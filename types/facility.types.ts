import { z } from "zod";
import { FacilityStatusEnum, IFacility } from "./main.types";
import { createFacilitySchema } from "@/schemas/facility.schema";

//* --------------------
// Facility State
//* --------------------
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

//* --------------------
// Facility Actions
//* --------------------
export type FacilityAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_FACILITIES"; payload: { facilities: IFacility[]; total: number; page: number; limit: number } }
  | { type: "SET_FACILITY"; payload: IFacility | null }
  | { type: "ADD_FACILITY"; payload: IFacility }
  | { type: "UPDATE_FACILITY"; payload: IFacility }
  | { type: "DELETE_FACILITY"; payload: string } // facilityId
  | { type: "UPDATE_FACILITY_STATUS"; payload: { facilityId: string; status: FacilityStatusEnum } };

//* --------------------
// Form Data
//* --------------------
export type CreateFacilityFormData = z.infer<typeof createFacilitySchema>;
export type UpdateFacilityFormData = Partial<CreateFacilityFormData>;

//* --------------------
// API Response Types
//* --------------------
export interface FacilitiesResponse {
  data: IFacility[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

//* --------------------
// Context Type
//* --------------------
export interface FacilityContextType {
  state: FacilityState;
  //* CRUD Actions
  getFacilities: (params?: GetFacilitiesParams) => Promise<void>;
  getFacilityById: (id: string) => Promise<void>;
  createFacility: (data: FormData) => Promise<IFacility>;
  updateFacility: (id: string, data: UpdateFacilityFormData) => Promise<IFacility>;
  deleteFacility: (id: string) => Promise<void>;
  updateFacilityStatus: (id: string, status: FacilityStatusEnum) => Promise<void>;
  clearCurrentFacility: () => void;
  clearError: () => void;
}

//* --------------------
// Query Params
//* --------------------
export interface GetFacilitiesParams {
  page?: number;
  limit?: number;
  status?: FacilityStatusEnum;
  search?: string;
}
