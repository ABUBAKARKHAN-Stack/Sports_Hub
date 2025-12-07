import { Schema, models, Model, model } from "mongoose";
import { IFacility, FacilityStatusEnum } from "@/types/main.types";

type FacilityModelType = IFacility & Document;

const FacilitySchema = new Schema<FacilityModelType>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    location: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      coordinates: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 }
      }
    },
    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" }
    },
    openingHours: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
      },
      openingTime: { type: String, default: null },
      closingTime: { type: String, default:null },
      isClosed: { type: Boolean, default: false }
    }],
    services: [{
      type: Schema.Types.ObjectId,
      ref: "Service"
    }],
    status: {
      type: String,
      enum: Object.values(FacilityStatusEnum),
      default: FacilityStatusEnum.PENDING
    },
    gallery: {
      images: [{
        type: String,
        default: [],
      }],
      introductoryVideo: {
        type: String,
        default: ""
      },
    }
  },
  { timestamps: true }
);

//* Indexes for better query performance
FacilitySchema.index({ adminId: 1 });
FacilitySchema.index({ status: 1 });
FacilitySchema.index({ "location.city": 1 });

export const Facility = (models?.Facility as Model<FacilityModelType>) ||
  model<FacilityModelType>("Facility", FacilitySchema);