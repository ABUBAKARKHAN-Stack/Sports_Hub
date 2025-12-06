import { Schema, models, Model, model } from "mongoose";
import { IService } from "@/types/main.types";

type ServiceModelType = IService & Document;

const ServiceSchema = new Schema<ServiceModelType>(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      default: "" 
    },
    facilityId: { 
      type: Schema.Types.ObjectId, 
      ref: "Facility", 
      required: true 
    },
    price: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    duration: { 
      type: Number, 
      required: true, 
      min: 1 
    },
    capacity: { 
      type: Number, 
      required: true, 
      min: 1 
    },
    category: { 
      type: String, 
      default: "" 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    images: [{ 
      type: String, 
      default: [] 
    }]
  },
  { timestamps: true }
);

//* Indexes for better query performance
ServiceSchema.index({ facilityId: 1 });
ServiceSchema.index({ isActive: 1 });
ServiceSchema.index({ category: 1 });

export const Service = (models?.Service as Model<ServiceModelType>) || 
  model<ServiceModelType>("Service", ServiceSchema);