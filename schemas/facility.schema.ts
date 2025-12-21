import { WeekDays } from "@/types/main.types";
import z from "zod";

const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const locationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  coordinates: coordinatesSchema,
});

const contactSchema = z.object({
  phone: z.string().min(5, "Phone number is required"),
  email: z.email("Invalid email address"),
});

const openingHoursSchema = z.object({
  day: z.enum(WeekDays),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  isClosed: z.boolean().optional(),
})
  .refine(
    (data) => {
      //* If not closed, both openingTime and closingTime are required
      if (!data.isClosed) {
        return data.openingTime && data.openingTime.length > 0 &&
          data.closingTime && data.closingTime.length > 0;
      }
      //* If closed, times are not required
      return true;
    },
    {
      message: "Opening and closing times are required when the facility is open",
      path: ["openingTime"],
    }
  );

const gallerySchema = z.object({
  images: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(1, "At least one image is required")
    .max(5, "Only up to 5 images can be uploaded"),
  introductoryVideo: z.union([z.instanceof(File), z.string()]).nullable().optional(),
});

export const facilityFormSchema = z.object({
  name: z.string().min(3, "Facility name must be at least 3 characters"),
  description: z.string().optional(),
  location: locationSchema,
  contact: contactSchema,
  openingHours: z.array(openingHoursSchema).min(1, "At least one opening hour required")
    .refine(
      (hours) => hours.some(hour => !hour.isClosed),
      "At least one day must be open"
    ),
  gallery: gallerySchema,
});



export type FacilityFormDataType = z.infer<typeof facilityFormSchema>