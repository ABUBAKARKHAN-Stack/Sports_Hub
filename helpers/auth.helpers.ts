import { axiosInstance } from "@/lib/axios"
import { IUser } from "@/types/main.types";
import { ApiResponse } from "@/utils/ApiResponse";

const getUser = async (): Promise<IUser | null> => {
    try {
        const response = await axiosInstance.get('/auth/me')
        console.log(response);
        
        if (response.status === 200) {
            return response.data.data
        }
        return null

    } catch (error) {
        console.error("Me fetch error:", error);
        return null
    }
}


export {
    getUser
}
