import { test, expect } from '@playwright/test';

test.describe('Clients', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('E-mail').fill('admin@teddy.com');
    await page.getByLabel('Senha').fill('password123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await page.getByRole('link', { name: 'Clientes' }).first().click();
    await expect(page).toHaveURL(/\/clients$/);
  });

  test('should display client cards', async ({ page }) => {
    await expect(page.getByText('clientes encontrados')).toBeVisible();
  });

  test('should create a client via modal', async ({ page }) => {
    await page.getByRole('button', { name: 'Criar cliente' }).click();
    await expect(page.getByText('Criar cliente:')).toBeVisible();

    await page.getByPlaceholder('Digite o nome:').fill('Playwright Test');
    await page.getByPlaceholder('Digite o salário:').fill('500000');
    await page.getByPlaceholder('Digite o valor da empresa:').fill('10000000');
    await page.getByRole('button', { name: 'Criar cliente' }).nth(1).click();

    await expect(page.getByText('criado com sucesso')).toBeVisible();
  });

  test('should edit a client via modal', async ({ page }) => {
    const editButtons = page.getByLabel(/Editar/);
    await editButtons.first().click();
    await expect(page.getByText('Editar cliente:')).toBeVisible();

    const nameInput = page.getByPlaceholder('Digite o nome:');
    await nameInput.clear();
    await nameInput.fill('Playwright Edited');
    await page.getByRole('button', { name: 'Editar cliente' }).click();

    await expect(page.getByText('atualizado com sucesso')).toBeVisible();
  });

  test('should delete a client with confirmation', async ({ page }) => {
    const deleteButtons = page.getByLabel(/Excluir/);
    await deleteButtons.first().click();
    await expect(page.getByText('Excluir cliente:')).toBeVisible();

    await page.getByRole('button', { name: 'Excluir cliente' }).click();
    await expect(page.getByText('excluído com sucesso')).toBeVisible();
  });

});
