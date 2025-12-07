'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { FacilityState, FacilityAction, FacilityContextType, GetFacilitiesParams, FacilitiesResponse } from "@/types/facility.types";
import { IFacility } from "@/types/main.types";
import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/utils/ApiResponse";

type UserFacilityContextType = Omit<FacilityContextType, "createFacility" | "updateFacility" | "deleteFacility" | "updateFacilityStatus">;

const initialState: FacilityState = {
    facilities: [],
    currentFacility: null,
    loading: false,
    error: null,
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

//* Facility Reducers

const facilityReducer = (state: FacilityState, action: FacilityAction): FacilityState => {
    switch (action.type) {
        case "SET_LOADING": return { ...state, loading: action.payload };
        case "SET_ERROR": return { ...state, error: action.payload };
        case "SET_FACILITIES":
            return {
                ...state,
                facilities: action.payload.facilities,
                pagination: {
                    page: action.payload.page,
                    limit: action.payload.limit,
                    total: action.payload.total,
                    totalPages: Math.ceil(action.payload.total / action.payload.limit),
                },
                loading: false,
                error: null,
            };
        case "SET_FACILITY": return { ...state, currentFacility: action.payload, loading: false, error: null };

        default: return state;
    }
};

const FacilityContext = createContext<UserFacilityContextType | undefined>(undefined);

export const useUserFacility = (): UserFacilityContextType => {
    const context = useContext(FacilityContext);
    if (!context) throw new Error("useUserFacility must be used within a UserFacilityProvider");
    return context;
};

interface FacilityProviderProps { children: ReactNode; }

export const UserFacilityProvider: React.FC<FacilityProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(facilityReducer, initialState);

    const setLoading = (loading: boolean) => dispatch({ type: "SET_LOADING", payload: loading });
    const setError = (error: string | null) => dispatch({ type: "SET_ERROR", payload: error });
    const clearError = () => setError(null);
    const clearCurrentFacility = () => dispatch({ type: "SET_FACILITY", payload: null });

    //* Facility API Functions

    const getFacilities = async (params?: GetFacilitiesParams) => {
        try {
            setLoading(true); clearError();
            const res = await axiosInstance.get<ApiResponse<FacilitiesResponse>>("/user/facilities", { params });
            if (!res.data.success) throw new Error(res.data.message);
            const { data, total, page, limit } = res.data.data!;
            dispatch({ type: "SET_FACILITIES", payload: { facilities: data, total, page, limit } });
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to fetch facilities");
            console.error(err);
        } finally { setLoading(false); }
    };

    const getFacilityById = async (id: string) => {
        try {
            setLoading(true); clearError();
            const res = await axiosInstance.get<ApiResponse<IFacility>>(`/user/facilities/${id}`);
            if (!res.data.success) throw new Error(res.data.message);
            dispatch({ type: "SET_FACILITY", payload: res.data.data! });
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to fetch facility");
            console.error(err);
        } finally { setLoading(false); }
    };



    useEffect(() => { getFacilities(); }, []);

    const contextValue: UserFacilityContextType = {
        state,
        getFacilities,
        getFacilityById,
        clearCurrentFacility,
        clearError,
    };

    return <FacilityContext.Provider value={contextValue}>{children}</FacilityContext.Provider>;
};
