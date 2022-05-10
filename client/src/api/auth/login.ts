import { MutationVariables } from "api/index";
import { HttpClient } from "lib/axios";
import { Account } from "../account";

export type LoginRequestBody = {
  email: string;
  password: string;
};

export type LoginResponse = {
  account: Account;
  token: string;
};

export async function login({
  requestBody,
}: MutationVariables<undefined, LoginRequestBody>) {
  const res = await HttpClient.post<LoginResponse>("/login", requestBody);
  return res.data;
}
