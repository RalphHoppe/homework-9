import type { ReactNode } from 'react';
import s from '@/styles/fluent.module.css';
import { useBodyFamily } from '@/flow/useBodyFamily';
import { BackgroundLayers } from './BackgroundLayers';
import { PageTransition } from './PageTransition';
import { FluentFooter } from '../common/FluentFooter';

/**
 * Frame for the Fluent pages: the card and the footer share one centred
 * column, exactly like the reference pages.
 */
export function FluentLayout({ children }: { children: ReactNode }) {
  useBodyFamily('fluent');

  return (
    <div className={s.root}>
      <BackgroundLayers />

      <div className={s.outer}>
        <div className={s.middle}>
          <div className={s.stack}>
            <div className={s.card}>
              <PageTransition>{children}</PageTransition>
            </div>
            <FluentFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
