import { useEffect, useRef } from 'react';
import s from '@/styles/fluent.module.css';
import { cx } from '@/utils/cx';

export const CODE_LENGTH = 6;

type Props = {
  digits: string[];
  onChange: (digits: string[]) => void;
  /** fired as soon as every box is filled, the way the real page submits */
  onComplete?: (code: string) => void;
  invalid?: boolean;
  describedBy?: string;
  autoFocus?: boolean;
};

const EMPTY = Array<string>(CODE_LENGTH).fill('');

/**
 * The six one-digit boxes of the "Enter your code" step: typing moves on,
 * Backspace steps back, and pasting a whole code spreads across the boxes.
 */
export function CodeEntry({
  digits,
  onChange,
  onComplete,
  invalid,
  describedBy,
  autoFocus,
}: Props) {
  const boxes = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus) boxes.current[0]?.focus();
  }, [autoFocus]);

  function focusBox(index: number) {
    const box = boxes.current[Math.max(0, Math.min(index, CODE_LENGTH - 1))];
    box?.focus();
    box?.select();
  }

  function setDigits(next: string[]) {
    onChange(next);
    const code = next.join('');
    if (code.length === CODE_LENGTH && next.every(Boolean)) onComplete?.(code);
  }

  function handleInput(index: number, raw: string) {
    const typed = raw.replace(/\D/g, '');
    const next = [...digits];

    if (typed.length > 1) {
      // typing fast, or pasting a full code
      for (let i = 0; i < typed.length && index + i < CODE_LENGTH; i += 1) {
        next[index + i] = typed[i];
      }
      setDigits(next);
      focusBox(Math.min(index + typed.length, CODE_LENGTH - 1));
      return;
    }

    next[index] = typed;
    setDigits(next);
    if (typed && index < CODE_LENGTH - 1) focusBox(index + 1);
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      event.preventDefault();
      const next = [...digits];
      next[index - 1] = '';
      onChange(next);
      focusBox(index - 1);
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusBox(index - 1);
    }
    if (event.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      event.preventDefault();
      focusBox(index + 1);
    }
  }

  return (
    <div className={s['code-field']}>
      <div className={s['code-entry']} id="codeEntry" role="group" aria-label="Enter your code">
        {Array.from({ length: CODE_LENGTH }, (_, index) => (
          <input
            key={index}
            ref={(element) => {
              boxes.current[index] = element;
            }}
            type="text"
            id={`codeEntry-${index}`}
            value={digits[index] ?? ''}
            maxLength={index === 0 ? CODE_LENGTH : 1}
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label={`Enter code digit ${index + 1}`}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            className={cx(invalid && s['has-error'])}
            onFocus={(event) => event.target.select()}
            onChange={(event) => handleInput(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
          />
        ))}
      </div>
    </div>
  );
}

export const emptyCode = (): string[] => [...EMPTY];
