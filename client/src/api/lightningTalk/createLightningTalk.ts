import { HttpClient } from "lib/axios";
import { LightningTalk } from "api/lightningTalk/index";

export type CreateLightningTalkRequestBody = {
  talkDay: string;
  title: string;
  description?: string;
};

export async function createLightningTalk() {
  const res = await HttpClient.post<LightningTalk>("lightning_talks");
  return res.data;
}
