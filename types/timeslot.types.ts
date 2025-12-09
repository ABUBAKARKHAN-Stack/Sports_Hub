import { Types } from "mongoose";
import { UserRoles } from "./main.types";

export interface ITimeSlot {
    _id?: string;
    facilityId: Types.ObjectId | { _id: Types.ObjectId; name: string };
    serviceId: Types.ObjectId | { _id: Types.ObjectId; title: string; price: number; duration: number };
    date: Date;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    bookedCount: number;
    isActive: boolean;
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateTimeSlotDTO {
    facilityId: string;
    serviceId: string;
    date: string;
    startTime: string;
    endTime: string;
}

export interface UpdateTimeSlotDTO {
    date?: string;
    startTime?: string;
    endTime?: string;
    isActive?: boolean;
}

export interface TimeSlotQuery {
    facilityId?: string;
    serviceId?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    isBooked?: boolean;
    page?: number;
    limit?: number;
}

// Form Data Types
export interface CreateTimeSlotFormData {
    facilityId: string;
    serviceId: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
}

export interface UpdateTimeSlotFormData extends Partial<CreateTimeSlotFormData> {
    isActive?: boolean;
}

export interface BulkTimeSlotFormData {
    facilityId: string;
    serviceId: string;
    date: string;
    timeSlots: {
        startTime: string;
        endTime: string;
    }[];
    recurring?: {
        days: number[]; // 0-6 (0 = Sunday, 1 = Monday, etc.)
    };
    endDate?: string;
}

export interface GetTimeSlotsParams {
    page?: number;
    limit?: number;
    facilityId?: string;
    serviceId?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    isBooked?: boolean;
    search?: string;
    sortBy?: 'date' | 'startTime' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface TimeSlotsResponse {
    data: ITimeSlot[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// State and Context Types
export interface TimeSlotState {
    timeslots: ITimeSlot[];
    currentTimeslot: ITimeSlot | null;
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export type TimeSlotAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SET_TIMESLOTS"; payload: TimeSlotsResponse }
    | { type: "SET_TIMESLOT"; payload: ITimeSlot | null }
    | { type: "ADD_TIMESLOT"; payload: ITimeSlot }
    | { type: "UPDATE_TIMESLOT"; payload: ITimeSlot }
    | { type: "DELETE_TIMESLOT"; payload: string }
    | { type: "UPDATE_TIMESLOT_STATUS"; payload: { timeslotId: string; isActive: boolean } }
    | { type: "BULK_ADD_TIMESLOTS"; payload: ITimeSlot[] }
    | { type: "BULK_DELETE_TIMESLOTS"; payload: string[] }
    | { type: "UPDATE_BOOKING_STATUS"; payload: { timeslotId: string; isBooked: boolean; bookedCount: number } };

// Context Type with Role-based Methods
export interface TimeSlotContextType {
    state: TimeSlotState;

    // Public Methods (No authentication required)
    getPublicTimeSlots: (params?: GetTimeSlotsParams) => Promise<void>;
    getPublicTimeSlotById: (id: string) => Promise<void>;

    // Admin Methods (Requires admin authentication)
    getTimeSlots: (params?: GetTimeSlotsParams) => Promise<void>;
    getTimeSlotById: (id: string) => Promise<void>;
    createTimeSlot: (data: CreateTimeSlotFormData) => Promise<ITimeSlot>;
    updateTimeSlot: (id: string, data: UpdateTimeSlotFormData) => Promise<ITimeSlot>;
    deleteTimeSlot: (id: string) => Promise<void>;
    updateTimeSlotStatus: (id: string, isActive: boolean) => Promise<void>;
    createBulkTimeSlots: (data: BulkTimeSlotFormData) => Promise<{ created: number; errors?: string[] }>;
    deleteBulkTimeSlots: (timeslotIds: string[]) => Promise<{ deletedCount: number }>;


    // SuperAdmin Methods (Additional privileges)
    forceDeleteTimeSlot: (id: string) => Promise<void>; // Can delete booked timeslots
    getAllTimeSlots: (params?: GetTimeSlotsParams) => Promise<void>; // Across all facilities

    // Booking Methods (User actions)
    bookTimeSlot: (timeslotId: string, quantity?: number) => Promise<void>;
    cancelBooking: (timeslotId: string) => Promise<void>;

    // Utility Methods
    clearCurrentTimeSlot: () => void;
    clearError: () => void;
}

// Role Types
export type UserRole = UserRoles;