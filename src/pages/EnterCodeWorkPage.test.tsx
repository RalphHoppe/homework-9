import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderPage } from '@/test/renderPage';
import { EnterCodeWorkPage } from './EnterCodeWorkPage';

const renderCode = () =>
  renderPage(<EnterCodeWorkPage />, '/work-enter-code?email=anton5%40abv.bg');

describe('EnterCodeWorkPage', () => {
  it('asks for the code the app shows', () => {
    renderCode();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Enter code');
    expect(document.getElementById('idDiv_SAOTCC_Description')).toHaveTextContent(
      /Enter the code displayed in the Microsoft Authenticator app/,
    );
    expect(screen.getByLabelText('Enter code')).toHaveAttribute('type', 'tel');
    expect(document.title).toBe('Sign in to your account');
  });

  it('stays quiet until you press Verify', () => {
    renderCode();
    expect(document.getElementById('idDiv_SAOTCC_Success_OTC')).toHaveTextContent('');
    expect(screen.getByLabelText('Enter code')).not.toHaveAttribute('aria-invalid');
  });

  it('asks for the code when the field is empty', async () => {
    const user = userEvent.setup();
    renderCode();

    await user.click(screen.getByDisplayValue('Verify'));
    expect(document.getElementById('idDiv_SAOTCC_Success_OTC')).toHaveTextContent(
      'Enter the code displayed in your Microsoft Authenticator app.',
    );
    expect(screen.getByLabelText('Enter code')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not take a code that is not six digits', async () => {
    const user = userEvent.setup();
    renderCode();

    await user.type(screen.getByLabelText('Enter code'), '12345');
    await user.click(screen.getByDisplayValue('Verify'));
    expect(document.getElementById('idDiv_SAOTCC_Success_OTC')).toHaveTextContent(
      'Enter the six digits shown in your Microsoft Authenticator app.',
    );
  });

  it('clears the error as soon as you type', async () => {
    const user = userEvent.setup();
    renderCode();

    await user.click(screen.getByDisplayValue('Verify'));
    await user.type(screen.getByLabelText('Enter code'), '1');
    expect(document.getElementById('idDiv_SAOTCC_Success_OTC')).toHaveTextContent('');
  });

  it('takes six digits and says that nothing is checked', async () => {
    const user = userEvent.setup();
    renderCode();

    await user.type(screen.getByLabelText('Enter code'), '123456');
    await user.click(screen.getByDisplayValue('Verify'));
    expect(document.getElementById('idDiv_SAOTCC_Success_OTC')).toHaveTextContent('');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Demo only: no code is checked or sent anywhere.',
    );
  });

  it('goes back to the approval step', async () => {
    const user = userEvent.setup();
    const { location } = renderCode();

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(location()).toBe('/approve-sign-in?email=anton5%40abv.bg');
  });
});
