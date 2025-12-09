import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import { withAdmin } from '@/middlewares/auth';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { Service } from '@/models/service.model';
import { Facility } from '@/models/facility.model';
import { TimeSlot } from '@/models/timeslot.model';
import { getToken } from 'next-auth/jwt';

async function createBulkTimeslots(req: NextRequest) {
    try {
        await connectDb();

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const adminId = "693321382f71c557aa971adc"

        if (!adminId) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), { status: 401 });
        }

        const body = await req.json();
        const { facilityId, serviceId, date, timeSlots, recurring } = body;

        // Validate required fields
        if (!facilityId || !serviceId || !date || !Array.isArray(timeSlots)) {
            return NextResponse.json(
                new ApiError(400, "Missing required fields or invalid format"),
                { status: 400 }
            );
        }

        // Verify facility and service
        const facility = await Facility.findById(facilityId);
        if (!facility) {
            return NextResponse.json(
                new ApiError(404, "Facility not found"),
                { status: 404 }
            );
        }

        const service = await Service.findOne({
            _id: serviceId,
            facilityId: facilityId
        });

        if (!service) {
            return NextResponse.json(
                new ApiError(404, "Service not found or doesn't belong to this facility"),
                { status: 404 }
            );
        }

        // Process bulk creation
        const timeslotsToCreate = [];
        const errors = [];
        const baseDate = new Date(date);

        // Handle recurring timeslots (e.g., for multiple days)
        const days = recurring?.days || [0];
        for (const dayOffset of days) {
            const slotDate = new Date(baseDate);
            slotDate.setDate(slotDate.getDate() + dayOffset);
            slotDate.setHours(0, 0, 0, 0); // Normalize to start of day

            for (const slot of timeSlots) {
                // Validate slot
                if (!slot.startTime || !slot.endTime) {
                    errors.push(`Invalid slot: ${JSON.stringify(slot)}`);
                    continue;
                }

                // Check for existing timeslot
                const existingTimeslot = await TimeSlot.findOne({
                    facilityId,
                    serviceId,
                    date: slotDate,
                    startTime: slot.startTime,
                    isActive: true
                });

                if (!existingTimeslot) {
                    timeslotsToCreate.push({
                        facilityId,
                        serviceId,
                        date: slotDate,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        isActive: true,
                        isBooked: false,
                        bookedCount: 0,
                        createdBy: adminId
                    });
                } else {
                    errors.push(`Timeslot already exists for ${slotDate.toISOString().split('T')[0]} at ${slot.startTime}`);
                }
            }
        }

        // Create all timeslots
        const createdTimeslots = timeslotsToCreate.length > 0
            ? await TimeSlot.insertMany(timeslotsToCreate)
            : [];

        return NextResponse.json(
            new ApiResponse(
                createdTimeslots.length > 0 ? 201 : 200,
                createdTimeslots.length > 0
                    ? `Created ${createdTimeslots.length} timeslots successfully`
                    : 'No new timeslots created',
                {
                    created: createdTimeslots.length,
                    errors: errors.length > 0 ? errors : undefined
                }
            ),
            { status: createdTimeslots.length > 0 ? 201 : 200 }
        );

    } catch (error: any) {
        console.error("Bulk create timeslots error:", error);
        return NextResponse.json(
            new ApiError(500, "Failed to create timeslots", error.message),
            { status: 500 }
        );
    }
}

async function deleteBulkTimeslots(req: NextRequest) {
    try {
        await connectDb();

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const adminId = "693321382f71c557aa971adc"
        if (!adminId) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), { status: 401 });
        }

        const body = await req.json();
        const { timeslotIds } = body;

        // Validate inputs
        if (!timeslotIds) {
            return NextResponse.json(
                new ApiError(400, "Provide either timeslotIds, facilityId, serviceId"),
                { status: 400 }
            );
        }

        // Build delete query
        let query: any = { isActive: true };

        if (timeslotIds) {
            if (!Array.isArray(timeslotIds) || timeslotIds.length === 0) {
                return NextResponse.json(
                    new ApiError(400, "timeslotIds must be a non-empty array"),
                    { status: 400 }
                );
            }
            query._id = { $in: timeslotIds };
        } else {
            query.createdBy = adminId;
        }

        //* Single DB call: fetch matching active timeslots
        const timeslots = await TimeSlot.find(query);

        if (timeslots.length === 0) {
            return NextResponse.json(
                new ApiResponse(200, "No active timeslots found to delete"),
                { status: 200 }
            );
        }

        //* Booking protection
        const booked = timeslots.filter(t => t.bookedCount > 0);

        if (booked.length > 0) {
            return NextResponse.json(
                new ApiError(400, "Cannot delete timeslots that have bookings", {
                    bookedTimeslots: booked.map(ts => ({
                        id: ts._id,
                        date: ts.date,
                        startTime: ts.startTime,
                        bookedCount: ts.bookedCount
                    }))
                }),
                { status: 400 }
            );
        }

        //* Final deletion
        await TimeSlot.deleteMany(query);

        return NextResponse.json(
            new ApiResponse(
                200,
                `Deleted ${timeslots.length} timeslots successfully`,
                {
                    deletedCount: timeslots.length,
                }
            ),
            { status: 200 }
        );

    } catch (err: any) {
        console.error("Bulk delete timeslots error:", err);
        return NextResponse.json(
            new ApiError(500, "Failed to delete timeslots", err.message),
            { status: 500 }
        );
    }
}


export const POST = (createBulkTimeslots);
export const DELETE = (deleteBulkTimeslots);