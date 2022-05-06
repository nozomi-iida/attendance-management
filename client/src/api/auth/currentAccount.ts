import { HttpClient } from "lib/axios";
import { Account } from "../account";

export async function getCurrentAccount() {
  const res = await HttpClient.get<Account>("/current_account");
  return res.data;
}
