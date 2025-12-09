import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import { withAdmin } from '@/middlewares/auth';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { TimeSlot } from '@/models/timeslot.model';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await params
        await connectDb();

        const timeslot = await TimeSlot.findById(id)
            .populate('facilityId', 'name address')
            .populate('serviceId', 'name price duration description')
            .populate('createdBy', 'name email');

        if (!timeslot) {
            return NextResponse.json(
                new ApiError(404, "Timeslot not found"),
                { status: 404 }
            );
        }

        return NextResponse.json(
            new ApiResponse(200, "Timeslot fetched successfully", timeslot),
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Get timeslot error:", error);
        return NextResponse.json(
            new ApiError(500, "Failed to fetch timeslot", error.message),
            { status: 500 }
        );
    }
}

// PUT - Update timeslot
async function updateTimeslot(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await params
        await connectDb();

        const timeslot = await TimeSlot.findById(id);
        if (!timeslot) {
            return NextResponse.json(
                new ApiError(404, "Timeslot not found"),
                { status: 404 }
            );
        }

        // Check if timeslot is booked
        if (timeslot.isBooked) {
            return NextResponse.json(
                new ApiError(400, "Cannot update booked timeslot"),
                { status: 400 }
            );
        }

        const body = await req.json();
        const updates: any = {};

        // Only allow updating certain fields
        const allowedUpdates = ['date', 'startTime', 'endTime', 'maxCapacity', 'isActive'];

        allowedUpdates.forEach(field => {
            if (body[field] !== undefined) {
                if (field === 'date') {
                    updates[field] = new Date(body[field]);
                } else {
                    updates[field] = body[field];
                }
            }
        });

        // Check for conflicts if time/date is being updated
        if (updates.date || updates.startTime) {
            const conflictingTimeslot = await TimeSlot.findOne({
                _id: { $ne: id },
                facilityId: timeslot.facilityId,
                serviceId: timeslot.serviceId,
                date: updates.date || timeslot.date,
                startTime: updates.startTime || timeslot.startTime,
                isActive: true
            });

            if (conflictingTimeslot) {
                return NextResponse.json(
                    new ApiError(409, "Another timeslot already exists for this time"),
                    { status: 409 }
                );
            }
        }

        // Update timeslot
        const updatedTimeslot = await TimeSlot.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).populate('facilityId', 'name')
            .populate('serviceId', 'name price duration');

        return NextResponse.json(
            new ApiResponse(200, "Timeslot updated successfully", updatedTimeslot),
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Update timeslot error:", error);

        if (error.name === 'ValidationError') {
            return NextResponse.json(
                new ApiError(400, "Validation error", error.errors),
                { status: 400 }
            );
        }

        return NextResponse.json(
            new ApiError(500, "Failed to update timeslot", error.message),
            { status: 500 }
        );
    }
}

// DELETE - Delete timeslot
async function deleteTimeslot(
    req: NextRequest,
    { params }: { params: Promise<{ id: string } >}
) {
    try {
        const {id} = await params
        await connectDb();

        const timeslot = await TimeSlot.findById(id);
        if (!timeslot) {
            return NextResponse.json(
                new ApiError(404, "Timeslot not found"),
                { status: 404 }
            );
        }

        // Check if timeslot is booked
        if (timeslot.isBooked) {
            return NextResponse.json(
                new ApiError(400, "Cannot delete booked timeslot"),
                { status: 400 }
            );
        }

        await timeslot.deleteOne()

        return NextResponse.json(
            new ApiResponse(200, "Timeslot deleted successfully"),
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Delete timeslot error:", error);
        return NextResponse.json(
            new ApiError(500, "Failed to delete timeslot", error.message),
            { status: 500 }
        );
    }
}

export const PUT = withAdmin(updateTimeslot);
export const DELETE = withAdmin(deleteTimeslot);