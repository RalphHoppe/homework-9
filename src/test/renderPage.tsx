import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { SessionProvider } from '@/flow/SessionProvider';

/** Shows where the flow currently is, so tests can assert on navigation. */
function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

/**
 * Renders one step of the flow inside a router and a session, the way
 * <App /> does.
 */
export function renderPage(ui: ReactElement, route = '/') {
  const view = render(
    <MemoryRouter initialEntries={[route]}>
      <SessionProvider>
        <Routes>
          <Route
            path="*"
            element={
              <>
                {ui}
                <LocationProbe />
              </>
            }
          />
        </Routes>
      </SessionProvider>
    </MemoryRouter>,
  );

  return {
    ...view,
    /** e.g. "/pick-account?email=anton5%40abv.bg" */
    location: () => view.getByTestId('location').textContent ?? '',
  };
}
