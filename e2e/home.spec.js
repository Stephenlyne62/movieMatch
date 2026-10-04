import { test, expect } from '@playwright/test'

test('user can navigate from Home to Catalogue', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', {
      name: 'Choose a mood. Find your next film.',
    })
  ).toBeVisible()

  const navigation = page.getByRole('navigation')

  await navigation.getByRole('link', {
    name: 'Catalogue',
  }).click()

  await expect(page).toHaveURL(/catalogue/)
})

test('user can add the featured movie to their watchlist', async ({ page }) => {
  await page.goto('/')

  const hero = page.locator('.hero')

  await expect(hero).toBeVisible()

  const movieTitle = await hero
    .getByRole('heading', { level: 2 })
    .textContent()

  await hero.getByRole('button', {
    name: 'Add to Watchlist',
  }).click()

  await expect(
    hero.getByRole('button', {
      name: 'Saved ✓',
    })
  ).toBeVisible()

  const navigation = page.getByRole('navigation')

  await navigation.getByRole('link', {
    name: 'Watchlist',
  }).click()

  await expect(page).toHaveURL(/watchlist/)

  await expect(
    page.getByRole('heading', {
      name: movieTitle,
      level: 2,
    })
  ).toBeVisible()
})