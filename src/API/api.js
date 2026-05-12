import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL ,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});


//token en memoria
let accessToken = null;

export const setAccessToken = token => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

//attach token
api.interceptors.request.use(config => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// refresh automático
api.interceptors.response.use(
    res => res,
    async err => {
        const original = err.config;

        // evitar loop infinito
        if (
            err.response?.status === 401 &&
            original?.url?.includes("/auth/refresh")
        ) {
            return Promise.reject(err);
        }

        // intentar refresh una vez
        if (err.response?.status === 401 && !original._retry) {
            original._retry = true;

            try {
                const { data } = await api.get("/auth/refresh"); // FIX

                setAccessToken(data.accessToken);

                original.headers.Authorization =
                    `Bearer ${data.accessToken}`;

                return api(original);
            } catch (refreshError) {
                // limpiar sesión si falla refresh
                setAccessToken(null);

                // opcional: redirigir a login
                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(err);
    }
);

export default api;