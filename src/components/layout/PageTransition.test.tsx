import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { PageTransition, SlideIn } from './PageTransition';
import { renderPage } from '@/test/renderPage';
import { SignInPage } from '@/pages/SignInPage';
import { GetACodePage } from '@/pages/GetACodePage';
import { directionBetween } from '@/flow/direction';
import { ROUTES } from '@/flow/routes';

/** A step with two ways out, the way the real pages have. */
function Harness({ children }: { children: ReactNode }) {
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
      {children}
    </>
  );
}

function renderSlide() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="*"
          element={
            <Harness>
              <SlideIn>
                <p>step content</p>
              </SlideIn>
            </Harness>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

function renderFluent() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="*"
          element={
            <Harness>
              <PageTransition>
                <p>step content</p>
              </PageTransition>
            </Harness>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

/** CSS Modules hash class names, but they keep the name they were written with. */
const byClass = (container: HTMLElement, name: string) =>
  container.querySelector(`[class*="${name}"]`);

describe('SlideIn (classic)', () => {
  it('slides the first step in from the right, like the reference page', () => {
    const { container } = renderSlide();
    expect(byClass(container, 'slide-in-next')).not.toBeNull();
  });

  it('slides in from the right when the flow moves forward', async () => {
    const user = userEvent.setup();
    const { container } = renderSlide();

    await user.click(screen.getByText('forward'));
    expect(byClass(container, 'slide-in-next')).not.toBeNull();
    expect(byClass(container, 'slide-in-back')).toBeNull();
  });

  it('slides in from the left when the flow moves back', async () => {
    const user = userEvent.setup();
    const { container } = renderSlide();

    await user.click(screen.getByText('forward'));
    await user.click(screen.getByText('back'));
    expect(byClass(container, 'slide-in-back')).not.toBeNull();
    expect(byClass(container, 'slide-in-next')).toBeNull();
  });

  it('carries the timings of the reference animation', () => {
    const { container } = renderSlide();
    const element = byClass(container, 'slide-in-next');
    expect(element?.className).toContain('slide');
  });

  it('takes the class of the element it stands in for', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SlideIn className="pinned">
          <p>step content</p>
        </SlideIn>
      </MemoryRouter>,
    );
    expect(document.querySelector('.pinned')?.className).toContain('slide-in-next');
  });
});

describe('PageTransition (fluent)', () => {
  it('fades the step in', () => {
    const { container } = renderFluent();
    expect(byClass(container, 'fade')).not.toBeNull();
  });

  it('fades in again on the next step — a new element, so the animation restarts', async () => {
    const user = userEvent.setup();
    const { container } = renderFluent();

    const before = byClass(container, 'fade');
    await user.click(screen.getByText('forward'));
    const after = byClass(container, 'fade');

    expect(after).not.toBeNull();
    expect(after).not.toBe(before);
  });

  it('keeps the box that animates the height around the step', () => {
    const { container } = renderFluent();
    const box = byClass(container, 'fluent');
    expect(box).not.toBeNull();
    expect(box?.contains(byClass(container, 'fade') ?? null)).toBe(true);
  });
});

describe('what moves on a classic step', () => {
  it('slides the contents of the card, not the card itself', () => {
    const { container } = renderPage(<SignInPage />, ROUTES.signIn);

    const card = byClass(container, 'sign-in-box');
    const slide = byClass(container, 'slide-in-next');

    expect(slide).not.toBeNull();
    expect(card?.contains(slide ?? null)).toBe(true);
    expect(card?.className).not.toContain('slide-in-next');
  });

  it('leaves the logo where it is — the reference does not move it either', () => {
    const { container } = renderPage(<SignInPage />, ROUTES.signIn);

    const slide = byClass(container, 'slide-in-next');
    const logo = screen.getByRole('img', { name: 'Microsoft' });

    expect(slide?.contains(logo)).toBe(false);
  });

  it('moves the buttons pinned to the card with everything else', () => {
    renderPage(<SignInPage />, ROUTES.signIn);

    const pinned = document.getElementById('idSIButton9')?.closest('[class*="slide-in-next"]');
    expect(pinned).not.toBeNull();
  });
});

describe('what moves on a Fluent step', () => {
  it('wraps the step in the fade', () => {
    const { container } = renderPage(<GetACodePage />, ROUTES.getACode);
    expect(byClass(container, 'fade')).not.toBeNull();
    expect(byClass(container, 'fluent')).not.toBeNull();
  });
});
