import { useState } from 'react';
import s from '@/styles/fluent.module.css';
import { IdentityBadge } from '@/components/common/IdentityBadge';
import { DemoNote } from '@/components/common/DemoNote';
import { ValidationMessage } from '@/components/fields/ValidationMessage';
import { CodeEntry, CODE_LENGTH, emptyCode } from '@/components/fields/CodeEntry';
import { useSession } from '@/flow/SessionProvider';
import { usePageTitle } from '@/flow/usePageTitle';
import { ROUTES } from '@/flow/routes';

/**
 * "Enter your code" — six boxes. The real page submits as soon as the last
 * digit is in, so there is no button here either.
 */
export function EnterCodeStep() {
  usePageTitle('Enter your code');

  const { account, href } = useSession();

  const [digits, setDigits] = useState<string[]>(emptyCode);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const complete = digits.join('').length === CODE_LENGTH;

  function submit() {
    if (!complete) {
      setError('Enter the code we sent you.');
      return;
    }
    setError(null);
    setNote('Demo only: no code is checked or sent anywhere.');
  }

  return (
    <>
      <IdentityBadge account={account} />

      <h1 className={s.title} id="loginHeader">
        Enter your code
      </h1>

      <p className={s.subtitle}>
        If <span>{account}</span> matches the email address on your account, we&apos;ll send you a
        code.
      </p>

      <form
        id="codeForm"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <CodeEntry
          digits={digits}
          describedBy="codeError"
          invalid={Boolean(error)}
          autoFocus
          onChange={(next) => {
            setDigits(next);
            if (error) setError(null);
            if (next.join('').length < CODE_LENGTH) setNote(null);
          }}
          onComplete={() => {
            setError(null);
            setNote('Demo only: no code is checked or sent anywhere.');
          }}
        />

        <ValidationMessage id="codeError" textId="codeErrorText" visible={Boolean(error)}>
          {error ?? 'Enter the code we sent you.'}
        </ValidationMessage>

        <DemoNote id="demoStatus" message={note} />
      </form>

      <div className={s['view-footer']}>
        <a className={s.link} href={href(ROUTES.getACode)} id="noCodeLink">
          Didn&apos;t get a code?
        </a>
      </div>
    </>
  );
}
