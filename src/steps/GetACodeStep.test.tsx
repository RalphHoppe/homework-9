import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderFlow } from '@/test/renderFlow';

const renderCode = () => renderFlow('/get-a-code?email=jane.doe%40contoso.com');

describe('GetACodeStep', () => {
  it('names the account the code would go to', () => {
    renderCode();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Get a code to sign in');
    expect(screen.getByLabelText('jane.doe@contoso.com')).toHaveTextContent('jane.doe@contoso.com');
    expect(screen.getByText(/We'll send a code to/)).toHaveTextContent(
      'jane.doe@contoso.com to sign you in.',
    );
    expect(document.title).toBe('Get a code to sign in');
  });

  it('has no dismiss button in the banner', () => {
    renderCode();
    const labels = screen.getAllByRole('button').map((button) => button.getAttribute('aria-label'));
    expect(labels).not.toContain('Back');
    expect(labels).not.toContain('Close');
  });

  it('opens the verify step when the code is sent', async () => {
    const user = userEvent.setup();
    const { location } = renderCode();

    await user.click(screen.getByRole('button', { name: 'Send code' }));
    expect(location()).toBe('/verify-email?email=jane.doe%40contoso.com');
  });

  it('offers the password instead', () => {
    renderCode();
    expect(document.getElementById('usePasswordLink')).toHaveAttribute(
      'href',
      '/password?email=jane.doe%40contoso.com',
    );
  });
});
