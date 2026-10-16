/**
 * One place for every step of the flow, so a page never hard-codes another
 * page's URL.
 *
 *   sign in ─┬─ personal ─→ get a code ─→ verify email ─→ enter code
 *            │                          └→ password (personal)
 *            └─ work     ─→ work password ─→ approve sign in request
 *                                                        └→ enter code (work)
 */
export const ROUTES = {
  signIn: '/',
  pickAccount: '/pick-account',
  getACode: '/get-a-code',
  verifyEmail: '/verify-email',
  enterCode: '/enter-code',
  password: '/password',
  workPassword: '/work-password',
  approveSignIn: '/approve-sign-in',
  workEnterCode: '/work-enter-code',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/** The order the steps are walked in, used only for documentation/tests. */
export const STEP_ORDER: RoutePath[] = [
  ROUTES.signIn,
  ROUTES.pickAccount,
  ROUTES.getACode,
  ROUTES.verifyEmail,
  ROUTES.enterCode,
  ROUTES.password,
  ROUTES.workPassword,
  ROUTES.approveSignIn,
  ROUTES.workEnterCode,
];
