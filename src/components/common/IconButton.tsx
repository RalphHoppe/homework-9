import s from '@/styles/fluent.module.css';

const PATHS = {
  /* left arrow — the "back" glyph from the Fluent captures */
  back: 'M10.73 19.8a.75.75 0 0 0 1.04-1.1l-6.25-5.95h14.73a.75.75 0 0 0 0-1.5H5.52l6.25-5.95a.75.75 0 0 0-1.04-1.1l-7.42 7.08a1 1 0 0 0 0 1.44l7.42 7.07Z',
  /* the × the "Verify your email" page uses to leave the flow */
  close:
    'm4.21 4.39.08-.1a1 1 0 0 1 1.32-.08l.1.08L12 10.6l6.3-6.3a1 1 0 0 1 1.4 1.42L13.42 12l6.3 6.3a1 1 0 0 1 .08 1.31l-.08.1a1 1 0 0 1-1.32.08l-.1-.08L12 13.4l-6.3 6.3a1 1 0 0 1-1.4-1.42L10.58 12l-6.3-6.3a1 1 0 0 1-.08-1.31l.08-.1-.08.1Z',
} as const;

type Props = {
  icon: keyof typeof PATHS;
  label: string;
  onClick: () => void;
};

/** The 32×32 button in the top-left corner of a Fluent card. */
export function IconButton({ icon, label, onClick }: Props) {
  return (
    <button
      type="button"
      className={s['icon-button']}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path d={PATHS[icon]} />
      </svg>
    </button>
  );
}
