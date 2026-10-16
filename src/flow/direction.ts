import { useLocation } from 'react-router-dom';
import { STEP_ORDER, type RoutePath } from './routes';

export type FlowDirection = 'next' | 'back' | null;

/** Where `to` sits in the flow relative to `from`. */
export function directionBetween(from: string, to: string): FlowDirection {
  const a = STEP_ORDER.indexOf(from as RoutePath);
  const b = STEP_ORDER.indexOf(to as RoutePath);
  if (a === -1 || b === -1) return null;
  return b > a ? 'next' : 'back';
}

/**
 * The direction the current navigation carried with it. Steps reached by a
 * plain link (or by loading the page) carry none, and slide in forward — which
 * is what the reference pages do on their first paint.
 */
export function useFlowDirection(): FlowDirection {
  const { state } = useLocation();
  const carried = (state as { direction?: FlowDirection } | null)?.direction;
  return carried ?? 'next';
}
