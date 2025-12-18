import axios from "axios"
import { ILocation } from "@/types/main.types"

export const getLocations = async (location: string) => {
    try {
        const response = await axios.get('/api/geocode', {
            params: {
                location
            }
        })

        if (response.status === 200) {
            const data: ILocation[] = await response.data?.data || [];
            return data
        }
        return []
    } catch (error) {
        console.error("Locations fetch error:", error);
        return []
    }
}


export const reverseGeocoding = async (lat: number, lon: number) => {
    try {
        const response = await axios.get('/api/reverse-geocoding', {
            params: {
                lat,
                lon
            }
        })

        if (response.status === 200) {
            const data: ILocation = await response.data?.data || null;
            return data
        }

        return null

    } catch (error) {
        console.error("Location fetch error:", error);
        return null
    }
}