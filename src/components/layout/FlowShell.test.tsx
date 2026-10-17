import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderFlow } from '@/test/renderFlow';

/**
 * The flow lives in one box: the shell is what stays, the steps are what
 * change. These are the assertions that keep it that way.
 */
describe('the flow shell', () => {
  it('keeps the one box while the step inside it changes', async () => {
    const user = userEvent.setup();
    const view = renderFlow('/');

    const box = screen.getByTestId('flow-box');
    expect(view.getByRole('heading', { level: 1 })).toHaveTextContent('Sign in');

    await user.type(view.getByLabelText(/Enter your email/), 'anton5@abv.bg');
    await user.click(view.getByRole('button', { name: 'Next' }));

    expect(view.location()).toBe('/pick-account?email=anton5%40abv.bg');
    expect(screen.getByTestId('flow-box')).toBe(box);
    expect(screen.getByTestId('step-body')).toHaveTextContent(
      'It looks like this email is used with more than one account',
    );
  });

  it('morphs the box between the two design families', () => {
    const classic = renderFlow('/');
    expect(screen.getByTestId('flow-box')).toHaveAttribute('data-family', 'classic');
    classic.unmount();

    renderFlow('/get-a-code');
    expect(screen.getByTestId('flow-box')).toHaveAttribute('data-family', 'fluent');
  });

  it('gives the step the footer of its family', () => {
    const classic = renderFlow('/');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Privacy & cookies');
    expect(screen.getByRole('contentinfo')).not.toHaveTextContent('Learn more');
    classic.unmount();

    renderFlow('/get-a-code');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Privacy and cookies');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Learn more');
  });

  it('slides a classic step and fades a Fluent one', () => {
    const classic = renderFlow('/');
    expect(screen.getByTestId('step-body')).toHaveAttribute('data-animation', 'slide-next');
    classic.unmount();

    renderFlow('/verify-email');
    expect(screen.getByTestId('step-body')).toHaveAttribute('data-animation', 'fade');
  });

  it('leaves a row of buttons pinned to the card out of the animation', () => {
    // The pinned rows are placed with `position: absolute`, and an animated
    // element is a containing block for them — inside one, they would move.
    renderFlow('/work-password');
    const pinned = document.querySelector('#idSIButton9')?.closest('[data-testid="step-body"]');
    expect(pinned).toBeNull();
    expect(screen.getByTestId('flow-box')).toContainElement(
      document.querySelector('#idSIButton9')!,
    );
  });
});
