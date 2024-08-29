import { render, screen } from '@testing-library/react'
import ExpandableText from '../../src/components/ExpandableText'
import userEvent from '@testing-library/user-event';

describe('ExpandableText', () => {
  const limit: number = 255;
  const longText: string = 'a'.repeat(limit + 1);
  const truncatedText: string = longText.substring(0, limit) + '...'

  it('should render full text if text length is less than limit', () => {
    const text = "test text length <= 255";
    render(<ExpandableText text={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  })


  it('should truncate if text length is greater than limit', () => {

    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();

    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent(/more/i);
  })

  it('should expand text when Show More button is clicked', async () => {

    render(<ExpandableText text={longText} />);

    const btn = screen.getByRole('button');
    const user = userEvent.setup();
    await user.click(btn);

    expect(screen.getByText(longText)).toBeInTheDocument();

    expect(btn).toHaveTextContent(/less/i);
  })

  it('should collapse text when Show Less button is clicked', async () => {

    render(<ExpandableText text={longText} />);

    const showMoreBtn = screen.getByRole('button', { name: /more/i });
    const user = userEvent.setup();
    await user.click(showMoreBtn);

    const showLessBtn = screen.getByRole('button', { name: /less/i });
    await user.click(showLessBtn);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();

    expect(showMoreBtn).toHaveTextContent(/more/i);
  })

})