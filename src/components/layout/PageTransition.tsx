import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { cx } from '@/utils/cx';
import { useFlowDirection } from '@/flow/direction';
import s from './PageTransition.module.css';

/** Long enough for the 0.25s height transition, plus a little slack. */
const HEIGHT_TIMEOUT = 400;

/**
 * Fluent: the view fades in while the box around it animates from the old
 * height to the new one, the way `data-testid="routeAnimationFluent"` does it
 * in the captures.
 *
 * The outgoing view is not animated: this app renders one step at a time, so
 * there is no outgoing view left — and holding two copies of a page would
 * duplicate every element id in the document.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <FluentFade>{children}</FluentFade>;
}

/**
 * Classic: what is inside the card slides in and fades up, 200px over a
 * quarter of a second — in from the right when the flow moves on, in from the
 * left when it goes back. The card itself stays where it is: in the captures
 * only `.pagination-view` and the buttons pinned to the card carry the
 * animation.
 *
 * It slides with `transform`, not with the `left` the reference animates:
 * the pinned buttons are placed with `left`, and an animation on the same
 * property would move them for good once it settled.
 */
export function SlideIn({ className, children }: { className?: string; children: ReactNode }) {
  const { pathname } = useLocation();
  const direction = useFlowDirection();

  return (
    <div
      // A fresh element per step, so the animation starts over every time.
      key={pathname}
      className={cx(
        s.slide,
        direction === 'back' ? s['slide-in-back'] : s['slide-in-next'],
        className,
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
