import { render } from '@testing-library/react';
import { MemoryRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SessionProvider } from '@/flow/SessionProvider';
import { FlowShell } from '@/components/layout/FlowShell';
import { ROUTES } from '@/flow/routes';
import { STEPS } from '@/flow/steps';
import { STEP_ELEMENTS } from '@/steps/elements';

/** Shows where the flow currently is, so tests can assert on navigation. */
function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

/**
 * Renders the flow at one of its steps, inside the shell and the router, the
 * way <App /> does.
 */
export function renderFlow(route = '/') {
  const view = render(
    <MemoryRouter initialEntries={[route]}>
      <SessionProvider>
        <Routes>
          <Route element={<FlowShell />}>
            {STEPS.map((step) => (
              <Route key={step.path} path={step.path} element={STEP_ELEMENTS[step.path]} />
            ))}
            <Route path="*" element={<Navigate to={ROUTES.signIn} replace />} />
          </Route>
        </Routes>
        <LocationProbe />
      </SessionProvider>
    </MemoryRouter>,
  );

  return {
    ...view,
    /** e.g. "/pick-account?email=anton5%40abv.bg" */
    location: () => view.getByTestId('location').textContent ?? '',
  };
}
