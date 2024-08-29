
import { render, screen } from '@testing-library/react';
import UserAccount from '../../src/components/UserAccount';

describe('UserAccount', () => {
  it('should render user profile with a name', () => {
    render(<UserAccount user={{ id: 1, name: 'Hoang' }} />);
    const name = screen.getByText('Hoang');
    expect(name).toBeInTheDocument();
  })
})

describe('UserAccount', () => {
  it('should render edit button when user is an admin', () => {
    render(<UserAccount user={{ id: 1, name: 'Hoang', isAdmin: true }} />);
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent(/edit/i);
  })
})

describe('UserAccount', () => {
  it('should NOT render edit button when user is NOT an admin', () => {
    render(<UserAccount user={{ id: 1, name: 'Hoang', isAdmin: false }} />);
    const btn = screen.queryByRole('button'); // getByRole already expect the element to exist, so doing this before will give error
    expect(btn).not.toBeInTheDocument();

  })
})