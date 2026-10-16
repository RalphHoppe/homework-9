/**
 * Helpers for the account name that is carried through the flow.
 *
 * The reference captures were taken with test@test.com, so that is the
 * fallback when nothing has been entered yet.
 */
export const DEFAULT_ACCOUNT = 'test@test.com';

const STORAGE_KEY = 'msft-demo-email';

/* localStorage throws in private mode / file:// sandboxes — never fatal. */
export function readStoredAccount(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeAccount(account: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, account);
  } catch {
    /* ignore */
  }
}

/** Adds ?email=… to a link between two steps of the flow. */
export function withAccount(path: string, account: string): string {
  const [base, hash = ''] = path.split('#');
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}email=${encodeURIComponent(account)}${hash ? `#${hash}` : ''}`;
}

/** anton5@abv.bg → an*****@abv.bg, like the "Verify your email" page. */
export function maskEmail(account: string): string {
  const at = account.indexOf('@');
  if (at < 1) return account;
  const local = account.slice(0, at);
  const domain = account.slice(at);
  const stars = '*'.repeat(Math.max(local.length - 1, 5));
  return local.slice(0, 2) + stars + domain;
}

/**
 * The sign-in page accepts an email, a phone number or a Skype name — the same
 * three shapes the real page's own validation allows through.
 */
export type AccountKind = 'email' | 'phone' | 'skype';

export function classifyAccount(value: string): AccountKind | null {
  const v = value.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'email';
  if (/^[+\d][\d\s\-().]{4,}$/.test(v)) return 'phone';
  if (/^[a-zA-Z][a-zA-Z0-9._-]{5,31}$/.test(v)) return 'skype';
  return null;
}
