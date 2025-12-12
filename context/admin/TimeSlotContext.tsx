'use client';

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from "react";
import {
    TimeSlotState,
    TimeSlotAction,
    TimeSlotContextType,
    GetTimeSlotsParams,
    TimeSlotsResponse,
    CreateTimeSlotFormData,
    UpdateTimeSlotFormData,
    BulkTimeSlotFormData,
    UserRole
} from "@/types/timeslot.types";
import { ITimeSlot } from "@/types/timeslot.types";
import {axiosInstance} from "@/lib/axios";
import { ApiResponse } from "@/utils/ApiResponse";
import { useToasts } from "@/hooks/toastNotifications";
import { useAuth } from "@/context/AuthContext";
import { UserRoles } from "@/types/main.types";

const initialState: TimeSlotState = {
    timeslots: [],
    currentTimeslot: null,
    loading: false,
    error: null,
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

// TimeSlot Reducers
const timeSlotReducer = (state: TimeSlotState, action: TimeSlotAction): TimeSlotState => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.payload };

        case "SET_ERROR":
            return { ...state, error: action.payload };

        case "SET_TIMESLOTS":
            return {
                ...state,
                timeslots: action.payload.data,
                pagination: {
                    page: action.payload.page,
                    limit: action.payload.limit,
                    total: action.payload.total,
                    totalPages: Math.ceil(action.payload.total / action.payload.limit),
                },
                loading: false,
                error: null,
            };

        case "SET_TIMESLOT":
            return { ...state, currentTimeslot: action.payload, loading: false, error: null };

        case "ADD_TIMESLOT":
            return {
                ...state,
                timeslots: [action.payload, ...state.timeslots],
                currentTimeslot: action.payload,
                loading: false,
                error: null
            };

        case "UPDATE_TIMESLOT":
            return {
                ...state,
                timeslots: state.timeslots.map(t =>
                    t._id?.toString() === action.payload._id?.toString() ? action.payload : t
                ),
                currentTimeslot: action.payload,
                loading: false,
                error: null,
            };

        case "DELETE_TIMESLOT":
            return {
                ...state,
                timeslots: state.timeslots.filter(t => t._id?.toString() !== action.payload),
                currentTimeslot: null,
                loading: false,
                error: null
            };

        case "UPDATE_TIMESLOT_STATUS":
            return {
                ...state,
                timeslots: state.timeslots.map(t =>
                    t._id?.toString() === action.payload.timeslotId
                        ? { ...t, isActive: action.payload.isActive }
                        : t
                ),
                currentTimeslot: state.currentTimeslot?._id?.toString() === action.payload.timeslotId
                    ? { ...state.currentTimeslot, isActive: action.payload.isActive }
                    : state.currentTimeslot,
                loading: false,
                error: null,
            };

        case "BULK_ADD_TIMESLOTS":
            return {
                ...state,
                timeslots: [...action.payload, ...state.timeslots],
                loading: false,
                error: null
            };

        case "BULK_DELETE_TIMESLOTS":
            return {
                ...state,
                timeslots: state.timeslots.filter(t => !action.payload.includes(t._id?.toString() || '')),
                currentTimeslot: state.currentTimeslot && action.payload.includes(state.currentTimeslot._id?.toString() || '')
                    ? null
                    : state.currentTimeslot,
                loading: false,
                error: null
            };

        case "UPDATE_BOOKING_STATUS":
            return {
                ...state,
                timeslots: state.timeslots.map(t =>
                    t._id?.toString() === action.payload.timeslotId
                        ? {
                            ...t,
                            isBooked: action.payload.isBooked,
                            bookedCount: action.payload.bookedCount
                        }
                        : t
                ),
                currentTimeslot: state.currentTimeslot?._id?.toString() === action.payload.timeslotId
                    ? {
                        ...state.currentTimeslot,
                        isBooked: action.payload.isBooked,
                        bookedCount: action.payload.bookedCount
                    }
                    : state.currentTimeslot,
                loading: false,
                error: null,
            };

        default:
            return state;
    }
};

const TimeSlotContext = createContext<TimeSlotContextType | undefined>(undefined);

export const useTimeSlot = (): TimeSlotContextType => {
    const context = useContext(TimeSlotContext);
    if (!context) throw new Error("useTimeSlot must be used within a TimeSlotProvider");
    return context;
};

interface TimeSlotProviderProps {
    children: ReactNode;
    defaultRole?: UserRole;
}

export const TimeSlotProvider: React.FC<TimeSlotProviderProps> = ({
    children,
    defaultRole = UserRoles.USER
}) => {
    const [state, dispatch] = useReducer(timeSlotReducer, initialState);
    const { errorToast, successToast } = useToasts();
    const { session } = useAuth();

    const setLoading = (loading: boolean) => dispatch({ type: "SET_LOADING", payload: loading });
    const setError = (error: string | null) => dispatch({ type: "SET_ERROR", payload: error });
    const clearError = () => setError(null);
    const clearCurrentTimeSlot = () => dispatch({ type: "SET_TIMESLOT", payload: null });

    // Helper function to check user role
    const checkPermission = useCallback((requiredRole: UserRole): boolean => {
        if (!session?.user) {
            // Public users can only access public endpoints
            return requiredRole === UserRoles.USER;
        }

        const roleHierarchy: Record<UserRole, number> = {
            [UserRoles.USER]: 1,
            [UserRoles.ADMIN]: 2,
            [UserRoles.SUPER_ADMIN]: 3
        };

        return roleHierarchy[session.user.role] >= roleHierarchy[requiredRole];
    }, [session]);

    //* PUBLIC METHODS (No authentication required)

    const getPublicTimeSlots = async (params?: GetTimeSlotsParams) => {
        try {
            setLoading(true);
            clearError();

            const res = await axiosInstance.get<ApiResponse<TimeSlotsResponse>>("/timeslots", { params });

            if (!res.data.success) throw new Error(res.data.message);

            const { data, total, page, limit } = res.data.data!;
            dispatch({
                type: "SET_TIMESLOTS",
                payload: {
                    data,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to fetch timeslots");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getPublicTimeSlotById = async (id: string) => {
        try {
            setLoading(true);
            clearError();

            const res = await axiosInstance.get<ApiResponse<ITimeSlot>>(`/timeslots/${id}`);

            if (!res.data.success) throw new Error(res.data.message);

            dispatch({ type: "SET_TIMESLOT", payload: res.data.data! });
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to fetch timeslot");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //* ADMIN METHODS (Requires admin authentication)

    const getTimeSlots = async (params?: GetTimeSlotsParams) => {
        try {
            if (!checkPermission(UserRoles.ADMIN)) {
                throw new Error("Admin access required");
            }

            setLoading(true);
            clearError();

            const res = await axiosInstance.get<ApiResponse<TimeSlotsResponse>>("/admin/timeslots", { params });

            if (!res.data.success) throw new Error(res.data.message);


            const { data, total, page, limit } = res.data.data!;

            dispatch({
                type: "SET_TIMESLOTS",
                payload: {
                    data,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to fetch timeslots");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getTimeSlotById = async (id: string) => {
        try {
            if (!checkPermission(UserRoles.ADMIN)) {
                throw new Error("Admin access required");
            }

            setLoading(true);
            clearError();

            const res = await axiosInstance.get<ApiResponse<ITimeSlot>>(`/admin/timeslots/${id}`);

            if (!res.data.success) throw new Error(res.data.message);

            dispatch({ type: "SET_TIMESLOT", payload: res.data.data! });
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to fetch timeslot");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createTimeSlot = async (data: CreateTimeSlotFormData): Promise<ITimeSlot> => {
        try {
            if (!checkPermission(UserRoles.ADMIN)) {
                throw new Error("Admin access required");
            }

            setLoading(true);
            clearError();

            const res = await axiosInstance.post<ApiResponse<ITimeSlot>>("/admin/timeslots", data);

            if (!res.data.success) throw new Error(res.data.message);

            successToast("Timeslot created successfully");
            dispatch({ type: "ADD_TIMESLOT", payload: res.data.data! });
            return res.data.data!;
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message || "Failed to create timeslot";
            errorToast(errMsg);
            setError(errMsg);
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateTimeSlot = async (id: string, data: UpdateTimeSlotFormData): Promise<ITimeSlot> => {
        try {
            if (!checkPermission(UserRoles.ADMIN)) {
                throw new Error("Admin access required");
            }

            setLoading(true);
            clearError();

            const res = await axiosInstance.put<ApiResponse<ITimeSlot>>(`/admin/timeslots/${id}`, data);

            if (!res.data.success) throw new Error(res.data.message);

            successToast("Timeslot updated successfully");
            dispatch({ type: "UPDATE_TIMESLOT", payload: res.data.data! });
            return res.data.data!;
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message || "Failed to update timeslot";
            errorToast(errMsg);
            setError(errMsg);
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteTimeSlot = async (id: string) => {
        try {
            if (!checkPermission(UserRoles.ADMIN)) {
                throw new Error("Admin access required");
            }

            setLoading(true);
            clearError();

            const res = await axiosInstance.delete<ApiResponse<null>>(`/admin/timeslots/${id}`);

            if (!res.data.success) throw new Error(res.data.message);

            successToast("Timeslot deleted successfully");
            dispatch({ type: "DELETE_TIMESLOT", payload: id });
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message || "Failed to delete timeslot";
            errorToast(errMsg);
            setError(errMsg);
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateTimeSlotStatus = async (id: string, isActive: boolean) => {
        try {
            if (!checkPermission(UserRoles.ADMIN)) {
                throw new Error("Admin access required");
            }

            setLoading(true);
            clearError();

            const res = await axiosInstance.put<ApiResponse<ITimeSlot>>(
                `/admin/timeslots/${id}`,
                { isActive }
            );

            if (!res.data.success) throw new Error(res.data.message);

            dispatch({
                type: "UPDATE_TIMESLOT_STATUS",
                payload: { timeslotId: id, isActive }
            });
            successToast(`Timeslot ${isActive ? 'activated' : 'deactivated'} successfully`);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to update timeslot status");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createBulkTimeSlots = async (data: BulkTimeSlotFormData): Promise<{ created: number; errors?: string[] }> => {
        try {
            if (!checkPermission(UserRoles.ADMIN)) {
                throw new Error("Admin access required");
            }

            setLoading(true);
            clearError();

            const res = await axiosInstance.post<ApiResponse<{ created: number; errors?: string[] }>>(
                "/admin/timeslots/bulk",
                data
            );

            if (!res.data.success) throw new Error(res.data.message);

            const result = res.data.data!;

            if (result.errors && result.errors.length > 0) {
                errorToast(`Created ${result.created} timeslots with ${result.errors.length} errors`);
            } else {
                successToast(`Successfully created ${result.created} timeslots`);
            }

            // Refresh timeslots
            await getTimeSlots();

            return result;
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message || "Failed to create bulk timeslots";
            errorToast(errMsg);
            setError(errMsg);
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteBulkTimeSlots = async (timeslotIds: string[]) => {
        try {
            if (!checkPermission(UserRoles.ADMIN)) {
                throw new Error("Admin access required");
            }

            if (!timeslotIds || timeslotIds.length === 0) {
                throw new Error("No timeslots selected for deletion");
            }

            setLoading(true);
            clearError();

            const res = await axiosInstance.delete<ApiResponse<{ deletedCount: number }>>(
                "/admin/timeslots/bulk",
                {
                    data: { timeslotIds }
                }
            );

            if (!res.data.success) throw new Error(res.data.message);

            const result = res.data.data!;

            successToast(`Successfully deleted ${result.deletedCount} timeslot(s)`);

            // Update local state
            dispatch({ type: "BULK_DELETE_TIMESLOTS", payload: timeslotIds });

            return result;
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message || "Failed to delete timeslots";
            errorToast(errMsg);
            setError(errMsg);
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    //* SUPERADMIN METHODS

    const forceDeleteTimeSlot = async (id: string) => {
        try {
            if (!checkPermission(UserRoles.SUPER_ADMIN)) {
                throw new Error("Superadmin access required");
            }

            setLoading(true);
            clearError();

            const res = await axiosInstance.delete<ApiResponse<null>>(`/superadmin/timeslots/${id}/force`);

            if (!res.data.success) throw new Error(res.data.message);

            successToast("Timeslot force deleted successfully");
            dispatch({ type: "DELETE_TIMESLOT", payload: id });
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message || "Failed to force delete timeslot";
            errorToast(errMsg);
            setError(errMsg);
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getAllTimeSlots = async (params?: GetTimeSlotsParams) => {
        try {
            if (!checkPermission(UserRoles.SUPER_ADMIN)) {
                throw new Error("Superadmin access required");
            }

            setLoading(true);
            clearError();

            const res = await axiosInstance.get<ApiResponse<TimeSlotsResponse>>("/superadmin/timeslots", { params });

            if (!res.data.success) throw new Error(res.data.message);

            const { data, total, page, limit } = res.data.data!;
            dispatch({
                type: "SET_TIMESLOTS",
                payload: {
                    data,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to fetch all timeslots");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //* BOOKING METHODS (User actions)

    const bookTimeSlot = async (timeslotId: string, quantity: number = 1) => {
        try {
            if (!checkPermission(UserRoles.USER)) {
                throw new Error("User login required");
            }

            setLoading(true);
            clearError();

            const res = await axiosInstance.post<ApiResponse<ITimeSlot>>(
                `/timeslots/${timeslotId}/book`,
                { quantity }
            );

            if (!res.data.success) throw new Error(res.data.message);

            const updatedTimeslot = res.data.data!;
            dispatch({
                type: "UPDATE_BOOKING_STATUS",
                payload: {
                    timeslotId,
                    isBooked: updatedTimeslot.isBooked,
                    bookedCount: updatedTimeslot.bookedCount || 0
                }
            });

            successToast(`Successfully booked ${quantity} slot(s)`);
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message || "Failed to book timeslot";
            errorToast(errMsg);
            setError(errMsg);
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (timeslotId: string) => {
        try {
            if (!checkPermission(UserRoles.USER)) {
                throw new Error("User login required");
            }

            setLoading(true);
            clearError();

            const res = await axiosInstance.post<ApiResponse<ITimeSlot>>(
                `/timeslots/${timeslotId}/cancel`
            );

            if (!res.data.success) throw new Error(res.data.message);

            const updatedTimeslot = res.data.data!;
            dispatch({
                type: "UPDATE_BOOKING_STATUS",
                payload: {
                    timeslotId,
                    isBooked: updatedTimeslot.isBooked,
                    bookedCount: updatedTimeslot.bookedCount || 0
                }
            });

            successToast("Booking cancelled successfully");
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message || "Failed to cancel booking";
            errorToast(errMsg);
            setError(errMsg);
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const contextValue: TimeSlotContextType = {
        state,

        // Public Methods
        getPublicTimeSlots,
        getPublicTimeSlotById,

        // Admin Methods
        getTimeSlots,
        getTimeSlotById,
        createTimeSlot,
        updateTimeSlot,
        deleteTimeSlot,
        updateTimeSlotStatus,
        createBulkTimeSlots,
        deleteBulkTimeSlots,


        // SuperAdmin Methods
        forceDeleteTimeSlot,
        getAllTimeSlots,

        // Booking Methods
        bookTimeSlot,
        cancelBooking,

        // Utility Methods
        clearCurrentTimeSlot,
        clearError,
    };

    return (
        <TimeSlotContext.Provider value={contextValue}>
            {children}
        </TimeSlotContext.Provider>
    );
};

// Hook for checking user's role-based access
export const useTimeSlotAccess = () => {
    const { session } = useAuth();

    const can = (action: 'create' | 'edit' | 'delete' | 'viewAll' | 'forceDelete'): boolean => {
        if (!session?.user) {
            return action === 'viewAll'; // Public can only view
        }

        switch (action) {
            case 'create':
            case 'edit':
                return session.user.role === UserRoles.ADMIN || session.user.role === UserRoles.SUPER_ADMIN;

            case 'delete':
                return session.user.role === UserRoles.ADMIN || session.user.role === UserRoles.SUPER_ADMIN;

            case 'viewAll':
                return session.user.role === UserRoles.SUPER_ADMIN;

            case 'forceDelete':
                return session.user.role === UserRoles.SUPER_ADMIN;

            default:
                return false;
        }
    };

    return {
        can,
        role: session?.user?.role || UserRoles.USER,
        isAdmin: session?.user?.role === UserRoles.ADMIN || session?.user?.role === UserRoles.SUPER_ADMIN,
        isSuperAdmin: session?.user?.role === UserRoles.SUPER_ADMIN
    };
};