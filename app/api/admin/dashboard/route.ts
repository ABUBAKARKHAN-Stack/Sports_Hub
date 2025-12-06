import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import { withAdmin } from '@/middlewares/auth';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { Facility } from '@/models/facility.model';
import { Booking } from '@/models/booking.model';
import { Payment } from '@/models/payment.model';
import { Review } from '@/models/review.model';
import { BookingStatusEnum, PaymentStatusEnum, ReviewStatusEnum, FacilityStatusEnum } from '@/types/main.types';
import { getToken } from 'next-auth/jwt';

async function getDashboardData(req: NextRequest) {
  try {
    await connectDb();
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const adminId = token?.sub;

    if (!adminId) {
      return NextResponse.json(
        new ApiError(401, "Unauthorized"),
        { status: 401 }
      );
    }

    //* Get facilities managed by this admin
    const facilities = await Facility.find({ adminId });
    const facilityIds = facilities.map(f => f._id);

    //* Calculate statistics for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalFacilities,
      pendingFacilities,
      totalBookings,
      pendingBookings,
      totalRevenue,
      pendingReviews,
      recentBookings,
      revenueChartData
    ] = await Promise.all([
      //* Total facilities
      Facility.countDocuments({ adminId }),
      
      //* Pending facilities
      Facility.countDocuments({ 
        adminId, 
        status: FacilityStatusEnum.PENDING 
      }),
      
      //* Total bookings (last 30 days)
      Booking.countDocuments({
        facilityId: { $in: facilityIds },
        createdAt: { $gte: thirtyDaysAgo }
      }),
      
      //* Pending bookings
      Booking.countDocuments({
        facilityId: { $in: facilityIds },
        status: BookingStatusEnum.PENDING
      }),
      
      //* Total revenue (last 30 days)
      Payment.aggregate([
        {
          $match: {
            status: PaymentStatusEnum.COMPLETED,
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $lookup: {
            from: 'bookings',
            localField: 'bookingId',
            foreignField: '_id',
            as: 'booking'
          }
        },
        {
          $match: {
            'booking.facilityId': { $in: facilityIds }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]),
      
      //* Pending reviews
      Review.countDocuments({
        facilityId: { $in: facilityIds },
        status: ReviewStatusEnum.PENDING
      }),
      
      //* Recent bookings (last 10)
      Booking.find({
        facilityId: { $in: facilityIds }
      })
        .populate('serviceId', 'title')
        .populate('userId', 'username email')
        .sort({ createdAt: -1 })
        .limit(10),
      
      //* Revenue by day (last 7 days)
      Payment.aggregate([
        {
          $match: {
            status: PaymentStatusEnum.COMPLETED,
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $lookup: {
            from: 'bookings',
            localField: 'bookingId',
            foreignField: '_id',
            as: 'booking'
          }
        },
        {
          $match: {
            'booking.facilityId': { $in: facilityIds }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);

    const dashboardData = {
      summary: {
        totalFacilities,
        pendingFacilities,
        totalBookings,
        pendingBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingReviews
      },
      recentBookings,
      revenueChart: revenueChartData,
      topFacilities: facilities.slice(0, 5).map(f => ({
        id: f._id,
        name: f.name,
        status: f.status,
        bookingCount: 0 // You can add actual count logic
      }))
    };

    return NextResponse.json(
      new ApiResponse(200, "Dashboard data fetched successfully", dashboardData),
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      new ApiError(500, "Failed to fetch dashboard data", error.message),
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getDashboardData);