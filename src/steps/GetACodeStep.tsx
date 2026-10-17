import s from '@/styles/fluent.module.css';
import { IdentityBadge } from '@/components/common/IdentityBadge';
import { DemoNote } from '@/components/common/DemoNote';
import { useSession } from '@/flow/SessionProvider';
import { usePageTitle } from '@/flow/usePageTitle';
import { useFlowNavigation } from '@/flow/useFlowNavigation';
import { ROUTES } from '@/flow/routes';

/**
 * "Get a code to sign in" — reached by picking the personal account.
 * Send code opens the verify-email step, the way the real flow does.
 */
export function GetACodeStep() {
  usePageTitle('Get a code to sign in');

  const { account, href } = useSession();
  const go = useFlowNavigation();

  return (
    <>
      <IdentityBadge account={account} />

      <h1 className={s.title} id="loginHeader">
        Get a code to sign in
      </h1>

      <p className={s.subtitle}>
        We&apos;ll send a code to <span className={s.email}>{account}</span> to sign you in.
      </p>

      <form
        id="codeForm"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          go(ROUTES.verifyEmail);
        }}
      >
        <div className={s.actions}>
          <button type="submit" className={s['primary-button']} id="idSIButton9">
            Send code
          </button>
          <DemoNote id="demoStatus" message={null} />
        </div>
      </form>

      <div className={s['view-footer']}>
        <a className={s.link} href={href(ROUTES.password)} id="usePasswordLink">
          Use your password
        </a>
      </div>
    </>
  );
}
