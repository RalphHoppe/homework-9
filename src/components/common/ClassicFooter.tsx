import s from '@/styles/classic.module.css';
import { cx } from '@/utils/cx';

const LINKS = [
  { label: 'Terms of use', href: 'https://www.microsoft.com/en-US/servicesagreement/' },
  { label: 'Privacy & cookies', href: 'https://privacy.microsoft.com/en-US/privacystatement' },
];

/** The footer of the old-style pages: right-aligned links on a white bar. */
export function ClassicFooter() {
  return (
    <div className={s.footer} role="contentinfo">
      <div className={s.footerNode}>
        {LINKS.map((link) => (
          <a
            key={link.label}
            className={cx(s['footer-content'], s['footer-item'])}
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {link.label}
          </a>
        ))}
        <a
          className={cx(s['footer-content'], s['footer-item'], s['debug-item'])}
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
