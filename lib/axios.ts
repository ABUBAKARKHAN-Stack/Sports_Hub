
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "/api",
});

axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
            //! Handle unauthorized
            window.location.href = "/signin";
        }
        return Promise.reject(err);
    }
);





export default axiosInstance;
