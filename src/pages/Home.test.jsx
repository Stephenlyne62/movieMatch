import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import Home from './Home'
import { WatchlistProvider } from '../context/WatchlistContext'
import { getMovieDetails } from '../services/tmdb'

vi.mock('../services/tmdb', () => ({
  getMovieDetails: vi.fn(),
}))

vi.mock('../utils/pickSchedule', () => ({
  getFeaturedMoodForToday: () => 'happy',

  isWeekendCatchup: () => false,

  getCurrentWeek: () => ({
    weekLabel: 'Test Week',

    picks: {
      happy: {
        id: 1,
        reason: 'A cheerful movie for testing.',
      },

      excited: {
        id: 2,
        reason: 'An exciting movie for testing.',
      },

      thoughtful: {
        id: 3,
        reason: 'A thoughtful movie for testing.',
      },

      scared: {
        id: 4,
        reason: 'A scary movie for testing.',
      },

      romantic: {
        id: 5,
        reason: 'A romantic movie for testing.',
      },
    },
  }),
}))

const movies = {
  1: {
    id: 1,
    title: 'Test Happy Movie',
    overview: 'A happy movie used for testing.',
    poster_path: '/happy.jpg',
    backdrop_path: '/happy-backdrop.jpg',
    release_date: '2020-01-01',
  },

  2: {
    id: 2,
    title: 'Test Excited Movie',
    overview: 'An exciting movie used for testing.',
    poster_path: '/excited.jpg',
    backdrop_path: '/excited-backdrop.jpg',
    release_date: '2021-01-01',
  },

  3: {
    id: 3,
    title: 'Test Thoughtful Movie',
    overview: 'A thoughtful movie used for testing.',
    poster_path: '/thoughtful.jpg',
    backdrop_path: '/thoughtful-backdrop.jpg',
    release_date: '2022-01-01',
  },

  4: {
    id: 4,
    title: 'Test Scared Movie',
    overview: 'A scary movie used for testing.',
    poster_path: '/scared.jpg',
    backdrop_path: '/scared-backdrop.jpg',
    release_date: '2023-01-01',
  },

  5: {
    id: 5,
    title: 'Test Romantic Movie',
    overview: 'A romantic movie used for testing.',
    poster_path: '/romantic.jpg',
    backdrop_path: '/romantic-backdrop.jpg',
    release_date: '2024-01-01',
  },
}

describe('Home', () => {

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    getMovieDetails.mockImplementation(async (id) => {
      return movies[id]
    })
  })

  it('loads and displays the featured movie', async () => {
    render(
      <MemoryRouter>
        <WatchlistProvider>
          <Home />
        </WatchlistProvider>
      </MemoryRouter>
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Test Happy Movie',
        level: 2,
      })
    ).toBeInTheDocument()
  })

  it('changes the featured movie when a different mood is selected', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <WatchlistProvider>
          <Home />
        </WatchlistProvider>
      </MemoryRouter>
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Test Happy Movie',
        level: 2,
      })
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: 'Scared',
      })
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Test Scared Movie',
        level: 2,
      })
    ).toBeInTheDocument()
  })
it('adds the featured movie to the watchlist', async () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <WatchlistProvider>
        <Home />
      </WatchlistProvider>
    </MemoryRouter>
  )

  await screen.findByRole('heading', {
    name: 'Test Happy Movie',
    level: 2,
  })

  const watchlistButton = screen.getByRole('button', {
    name: 'Add to Watchlist',
  })

  await user.click(watchlistButton)

  expect(
    screen.getByRole('button', {
      name: 'Saved ✓',
    })
  ).toBeInTheDocument()
})
})