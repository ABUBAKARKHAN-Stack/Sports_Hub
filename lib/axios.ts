
import axios from "axios";
import { redirect } from "next/navigation";

const axiosInstance = axios.create({
    baseURL: "/api",
});




axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
            //! Handle unauthorized
            redirect('/signin')
        }
        return Promise.reject(err);
    }
);



export {
    axiosInstance,
    // axiosInstanceWithCredentials
}