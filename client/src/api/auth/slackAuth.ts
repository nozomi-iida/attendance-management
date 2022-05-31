import { MutationVariables } from "api/index";
import { HttpClient } from "lib/axios";
import axios from "axios";
import { Account } from "../account";

export type LoginResponse = {
  account: Account;
  token: string;
};

export async function slackAuth() {
  const res = await HttpClient.get<LoginResponse>("/slack_auth");
  console.log(res)
}
