import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Trailing = {
  host: HTMLElement | null;
  setHost: (node: HTMLElement | null) => void;
};

const Context = createContext<Trailing>({ host: null, setHost: () => {} });

/**
 * A slot under the box, for the one step that has something there: the
 * "Sign-in options" card below the sign-in box. The box is the single element
 * the flow lives in, so a step cannot render a sibling next to it — this
 * carries such content into the slot the shell leaves under the box.
 */
export function TrailingProvider({ children }: { children: ReactNode }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const value = useMemo(() => ({ host, setHost }), [host]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

/** Where the trailing content lands — rendered by the shell, under the box. */
export function TrailingSlot() {
  const { setHost } = useContext(Context);
  return <div ref={setHost} />;
}

/** Renders its children under the box instead of inside it. */
export function StepTrailing({ children }: { children: ReactNode }) {
  const { host } = useContext(Context);
  return host ? createPortal(children, host) : null;
}
