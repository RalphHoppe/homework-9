import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSession } from './SessionProvider';
import { withAccount } from './account';
import { directionBetween } from './direction';

/**
 * Moves to another step, keeping the account in the URL. The direction of the
 * move travels with the navigation, so the next step knows which way to slide
 * in from.
 */
export function useFlowNavigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { href } = useSession();

  return useCallback(
    // `account` is for the step that has just learned the name (sign in) —
    // its own state has not caught up with the new value yet.
    (path: string, account?: string) =>
      navigate(account ? withAccount(path, account) : href(path), {
        state: { direction: directionBetween(pathname, path) },
      }),
    [navigate, href, pathname],
  );
}
