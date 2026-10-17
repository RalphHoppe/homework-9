/**
 * One place for every path of the flow, so a step never hard-codes another
 * step's URL. Which step lives at which path — and which design system it
 * belongs to — is in `flow/steps.ts`.
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
