import { useState } from 'react';
import s from '@/styles/fluent.module.css';
import { IdentityBadge } from '@/components/common/IdentityBadge';
import { DemoNote } from '@/components/common/DemoNote';
import { FluentTextField } from '@/components/fields/FluentTextField';
import { ValidationMessage } from '@/components/fields/ValidationMessage';
import { useSession } from '@/flow/SessionProvider';
import { usePageTitle } from '@/flow/usePageTitle';
import { ROUTES } from '@/flow/routes';

/**
 * "Enter your password" — the personal-account password step, reached from
 * "Use your password".
 */
export function PasswordStep() {
  usePageTitle('Enter your password');

  const { account, href } = useSession();

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!password) {
      setError('Enter your password.');
      return;
    }
    setError(null);
    setNote('Demo only: no password is checked or sent anywhere.');
  }

  return (
    <>
      <IdentityBadge account={account} />

      <h1 className={s.title} id="loginHeader">
        Enter your password
      </h1>

      <form id="passwordForm" noValidate onSubmit={submit}>
        <FluentTextField
          id="passwordEntry"
          shellId="inputShell"
          revealButtonId="showButton"
          eyeIconId="eyeIcon"
          eyeOffIconId="eyeOffIcon"
          label="Password"
          type="password"
          value={password}
          autoComplete="current-password"
          autoFocus
          revealable
          describedBy="passwordError"
          invalid={Boolean(error)}
          onChange={(next) => {
            setPassword(next);
            if (error) setError(null);
          }}
        />

        <ValidationMessage id="passwordError" textId="passwordErrorText" visible={Boolean(error)}>
          {error ?? "You've tried to sign in too many times with an incorrect account or password."}
        </ValidationMessage>

        <div className={s.actions}>
          <button type="submit" className={s['primary-button']} id="idSIButton9">
            Next
          </button>
          <DemoNote id="demoStatus" message={note} />
        </div>
      </form>

      <div className={s['view-footer']}>
        <a className={s.link} href={href(ROUTES.getACode)} id="sendCodeLink">
          Send a code to {account}
        </a>
      </div>
    </>
  );
}
