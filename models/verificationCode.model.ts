import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IVerificationCode extends Document {
    userId: mongoose.Types.ObjectId;
    code: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
}

const verificationCodeSchema = new Schema<IVerificationCode>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export const VerificationCodeModel =
    models.VerificationCode ||
    model<IVerificationCode>("VerificationCode", verificationCodeSchema);
