import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

// Every test starts from a clean DOM and an empty "remembered account", so one
// test can never inherit the state another one left behind.
beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  document.body.removeAttribute('data-family');
  document.title = '';
});
