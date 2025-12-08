import { Schema, models, Model, model } from "mongoose";
import { IPayment, PaymentStatusEnum, PaymentMethodEnum } from "@/types/main.types";

type PaymentModelType = IPayment & Document;

const PaymentSchema = new Schema<PaymentModelType>(
  {
    bookingId: { 
      type: Schema.Types.ObjectId, 
      ref: "Booking", 
      required: true,
      unique: true 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    },
    amount: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    paymentMethod: { 
      type: String, 
      enum: Object.values(PaymentMethodEnum), 
      required: true 
    },
    transactionId: { 
      type: String, 
      required: true, 
      unique: true 
    },
    status: { 
      type: String, 
      enum: Object.values(PaymentStatusEnum), 
      default: PaymentStatusEnum.PENDING 
    },
    paymentDetails: {
      accountNumber: { type: String },
      accountTitle: { type: String },
      mobileNumber: { type: String }
    },
    refundDetails: {
      amount: { type: Number },
      reason: { type: String },
      refundedAt: { type: Date },
      refundTransactionId: { type: String }
    }
  },
  { timestamps: true }
);


export const Payment = (models?.Payment as Model<PaymentModelType>) || 
  model<PaymentModelType>("Payment", PaymentSchema);