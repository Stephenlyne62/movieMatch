import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  getCurrentWeekIndex,
  getFeaturedMoodForToday
} from './pickSchedule'

describe('getCurrentWeekIndex', () => {

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 0 when the current date is before the start date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-10T12:00:00'))

    expect(getCurrentWeekIndex()).toBe(0)
  })

  it('returns 1 during the second week', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-22T12:00:00'))

    expect(getCurrentWeekIndex()).toBe(1)
  })

  it('switches to week 2 exactly seven days after the start date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T00:00:00'))

    expect(getCurrentWeekIndex()).toBe(1)
  })

  it('does not go beyond the final available week', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T12:00:00'))

    expect(getCurrentWeekIndex()).toBe(4)
  })

})

describe('getFeaturedMoodForToday', () => {

  afterEach(() => {
    vi.useRealTimers()
  })

  const days = [
    ['2026-04-20T12:00:00', 'happy'],
    ['2026-04-21T12:00:00', 'excited'],
    ['2026-04-22T12:00:00', 'thoughtful'],
    ['2026-04-23T12:00:00', 'scared'],
    ['2026-04-24T12:00:00', 'romantic'],
    ['2026-04-25T12:00:00', 'romantic'],
    ['2026-04-26T12:00:00', 'romantic'],
  ]

  it.each(days)(
    'returns %s mood correctly',
    (date, expectedMood) => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(date))

      expect(getFeaturedMoodForToday()).toBe(expectedMood)
    }
  )

})