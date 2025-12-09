import { Schema, models, Model, model } from "mongoose";
import { ITimeSlot } from "@/types/timeslot.types";

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
    bookedCount: { 
      type: Number, 
      default: 0 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);


export const TimeSlot: Model<TimeSlotModelType> = 
  models?.TimeSlot || model<TimeSlotModelType>("TimeSlot", TimeSlotSchema);