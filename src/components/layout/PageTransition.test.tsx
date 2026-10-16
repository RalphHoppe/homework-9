import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { PageTransition } from './PageTransition';
import { renderPage } from '@/test/renderPage';
import { SignInPage } from '@/pages/SignInPage';
import { GetACodePage } from '@/pages/GetACodePage';
import { directionBetween } from '@/flow/direction';
import { ROUTES } from '@/flow/routes';

/** A step with two ways out, the way the real pages have. */
function Harness({ family }: { family: 'classic' | 'fluent' }) {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() =>
          navigate(ROUTES.getACode, {
            state: { direction: directionBetween('/', ROUTES.getACode) },
          })
        }
      >
        forward
      </button>
      <button
        onClick={() =>
          navigate('/', { state: { direction: directionBetween(ROUTES.getACode, '/') } })
        }
      >
        back
      </button>
      <PageTransition family={family}>
        <p>step content</p>
      </PageTransition>
    </>
  );
}

function renderHarness(family: 'classic' | 'fluent') {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="*" element={<Harness family={family} />} />
      </Routes>
    </MemoryRouter>,
  );
}

/** CSS Modules hash class names, but they keep the name they were written with. */
const byClass = (container: HTMLElement, name: string) =>
  container.querySelector(`[class*="${name}"]`);

describe('PageTransition (classic)', () => {
  it('slides the first step in from the right, like the reference page', () => {
    const { container } = renderHarness('classic');
    expect(byClass(container, 'slide-in-next')).not.toBeNull();
  });

  it('slides in from the right when the flow moves forward', async () => {
    const user = userEvent.setup();
    const { container } = renderHarness('classic');

    await user.click(screen.getByText('forward'));
    expect(byClass(container, 'slide-in-next')).not.toBeNull();
    expect(byClass(container, 'slide-in-back')).toBeNull();
  });

  it('slides in from the left when the flow moves back', async () => {
    const user = userEvent.setup();
    const { container } = renderHarness('classic');

    await user.click(screen.getByText('forward'));
    await user.click(screen.getByText('back'));
    expect(byClass(container, 'slide-in-back')).not.toBeNull();
    expect(byClass(container, 'slide-in-next')).toBeNull();
  });

  it('carries the timings of the reference animation', () => {
    const { container } = renderHarness('classic');
    const element = byClass(container, 'animate');
    expect(element).not.toBeNull();
    expect(element?.className).toContain('animate');
  });
});

describe('PageTransition (fluent)', () => {
  it('fades the step in', () => {
    const { container } = renderHarness('fluent');
    expect(byClass(container, 'fade')).not.toBeNull();
  });

  it('fades in again on the next step — a new element, so the animation restarts', async () => {
    const user = userEvent.setup();
    const { container } = renderHarness('fluent');

    const before = byClass(container, 'fade');
    await user.click(screen.getByText('forward'));
    const after = byClass(container, 'fade');

    expect(after).not.toBeNull();
    expect(after).not.toBe(before);
  });

  it('keeps the box that animates the height around the step', () => {
    const { container } = renderHarness('fluent');
    const box = byClass(container, 'fluent');
    expect(box).not.toBeNull();
    expect(box?.contains(byClass(container, 'fade') ?? null)).toBe(true);
  });
});

describe('every step animates', () => {
  it('wraps a classic step in the slide', () => {
    const { container } = renderPage(<SignInPage />, ROUTES.signIn);
    expect(byClass(container, 'slide-in-next')).not.toBeNull();
  });

  it('wraps a Fluent step in the fade', () => {
    const { container } = renderPage(<GetACodePage />, ROUTES.getACode);
    expect(byClass(container, 'fade')).not.toBeNull();
    expect(byClass(container, 'fluent')).not.toBeNull();
  });
});
