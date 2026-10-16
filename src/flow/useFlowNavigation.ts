import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from './SessionProvider';
import { withAccount } from './account';

/** Moves to another step, keeping the account in the URL. */
export function useFlowNavigation() {
  const navigate = useNavigate();
  const { href } = useSession();

  return useCallback(
    // `account` is for the step that has just learned the name (sign in) —
    // its own state has not caught up with the new value yet.
    (path: string, account?: string) => navigate(account ? withAccount(path, account) : href(path)),
    [navigate, href],
  );
}
