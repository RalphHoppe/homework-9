import type { ReactNode } from 'react';
import s from '@/styles/classic.module.css';
import { useBodyFamily } from '@/flow/useBodyFamily';
import { BackgroundLayers } from './BackgroundLayers';
import { ClassicFooter } from '../common/ClassicFooter';

/**
 * Frame for the old-style pages: a centred column over the background photo,
 * with the footer pinned to the bottom of the viewport.
 */
export function ClassicLayout({ children }: { children: ReactNode }) {
  useBodyFamily('classic');

  return (
    <div className={s.root}>
      <BackgroundLayers />

      <div className={s.outer}>
        <div className={s.middle}>
          <div className={s['flex-column']}>{children}</div>
        </div>
      </div>

      <ClassicFooter />
    </div>
  );
}
