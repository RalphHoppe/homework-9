import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useFlowDirection } from '@/flow/direction';
import { stepAt } from '@/flow/steps';
import s from './StepBody.module.css';

/**
 * The part of a step that moves. On the classic steps it slides 200px in —
 * from the right when the flow moves on, from the left when it goes back — on
 * the Fluent ones it fades in.
 *
 * A step wraps its own contents in this, and only its contents: never the box,
 * the logo or the Fluent banner, which the shell owns, and never a row of
 * buttons that is pinned to the card. Those rows are placed with
 * `position: absolute`, and an animated element is a containing block for
 * absolutely placed descendants — wrapping one would quietly move every
 * pinned button off the spot the reference puts it on.
 */
export function StepBody({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const family = stepAt(pathname)?.family ?? 'classic';
  const direction = useFlowDirection();

  return (
    <div
      data-testid="step-body"
      data-family={family}
      data-animation={family === 'classic' ? `slide-${direction}` : 'fade'}
      className={
        family === 'classic'
          ? `${s.slide} ${direction === 'back' ? s['slide-in-back'] : s['slide-in-next']}`
          : s.fade
      }
    >
      {children}
    </div>
  );
}
