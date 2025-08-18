import axios, {
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";

const BaseUrl: string = "http://localhost:5000/api/v1";

const instance = axios.create({
    baseURL: BaseUrl,
    // headers: {
    //     "Content-Type": "application/json",
    // },
});

instance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Let browser set Content-Type with proper boundary
    delete config.headers["Content-Type"];
  }
  return config;
});
// Request Interceptor
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        // Example: Adding an Authorization token
        // const accessToken: string = "your_access_token_here";
        // if (accessToken) {
        //     config.headers["Authorization"] = `Bearer ${accessToken}`;
        // }

        return config;
    },
    (error: AxiosError): Promise<never> => {
        return Promise.reject(error);
    }
);

// Response Interceptor
instance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error: AxiosError): Promise<never> => {
        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = "/apps?session=expired";
            } else {
                console.error(
                    `Unexpected error code ${error.response.status}:`,
                    error.response.data
                );
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
  // email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }