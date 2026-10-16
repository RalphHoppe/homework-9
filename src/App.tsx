import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SessionProvider } from '@/flow/SessionProvider';
import { ROUTES } from '@/flow/routes';
import { SignInPage } from '@/pages/SignInPage';
import { PickAccountPage } from '@/pages/PickAccountPage';
import { GetACodePage } from '@/pages/GetACodePage';
import { VerifyEmailPage } from '@/pages/VerifyEmailPage';
import { EnterCodePage } from '@/pages/EnterCodePage';
import { PasswordPage } from '@/pages/PasswordPage';
import { WorkPasswordPage } from '@/pages/WorkPasswordPage';
import { ApproveSignInPage } from '@/pages/ApproveSignInPage';
import { EnterCodeWorkPage } from '@/pages/EnterCodeWorkPage';

/**
 * The flow:
 *
 *   /                  sign in
 *   /pick-account      which account to use
 *   /get-a-code        personal → we'll send a code
 *   /verify-email      retype the masked address
 *   /enter-code        the six digit boxes
 *   /password          personal account password
 *   /work-password     work or school account password
 *
 * Every step carries the account along in ?email=…
 */
export function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path={ROUTES.signIn} element={<SignInPage />} />
          <Route path={ROUTES.pickAccount} element={<PickAccountPage />} />
          <Route path={ROUTES.getACode} element={<GetACodePage />} />
          <Route path={ROUTES.verifyEmail} element={<VerifyEmailPage />} />
          <Route path={ROUTES.enterCode} element={<EnterCodePage />} />
          <Route path={ROUTES.password} element={<PasswordPage />} />
          <Route path={ROUTES.workPassword} element={<WorkPasswordPage />} />
        <Route path={ROUTES.approveSignIn} element={<ApproveSignInPage />} />
        <Route path={ROUTES.workEnterCode} element={<EnterCodeWorkPage />} />
          <Route path="*" element={<Navigate to={ROUTES.signIn} replace />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
