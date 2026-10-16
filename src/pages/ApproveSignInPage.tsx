import s from '@/styles/classic.module.css';
import { cx } from '@/utils/cx';
import { ClassicLayout } from '@/components/layout/ClassicLayout';
import { MicrosoftLogo } from '@/components/brand/MicrosoftLogo';
import { useSession } from '@/flow/SessionProvider';
import { usePageTitle } from '@/flow/usePageTitle';
import { ROUTES } from '@/flow/routes';
import authenticatorIcon from '@/assets/verify-authenticator.svg';

/** The number the reference page shows. The real one is picked per request. */
const SIGN_IN_NUMBER = '77';

/**
 * "Approve sign in request" — the step after the work or school password, where
 * the flow waits for the Microsoft Authenticator app. Nothing here is pressed:
 * the number is what you type into the app, and the only ways out are the two
 * links.
 */
export function ApproveSignInPage() {
  usePageTitle('Sign in to your account');

  const { account, href } = useSession();

  return (
    <ClassicLayout captured>
      {/* the real page renders the card inside its lightbox, and the capture
          kept that id on the card itself */}
      <div id="lightbox" className={cx(s['sign-in-box'], s['verify-box'])}>
        <MicrosoftLogo family="classic" className={s.logo} />

        {/* which account is being signed in to — there is no way back from here */}
        <div className={s.identityBanner}>
          <div id="displayName" className={s.identity} title={account}>
            {account}
          </div>
        </div>

        <div id="idDiv_SAOTCAS_Title" className={cx(s.row, s.title)} role="heading" aria-level={1}>
          Approve sign in request
        </div>

        <div className={cx(s.row, s['text-body'])}>
          <div>
            {/* blinks while the flow waits for the app */}
            <img
              className={cx(s['tile-img'], s.small, s['animate-pulse'])}
              width="24"
              height="24"
              role="presentation"
              alt=""
              src={authenticatorIcon}
            />
          </div>
          <div className={s['overflow-hidden']}>
            {/* the reference copy ends in two zero-width spaces */}
            <div id="idDiv_SAOTCAS_Description">
              {
                'Open your Authenticator app and approve the request. Enter the number if prompted.​​'
              }
            </div>
          </div>
        </div>

        <div className={s.section}>
          <div className={cx(s.row, s['text-body'])}>
            <div className={s['display-sign-container']}>
              <div
                id="idRichContext_DisplaySign"
                className={cx(s.displaySign, s['display-sign-height'])}
                tabIndex={0}
                aria-labelledby="idDiv_SAOTCAS_Description idRichContext_DisplaySign"
              >
                {SIGN_IN_NUMBER}
              </div>
            </div>
          </div>
        </div>

        <div className={cx(s.row, s['text-body'])}>
          <div className={s['richtext-warning']}>
            Didn&apos;t receive a sign-in request? <b>Swipe down to refresh</b> the content in your
            app.
          </div>
        </div>

        <div className={s['position-buttons']}>
          <div className={s.row}>
            <div className={s.row}>
              <div className={s['col-md-24']}>
                <div className={s['text-13']}>
                  <div id="idDiv_SAOTCS_HavingTrouble" className={s['form-group']}>
                    <a
                      id="signInAnotherWay"
                      href={href(ROUTES.workEnterCode)}
                      aria-describedby="idDiv_SAOTCAS_Title idDiv_SAOTCAS_Description"
                    >
                      I can&apos;t use my Microsoft Authenticator app right now
                    </a>
                  </div>
                  <div className={cx(s['form-group'], s['no-margin-bottom'])}>
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
        </div>
      </div>
    </ClassicLayout>
  );
}
