import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('E-mail').fill('admin@teddy.com');
    await page.getByLabel('Senha').fill('password123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should display total clients card', async ({ page }) => {
    await expect(page.getByText('Total de clientes', { exact: true })).toBeVisible();
  });

  test('should display company value card', async ({ page }) => {
    await expect(page.getByText('Soma de valor das empresas')).toBeVisible();
  });

  test('should display chart section', async ({ page }) => {
    await expect(page.getByText('Clientes por mês')).toBeVisible();
  });

  test('should display latest clients table', async ({ page }) => {
    await expect(page.getByText('Últimos 10 clientes')).toBeVisible();
  });

  test('should navigate to clients via Ver todos button', async ({ page }) => {
    await page.getByRole('link', { name: 'Ver todos' }).click();
    await expect(page).toHaveURL(/\/clients$/);
  });
});
