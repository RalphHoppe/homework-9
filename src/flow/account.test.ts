import { describe, expect, it } from 'vitest';
import { classifyAccount, maskEmail, withAccount } from './account';

describe('maskEmail', () => {
  it('keeps the first two characters and at least five stars', () => {
    expect(maskEmail('anton5@abv.bg')).toBe('an*****@abv.bg');
    expect(maskEmail('test@test.com')).toBe('te*****@test.com');
    expect(maskEmail('ab@cd.com')).toBe('ab*****@cd.com');
  });

  it('leaves something that is not an address alone', () => {
    expect(maskEmail('noperson')).toBe('noperson');
  });
});

describe('classifyAccount', () => {
  it('accepts emails, phone numbers and Skype names', () => {
    expect(classifyAccount('anton5@abv.bg')).toBe('email');
    expect(classifyAccount('+1 (555) 123-4567')).toBe('phone');
    expect(classifyAccount('someone.skype')).toBe('skype');
  });

  it('rejects everything else', () => {
    expect(classifyAccount('')).toBeNull();
    expect(classifyAccount('not an email')).toBeNull();
    expect(classifyAccount('a@b')).toBeNull();
  });
});

describe('withAccount', () => {
  it('carries the account to the next step', () => {
    expect(withAccount('/get-a-code', 'anton5@abv.bg')).toBe('/get-a-code?email=anton5%40abv.bg');
  });

  it('keeps an existing query string and a hash', () => {
    expect(withAccount('/x?a=1#top', 'a@b.com')).toBe('/x?a=1&email=a%40b.com#top');
  });
});
