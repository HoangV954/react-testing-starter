import { render, screen } from '@testing-library/react'
import TermsAndConditions from '../../src/components/TermsAndConditions'
import userEvent from '@testing-library/user-event';


describe('TermsAndConditions', () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);

    return {
      heading: screen.getByRole('heading'),
      checkbox: screen.getByRole('checkbox'),
      button: screen.getByRole('button'),
    }
  }


  it('should render with correct text and initial state', () => {
    const { heading, checkbox, button } = renderComponent();
    // Group the render tests in 1 test case to minimize repetition

    expect(heading).toHaveTextContent(/terms & conditions/i);
    expect(checkbox).not.toBeChecked();
    expect(button).toBeDisabled();

    // getByRole = guaranteed to be in doc, dont need tbind()
    // We are not doing button text render test here because the text can change, and we should focus on functionality
  })

  it('should enable button when checkbox is checked', async () => {
    const { checkbox, button } = renderComponent();


    const user = userEvent.setup();
    await user.click(checkbox);

    expect(button).toBeEnabled();
  })
})