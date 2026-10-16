import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderPage } from '@/test/renderPage';
import { SignInPage } from './SignInPage';

const renderSignIn = () => renderPage(<SignInPage />, '/');

describe('SignInPage', () => {
  it('is the first step of the flow', () => {
    renderSignIn();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sign in');
    expect(document.title).toBe('Sign in to your account');
  });

  it('shows no error until you press Next', () => {
    renderSignIn();
    expect(screen.getByLabelText(/Enter your email, phone, or Skype/)).not.toHaveAttribute(
      'aria-invalid',
    );
    expect(document.getElementById('usernameError')).toHaveTextContent('');
  });

  it('refuses an empty or malformed name', async () => {
    const user = userEvent.setup();
    renderSignIn();

    await user.click(screen.getByDisplayValue('Next'));
    expect(document.getElementById('usernameError')).toHaveTextContent(
      'Enter a valid email address, phone number, or Skype name.',
    );

    await user.type(screen.getByLabelText(/Enter your email/), 'nope');
    await user.click(screen.getByDisplayValue('Next'));
    expect(document.getElementById('usernameError')).toHaveTextContent(
      'Enter a valid email address',
    );
  });

  it('hands a valid account to the account picker', async () => {
    const user = userEvent.setup();
    const { location } = renderSignIn();

    await user.type(screen.getByLabelText(/Enter your email/), 'anton5@abv.bg');
    await user.click(screen.getByDisplayValue('Next'));

    expect(location()).toBe('/pick-account?email=anton5%40abv.bg');
  });
});
