import { useRef, useState } from 'react';
import s from '@/styles/classic.module.css';
import { ClassicLayout } from '@/components/layout/ClassicLayout';
import { MicrosoftLogo } from '@/components/brand/MicrosoftLogo';
import { UnderlineField } from '@/components/fields/UnderlineField';
import { InlineError } from '@/components/fields/InlineError';
import { DemoNote } from '@/components/common/DemoNote';
import { useSession } from '@/flow/SessionProvider';
import { usePageTitle } from '@/flow/usePageTitle';
import { useFlowNavigation } from '@/flow/useFlowNavigation';
import { ROUTES } from '@/flow/routes';
import arrowLeft from '@/assets/arrow-left.svg';

/**
 * The work or school password step — the old-style page that follows the
 * "Work or school account" tile.
 */
export function WorkPasswordPage() {
  usePageTitle('Sign in to your account');

  const { account } = useSession();
  const go = useFlowNavigation();

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const field = useRef<HTMLInputElement>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!password) {
      setError('Please enter your password.');
      field.current?.focus();
      return;
    }
    setError(null);
    setNote('Demo only: no password is checked or sent anywhere.');
  }

  return (
    <ClassicLayout>
      <div className={s['sign-in-box']}>
        <MicrosoftLogo family="classic" className={s.logo} />

        <form id="passwordForm" noValidate onSubmit={submit}>
          {/* Which account you are signing in to, and the way back */}
          <div className={s.identityBanner}>
            <button
              type="button"
              className={s.backButton}
              id="idBtn_Back"
              aria-label="Back"
              onClick={() => go(ROUTES.pickAccount)}
            >
              <img
                className="back-icon"
                width="24"
                height="24"
                role="presentation"
                alt=""
                src={arrowLeft}
              />
            </button>
            <div id="displayName" className={s.identity} title={account}>
              {account}
            </div>
          </div>

          <div id="loginHeader" className={`${s.row} ${s.title}`}>
            <div role="heading" aria-level={1}>
              Enter password
            </div>
          </div>

          <div className={s.row}>
            <div className={`${s['form-group']} ${s['text-13']}`}>
              <InlineError id="passwordError" message={error} />
              <div className={s.placeholderContainer}>
                <UnderlineField
                  id="i0118"
                  type="password"
                  value={password}
                  onChange={(next) => {
                    setPassword(next);
                    if (error) setError(null);
                  }}
                  placeholder="Password"
                  autoComplete="current-password"
                  ariaLabel={`Enter the password for ${account}`}
                  describedBy="loginHeader passwordError"
                  invalid={Boolean(error)}
                  inputRef={field}
                />
              </div>
              <DemoNote id="demoStatus" message={note} family="classic" />
            </div>
          </div>

          <div className={`${s['position-buttons']} ${s['password-reset-links-container']}`}>
            <div>
              <div className={s.row}>
                <div className={s['text-13']}>
                  <div className={s['form-group']}>
                    <a
                      id="idA_PWD_ForgotPassword"
                      href="https://passwordreset.microsoftonline.com/"
                      role="link"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Forgot my password
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={s['win-button-pin-bottom']}>
            <div className={s.row}>
              <div className={s['button-field-container']}>
                <input type="submit" id="idSIButton9" className={s.primary} value="Sign in" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </ClassicLayout>
  );
}
