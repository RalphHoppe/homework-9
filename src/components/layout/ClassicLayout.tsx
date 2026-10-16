import type { ReactNode } from 'react';
import s from '@/styles/classic.module.css';
import { useBodyFamily } from '@/flow/useBodyFamily';
import { BackgroundLayers } from './BackgroundLayers';
import { PageTransition } from './PageTransition';
import { ClassicFooter } from '../common/ClassicFooter';

/**
 * Frame for the old-style pages: a centred column over the background photo,
 * with the footer pinned to the bottom of the viewport.
 */
type Props = {
  children: ReactNode;
  /**
   * The two work-account steps were captured from the live flow, and the
   * capture carries ids the hand-written pages have no use for: the shell
   * around the background, the card, and the footer.
   */
  captured?: boolean;
};

export function ClassicLayout({ children, captured = false }: Props) {
  useBodyFamily('classic');

  return (
    <div className={s.root}>
      <BackgroundLayers withIds={captured} />

      <div className={s.outer}>
        <div className={s.middle}>
          <div className={s['flex-column']}>
            <PageTransition family="classic">{children}</PageTransition>
          </div>
        </div>
      </div>

      <ClassicFooter withIds={captured} />
    </div>
  );
}
