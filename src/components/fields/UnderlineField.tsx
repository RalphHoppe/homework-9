import s from '@/styles/classic.module.css';
import { cx } from '@/utils/cx';

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'email' | 'password';
  placeholder?: string;
  autoComplete?: string;
  ariaLabel: string;
  describedBy?: string;
  invalid?: boolean;
  maxLength?: number;
  inputRef?: React.Ref<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

/**
 * The underlined text field of the old-style pages (styling comes from the
 * `input[type=email]` / `input[type=password]` rules).
 */
export function UnderlineField({
  id,
  value,
  onChange,
  type = 'email',
  placeholder,
  autoComplete,
  ariaLabel,
  describedBy,
  invalid,
  maxLength,
  inputRef,
  onKeyDown,
}: Props) {
  return (
    <input
      ref={inputRef}
      id={id}
      name={id}
      type={type}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      maxLength={maxLength}
      aria-label={ariaLabel}
      aria-describedby={describedBy}
      aria-required
      aria-invalid={invalid || undefined}
      className={cx(invalid && s['has-error'])}
      onKeyDown={onKeyDown}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
