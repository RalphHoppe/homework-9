import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

/** jsdom starts at http://localhost/, and window.history can be moved by hand. */
function renderAt(path: string) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

describe('App routing', () => {
  it('opens on the sign-in page', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sign in');
  });

  it('renders every step of the flow', () => {
    const expected: Array<[string, string]> = [
      ['/pick-account', 'It looks like this email is used with more than one account'],
      ['/get-a-code', 'Get a code to sign in'],
      ['/verify-email', 'Verify your email'],
      ['/enter-code', 'Enter your code'],
      ['/password', 'Enter your password'],
      ['/work-password', 'Enter password'],
    ];

    for (const [path, text] of expected) {
      const view = renderAt(path);
      expect(document.body, path).toHaveTextContent(text);
      view.unmount();
    }
  });

  it('sends an unknown address back to the sign-in page', () => {
    renderAt('/nowhere');
    expect(window.location.pathname).toBe('/');
  });

  it('adopts the account named in the URL', () => {
    renderAt('/get-a-code?email=anton5%40abv.bg');
    expect(document.getElementById('bannerText')).toHaveTextContent('anton5@abv.bg');
  });
});
