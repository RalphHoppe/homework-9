import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_ACCOUNT, readStoredAccount, storeAccount, withAccount } from './account';

export type Session = {
  /** The account the flow is currently walking through. */
  account: string;
  /** Remembers the account for the following steps. */
  setAccount: (account: string) => void;
  /** A link to another step, carrying the account along. */
  href: (path: string) => string;
};

const SessionContext = createContext<Session | null>(null);

/**
 * Holds the account name for the whole flow. The name is *derived*, never
 * copied out of the URL into state: `?email=` wins, then whatever an earlier
 * step stored, then the account from the reference captures.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [params] = useSearchParams();
  const fromQuery = params.get('email')?.trim();

  const [storedAccount, setManualAccount] = useState(() => readStoredAccount());
  const account = fromQuery || storedAccount || DEFAULT_ACCOUNT;

  // Only a name the visitor actually typed is remembered for later visits.
  const setAccount = useCallback((next: string) => {
    const trimmed = next.trim();
    storeAccount(trimmed);
    setManualAccount(trimmed || null);
  }, []);

  const href = useCallback((path: string) => withAccount(path, account), [account]);

  const value = useMemo<Session>(
    () => ({ account, setAccount, href }),
    [account, setAccount, href],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession must be used inside <SessionProvider>');
  return session;
}
