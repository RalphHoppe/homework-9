import { useState } from 'react';
import s from '@/styles/classic.module.css';
import { ClassicLayout } from '@/components/layout/ClassicLayout';
import { SlideIn } from '@/components/layout/PageTransition';
import { MicrosoftLogo } from '@/components/brand/MicrosoftLogo';
import { UnderlineField } from '@/components/fields/UnderlineField';
import { InlineError } from '@/components/fields/InlineError';
import { useSession } from '@/flow/SessionProvider';
import { usePageTitle } from '@/flow/usePageTitle';
import { useFlowNavigation } from '@/flow/useFlowNavigation';
import { ROUTES } from '@/flow/routes';
import { classifyAccount, readStoredAccount } from '@/flow/account';
import keyIcon from '@/assets/sign-in-options-key.svg';

const INVALID_ACCOUNT = 'Enter a valid email address, phone number, or Skype name.';

/**
 * "Sign in to your account" — the first step. A valid name moves on to the
 * account picker, which is where Microsoft asks which kind of account to use.
 */
export function SignInPage() {
  usePageTitle('Sign in to your account');

  const { setAccount } = useSession();
  const go = useFlowNavigation();

  const [value, setValue] = useState(() => readStoredAccount() ?? '');
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!classifyAccount(value)) {
      setError(INVALID_ACCOUNT);
      return;
    }
    setAccount(value.trim());
    go(ROUTES.pickAccount, value.trim());
  }

  return (
    <ClassicLayout>
      <div className={s['sign-in-box']}>
        <MicrosoftLogo family="classic" className={s.logo} />

        {/* the card stays where it is, what is inside it slides */}
        <SlideIn>
          <div className={s.title} id="loginHeader" role="heading" aria-level={1}>
            Sign in
          </div>

          {/* the reference keeps a hidden live region mirroring the error */}
          <div
            id="alertRegion"
            className={s.alertRegion}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            {error}
          </div>

          <InlineError id="usernameError" message={error} />

          <div className={s['form-group']} id="emailFormGroup">
            <UnderlineField
              id="i0116"
              type="email"
              value={value}
              onChange={(next) => {
                setValue(next);
                if (error) setError(null);
              }}
              placeholder="Email, phone, or Skype"
              autoComplete="username"
              ariaLabel="Enter your email, phone, or Skype."
              describedBy="usernameError loginHeader"
              invalid={Boolean(error)}
              maxLength={113}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submit();
              }}
            />
          </div>

          <div className={s['position-buttons']}>
            <div>
              <div className={s['text-13']}>
                <div className={s['form-group']}>
                  No account?{' '}
                  <a
                    href="https://signup.live.com"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Create a Microsoft account"
                  >
                    Create one!
                  </a>
                </div>
                <div className={s['form-group']}>
                  <a
                    href="https://account.live.com/ResetPassword.aspx"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Can&apos;t access your account?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </SlideIn>

        <SlideIn className={s['button-container']}>
          <input
            type="submit"
            id="idSIButton9"
            className={s.primary}
            value="Next"
            onClick={submit}
          />
        </SlideIn>
      </div>

      {/* "Sign-in options" — the second card the real page shows */}
      <div className={s['promoted-fed-cred-box']}>
        <div className={s['promoted-fed-cred-content']}>
          <div
            className={`${s.row} ${s.tile}`}
            role="button"
            tabIndex={0}
            aria-label="Sign-in options"
          >
            <div className={s.table}>
              <div className={s['table-row']}>
                <div className={`${s['table-cell']} ${s['tile-img']} ${s.medium}`}>
                  <img
                    className={`${s['tile-img']} ${s.medium}`}
                    width="32"
                    height="32"
                    role="presentation"
                    alt=""
                    src={keyIcon}
                  />
                </div>
                <div className={`${s['table-cell']} ${s['text-left']} ${s.content}`}>
                  Sign-in options
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClassicLayout>
  );
}
