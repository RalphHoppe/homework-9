import type { ReactElement } from 'react';
import { ROUTES, type RoutePath } from '@/flow/routes';
import { SignInStep } from './SignInStep';
import { PickAccountStep } from './PickAccountStep';
import { GetACodeStep } from './GetACodeStep';
import { VerifyEmailStep } from './VerifyEmailStep';
import { EnterCodeStep } from './EnterCodeStep';
import { PasswordStep } from './PasswordStep';
import { WorkPasswordStep } from './WorkPasswordStep';
import { ApproveSignInStep } from './ApproveSignInStep';
import { EnterCodeWorkStep } from './EnterCodeWorkStep';

/**
 * Which step is rendered inside the box at which path. Kept apart from
 * `flow/steps` so the description of the flow — used by the shell and by the
 * navigation — does not have to import the steps themselves.
 */
export const STEP_ELEMENTS: Record<RoutePath, ReactElement> = {
  [ROUTES.signIn]: <SignInStep />,
  [ROUTES.pickAccount]: <PickAccountStep />,
  [ROUTES.getACode]: <GetACodeStep />,
  [ROUTES.verifyEmail]: <VerifyEmailStep />,
  [ROUTES.enterCode]: <EnterCodeStep />,
  [ROUTES.password]: <PasswordStep />,
  [ROUTES.workPassword]: <WorkPasswordStep />,
  [ROUTES.approveSignIn]: <ApproveSignInStep />,
  [ROUTES.workEnterCode]: <EnterCodeWorkStep />,
};
