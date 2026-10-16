import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { cx } from '@/utils/cx';
import { useFlowDirection } from '@/flow/direction';
import s from './PageTransition.module.css';

type Family = 'classic' | 'fluent';

/** Long enough for the 0.25s height transition, plus a little slack. */
const HEIGHT_TIMEOUT = 400;

/**
 * The animation the reference pages play when the flow moves to another step.
 *
 * The two families do it differently, and both are copied from the captures:
 *
 * - classic pages wrap their view in `.pagination-view` and slide it 200px,
 *   in from the right when moving forward and in from the left when going back.
 *   Here the step slides as a whole: the reference keeps the card still and
 *   slides what is inside it, which needs a second containing block inside the
 *   card — and that would move the Next button, which is pinned to the card's
 *   bottom right corner with `position: absolute`.
 * - Fluent pages (`data-testid="routeAnimationFluent"`) fade the new view in
 *   while the box around it animates from the old height to the new one.
 *
 * The outgoing view is not animated: this app renders one step at a time, so
 * there is no outgoing view left — and holding two copies of a page would
 * duplicate every element id in the document.
 */
export function PageTransition({ family, children }: { family: Family; children: ReactNode }) {
  return family === 'classic' ? (
    <ClassicSlide>{children}</ClassicSlide>
  ) : (
    <FluentFade>{children}</FluentFade>
  );
}

/** Classic: the view slides in and fades up, 200px over a quarter of a second. */
function ClassicSlide({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const direction = useFlowDirection();

  return (
    <div
      // A fresh element per step, so the animation starts over every time.
      key={pathname}
      className={cx(
        s.classic,
        s.animate,
        direction === 'next' && s['slide-in-next'],
        direction === 'back' && s['slide-in-back'],
      )}
    >
      {children}
    </div>
  );
}

/**
 * Fluent: the content fades in and the box grows or shrinks to fit it. A height
 * cannot be transitioned to `auto`, so the height the last step settled at is
 * kept in a ref and the new one is animated from there.
 */
function FluentFade({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const box = useRef<HTMLDivElement>(null);
  const settledHeight = useRef<number | null>(null);
  const animating = useRef(false);
  const shownStep = useRef<string | null>(null);

  useLayoutEffect(() => {
    const element = box.current;
    if (!element || shownStep.current === pathname) return;
    shownStep.current = pathname;

    const to = element.getBoundingClientRect().height;
    const from = settledHeight.current;
    settledHeight.current = to;
    if (from === null || Math.abs(to - from) < 1) return;

    animating.current = true;
    element.style.overflow = 'hidden';
    element.style.height = `${from}px`;
    void element.offsetHeight; // make the browser take the start height first
    element.style.height = `${to}px`;

    const clear = () => {
      element.style.height = '';
      element.style.overflow = '';
      animating.current = false;
      settledHeight.current = to;
    };
    element.addEventListener('transitionend', clear, { once: true });
    const fallback = window.setTimeout(clear, HEIGHT_TIMEOUT);

    return () => {
      element.removeEventListener('transitionend', clear);
      window.clearTimeout(fallback);
    };
  }, [pathname]);

  // Pages change height while they are used — an error line appears, a hint
  // goes away — so the height to start the next transition from is refreshed
  // after every render that is not already mid-transition.
  useLayoutEffect(() => {
    if (animating.current || !box.current) return;
    settledHeight.current = box.current.getBoundingClientRect().height;
  });

  return (
    <div ref={box} className={s.fluent}>
      {/* A fresh element per step, so the fade starts over every time. */}
      <div key={pathname} className={s.fade}>
        {children}
      </div>
    </div>
  );
}
