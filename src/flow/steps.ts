import type { DesignFamily } from '@/components/brand/MicrosoftLogo';
import { ROUTES, type RoutePath } from './routes';

/**
 * What the shell needs to know about a step — deliberately without the step
 * itself, so this table can be read by the parts of the flow that must not
 * depend on the pages (`direction`, the animation, the shell).
 */
export type StepMeta = {
  path: RoutePath;
  family: DesignFamily;
  /**
   * The two work-account steps were captured from the live flow, and the
   * capture carries ids the hand-written pages have no use for: the shell
   * around the background, the card, and the footer.
   */
  captured?: boolean;
  /** The control at the start of the Fluent banner, if the step has one. */
  leading?: { icon: 'back' | 'close'; to: RoutePath };
};

/**
 * The flow, in order. There is one page: the box stays where it is and these
 * steps move through it, each at its own address. The order is also what the
 * slide animation reads as "forward".
 */
export const STEPS: StepMeta[] = [
  { path: ROUTES.signIn, family: 'classic' },
  { path: ROUTES.pickAccount, family: 'classic' },
  { path: ROUTES.getACode, family: 'fluent' },
  { path: ROUTES.verifyEmail, family: 'fluent', leading: { icon: 'close', to: ROUTES.signIn } },
  { path: ROUTES.enterCode, family: 'fluent', leading: { icon: 'back', to: ROUTES.signIn } },
  { path: ROUTES.password, family: 'fluent', leading: { icon: 'back', to: ROUTES.signIn } },
  { path: ROUTES.workPassword, family: 'classic' },
  { path: ROUTES.approveSignIn, family: 'classic', captured: true },
  { path: ROUTES.workEnterCode, family: 'classic', captured: true },
];

/** The paths of {@link STEPS}, in the same order. */
export const STEP_ORDER: RoutePath[] = STEPS.map((step) => step.path);

export function stepAt(pathname: string): StepMeta | undefined {
  return STEPS.find((step) => step.path === pathname);
}
