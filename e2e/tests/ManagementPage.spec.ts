import {test} from "@playwright/test";
import {signIn} from "../helpers/signIn";

test.beforeEach(async ({page}) => {
  await signIn(page);
})
