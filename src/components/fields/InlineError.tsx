import s from '@/styles/classic.module.css';
import { cx } from '@/utils/cx';

type Props = {
  id: string;
  message: string | null;
};

/** The red line the old-style pages show under a field. */
export function InlineError({ id, message }: Props) {
  return (
    <div
      id={id}
      className={cx(s.errorMessage, message && s.visible)}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {message}
    </div>
  );
}
