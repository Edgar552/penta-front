import api from "../API/api";

export const login = data =>
    api.post("/auth/login", data);

// export const refresh = token =>
//     api.post("/auth/refresh", { token });
//
// export const logout = () =>
//     api.post("/auth/logout");

export const register = data =>
    api.post("/auth/register", data);
