import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
  await page.goto('/login');
  await page.locator('[placeholder="メールアドレス"]').click();
  await page.locator('[placeholder="メールアドレス"]').fill('test@gmail.com');
  await page.locator('[placeholder="パスワード"]').click();
  await page.locator('[placeholder="パスワード"]').fill('password');
  await page.locator('button:has-text("ログイン")').click();
  await expect(page).toHaveURL("http://localhost:3000")
});