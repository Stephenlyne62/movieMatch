import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

describe('Navbar', () => {

  it('renders the main navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Catalogue' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Watchlist' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Suggest' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Privacy' })).toBeInTheDocument()
  })

  it('opens and closes the navigation menu when the toggle button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    const button = screen.getByRole('button', {
      name: 'Toggle navigation menu'
    })

    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('adds the scrolled class when the page is scrolled', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    const navbar = screen.getByRole('navigation')

    expect(navbar).not.toHaveClass('navbar--scrolled')

    Object.defineProperty(window, 'scrollY', {
      value: 50,
      writable: true,
    })

    window.dispatchEvent(new Event('scroll'))

    await waitFor(() => {
      expect(navbar).toHaveClass('navbar--scrolled')
    })
  })

})