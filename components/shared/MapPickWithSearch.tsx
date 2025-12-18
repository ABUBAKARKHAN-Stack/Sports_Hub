"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent, LayersControl } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import "@/lib/LeafletMarkerFix";
import { ILocation } from "@/types/main.types";
import { cn } from "@/lib/utils";
import { reverseGeocoding } from "@/helpers/geolocation.helpers";

interface MapPickWithSearchProps {
    location?: Partial<ILocation> | null;
    showMarker?: boolean;
    autoCenter?: boolean;
    zoom?: number;
    className?: string;
    onLocationSelect: (location: ILocation) => void;
}

const DEFAULT_CENTER: [number, number] = [24.8607, 67.0011];

function SafeLocationMarker({
    location,
    autoCenter,
    zoom,
    showMarker,
    onLocationSelect,
}: {
    location?: Partial<ILocation> | null;
    autoCenter: boolean;
    zoom: number;
    showMarker: boolean;
    onLocationSelect: (location: ILocation) => void;
}) {
    const map = useMap();
    const [isFetching, setIsFetching] = useState(false);


    useMapEvent("click", async (e) => {
        const { lat, lng } = e.latlng;
        setIsFetching(true);

        try {
            const response = await reverseGeocoding(lat, lng)

            const newLocation: ILocation = {
                address: response?.address || "Unknown Location",
                city: response?.city,
                country: response?.country,
                coordinates: {
                    ...response?.coordinates || { lat: 0, lng: 0 }
                }
            };

            onLocationSelect(newLocation);

            map.flyTo([lat, lng], map.getZoom());
        } catch (error) {
            console.error("Failed to resolve address", error);
            //! Fallback if fetch fails
            onLocationSelect({
                coordinates: {
                    lat,
                    lng
                },
                address: "Unknown Location",
                city: "N/A",
                country: "N/A"
            });
        } finally {
            setIsFetching(false);
        }
    });

    const isValidLocation = useMemo(
        () => typeof location?.coordinates?.lat === "number" && typeof location?.coordinates?.lng === "number",
        [location]
    );

    useEffect(() => {
        if (isValidLocation && autoCenter) {
            map.flyTo([location!.coordinates!.lat!, location!.coordinates!.lng!], zoom, {
                animate: true,
            });
        }
    }, [isValidLocation, autoCenter, zoom, map, location]);

    if (!isValidLocation || !showMarker) return null;

    return (
        <Marker position={[location!.coordinates!.lat!, location!.coordinates!.lng!]}>
            {location?.address && <Popup>{isFetching ? "Loading..." : location.address}</Popup>}
        </Marker>
    );
}

export default function MapPickWithSearch({
    location = null,
    showMarker = true,
    autoCenter = true,
    zoom = 13,
    className = "",
    onLocationSelect,
}: MapPickWithSearchProps) {
    const initialCenter = useMemo<[number, number]>(() => {
        if (typeof location?.coordinates?.lat === "number" && typeof location?.coordinates?.lng === "number") {
            return [location.coordinates.lat, location.coordinates.lng];
        }
        return DEFAULT_CENTER;
    }, [location]);


    return (
        <MapContainer
            center={initialCenter}
            zoom={zoom}
            scrollWheelZoom
            maxZoom={19}
            className={cn(className)}

        >
            <TileLayer
                url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
            />

            <SafeLocationMarker
                location={location}
                autoCenter={autoCenter}
                zoom={zoom}
                showMarker={showMarker}
                onLocationSelect={onLocationSelect}
            />
        </MapContainer>
    );
}