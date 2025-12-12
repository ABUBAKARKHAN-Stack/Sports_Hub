'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { FacilityState, FacilityAction, FacilityContextType, CreateFacilityFormData, UpdateFacilityFormData, GetFacilitiesParams, FacilitiesResponse } from "@/types/facility.types";
import { IFacility, FacilityStatusEnum } from "@/types/main.types";
import {axiosInstance} from "@/lib/axios";
import { ApiResponse } from "@/utils/ApiResponse";
import { useToasts } from "@/hooks/toastNotifications";

type SuperAdminFacilityContextType = Omit<FacilityContextType, "createFacility" | "updateFacility" | "deleteFacility">;

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
    case "UPDATE_FACILITY_STATUS":
      return {
        ...state,
        facilities: state.facilities.map(f =>
          f._id.toString() === action.payload.facilityId ? { ...f, status: action.payload.status } : f
        ),
        currentFacility: state.currentFacility?._id.toString() === action.payload.facilityId
          ? { ...state.currentFacility, status: action.payload.status }
          : state.currentFacility,
        loading: false,
        error: null,
      };
    default: return state;
  }
};

const FacilityContext = createContext<SuperAdminFacilityContextType | undefined>(undefined);

export const useSuperAdminFacility = (): SuperAdminFacilityContextType => {
  const context = useContext(FacilityContext);
  if (!context) throw new Error("useFacility must be used within a FacilityProvider");
  return context;
};

interface FacilityProviderProps { children: ReactNode; }

export const SuperAdminFacilityProvider: React.FC<FacilityProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(facilityReducer, initialState);

  const setLoading = (loading: boolean) => dispatch({ type: "SET_LOADING", payload: loading });
  const setError = (error: string | null) => dispatch({ type: "SET_ERROR", payload: error });
  const clearError = () => setError(null);
  const clearCurrentFacility = () => dispatch({ type: "SET_FACILITY", payload: null });

  //* Facility API Functions

  const getFacilities = async (params?: GetFacilitiesParams) => {
    try {
      setLoading(true); clearError();
      const res = await axiosInstance.get<ApiResponse<FacilitiesResponse>>("/super-admin/facilities", { params });
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
      const res = await axiosInstance.get<ApiResponse<IFacility>>(`/super-admin/facilities/${id}`);
      if (!res.data.success) throw new Error(res.data.message);
      dispatch({ type: "SET_FACILITY", payload: res.data.data! });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch facility");
      console.error(err);
    } finally { setLoading(false); }
  };


  const updateFacilityStatus = async (id: string, status: FacilityStatusEnum) => {
    try {
      setLoading(true); clearError();
      const res = await axiosInstance.patch<ApiResponse<IFacility>>(`/super-admin/facilities/${id}/status`, { status });
      if (!res.data.success) throw new Error(res.data.message);
      dispatch({ type: "UPDATE_FACILITY_STATUS", payload: { facilityId: id, status } });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to update facility status");
      console.error(err);
      throw err;
    } finally { setLoading(false); }
  };

  useEffect(() => { getFacilities(); }, []);

  const contextValue: Omit<FacilityContextType, "createFacility" | "updateFacility" | "deleteFacility"> = {
    state,
    getFacilities,
    getFacilityById,
    updateFacilityStatus,
    clearCurrentFacility,
    clearError,
  };

  return <FacilityContext.Provider value={contextValue}>{children}</FacilityContext.Provider>;
};
