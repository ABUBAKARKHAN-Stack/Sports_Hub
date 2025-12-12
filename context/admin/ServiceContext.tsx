'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import {
  ServiceState,
  ServiceAction,
  ServiceContextType,
  GetServicesParams,
  ServicesResponse,
  UpdateServiceFormData
} from "@/types/service.types";
import { IService } from "@/types/main.types";
import {axiosInstance} from "@/lib/axios";
import { ApiResponse } from "@/utils/ApiResponse";
import { useToasts } from "@/hooks/toastNotifications";

const initialState: ServiceState = {
  services: [],
  currentService: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

// Service Reducers
const serviceReducer = (state: ServiceState, action: ServiceAction): ServiceState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_SERVICES":
      return {
        ...state,
        services: action.payload.data,
        pagination: {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: Math.ceil(action.payload.total / action.payload.limit),
        },
        loading: false,
        error: null,
      };

    case "SET_SERVICE":
      return { ...state, currentService: action.payload, loading: false, error: null };

    case "ADD_SERVICE":
      return {
        ...state,
        services: [action.payload, ...state.services],
        currentService: action.payload,
        loading: false,
        error: null
      };

    case "UPDATE_SERVICE":
      return {
        ...state,
        services: state.services.map(s =>
          s._id.toString() === action.payload._id.toString() ? action.payload : s
        ),
        currentService: action.payload,
        loading: false,
        error: null,
      };

    case "DELETE_SERVICE":
      return {
        ...state,
        services: state.services.filter(s => s._id.toString() !== action.payload),
        currentService: null,
        loading: false,
        error: null
      };

    case "UPDATE_SERVICE_STATUS":
      return {
        ...state,
        services: state.services.map(s =>
          s._id.toString() === action.payload.serviceId
            ? { ...s, isActive: action.payload.isActive }
            : s
        ),
        currentService: state.currentService?._id.toString() === action.payload.serviceId
          ? { ...state.currentService, isActive: action.payload.isActive }
          : state.currentService,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const useService = (): ServiceContextType => {
  const context = useContext(ServiceContext);
  if (!context) throw new Error("useService must be used within a ServiceProvider");
  return context;
};

interface ServiceProviderProps {
  children: ReactNode;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(serviceReducer, initialState);
  const { errorToast, successToast } = useToasts();

  const setLoading = (loading: boolean) => dispatch({ type: "SET_LOADING", payload: loading });
  const setError = (error: string | null) => dispatch({ type: "SET_ERROR", payload: error });
  const clearError = () => setError(null);
  const clearCurrentService = () => dispatch({ type: "SET_SERVICE", payload: null });

  //* Service API Functions

  const getServices = async (params?: GetServicesParams) => {
    try {
      setLoading(true);
      clearError();

      const res = await axiosInstance.get<ApiResponse<ServicesResponse>>("/admin/services", { params });

      if (!res.data.success) throw new Error(res.data.message);

      const { data, total, page, limit } = res.data.data!;
      dispatch({
        type: "SET_SERVICES",
        payload: {
          data,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch services");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getServiceById = async (id: string) => {
    try {
      setLoading(true);
      clearError();

      const res = await axiosInstance.get<ApiResponse<IService>>(`/admin/services/${id}`);

      if (!res.data.success) throw new Error(res.data.message);

      dispatch({ type: "SET_SERVICE", payload: res.data.data! });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch service");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createService = async (data: FormData): Promise<IService> => {
    try {
      setLoading(true);
      clearError();

      const res = await axiosInstance.post<ApiResponse<IService>>(
        "/admin/services",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!res.data.success) throw new Error(res.data.message);

      successToast("Service created successfully");
      dispatch({ type: "ADD_SERVICE", payload: res.data.data! });
      return res.data.data!;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to create service";
      errorToast(errMsg);
      setError(errMsg);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id: string, data: UpdateServiceFormData): Promise<IService> => {
    try {
      setLoading(true);
      clearError();

      const res = await axiosInstance.put<ApiResponse<IService>>(`/admin/services/${id}`, data);

      if (!res.data.success) throw new Error(res.data.message);

      successToast("Service updated successfully");
      dispatch({ type: "UPDATE_SERVICE", payload: res.data.data! });
      return res.data.data!;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update service";
      errorToast(errMsg);
      setError(errMsg);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    try {
      setLoading(true);
      clearError();

      const res = await axiosInstance.delete<ApiResponse<null>>(`/admin/services/${id}`);

      if (!res.data.success) throw new Error(res.data.message);

      successToast("Service deleted successfully");
      dispatch({ type: "DELETE_SERVICE", payload: id });
    } catch (err: any) {
      errorToast(err.response?.data?.message || err.message || "Failed to delete service");
      setError(err.response?.data?.message || err.message || "Failed to delete service");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateServiceStatus = async (id: string, isActive: boolean) => {
    try {
      setLoading(true);
      clearError();

      const res = await axiosInstance.patch<ApiResponse<IService>>(
        `/admin/services/${id}`,
        { isActive }
      );

      if (!res.data.success) throw new Error(res.data.message);

      dispatch({
        type: "UPDATE_SERVICE_STATUS",
        payload: { serviceId: id, isActive }
      });
      successToast(`Service ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to update service status");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const contextValue: ServiceContextType = {
    state,
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    updateServiceStatus,
    clearCurrentService,
    clearError,
  };

  return (
    <ServiceContext.Provider value={contextValue}>
      {children}
    </ServiceContext.Provider>
  );
};