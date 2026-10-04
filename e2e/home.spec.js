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
  const fakeMovies = {
    1: {
      id: 1,
      title: 'Test Happy Movie',
      overview: 'A happy movie used for E2E testing.',
      poster_path: '/happy.jpg',
      backdrop_path: '/happy-backdrop.jpg',
      release_date: '2020-01-01',
    },

    2: {
      id: 2,
      title: 'Test Excited Movie',
      overview: 'An exciting movie used for E2E testing.',
      poster_path: '/excited.jpg',
      backdrop_path: '/excited-backdrop.jpg',
      release_date: '2021-01-01',
    },

    3: {
      id: 3,
      title: 'Test Thoughtful Movie',
      overview: 'A thoughtful movie used for E2E testing.',
      poster_path: '/thoughtful.jpg',
      backdrop_path: '/thoughtful-backdrop.jpg',
      release_date: '2022-01-01',
    },

    4: {
      id: 4,
      title: 'Test Scared Movie',
      overview: 'A scary movie used for E2E testing.',
      poster_path: '/scared.jpg',
      backdrop_path: '/scared-backdrop.jpg',
      release_date: '2023-01-01',
    },

    5: {
      id: 5,
      title: 'Test Romantic Movie',
      overview: 'A romantic movie used for E2E testing.',
      poster_path: '/romantic.jpg',
      backdrop_path: '/romantic-backdrop.jpg',
      release_date: '2024-01-01',
    },
  }

  await page.route('**/api.themoviedb.org/3/movie/**', async (route) => {
    const url = new URL(route.request().url())
    const match = url.pathname.match(/\/movie\/(\d+)/)
    const id = Number(match?.[1])

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        fakeMovies[id] || {
          id,
          title: `Test Movie ${id}`,
          overview: 'A movie used for E2E testing.',
          poster_path: '/test.jpg',
          backdrop_path: '/test-backdrop.jpg',
          release_date: '2020-01-01',
        }
      ),
    })
  })

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