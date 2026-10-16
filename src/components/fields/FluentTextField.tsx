import { useState } from 'react';
import s from '@/styles/fluent.module.css';
import { cx } from '@/utils/cx';
import { EyeIcon, EyeOffIcon } from '../brand/icons';

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  autoComplete?: string;
  describedBy?: string;
  invalid?: boolean;
  /** password fields get the show/hide toggle once something has been typed */
  revealable?: boolean;
  autoFocus?: boolean;
  /** ids the reference markup carries on the wrapper, the toggle and the icons */
  shellId?: string;
  revealButtonId?: string;
  eyeIconId?: string;
  eyeOffIconId?: string;
};

/** Fluent field: the label floats to the top as soon as it is focused or filled. */
export function FluentTextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  describedBy,
  invalid,
  revealable,
  autoFocus,
  shellId,
  revealButtonId,
  eyeIconId,
  eyeOffIconId,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const floating = focused || value.length > 0;
  const resolvedType = type === 'password' && revealed ? 'text' : type;

  return (
    <div className={s.field}>
      <div
        id={shellId}
        className={cx(s['input-shell'], floating && s['is-floating'], invalid && s['has-error'])}
      >
        <label className={s['input-label']} htmlFor={id}>
          {label}
        </label>

        <input
          id={id}
          name={id}
          type={resolvedType}
          value={value}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-required
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => onChange(event.target.value)}
        />

        {revealable && (
          <button
            type="button"
            id={revealButtonId}
            className={s['show-button']}
            hidden={value.length === 0}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={!revealed}
            onClick={() => setRevealed((current) => !current)}
          >
            <>
              <EyeIcon id={eyeIconId} hidden={revealed} />
              <EyeOffIcon id={eyeOffIconId} hidden={!revealed} />
            </>
          </button>
        )}
      </div>
    </div>
  );
}
