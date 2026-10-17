import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import type { DesignFamily } from '@/components/brand/MicrosoftLogo';
import { useFlowDirection } from '@/flow/direction';
import s from './StepView.module.css';

type Props = {
  family: DesignFamily;
  children: ReactNode;
};

/**
 * The part of the box that changes from step to step. The box itself stays
 * put — this is what moves: a classic step slides 200px in (from the right
 * when the flow moves on, from the left when it goes back), a Fluent step
 * fades in.
 */
export function StepView({ family, children }: Props) {
  const { pathname } = useLocation();
  const direction = useFlowDirection();

  return (
    <div
      // A fresh element per step, so the animation starts over every time.
      key={pathname}
      data-testid="step-view"
      data-family={family}
      data-direction={direction}
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
