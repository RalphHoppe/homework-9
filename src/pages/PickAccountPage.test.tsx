import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderPage } from '@/test/renderPage';
import { PickAccountPage } from './PickAccountPage';

const renderPicker = () => renderPage(<PickAccountPage />, '/pick-account?email=anton5%40abv.bg');

describe('PickAccountPage', () => {
  it('explains why it is asking', () => {
    renderPicker();
    expect(document.getElementById('loginDescription')).toHaveTextContent(
      'It looks like this email is used with more than one account from Microsoft. Which one do you want to use?',
    );
  });

  it('offers both accounts, each with the address being signed in', () => {
    renderPicker();
    expect(document.getElementById('aadTileTitle')).toHaveTextContent('Work or school account');
    expect(document.getElementById('aadTitleHint')).toHaveTextContent(
      'Created by your IT department',
    );
    expect(document.getElementById('msaTileTitle')).toHaveTextContent('Personal account');
    expect(document.getElementById('msaTileHint')).toHaveTextContent('Created by you');
    expect(document.getElementById('aadTile')).toHaveTextContent('anton5@abv.bg');
    expect(document.getElementById('msaTile')).toHaveTextContent('anton5@abv.bg');
  });

  it('has no Next button — picking a tile is what continues', () => {
    renderPicker();
    expect(screen.queryByDisplayValue('Next')).toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(3); // two tiles + Back
  });

  it('sends the personal account to the code step', async () => {
    const user = userEvent.setup();
    const { location } = renderPicker();

    await user.click(document.getElementById('msaTile') as HTMLElement);
    expect(location()).toBe('/get-a-code?email=anton5%40abv.bg');
  });

  it('sends the work account to the work password step', async () => {
    const user = userEvent.setup();
    const { location } = renderPicker();

    await user.click(document.getElementById('aadTile') as HTMLElement);
    expect(location()).toBe('/work-password?email=anton5%40abv.bg');
  });

  it('can be driven from the keyboard', async () => {
    const user = userEvent.setup();
    const { location } = renderPicker();

    const personal = document.getElementById('msaTile') as HTMLElement;
    personal.focus();
    await user.keyboard('{Enter}');
    expect(location()).toBe('/get-a-code?email=anton5%40abv.bg');
  });

  it('goes back to the sign-in page', async () => {
    const user = userEvent.setup();
    const { location } = renderPicker();

    await user.click(screen.getByDisplayValue('Back'));
    expect(location()).toBe('/?email=anton5%40abv.bg');
  });
});
