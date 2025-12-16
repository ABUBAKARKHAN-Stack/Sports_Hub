import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location")?.trim();

    if (!location) {
      return NextResponse.json(
        new ApiError(400, "Location is required"),
        { status: 400 }
      );
    }

    const urlSafeLocation = encodeURIComponent(location);

    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${urlSafeLocation}&key=${process.env.OPENCAGE_API_KEY}&limit=10`
    );    

    if (response.status !== 200) {        
      return NextResponse.json(
        new ApiError(response.status, "Failed to fetch locations from OpenCage"),
        { status: response.status }
      );
    }


    //* Map results to only return what frontend needs
    const simplifiedResults = response.data.results.map((r: any) => ({
      formatted: r.formatted,
      lat: r.geometry.lat,
      lng: r.geometry.lng,
    }));

    return NextResponse.json(
      new ApiResponse(200, "Locations fetched successfully!", simplifiedResults)
    );
  } catch (error: any) {
    console.error("Geocode API error:", error);

    return NextResponse.json(
      new ApiError(500, "Failed to fetch locations", error.message),
      { status: 500 }
    );
  }
};
