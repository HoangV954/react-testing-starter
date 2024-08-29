import { render, screen } from '@testing-library/react'
import UserList from '../../src/components/UserList'
import { User } from '../../src/entities'

describe('UserList', () => {
  it('should render no users when users array is empty', () => {
    render(<UserList users={[]} />);

    const text = screen.getByText(/no users/i) // more robust testing (only include that part you think will absolutely be there)

    expect(text).toBeInTheDocument();
  })
})

describe('UserList', () => {
  it('should render a list of users', () => {
    const users: User[] = [
      { id: 1, name: 'Hoang' },
      { id: 2, name: 'Titus' },
    ]

    render(<UserList users={users} />);

    users.forEach(user => {
      const link = screen.getByRole('link', { name: user.name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/users/${user.id}`);
    })
  })
})
