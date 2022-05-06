import axios from "axios";
import { PersistKeys } from "../constants/persistKeys";
import { ApiHost } from "../constants/urls";

export const HttpClient = axios.create({
  baseURL: ApiHost,
});

const token = localStorage.getItem(PersistKeys.AuthToken);

if (token) {
  HttpClient.defaults.headers.common.Authorization = `Bearer ${token}`;
}
