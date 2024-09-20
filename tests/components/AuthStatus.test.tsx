import { render, screen } from '@testing-library/react'
import AuthStatus from '../../src/components/AuthStatus'
import { mockAuthState } from "../utils"

describe('AuthStatus', () => {
  const renderComponent = () => {
    render(<AuthStatus />)
  }

  it('should render loading message while fetching the auth status', () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: false,
      user: undefined
    })

    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should render log in btn if user is not authenticated', () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined
    })

    renderComponent();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /log out/i })).not.toBeInTheDocument()

  })

  it('should render username if user is authenticated', () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: { id: 1, name: 'Hoang' }
    })

    renderComponent();
    expect(screen.getByText(/hoang/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument()

  })
})