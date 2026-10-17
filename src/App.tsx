import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SessionProvider } from '@/flow/SessionProvider';
import { FlowShell } from '@/components/layout/FlowShell';
import { ROUTES } from '@/flow/routes';
import { STEPS } from '@/flow/steps';
import { STEP_ELEMENTS } from '@/steps/elements';

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
 *   /approve-sign-in   approve the request in the Authenticator app
 *   /work-enter-code   or type the code the app shows
 *
 * There is one page. The shell — background, box, footer — is mounted once and
 * the steps are rendered inside the box; every step keeps its own address, so
 * a step can be reloaded or linked to. Every step carries the account along in
 * ?email=…
 */
export function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route element={<FlowShell />}>
            {STEPS.map((step) => (
              <Route key={step.path} path={step.path} element={STEP_ELEMENTS[step.path]} />
            ))}
            <Route path="*" element={<Navigate to={ROUTES.signIn} replace />} />
          </Route>
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
