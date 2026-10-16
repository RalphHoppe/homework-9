import s from '@/styles/fluent.module.css';

type Props = {
  /** The account the flow is currently signing in. */
  account: string;
};

/** The centred chip showing which account you are signing in to. */
export function IdentityBadge({ account }: Props) {
  return (
    <div className={s['badge-row']}>
      <div className={s['identity-badge']} id="identityBadge" aria-label={account}>
        <span id="bannerText">{account}</span>
      </div>
    </div>
  );
}
