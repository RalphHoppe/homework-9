import { useEffect } from 'react';

/**
 * The classic and the Fluent pages ship different base typography, so the
 * active layout tells <body> which family it belongs to (see global.css).
 */
export function useBodyFamily(family: 'classic' | 'fluent'): void {
  useEffect(() => {
    document.body.dataset.family = family;
    return () => {
      delete document.body.dataset.family;
    };
  }, [family]);
}
