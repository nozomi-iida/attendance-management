import axios from "axios";
import { PersistKeys } from "constants/persistKeys";
import { ApiHost } from "constants/urls";

export const HttpClient = axios.create({
  baseURL: ApiHost,
});

HttpClient.interceptors.request.use((config) => {
  if (config.headers && !config.headers?.Authorization) {
    const token = localStorage.getItem(PersistKeys.AuthToken);
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
