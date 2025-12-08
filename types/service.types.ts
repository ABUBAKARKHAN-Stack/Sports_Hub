import { IService } from "./main.types";

export interface CreateServiceFormData {
  title: string;
  description?: string;
  facilityId: string;
  price: number;
  duration: number;
  capacity: number;
  category: string;
  images: File[];
}

export interface UpdateServiceFormData extends Partial<CreateServiceFormData> {
  isActive?: boolean;
}

export interface GetServicesParams {
  page?: number;
  limit?: number;
  facilityId?: string;
  search?: string;
  category?: string;
  isActive?: boolean;
}

export interface ServicesResponse {
  data: IService[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// State and Context Types
export interface ServiceState {
  services: IService[];
  currentService: IService | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ServiceAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SERVICES"; payload: ServicesResponse }
  | { type: "SET_SERVICE"; payload: IService | null }
  | { type: "ADD_SERVICE"; payload: IService }
  | { type: "UPDATE_SERVICE"; payload: IService }
  | { type: "DELETE_SERVICE"; payload: string }
  | { type: "UPDATE_SERVICE_STATUS"; payload: { serviceId: string; isActive: boolean } };

export interface ServiceContextType {
  state: ServiceState;
  getServices: (params?: GetServicesParams) => Promise<void>;
  getServiceById: (id: string) => Promise<void>;
  createService: (data: FormData) => Promise<IService>;
  updateService: (id: string, data: UpdateServiceFormData) => Promise<IService>;
  deleteService: (id: string) => Promise<void>;
  updateServiceStatus: (id: string, isActive: boolean) => Promise<void>;
  clearCurrentService: () => void;
  clearError: () => void;
}