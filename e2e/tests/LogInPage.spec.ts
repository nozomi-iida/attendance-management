import { test, expect } from '@playwright/test';
import {signIn} from "../helpers/signIn";

test('login', async ({ page }) => {
  await signIn(page)
  await expect(page).toHaveURL("http://localhost:3000")
});
