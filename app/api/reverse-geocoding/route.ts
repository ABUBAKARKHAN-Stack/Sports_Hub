import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { ILocation } from "@/types/main.types";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get("lat")?.trim();
        const lon = searchParams.get("lon")?.trim();


        if (!lat || !lon) {
            return NextResponse.json(
                new ApiError(400, "Latitude and Longitude is required"),
                { status: 400 }
            );
        }


        const response = await axios.get(
            `https://us1.locationiq.com/v1/reverse?key=${process.env.LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json&`
        )

        if (response.status !== 200) {
            return NextResponse.json(
                new ApiError(response.status, "Failed to fetch reverse geocoding from LocationIQ"),
                { status: response.status }
            );
        }

        const data = response.data

        const location: ILocation = {
            address: data?.display_name || "Unknown Location",
            city: data.address?.city || data.address?.town || data.address?.village || "",
            country: data.address?.country || "",
            coordinates: {
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lon),
            },
        }


        return NextResponse.json(
            new ApiResponse(200, "Location fetched successfully!", location)
        );
    } catch (error: any) {
        console.error("Geocode API error:", error);

        return NextResponse.json(
            new ApiError(500, "Failed to fetch reverse geocoding", error.message),
            { status: 500 }
        );
    }
};
