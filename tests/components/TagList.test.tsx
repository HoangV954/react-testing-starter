import { render, screen } from '@testing-library/react'
import TagList from '../../src/components/TagList'

describe('TagList', () => {


  const renderTagList = () => {
    render(<TagList />)
  }

  it('should render tags', async () => {
    renderTagList();

    /* await waitFor(() => {
      const listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0);
    }) */ //Not recommended since the function must be pure (waitFor will keep calling the callback until it times out), no side effect involved

    const listItems = await screen.findAllByRole('listitem')
    expect(listItems.length).toBeGreaterThan(0);
  })

  /* it('should fetch api', async () => {
    const response = await fetch('/categories');
    const data = await response.json();
    console.log(data)
    expect(data).toHaveLength(3)
  }) */
})