import { useRef, useState } from 'react';
import s from '@/styles/classic.module.css';
import { cx } from '@/utils/cx';
import { ClassicLayout } from '@/components/layout/ClassicLayout';
import { SlideIn } from '@/components/layout/PageTransition';
import { MicrosoftLogo } from '@/components/brand/MicrosoftLogo';
import { DemoNote } from '@/components/common/DemoNote';
import { InlineError } from '@/components/fields/InlineError';
import { UnderlineField } from '@/components/fields/UnderlineField';
import { useSession } from '@/flow/SessionProvider';
import { usePageTitle } from '@/flow/usePageTitle';
import { useFlowNavigation } from '@/flow/useFlowNavigation';
import { ROUTES } from '@/flow/routes';
import arrowLeft from '@/assets/arrow-left.svg';
import codeIcon from '@/assets/verify-code.svg';

/**
 * "Enter code" — where "I can't use my Microsoft Authenticator app" lands. The
 * code is the one the app shows rather than one that was emailed, and checking
 * it is the end of this mockup, so Verify only ever answers for itself.
 */
export function EnterCodeWorkPage() {
  usePageTitle('Sign in to your account');

  const { account } = useSession();
  const go = useFlowNavigation();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const field = useRef<HTMLInputElement>(null);

  function verify(event: React.FormEvent) {
    event.preventDefault();

    if (code.trim().length === 0) {
      setError('Enter the code displayed in your Microsoft Authenticator app.');
      setNote(null);
      field.current?.focus();
      return;
    }

    if (!/^\d{6}$/.test(code.trim())) {
      setError('Enter the six digits shown in your Microsoft Authenticator app.');
      setNote(null);
      return;
    }

    setError(null);
    setNote('Demo only: no code is checked or sent anywhere.');
  }

  return (
    <ClassicLayout captured>
      {/* the real page renders the card inside its lightbox, and the capture
          kept that id on the card itself */}
      <div id="lightbox" className={cx(s['sign-in-box'], s['verify-box'])}>
        <MicrosoftLogo family="classic" className={s.logo} />

        <form noValidate onSubmit={verify}>
          <SlideIn>
            {/* back to the approval step, and which account is being signed in to */}
            <div className={s.identityBanner}>
              <button
                type="button"
                className={s.backButton}
                id="idBtn_Back"
                aria-label="Back"
                onClick={() => go(ROUTES.approveSignIn)}
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

            <div
              id="idDiv_SAOTCC_Title"
              className={cx(s.row, s.title)}
              role="heading"
              aria-level={1}
            >
              Enter code
            </div>

            <div className={cx(s.row, s['text-body'])}>
              <div>
                <img
                  className={cx(s['tile-img'], s.small)}
                  width="24"
                  height="24"
                  role="presentation"
                  alt=""
                  src={codeIcon}
                />
              </div>
              {/* the reference copy ends in a zero-width space */}
              <div id="idDiv_SAOTCC_Description" className={s['overflow-hidden']}>
                {
                  'Enter the code displayed in the Microsoft Authenticator app on your mobile device​'
                }
              </div>
            </div>

            <div className={s['form-group']} id="idDiv_SAOTCC_OTCRow">
              <InlineError id="idDiv_SAOTCC_Success_OTC" message={error} />
              <div className={s['form-group']} id="idDiv_SAOTCC_OTC">
                <UnderlineField
                  id="idTxtBx_SAOTCC_OTC"
                  type="tel"
                  value={code}
                  onChange={(next) => {
                    setCode(next);
                    if (error) setError(null);
                    if (note) setNote(null);
                  }}
                  labelledBy="idDiv_SAOTCC_Title"
                  describedBy="idDiv_SAOTCC_Description idDiv_SAOTCC_Success_OTC"
                  autoComplete="one-time-code"
                  maxLength={6}
                  invalid={Boolean(error)}
                  inputRef={field}
                />
                <DemoNote message={note} family="classic" />
              </div>
            </div>

            <div className={s['position-buttons']}>
              <div className={s.row}>
                {/* the "trouble" section the real page shows when it needs to */}
                <div id="idDiv_SAOTCC_TD_Section" className={s['no-margin-top-bottom']} hidden />
                <div className={s['col-md-24']}>
                  <div className={s['text-13']}>
                    <div className={s['form-group']}>
                      <a
                        id="moreInfoUrl"
                        href="https://go.microsoft.com/fwlink/p/?LinkId=708614"
                        aria-label="More information about two step verification"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        More information
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SlideIn>

          <SlideIn className={s['win-button-pin-bottom']}>
            <div className={s.row}>
              <div className={s['button-field-container']}>
                <input
                  type="submit"
                  id="idSubmit_SAOTCC_Continue"
                  className={s.primary}
                  value="Verify"
                />
              </div>
            </div>
          </SlideIn>
        </form>
      </div>
    </ClassicLayout>
  );
}
