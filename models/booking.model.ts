import { Schema, models, Model, model } from "mongoose";
import { IBooking, BookingStatusEnum, PaymentStatusEnum } from "@/types/main.types";

type BookingModelType = IBooking & Document;

const BookingSchema = new Schema<BookingModelType>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    },
    guestInfo: {
      name: { type: String },
      email: { type: String },
      phone: { type: String }
    },
    serviceId: { 
      type: Schema.Types.ObjectId, 
      ref: "Service", 
      required: true 
    },
    facilityId: { 
      type: Schema.Types.ObjectId, 
      ref: "Facility", 
      required: true 
    },
    slotId: { 
      type: Schema.Types.ObjectId, 
      ref: "TimeSlot", 
      required: true 
    },
    bookingDate: { 
      type: Date, 
      required: true 
    },
    participants: { 
      type: Number, 
      required: true, 
      min: 1 
    },
    totalAmount: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    status: { 
      type: String, 
      enum: Object.values(BookingStatusEnum), 
      default: BookingStatusEnum.PENDING 
    },
    paymentStatus: { 
      type: String, 
      enum: Object.values(PaymentStatusEnum), 
      default: PaymentStatusEnum.PENDING 
    },
    paymentId: { 
      type: String 
    },
    transactionId: { 
      type: String 
    },
    adminNotes: { 
      type: String 
    },
    cancellationReason: { 
      type: String 
    }
  },
  { timestamps: true }
);

//* Indexes for better query performance
BookingSchema.index({ userId: 1 });
BookingSchema.index({ facilityId: 1 });
BookingSchema.index({ serviceId: 1 });
BookingSchema.index({ slotId: 1 },{unique:true,sparse:true});
BookingSchema.index({ status: 1, paymentStatus: 1 });
BookingSchema.index({ bookingDate: 1 });
BookingSchema.index({ createdAt: 1 });

export const Booking = (models?.Booking as Model<BookingModelType>) || 
  model<BookingModelType>("Booking", BookingSchema);