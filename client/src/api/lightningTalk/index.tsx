import { Account } from "api/account";

export type LightningTalk = {
  id: number;
  talkDay: string;
  title: string;
  description?: string;
  author: Account;
};
