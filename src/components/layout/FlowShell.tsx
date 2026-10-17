import { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import classic from '@/styles/classic.module.css';
import fluent from '@/styles/fluent.module.css';
import box from './box.module.css';
import { cx } from '@/utils/cx';
import { useBodyFamily } from '@/flow/useBodyFamily';
import { useFlowNavigation } from '@/flow/useFlowNavigation';
import { stepAt, type StepMeta } from '@/flow/steps';
import type { DesignFamily } from '@/components/brand/MicrosoftLogo';
import { BackgroundLayers } from './BackgroundLayers';
import { TrailingProvider, TrailingSlot } from './StepTrailing';
import { ClassicFooter } from '../common/ClassicFooter';
import { FluentFooter } from '../common/FluentFooter';
import { MicrosoftLogo } from '../brand/MicrosoftLogo';
import { IconButton } from '../common/IconButton';

/** Long enough for the 0.25s height transition, plus a little slack. */
const HEIGHT_TIMEOUT = 400;

/**
 * The frame of the flow, and the only one: the background, the box, and the
 * footer below it. It is mounted once — the steps are rendered inside the box
 * and never leave it, so moving from one step to the next is a change of the
 * box's contents rather than a change of page.
 *
 * Which design system a step belongs to lives in `flow/steps`, so the box can
 * morph between the two looks (corners, shadow, padding, height) while the
 * step inside it slides or fades.
 */
export function FlowShell() {
  const { pathname } = useLocation();
  const step = stepAt(pathname);
  const family = step?.family ?? 'classic';

  useBodyFamily(family);

  const s = family === 'classic' ? classic : fluent;
  const boxRef = useBoxHeight(pathname);

  return (
    <div className={s.root}>
      <BackgroundLayers withIds={step?.captured} />

      <div className={s.outer}>
        <div className={s.middle}>
          <div className={family === 'classic' ? s['flex-column'] : s.stack}>
            <TrailingProvider>
              <div
                ref={boxRef}
                id={step?.captured ? 'lightbox' : undefined}
                data-testid="flow-box"
                data-family={family}
                className={cx(
                  family === 'classic' ? s['sign-in-box'] : s.card,
                  step?.captured && classic['verify-box'],
                  box.box,
                )}
              >
                <Header family={family} step={step} />

                {/* the step, and whatever it wants to animate */}
                <Outlet />
              </div>

              {/* what a step wants below the box — the sign-in step's second card */}
              <TrailingSlot />

              {family === 'classic' ? <ClassicFooter withIds={step?.captured} /> : <FluentFooter />}
            </TrailingProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The logo (and, on the Fluent steps, the row it sits in with the back or
 * close button). It is part of the frame, not of the step: the captures keep
 * the logo out of the part that moves.
 */
function Header({ family, step }: { family: DesignFamily; step?: StepMeta }) {
  const go = useFlowNavigation();
  const leading = step?.leading;

  if (family === 'fluent') {
    return (
      <div className={fluent.banner}>
        {leading ? (
          <IconButton
            icon={leading.icon}
            label={leading.icon === 'close' ? 'Close' : 'Back'}
            onClick={() => go(leading.to)}
          />
        ) : (
          <span aria-hidden="true" />
        )}
        <MicrosoftLogo className={fluent.logo} />
        <span className={fluent['banner-end']} aria-hidden="true" />
      </div>
    );
  }

  return <MicrosoftLogo family="classic" className={classic.logo} />;
}

/**
 * Grows or shrinks the box to the step that has just moved in, and hands back
 * the ref to hang on it. A height cannot be transitioned to `auto`, so the
 * height the last step settled at is kept in a ref and the new one is animated
 * from there — measured in a layout effect, never during render.
 */
function useBoxHeight(pathname: string) {
  const boxElement = useRef<HTMLDivElement>(null);
  const settledHeight = useRef<number | null>(null);
  const animating = useRef(false);
  const shownStep = useRef<string | null>(null);

  useLayoutEffect(() => {
    const element = boxElement.current;
    if (!element || shownStep.current === pathname) return;
    const firstStep = shownStep.current === null;
    shownStep.current = pathname;

    const to = element.getBoundingClientRect().height;
    const from = settledHeight.current;
    settledHeight.current = to;
    if (firstStep || from === null || Math.abs(to - from) < 1) return;

    animating.current = true;
    element.style.height = `${from}px`;
    void element.offsetHeight; // make the browser take the start height first
    element.style.height = `${to}px`;

    const clear = () => {
      element.style.height = '';
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

  // Steps change height while they are used — an error line appears, a hint
  // goes away — so the height to start the next transition from is refreshed
  // after every render that is not already mid-transition.
  useLayoutEffect(() => {
    if (animating.current || !boxElement.current) return;
    settledHeight.current = boxElement.current.getBoundingClientRect().height;
  });

  return boxElement;
}
