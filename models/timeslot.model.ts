import { Schema, models, Model, model } from "mongoose";
import { ITimeSlot } from "@/types/main.types";

type TimeSlotModelType = ITimeSlot & Document;

const TimeSlotSchema = new Schema<TimeSlotModelType>(
  {
    facilityId: { 
      type: Schema.Types.ObjectId, 
      ref: "Facility", 
      required: true 
    },
    serviceId: { 
      type: Schema.Types.ObjectId, 
      ref: "Service", 
      required: true 
    },
    date: { 
      type: Date, 
      required: true 
    },
    startTime: { 
      type: String, 
      required: true 
    },
    endTime: { 
      type: String, 
      required: true 
    },
    isBooked: { 
      type: Boolean, 
      default: false 
    },
    maxCapacity: { 
      type: Number 
    },
    bookedCount: { 
      type: Number, 
      default: 0 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

//* Compound indexes for better query performance
TimeSlotSchema.index({ facilityId: 1, serviceId: 1, date: 1 });
TimeSlotSchema.index({ date: 1, startTime: 1 });
TimeSlotSchema.index({ isBooked: 1, isActive: 1 });
TimeSlotSchema.index({ serviceId: 1, date: 1, isActive: 1 });

export const TimeSlot = (models?.TimeSlot as Model<TimeSlotModelType>) || 
  model<TimeSlotModelType>("TimeSlot", TimeSlotSchema);