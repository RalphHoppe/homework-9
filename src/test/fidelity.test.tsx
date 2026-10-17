import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { renderFlow } from './renderFlow';
import { maskEmail } from '@/flow/account';

/**
 * The React steps are a port of `legacy/*.html`, not a redesign: this is the
 * guard that keeps it that way. Every step is rendered inside the shell and its
 * element ids, copy and title are compared against the HTML page it replaced.
 */

const ROOT = path.resolve(__dirname, '../..');
const ACCOUNT = 'test@test.com';

/** Every step of the flow, and the capture it was ported from. */
const pages: Array<{ route: string; file: string }> = [
  { route: '/', file: 'legacy/index.html' },
  { route: '/pick-account', file: 'legacy/pick-account.html' },
  { route: '/get-a-code', file: 'legacy/get-a-code.html' },
  { route: '/verify-email', file: 'legacy/verify-email.html' },
  { route: '/enter-code', file: 'legacy/enter-code.html' },
  { route: '/password', file: 'legacy/enter-password.html' },
  { route: '/work-password', file: 'legacy/enter-password-work.html' },
  { route: '/approve-sign-in', file: 'legacy/app-auth-work.html' },
  { route: '/work-enter-code', file: 'legacy/enter-code-work.html' },
];

/** JSX drops the whitespace between elements, so spacing says nothing here. */
const squeeze = (text: string) => text.replace(/\s+/g, '');

function legacyDocument(file: string) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const { window } = new JSDOM(html);
  const { document } = window;
  // The inline scripts are page behaviour, which now lives in React; the copy
  // and the ids are what is being compared.
  document.querySelectorAll('script, style, noscript').forEach((node) => node.remove());
  window.close();
  return document;
}

/** Renders one step and reads the page back out, without the test scaffolding. */
function snapshot(route: string) {
  const view = renderFlow(route);
  const page = [...view.container.children].filter(
    (node) => node.getAttribute('data-testid') !== 'location',
  );

  const result = {
    ids: page.flatMap((node) =>
      [node, ...node.querySelectorAll('[id]')].map((candidate) => candidate.id).filter(Boolean),
    ),
    text: page.map((node) => node.textContent ?? '').join(''),
    title: document.title,
  };
  view.unmount();
  return result;
}

describe('the React pages match the legacy pages they replaced', () => {
  for (const { route, file } of pages) {
    describe(`${route} ↔ ${file}`, () => {
      it('keeps every element id', () => {
        const reference = legacyDocument(file);
        const legacyIds = [...reference.querySelectorAll('[id]')].map((node) => node.id);
        expect(snapshot(route).ids.toSorted()).toEqual(legacyIds.toSorted());
      });

      it('keeps every word', () => {
        const reference = legacyDocument(file);
        // The reference file copies the address verbatim; the real page masks
        // it, and so does this one.
        const rendered = squeeze(snapshot(route).text).replace(maskEmail(ACCOUNT), ACCOUNT);
        expect(rendered).toBe(squeeze(reference.body.textContent ?? ''));
      });

      it('keeps the title', () => {
        expect(snapshot(route).title).toBe(legacyDocument(file).title);
      });
    });
  }
});
