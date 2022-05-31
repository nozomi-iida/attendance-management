import axios from "axios";
import { PersistKeys } from "constants/persistKeys";
import { ApiHost } from "constants/urls";

export const HttpClient = axios.create({
  baseURL: ApiHost,
  headers: {
    Authorization: `Bearer ${
      localStorage.getItem(PersistKeys.AuthToken) ?? ""
    }`,
    'Access-Control-Allow-Origin': '*'
  },
});
