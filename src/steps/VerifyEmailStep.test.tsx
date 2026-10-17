import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderFlow } from '@/test/renderFlow';

const renderVerify = () => renderFlow('/verify-email?email=anton5%40abv.bg');

describe('VerifyEmailStep', () => {
  it('masks the address the way the reference does', () => {
    renderVerify();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Verify your email');
    expect(screen.getByText('an*****@abv.bg')).toBeInTheDocument();
  });

  it('shows no error before you press Send code', () => {
    renderVerify();
    expect(document.getElementById('emailError')).not.toHaveClass('is-visible');
  });

  it('asks for the address when the field is empty', async () => {
    const user = userEvent.setup();
    renderVerify();

    await user.click(screen.getByRole('button', { name: 'Send code' }));
    expect(document.getElementById('emailError')).toHaveTextContent(
      'Enter the email address for your account.',
    );
  });

  it('moves on to the code step once the address is entered', async () => {
    const user = userEvent.setup();
    const { location } = renderVerify();

    await user.type(
      document.getElementById('proof-confirmation-email-input') as HTMLElement,
      'anton5@abv.bg',
    );
    await user.click(screen.getByRole('button', { name: 'Send code' }));
    expect(location()).toBe('/enter-code?email=anton5%40abv.bg');
  });

  it('links to the code step and the password step', () => {
    renderVerify();
    expect(document.getElementById('alreadyReceivedLink')).toHaveAttribute(
      'href',
      '/enter-code?email=anton5%40abv.bg',
    );
    expect(document.getElementById('usePasswordLink')).toHaveAttribute(
      'href',
      '/password?email=anton5%40abv.bg',
    );
  });

  it('closes back to the sign-in page', async () => {
    const user = userEvent.setup();
    const { location } = renderVerify();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(location()).toBe('/?email=anton5%40abv.bg');
  });
});
