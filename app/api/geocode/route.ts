import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const locationQuery = searchParams.get("location")?.trim();

    if (!locationQuery) {
      return NextResponse.json(
        new ApiError(400, "Location is required"),
        { status: 400 }
      );
    }

    const response = await axios.get(
      "https://us1.locationiq.com/v1/autocomplete.php",
      {
        params: {
          key: process.env.LOCATIONIQ_API_KEY,
          q: locationQuery,
          countrycodes: "pk",
          limit: 10,
          dedupe: 1,
          format: "json",
        },
        validateStatus: () => true, 
      }
    );

    // 🟡 No results found (NOT an error)
    if (response.status === 404 || !Array.isArray(response.data)) {
      return NextResponse.json(
        new ApiResponse(200, "No locations found", [])
      );
    }

    if (response.status !== 200) {
      return NextResponse.json(
        new ApiError(
          response.status,
          "Location service unavailable"
        ),
        { status: 502 }
      );
    }

    const simplifiedResults = response.data.map((r: any) => ({
      address: r.display_name || "",
      city: r.address?.city || r.address?.town || r.address?.village || "",
      country: r.address?.country || "",
      coordinates: {
        lat: Number(r.lat),
        lng: Number(r.lon),
      },
    }));

    return NextResponse.json(
      new ApiResponse(200, "Locations fetched successfully!", simplifiedResults)
    );

  } catch (error: any) {
    console.error("Geocode API error:", error);

    return NextResponse.json(
      new ApiError(500, "Internal server error"),
      { status: 500 }
    );
  }
};
