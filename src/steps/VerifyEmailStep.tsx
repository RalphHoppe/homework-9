import { useState } from 'react';
import s from '@/styles/fluent.module.css';
import { IdentityBadge } from '@/components/common/IdentityBadge';
import { FluentTextField } from '@/components/fields/FluentTextField';
import { ValidationMessage } from '@/components/fields/ValidationMessage';
import { useSession } from '@/flow/SessionProvider';
import { usePageTitle } from '@/flow/usePageTitle';
import { useFlowNavigation } from '@/flow/useFlowNavigation';
import { ROUTES } from '@/flow/routes';
import { maskEmail } from '@/flow/account';

/**
 * "Verify your email" — the masked address has to be typed in full before a
 * code is sent.
 */
export function VerifyEmailStep() {
  usePageTitle('Verify your email');

  const { account, href } = useSession();
  const go = useFlowNavigation();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) {
      setError('Enter the email address for your account.');
      return;
    }
    setError(null);
    go(ROUTES.enterCode);
  }

  return (
    <>
      <IdentityBadge account={account} />

      <h1 className={s.title} id="loginHeader">
        Verify your email
      </h1>

      <p className={s.subtitle}>
        We&apos;ll send a code to <span className={s.email}>{maskEmail(account)}</span>. To verify
        this is your email, enter it here.
      </p>

      <form id="emailForm" noValidate onSubmit={submit}>
        <FluentTextField
          id="proof-confirmation-email-input"
          shellId="inputShell"
          label="Email"
          type="email"
          value={email}
          autoComplete="email"
          autoFocus
          describedBy="emailError"
          invalid={Boolean(error)}
          onChange={(next) => {
            setEmail(next);
            if (error) setError(null);
          }}
        />

        <ValidationMessage id="emailError" textId="emailErrorText" visible={Boolean(error)}>
          {error ?? 'Enter the email address for your account.'}
        </ValidationMessage>

        <div className={s.actions}>
          <button type="submit" className={s['primary-button']} id="idSIButton9">
            Send code
          </button>
        </div>
      </form>

      <div className={s['view-footer']}>
        <a className={s.link} href={href(ROUTES.enterCode)} id="alreadyReceivedLink">
          Already received a code?
        </a>
        <a className={s.link} href={href(ROUTES.password)} id="usePasswordLink">
          Use your password
        </a>
      </div>
    </>
  );
}
