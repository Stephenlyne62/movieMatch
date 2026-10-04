import { describe, it, expect, vi, afterEach } from 'vitest'
import { getMovieDetails } from './tmdb'

describe('getMovieDetails', () => {

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns movie details when the TMDB request succeeds', async () => {
    const fakeMovie = {
      id: 550,
      title: 'Fight Club',
      release_date: '1999-10-15',
    }

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify(fakeMovie),
    })

    const result = await getMovieDetails(550)

    expect(result).toEqual(fakeMovie)

    expect(fetch).toHaveBeenCalledOnce()
  })

  it('throws an error when no movie id is provided', async () => {
    await expect(
      getMovieDetails()
    ).rejects.toThrow('getMovieDetails: missing id')
  })

  it('throws the TMDB error message when the request fails', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: false,
    status: 404,
    text: async () =>
      JSON.stringify({
        status_message: 'The resource you requested could not be found.',
      }),
  })

  await expect(
    getMovieDetails(999999)
  ).rejects.toThrow(
    'The resource you requested could not be found.'
  )
})

})