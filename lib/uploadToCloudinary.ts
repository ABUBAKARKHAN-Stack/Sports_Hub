import { ApiError } from "@/utils/ApiError";
import cloudinary from "./cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";


export async function uploadToCloudinary(
    fileBuffer: Buffer,
    folder: string,
    resourceType: "image" | "video" | "auto" = "auto"
): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
            },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(new Error("Failed to upload to Cloudinary"));
                } else if (result) {
                    resolve(result);
                } else {
                    reject(new Error("No result returned from Cloudinary"));
                }
            }
        );

        stream.end(fileBuffer);
    });
}

export async function deleteFromCloudinary(public_id: string,    resourceType: "image" | "video" | "auto" = "auto"
): Promise<any> {
    try {
        const response = await cloudinary.uploader.destroy(public_id,{resource_type:resourceType});

        if (response.result === "ok") {
            console.log(`Successfully deleted ${public_id} from Cloudinary.`);
        } else {
            console.warn(`Cloudinary deletion response for ${public_id}:`, response);
        }

        return response;
    } catch (error) {
        console.error(`Failed to delete ${public_id} from Cloudinary:`, error);
        throw new Error("Cloudinary deletion failed");
    }
}

export function extractPublicId(url: string) {
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;

  let publicIdWithExt = parts[1]       
    .replace(/^v\d+\//, "");          

  return publicIdWithExt.replace(/\.[^/.]+$/, ""); 
}

