import * as z from "zod";

const coordinatesSchema = z.object({
  lat: z.number().optional().default(0),
  lng: z.number().optional().default(0),
});

const locationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  coordinates: coordinatesSchema.optional(),
});

const contactSchema = z.object({
  phone: z.string().min(5, "Phone number is required"),
  email: z.email("Invalid email address"),
});

const openingHoursSchema = z.object({
  day: z.enum(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  isClosed: z.boolean().optional().default(false),
})
.refine(
  (data) => {
    // If not closed, both openingTime and closingTime are required
    if (!data.isClosed) {
      return data.openingTime && data.openingTime.length > 0 && 
             data.closingTime && data.closingTime.length > 0;
    }
    // If closed, times are not required
    return true;
  },
  {
    message: "Opening and closing times are required when the facility is open",
    path: ["openingTime"],
  }
);

const gallerySchema = z.object({
  images: z
    .custom<File[]>((files) => Array.isArray(files), {
      message: "At least one image is required",
    })
    .refine((files) => files.length > 0, "At least one image is required"),
  introductoryVideo: z.instanceof(File).optional().nullable(),
});

export const createFacilitySchema = z.object({
  name: z.string().min(3, "Facility name must be at least 3 characters"),
  description: z.string().optional().nullable(),
  location: locationSchema,
  contact: contactSchema,
  openingHours: z.array(openingHoursSchema).min(1, "At least one opening hour required")
    .refine(
      (hours) => hours.some(hour => !hour.isClosed),
      "At least one day must be open"
    ),
  gallery: gallerySchema.optional(),
});