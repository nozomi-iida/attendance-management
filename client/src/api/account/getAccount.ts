import {HttpClient} from "lib/axios";
import {Account} from "api/account/index";

export async function getAccount(id: number) {
  const res = await HttpClient.get<Account>(`/accounts/${id}`);
  return res.data;
}
