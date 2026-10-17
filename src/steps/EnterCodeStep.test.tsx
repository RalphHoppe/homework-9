import { describe, expect, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderFlow } from '@/test/renderFlow';

const renderCode = () => renderFlow('/enter-code?email=anton5%40abv.bg');
const boxes = () => screen.getAllByRole('textbox') as HTMLInputElement[];

describe('EnterCodeStep', () => {
  it('shows six boxes, the first one wide enough for a pasted code', () => {
    renderCode();
    const inputs = boxes();
    expect(inputs).toHaveLength(6);
    expect(inputs[0]).toHaveAttribute('maxlength', '6');
    expect(inputs[1]).toHaveAttribute('maxlength', '1');
    expect(inputs[0]).toHaveAttribute('autocomplete', 'one-time-code');
  });

  it('has no submit button — the last digit submits, like the real page', () => {
    renderCode();
    expect(screen.queryByRole('button', { name: /next|send/i })).toBeNull();
  });

  it('moves on as you type', async () => {
    const user = userEvent.setup();
    renderCode();

    await user.type(boxes()[0], '1');
    expect(document.activeElement).toBe(boxes()[1]);
  });

  it('spreads a pasted code across the boxes and reports the demo state', async () => {
    const user = userEvent.setup();
    renderCode();

    await user.type(boxes()[0], '123456');
    expect(
      boxes()
        .map((box) => box.value)
        .join(''),
    ).toBe('123456');
    expect(document.getElementById('demoStatus')).toHaveTextContent(/Demo only/);
  });

  it('steps back with Backspace', async () => {
    const user = userEvent.setup();
    renderCode();

    await user.type(boxes()[0], '7');
    await user.keyboard('{Backspace}');
    expect(
      boxes()
        .map((box) => box.value)
        .join(''),
    ).toBe('');
    expect(document.activeElement).toBe(boxes()[0]);
  });

  it('complains when the code is not finished', () => {
    renderCode();

    fireEvent.submit(document.getElementById('codeForm') as HTMLFormElement);
    expect(document.getElementById('codeError')).toHaveTextContent('Enter the code we sent you.');
  });

  it('offers a way back to the code step', () => {
    renderCode();
    expect(document.getElementById('noCodeLink')).toHaveAttribute(
      'href',
      '/get-a-code?email=anton5%40abv.bg',
    );
  });
});
