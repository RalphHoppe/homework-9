import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderFlow } from '@/test/renderFlow';

const renderWork = () => renderFlow('/work-password?email=anton5%40abv.bg');

describe('WorkPasswordStep', () => {
  it('asks for the password of the account being signed in', () => {
    renderWork();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Enter password');
    expect(document.getElementById('displayName')).toHaveTextContent('anton5@abv.bg');
    expect(screen.getByLabelText('Enter the password for anton5@abv.bg')).toBeInTheDocument();
    expect(document.title).toBe('Sign in to your account');
  });

  it('stays quiet until you press Sign in', () => {
    renderWork();
    expect(document.getElementById('passwordError')).toHaveTextContent('');
    expect(document.getElementById('demoStatus')).toBeEmptyDOMElement();
    expect(screen.getByLabelText(/Enter the password/)).not.toHaveAttribute('aria-invalid');
  });

  it('asks for the password when the field is empty', async () => {
    const user = userEvent.setup();
    renderWork();

    await user.click(screen.getByDisplayValue('Sign in'));
    expect(document.getElementById('passwordError')).toHaveTextContent(
      'Please enter your password.',
    );
    expect(screen.getByLabelText(/Enter the password/)).toHaveAttribute('aria-invalid', 'true');
  });

  it('clears the error as soon as you type', async () => {
    const user = userEvent.setup();
    renderWork();

    await user.click(screen.getByDisplayValue('Sign in'));
    await user.type(screen.getByLabelText(/Enter the password/), 'hunter2');
    expect(document.getElementById('passwordError')).toHaveTextContent('');
  });

  it('carries on to the Authenticator step', async () => {
    const user = userEvent.setup();
    const { location } = renderWork();

    await user.type(screen.getByLabelText(/Enter the password/), 'hunter2');
    await user.click(screen.getByDisplayValue('Sign in'));
    expect(location()).toBe('/approve-sign-in?email=anton5%40abv.bg');
  });

  it('has no show/hide button — the classic page has none', async () => {
    const user = userEvent.setup();
    renderWork();

    await user.type(screen.getByLabelText(/Enter the password/), 'hunter2');
    expect(screen.queryByRole('button', { name: /show password|hide password/i })).toBeNull();
  });

  it('keeps the wording of the real page', () => {
    renderWork();
    expect(document.getElementById('idA_PWD_ForgotPassword')).toHaveTextContent(
      'Forgot my password',
    );
    expect(screen.getByDisplayValue('Sign in')).toBeInTheDocument();
  });

  it('goes back to the account picker', async () => {
    const user = userEvent.setup();
    const { location } = renderWork();

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(location()).toBe('/pick-account?email=anton5%40abv.bg');
  });
});
