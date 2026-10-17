import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderFlow } from '@/test/renderFlow';

const renderPassword = () => renderFlow('/password?email=saved%40contoso.com');

describe('PasswordStep', () => {
  it('is the password step of a personal account', () => {
    renderPassword();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Enter your password');
    expect(document.getElementById('bannerText')).toHaveTextContent('saved@contoso.com');
    expect(document.title).toBe('Enter your password');
  });

  it('hides the show/hide button until there is something to reveal', () => {
    renderPassword();
    expect(screen.queryByRole('button', { name: /show password/i })).toBeNull();
  });

  it('reveals the password on demand', async () => {
    const user = userEvent.setup();
    renderPassword();

    await user.type(screen.getByLabelText('Password'), 'secret');
    const toggle = screen.getByRole('button', { name: 'Show password' });
    await user.click(toggle);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
  });

  it('asks for the password before reporting the demo state', async () => {
    const user = userEvent.setup();
    renderPassword();

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(document.getElementById('passwordError')).toHaveTextContent('Enter your password.');

    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(document.getElementById('demoStatus')).toHaveTextContent(/Demo only/);
  });

  it('offers to send a code instead', () => {
    renderPassword();
    expect(document.getElementById('sendCodeLink')).toHaveTextContent(
      'Send a code to saved@contoso.com',
    );
    expect(document.getElementById('sendCodeLink')).toHaveAttribute(
      'href',
      '/get-a-code?email=saved%40contoso.com',
    );
  });

  it('goes back to the sign-in page', async () => {
    const user = userEvent.setup();
    const { location } = renderPassword();

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(location()).toBe('/?email=saved%40contoso.com');
  });
});
