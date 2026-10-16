import type { ReactNode } from 'react';
import s from '@/styles/fluent.module.css';
import { cx } from '@/utils/cx';
import { ValidationIcon } from '../brand/icons';

type Props = {
  id: string;
  /** The reference pages put the copy in an inner <span id="…ErrorText">. */
  textId?: string;
  visible: boolean;
  children: ReactNode;
};

/** The Fluent error line under a field, hidden until something goes wrong. */
export function ValidationMessage({ id, textId, visible, children }: Props) {
  return (
    <p className={cx(s['validation-message'], visible && s['is-visible'])} id={id} role="alert">
      <ValidationIcon className={s['validation-icon']} />
      <span id={textId}>{children}</span>
    </p>
  );
}
