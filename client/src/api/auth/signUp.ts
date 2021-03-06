import { HttpClient } from "lib/axios";
import { MutationVariables } from "api/index";
import { Account } from "../account";

export type SignUpRequestBody = {
  token: string;
  password: string;
};

export type SignUpResponse = {
  account: Account;
  token: string;
};

// functionじゃないと型定義がうまくいかない
export async function signUp({
  requestBody,
}: MutationVariables<undefined, SignUpRequestBody>) {
  const res = await HttpClient.post<SignUpResponse>("/sign_up", requestBody);
  return res.data;
}
