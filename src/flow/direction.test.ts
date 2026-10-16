import { describe, expect, it } from 'vitest';
import { directionBetween } from './direction';
import { ROUTES } from './routes';

describe('directionBetween', () => {
  it('reads forward when the next step comes later in the flow', () => {
    expect(directionBetween(ROUTES.signIn, ROUTES.pickAccount)).toBe('next');
    expect(directionBetween(ROUTES.pickAccount, ROUTES.getACode)).toBe('next');
    expect(directionBetween(ROUTES.getACode, ROUTES.verifyEmail)).toBe('next');
    expect(directionBetween(ROUTES.verifyEmail, ROUTES.enterCode)).toBe('next');
  });

  it('reads back when the next step comes earlier in the flow', () => {
    expect(directionBetween(ROUTES.enterCode, ROUTES.verifyEmail)).toBe('back');
    expect(directionBetween(ROUTES.workPassword, ROUTES.pickAccount)).toBe('back');
    expect(directionBetween(ROUTES.password, ROUTES.getACode)).toBe('back');
  });

  it('has no opinion about a step that is not part of the flow', () => {
    expect(directionBetween(ROUTES.signIn, '/nowhere')).toBeNull();
    expect(directionBetween('/nowhere', ROUTES.signIn)).toBeNull();
  });
});
