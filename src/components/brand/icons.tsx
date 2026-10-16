/**
 * Inline icons. The path data is taken from the reference captures, so the
 * glyphs are the ones Microsoft ships rather than redrawn look-alikes.
 */

type IconProps = {
  className?: string;
  id?: string;
  /**
   * The reference keeps both eye glyphs in the markup and hides the one that
   * is not showing. `hidden` is not in React's SVG prop types, so it is
   * expressed as `display: none` — same result, same invisibility.
   */
  hidden?: boolean;
};

/* 20×20 eye — the exact path from the "Enter your password" capture */
const EYE_PATH =
  'M3.26 11.6A6.97 6.97 0 0 1 10 6c3.2 0 6.06 2.33 6.74 5.6a.5.5 0 0 0 .98-.2A7.97 7.97 0 0 0 10 5a7.97 7.97 0 0 0-7.72 6.4.5.5 0 0 0 .98.2ZM10 8a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-2.5 3.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Z';

export function EyeIcon({ className, id, hidden }: IconProps) {
  return (
    <svg
      id={id}
      className={className}
      style={hidden ? { display: 'none' } : undefined}
      viewBox="0 0 20 20"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={EYE_PATH} fill="currentColor" />
    </svg>
  );
}

export function EyeOffIcon({ className, id, hidden }: IconProps) {
  return (
    <svg
      id={id}
      className={className}
      style={hidden ? { display: 'none' } : undefined}
      viewBox="0 0 20 20"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={EYE_PATH} fill="currentColor" />
      {/* the strike is outlined in white first, the way the real icon is drawn */}
      <path
        d="M3.5 16.5 16.5 3.5"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M3.5 16.5 16.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 12×12 error glyph shown next to every validation message. */
export function ValidationIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 11A5 5 0 1 0 6 1a5 5 0 0 0 0 10Zm-.75-2.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Zm.26-4.84a.5.5 0 0 1 .98 0l.01.09v2.59a.5.5 0 0 1-1 0V3.41Z" />
    </svg>
  );
}
