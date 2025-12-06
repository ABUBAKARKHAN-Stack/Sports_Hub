import { Types } from 'mongoose';


type DatabaseConnectionObject = {
    isConntected?: number
}

enum UserRoles {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}

enum AuthProviderEnum {
    CREDENTIALS = "CREDENTIALS",
    GOOGLE = "GOOGLE"
}


interface IUser {
    username: string;
    email: string;
    password: string;
    role: UserRoles;
    avatar: string;
    isVerified: boolean;
    phone: string;
    provider: AuthProviderEnum
}


export type {
    DatabaseConnectionObject,
    IUser
}

export {
    UserRoles,
    AuthProviderEnum
}


export enum FacilityStatusEnum {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    SUSPENDED = 'suspended'
}

//* Facility Types
export interface IFacility {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    adminId: Types.ObjectId;
    location: {
        address?: string;
        city?: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    contact: {
        phone?: string;
        email?: string;
    };
    openingHours: {
        day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
        openingTime: string;
        closingTime: string;
        isClosed: boolean;
    }[];
    services: Types.ObjectId[];
    status: FacilityStatusEnum;
    images: string[];
    documents: {
        type: string;
        url: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

//* Service Types
export interface IService {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    facilityId: Types.ObjectId;
    price: number;
    duration: number;
    capacity: number;
    category?: string;
    isActive: boolean;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

export enum BookingStatusEnum {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}


export enum PaymentStatusEnum {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}


//* Booking Types
export interface IBooking {
    _id: Types.ObjectId;
    userId?: Types.ObjectId;
    guestInfo?: {
        name: string;
        email: string;
        phone: string;
    };
    serviceId: Types.ObjectId;
    facilityId: Types.ObjectId;
    slotId: Types.ObjectId;
    bookingDate: Date;
    participants: number;
    totalAmount: number;
    status: BookingStatusEnum;
    paymentStatus: PaymentStatusEnum;
    paymentId?: string;
    transactionId?: string;
    adminNotes?: string;
    cancellationReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

//* TimeSlot Types
export interface ITimeSlot {
    _id: Types.ObjectId;
    facilityId: Types.ObjectId;
    serviceId: Types.ObjectId;
    date: Date;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    maxCapacity?: number;
    bookedCount: number;
    isActive: boolean;
}

export enum ReviewStatusEnum {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}


//* Review Types
export interface IReview {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    facilityId?: Types.ObjectId;
    serviceId?: Types.ObjectId;
    rating: number;
    comment?: string;
    images: string[];
    status: ReviewStatusEnum;
    adminResponse?: {
        response: string;
        respondedAt: Date;
        respondedBy: Types.ObjectId;
    };
    createdAt: Date;
    updatedAt: Date;
}

export enum PaymentMethodEnum {
  EASYPAISA = 'easypaisa',
  JAZZCASH = 'jazzcash',
  CASH = 'cash',
}




//* Payment Types
export interface IPayment {
    _id: Types.ObjectId;
    bookingId: Types.ObjectId;
    userId?: Types.ObjectId;
    amount: number;
    paymentMethod: PaymentMethodEnum;
    transactionId: string;
    status: PaymentStatusEnum;
    paymentDetails?: {
        accountNumber?: string;
        accountTitle?: string;
        mobileNumber?: string;
    };
    refundDetails?: {
        amount: number;
        reason: string;
        refundedAt: Date;
        refundTransactionId: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

//* Paginated Response Types
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

//* Request Types
export interface CreateFacilityRequest {
    name: string;
    description?: string;
    location: IFacility['location'];
    contact: IFacility['contact'];
    openingHours: IFacility['openingHours'];
}


export interface CreateServiceRequest {
    title: string;
    description?: string;
    facilityId: string;
    price: number;
    duration: number;
    capacity?: number;
    category?: string;
}

export interface UpdateBookingRequest {
    status?: IBooking['status'];
    adminNotes?: string;
    cancellationReason?: string;
}

export interface UpdateReviewRequest {
    status: IReview['status'];
    response?: string;
}
