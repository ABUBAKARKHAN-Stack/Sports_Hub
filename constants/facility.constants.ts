import { FacilityFormDataType } from "@/schemas/facility.schema";
import { WeekDays } from "@/types/main.types";

const DAYS = Object.values(WeekDays);

const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/avi', 'video/webm'];


const defaultFormValues: FacilityFormDataType = {
  name: "",
  contact: {
    email: "",
    phone: ""
  },
  description: "",
  location: {
    address: "",
    city: "",
    country: "",
    coordinates: {
      lat: 0,
      lng: 0
    }
  },
  openingHours: Object.values(WeekDays).map(day => ({
    day,
    openingTime: '09:00',
    closingTime: '17:00',
    isClosed: false,
  })),
  gallery: {
    images: [],
    introductoryVideo: undefined,
  },
}


export {
    ALLOWED_VIDEO_TYPES,
    DAYS,
    MAX_VIDEO_SIZE,
    defaultFormValues
    
}

