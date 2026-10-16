import { useEffect } from 'react';

/** Sets the document title — each step of the real flow has its own. */
export function usePageTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
