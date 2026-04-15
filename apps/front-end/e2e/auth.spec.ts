import { test, expect } from '@playwright/test';

test.describe('Auth flow', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/clients');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show session expired message when redirected', async ({ page }) => {
    await page.goto('/clients');
    await expect(page.getByText('Sua sessão expirou')).toBeVisible();
  });

  test('should login with valid credentials and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('E-mail').fill('admin@teddy.com');
    await page.getByLabel('Senha').fill('password123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Olá,')).toBeVisible();
    await expect(page.getByText('Administrador')).toBeVisible();
  });

  test('should show validation errors on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('E-mail é obrigatório')).toBeVisible();
    await expect(page.getByText('Senha é obrigatória')).toBeVisible();
  });
});
