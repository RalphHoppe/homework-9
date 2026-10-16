import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderPage } from '@/test/renderPage';
import { ApproveSignInPage } from './ApproveSignInPage';

const renderApprove = () =>
  renderPage(<ApproveSignInPage />, '/approve-sign-in?email=anton5%40abv.bg');

describe('ApproveSignInPage', () => {
  it('shows the number to type into the app', () => {
    renderApprove();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Approve sign in request');
    expect(document.getElementById('idRichContext_DisplaySign')).toHaveTextContent('77');
    expect(document.getElementById('displayName')).toHaveTextContent('anton5@abv.bg');
    expect(document.title).toBe('Sign in to your account');
  });

  it('has nothing to press — the app decides when the flow moves on', () => {
    renderApprove();
    expect(screen.queryByRole('button', { name: /verify|next|sign in/i })).toBeNull();
  });

  it('keeps the wording of the real page', () => {
    renderApprove();
    expect(document.getElementById('idDiv_SAOTCAS_Description')).toHaveTextContent(
      /Open your Authenticator app and approve the request/,
    );
    expect(document.getElementById('idDiv_SAOTCS_HavingTrouble')).toHaveTextContent(
      "I can't use my Microsoft Authenticator app right now",
    );
    expect(screen.getByText('Swipe down to refresh')).toBeInTheDocument();
  });

  it('offers the code instead, carrying the account along', () => {
    renderApprove();
    expect(document.getElementById('signInAnotherWay')).toHaveAttribute(
      'href',
      '/work-enter-code?email=anton5%40abv.bg',
    );
  });

  it('has no way back — there is no back button on the real page', () => {
    renderApprove();
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });
});
