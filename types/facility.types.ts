import { FacilityStatusEnum, IFacility } from './main.types';

//* Facility context state
export interface FacilityState {
  facilities: IFacility[];
  currentFacility: IFacility | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

//* Facility actions
export type FacilityAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FACILITIES'; payload: { facilities: IFacility[]; total: number; page: number; limit: number } }
  | { type: 'SET_FACILITY'; payload: IFacility | null }
  | { type: 'ADD_FACILITY'; payload: IFacility }
  | { type: 'UPDATE_FACILITY'; payload: IFacility }
  | { type: 'DELETE_FACILITY'; payload: string } // facilityId
  | { type: 'UPDATE_FACILITY_STATUS'; payload: { facilityId: string; status: FacilityStatusEnum } };

//* Create facility form data
export interface CreateFacilityFormData {
  name: string;
  description?: string;
  location: {
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
  };
  openingHours: Array<{
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    openingTime: string;
    closingTime: string;
    isClosed: boolean;
  }>;
  images?: string[];
  documents?: Array<{
    type: string;
    url: string;
  }>;
}

//* Update facility form data
export interface UpdateFacilityFormData extends Partial<CreateFacilityFormData> {
  status?: FacilityStatusEnum;
}

//* API response types
export interface FacilitiesResponse {
  data: IFacility[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

//* Facility context type
export interface FacilityContextType {
  state: FacilityState;
  //* Actions
  getFacilities: (params?: GetFacilitiesParams) => Promise<void>;
  getFacilityById: (id: string) => Promise<void>;
  createFacility: (data: CreateFacilityFormData) => Promise<IFacility>;
  updateFacility: (id: string, data: UpdateFacilityFormData) => Promise<IFacility>;
  deleteFacility: (id: string) => Promise<void>;
  updateFacilityStatus: (id: string, status: FacilityStatusEnum) => Promise<void>;
  clearCurrentFacility: () => void;
  clearError: () => void;
}

//* Get facilities params
export interface GetFacilitiesParams {
  page?: number;
  limit?: number;
  status?: FacilityStatusEnum;
  search?: string;
}