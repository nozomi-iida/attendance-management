import { Account } from "../account";
import { HttpClient } from "../../lib/axios";

export type LoginRequestBody = {
  email: string;
  password: string;
};

export type LoginResponse = {
  account: Account;
  token: string;
};

export async function login(requestBody: LoginRequestBody) {
  const res = await HttpClient.post<LoginResponse>("/login", requestBody);
  return res.data;
}
