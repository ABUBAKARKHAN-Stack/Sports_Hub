import { Schema, models, Model, model } from "mongoose";
import { IReview, ReviewStatusEnum } from "@/types/main.types";

type ReviewModelType = IReview & Document;

const ReviewSchema = new Schema<ReviewModelType>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        facilityId: {
            type: Schema.Types.ObjectId,
            ref: "Facility"
        },
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: "Service"
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String
        },
        images: [{
            type: String,
            default: []
        }],
        status: {
            type: String,
            enum: Object.values(ReviewStatusEnum),
            default: ReviewStatusEnum.PENDING
        },
        adminResponse: {
            response: { type: String },
            respondedAt: { type: Date },
            respondedBy: { type: Schema.Types.ObjectId, ref: "User" }
        }
    },
    { timestamps: true }
);

//* Indexes for better query performance
ReviewSchema.index({ userId: 1 });
ReviewSchema.index({ facilityId: 1 });
ReviewSchema.index({ serviceId: 1 });
ReviewSchema.index({ status: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ facilityId: 1, status: 1 });

//* Ensure either facilityId or serviceId is provided
ReviewSchema.pre('validate', function (next) {
    if (!this.facilityId && !this.serviceId) {
        (next as any)(new Error('Either facilityId or serviceId must be provided'));
    } else {
        (next as any)();
    }
});

export const Review = (models?.Review as Model<ReviewModelType>) ||
    model<ReviewModelType>("Review", ReviewSchema);