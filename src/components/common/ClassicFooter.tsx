import s from '@/styles/classic.module.css';
import { cx } from '@/utils/cx';

const LINKS = [
  {
    label: 'Terms of use',
    href: 'https://www.microsoft.com/en-US/servicesagreement/',
    id: 'ftrTerms',
  },
  {
    label: 'Privacy & cookies',
    href: 'https://privacy.microsoft.com/en-US/privacystatement',
    id: 'ftrPrivacy',
  },
];

type Props = {
  /**
   * The two work-account verification steps were captured from the live flow,
   * and the capture carries ids on the footer and its links. The pages that
   * were written by hand do not, so the ids are opt-in.
   */
  withIds?: boolean;
};

/** The footer of the old-style pages: right-aligned links on a white bar. */
export function ClassicFooter({ withIds = false }: Props) {
  return (
    <div className={s.footer} id={withIds ? 'footer' : undefined} role="contentinfo">
      <div className={s.footerNode} id={withIds ? 'footerLinks' : undefined}>
        {LINKS.map((link) => (
          <a
            key={link.label}
            className={cx(s['footer-content'], s['footer-item'])}
            id={withIds ? link.id : undefined}
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {link.label}
          </a>
        ))}
        <a
          className={cx(s['footer-content'], s['footer-item'], s['debug-item'])}
          id={withIds ? 'moreOptions' : undefined}
          href="#"
          aria-label="Click here for troubleshooting information"
          aria-expanded={false}
        >
          ...
        </a>
      </div>
    </div>
  );
}
