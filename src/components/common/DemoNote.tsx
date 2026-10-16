import fluent from '@/styles/fluent.module.css';
import classic from '@/styles/classic.module.css';

type Props = {
  id: string;
  message: string | null;
  /** the two design systems size this line differently */
  family?: 'fluent' | 'classic';
};

/**
 * Nothing in this mockup is sent anywhere, so the steps that would talk to a
 * server say so — and only once you have actually pressed the button.
 */
export function DemoNote({ id, message, family = 'fluent' }: Props) {
  const s = family === 'classic' ? classic : fluent;

  return (
    <p className={s['demo-status']} id={id} role="status" hidden={!message}>
      {message}
    </p>
  );
}
