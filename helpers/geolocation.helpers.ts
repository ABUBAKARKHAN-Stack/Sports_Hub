import { axiosInstance } from "@/lib/axios"
import { Location } from "@/types/main.types"

export const getLocations = async (location: string) => {
    try {
        const response = await axiosInstance.get('/geocode', { params: {
            location: encodeURIComponent(location)
        } })
        if (response.status === 200) {
            const data: Location[] = await response.data.data;
            return data
        }
        return []
    } catch (error) {
        console.error("Locations fetch error:", error);
        return []
    }
}