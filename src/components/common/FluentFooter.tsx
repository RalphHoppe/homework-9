import s from '@/styles/fluent.module.css';

const LINKS = [
  { label: 'Terms of use', href: 'https://www.microsoft.com/en-US/servicesagreement/' },
  { label: 'Privacy and cookies', href: 'https://privacy.microsoft.com/en-US/privacystatement' },
];

/**
 * The footer of the Fluent pages: centred links plus the private-browsing note,
 * sitting below the card.
 */
export function FluentFooter() {
  return (
    <footer className={s.footer}>
      <div className={s['footer-links']}>
        <button type="button" className={s.link} id="helpAndFeedback">
          Help and feedback
        </button>
        {LINKS.map((link) => (
          <a
            key={link.label}
            className={s.link}
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {link.label}
          </a>
        ))}
      </div>
      <p className={s['footer-note']}>
        Use private browsing if this is not your device.{' '}
        <a
          className={s.link}
          href="https://go.microsoft.com/fwlink/?LinkID=2281649"
          target="_blank"
          rel="noreferrer noopener"
        >
          Learn more
        </a>
      </p>
    </footer>
  );
}
