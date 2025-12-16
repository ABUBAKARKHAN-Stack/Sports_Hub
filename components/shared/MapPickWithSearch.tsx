"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent, LayersControl } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import "@/lib/LeafletMarkerFix";
import { Location } from "@/types/main.types";
import { cn } from "@/lib/utils";

interface MapPickWithSearchProps {
    location?: Partial<Location> | null;
    showMarker?: boolean;
    autoCenter?: boolean;
    zoom?: number;
    height?: number | string;
    className?: string;
    onLocationSelect: (location: Location) => void;
}

const DEFAULT_CENTER: [number, number] = [24.8607, 67.0011];

function SafeLocationMarker({
    location,
    autoCenter,
    zoom,
    showMarker,
    onLocationSelect,
}: {
    location?: Partial<Location> | null;
    autoCenter: boolean;
    zoom: number;
    showMarker: boolean;
    onLocationSelect: (location: Location) => void;
}) {
    const map = useMap();
    const [isFetching, setIsFetching] = useState(false);


    useMapEvent("click", async (e) => {
        const { lat, lng } = e.latlng;
        setIsFetching(true);

        try {
            // 1. Basic Reverse Geocoding (OpenStreetMap/Nominatim)
            // You can replace this with your own helper if you have one
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();

            const newLocation: Location = {
                lat: lat,
                lng: lng,
                formatted: data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            };

            // 2. Trigger the callback to update parent state
            onLocationSelect(newLocation);

            // 3. Fly to the clicked spot
            map.flyTo([lat, lng], map.getZoom());
        } catch (error) {
            console.error("Failed to resolve address", error);
            // Fallback if fetch fails
            onLocationSelect({
                lat,
                lng,
                formatted: `${lat.toFixed(5)}, ${lng.toFixed(5)}`
            });
        } finally {
            setIsFetching(false);
        }
    });

    const isValidLocation = useMemo(
        () => typeof location?.lat === "number" && typeof location?.lng === "number",
        [location]
    );

    useEffect(() => {
        if (isValidLocation && autoCenter) {
            map.flyTo([location!.lat!, location!.lng!], zoom, {
                animate: true,
            });
        }
    }, [isValidLocation, autoCenter, zoom, map, location]);

    if (!isValidLocation || !showMarker) return null;

    return (
        <Marker position={[location!.lat!, location!.lng!]}>
            {location?.formatted && <Popup>{isFetching ? "Loading..." : location.formatted}</Popup>}
        </Marker>
    );
}

export default function MapPickWithSearch({
    location = null,
    showMarker = true,
    autoCenter = true,
    zoom = 13,
    height = 300,
    className = "",
    onLocationSelect,
}: MapPickWithSearchProps) {
    const initialCenter = useMemo<[number, number]>(() => {
        if (typeof location?.lat === "number" && typeof location?.lng === "number") {
            return [location.lat, location.lng];
        }
        return DEFAULT_CENTER;
    }, [location]);
    const { BaseLayer } = LayersControl;


    return (
        <MapContainer
            center={initialCenter}
            zoom={zoom}
            style={{ height, width: "100%" }}
            scrollWheelZoom
            className={cn(className)}

        >
            {/* <BaseLayer name="Satellite View"> */}
            <TileLayer
                url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
            />
            {/* </BaseLayer> */}

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