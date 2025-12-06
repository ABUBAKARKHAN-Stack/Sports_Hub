'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { ApiResponse } from '@/utils/ApiResponse';
import {
  FacilityState,
  FacilityContextType,
  FacilityAction,
  CreateFacilityFormData,
  UpdateFacilityFormData,
  GetFacilitiesParams,
  FacilitiesResponse
} from '@/types/facility.types';
import { IFacility, FacilityStatusEnum } from '@/types/main.types';

const initialState: FacilityState = {
  facilities: [],
  currentFacility: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
};

//* Reducer function
const facilityReducer = (state: FacilityState, action: FacilityAction): FacilityState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_FACILITIES':
      return {
        ...state,
        facilities: action.payload.facilities,
        pagination: {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: Math.ceil(action.payload.total / action.payload.limit)
        },
        loading: false,
        error: null
      };
    
    case 'SET_FACILITY':
      return {
        ...state,
        currentFacility: action.payload,
        loading: false,
        error: null
      };
    
    case 'ADD_FACILITY':
      return {
        ...state,
        facilities: [action.payload, ...state.facilities],
        currentFacility: action.payload,
        loading: false,
        error: null
      };
    
    case 'UPDATE_FACILITY':
      return {
        ...state,
        facilities: state.facilities.map(facility =>
          facility._id === action.payload._id ? action.payload : facility
        ),
        currentFacility: action.payload,
        loading: false,
        error: null
      };
    
    case 'DELETE_FACILITY':
      return {
        ...state,
        facilities: state.facilities.filter(facility => facility._id.toString() !== action.payload),
        currentFacility: null,
        loading: false,
        error: null
      };
    
    case 'UPDATE_FACILITY_STATUS':
      return {
        ...state,
        facilities: state.facilities.map(facility =>
          facility._id.toString() === action.payload.facilityId
            ? { ...facility, status: action.payload.status }
            : facility
        ),
        currentFacility: state.currentFacility?._id.toString() === action.payload.facilityId
          ? { ...state.currentFacility, status: action.payload.status }
          : state.currentFacility,
        loading: false,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const FacilityContext = createContext<FacilityContextType | undefined>(undefined);

// Custom hook to use facility context
export const useFacility = () => {
  const context = useContext(FacilityContext);
  if (!context) {
    throw new Error('useFacility must be used within a FacilityProvider');
  }
  return context;
};

// Provider component
interface FacilityProviderProps {
  children: ReactNode;
}

export const FacilityProvider: React.FC<FacilityProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(facilityReducer, initialState);

  // Set loading
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  // Set error
  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  // Clear current facility
  const clearCurrentFacility = () => {
    dispatch({ type: 'SET_FACILITY', payload: null });
  };

  // Get all facilities
  const getFacilities = async (params?: GetFacilitiesParams): Promise<void> => {
    try {
      setLoading(true);
      clearError();

      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);

      const response = await fetch(`/api/admin/facilities?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch facilities');
      }

      const result: ApiResponse<FacilitiesResponse> = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      dispatch({
        type: 'SET_FACILITIES',
        payload: {
          facilities: result.data!.data,
          total: result.data!.total,
          page: result.data!.page,
          limit: result.data!.limit
        }
      });

    } catch (error: any) {
      setError(error.message || 'Failed to fetch facilities');
      console.error('Get facilities error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get facility by ID
  const getFacilityById = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      clearError();

      const response = await fetch(`/api/admin/facilities/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch facility');
      }

      const result: ApiResponse<IFacility> = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      dispatch({ type: 'SET_FACILITY', payload: result.data! });

    } catch (error: any) {
      setError(error.message || 'Failed to fetch facility');
      console.error('Get facility by ID error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new facility
  const createFacility = async (data: CreateFacilityFormData): Promise<IFacility> => {
    try {
      setLoading(true);
      clearError();

      const response = await fetch('/api/admin/facilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result: ApiResponse<IFacility> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create facility');
      }

      dispatch({ type: 'ADD_FACILITY', payload: result.data! });
      return result.data!;

    } catch (error: any) {
      setError(error.message || 'Failed to create facility');
      console.error('Create facility error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update facility
  const updateFacility = async (id: string, data: UpdateFacilityFormData): Promise<IFacility> => {
    try {
      setLoading(true);
      clearError();

      const response = await fetch(`/api/admin/facilities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result: ApiResponse<IFacility> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update facility');
      }

      dispatch({ type: 'UPDATE_FACILITY', payload: result.data! });
      return result.data!;

    } catch (error: any) {
      setError(error.message || 'Failed to update facility');
      console.error('Update facility error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete facility
  const deleteFacility = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      clearError();

      const response = await fetch(`/api/admin/facilities/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result: ApiResponse<null> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete facility');
      }

      dispatch({ type: 'DELETE_FACILITY', payload: id });

    } catch (error: any) {
      setError(error.message || 'Failed to delete facility');
      console.error('Delete facility error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update facility status
  const updateFacilityStatus = async (id: string, status: FacilityStatusEnum): Promise<void> => {
    try {
      setLoading(true);
      clearError();

      const response = await fetch(`/api/admin/facilities/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      const result: ApiResponse<IFacility> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update facility status');
      }

      dispatch({
        type: 'UPDATE_FACILITY_STATUS',
        payload: { facilityId: id, status }
      });

    } catch (error: any) {
      setError(error.message || 'Failed to update facility status');
      console.error('Update facility status error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load facilities on initial render
  useEffect(() => {
    getFacilities();
  }, []);

  const contextValue: FacilityContextType = {
    state,
    getFacilities,
    getFacilityById,
    createFacility,
    updateFacility,
    deleteFacility,
    updateFacilityStatus,
    clearCurrentFacility,
    clearError,
  };

  return (
    <FacilityContext.Provider value={contextValue}>
      {children}
    </FacilityContext.Provider>
  );
};