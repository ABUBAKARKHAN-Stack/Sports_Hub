import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import { withAdmin } from '@/middlewares/auth';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { Booking } from '@/models/booking.model';
import { Facility } from '@/models/facility.model';
import { TimeSlot } from '@/models/timeslot.model';
import { BookingStatusEnum, PaymentStatusEnum } from '@/types/main.types';
import { getToken } from 'next-auth/jwt';

//* GET all bookings for admin's facilities
async function getBookings(req: NextRequest) {
  try {
    await connectDb();
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const adminId = token?.sub;

    //* Get facilities managed by this admin
    const facilities = await Facility.find({ adminId });
    const facilityIds = facilities.map(f => f._id);

    if (facilityIds.length === 0) {
      return NextResponse.json(
        new ApiResponse(200, "No facilities found", { data: [], total: 0 }),
        { status: 200 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query: any = { facilityId: { $in: facilityIds } };
    
    if (status && Object.values(BookingStatusEnum).includes(status as BookingStatusEnum)) {
      query.status = status;
    }
    
    if (startDate) {
      query.bookingDate = { $gte: new Date(startDate) };
    }
    
    if (endDate) {
      if (query.bookingDate) {
        query.bookingDate.$lte = new Date(endDate);
      } else {
        query.bookingDate = { $lte: new Date(endDate) };
      }
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('serviceId', 'title price duration')
        .populate('facilityId', 'name')
        .populate('userId', 'username email')
        .populate('slotId', 'startTime endTime')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(query)
    ]);

    const paginatedResponse = {
      data: bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };

    return NextResponse.json(
      new ApiResponse(200, "Bookings fetched successfully", paginatedResponse),
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      new ApiError(500, "Failed to fetch bookings", error.message),
      { status: 500 }
    );
  }
}

//* PUT update booking status
async function updateBooking(req: NextRequest) {
  try {
    await connectDb();
    
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('id');
    
    if (!bookingId) {
      return NextResponse.json(
        new ApiError(400, "Booking ID is required"),
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, adminNotes, cancellationReason } = body;

    // Validate status if provided
    if (status && !Object.values(BookingStatusEnum).includes(status)) {
      return NextResponse.json(
        new ApiError(400, "Invalid booking status"),
        { status: 400 }
      );
    }

    // Find booking
    const booking = await Booking.findById(bookingId)
      .populate('facilityId', 'adminId');
    
    if (!booking) {
      return NextResponse.json(
        new ApiError(404, "Booking not found"),
        { status: 404 }
      );
    }

    // Verify admin owns this facility
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const adminId = token?.sub;
    
    // if (booking.facilityId.admin.toString() !== adminId) {
    //   return NextResponse.json(
    //     new ApiError(403, "You don't have permission to update this booking"),
    //     { status: 403 }
    //   );
    // }

    // Update booking
    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (cancellationReason) updateData.cancellationReason = cancellationReason;

    // If cancelling, update timeslot availability
    if (status === BookingStatusEnum.CANCELLED) {
      await TimeSlot.findByIdAndUpdate(booking.slotId, {
        isBooked: false,
        $inc: { bookedCount: -booking.participants }
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('serviceId', 'title')
      .populate('userId', 'username email');

    return NextResponse.json(
      new ApiResponse(200, "Booking updated successfully", updatedBooking),
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Update booking error:", error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        new ApiError(400, "Validation error", error.errors),
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      new ApiError(500, "Failed to update booking", error.message),
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getBookings);
export const PUT = withAdmin(updateBooking);