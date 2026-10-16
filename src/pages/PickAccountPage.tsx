import s from '@/styles/classic.module.css';
import { ClassicLayout } from '@/components/layout/ClassicLayout';
import { MicrosoftLogo } from '@/components/brand/MicrosoftLogo';
import { useSession } from '@/flow/SessionProvider';
import { usePageTitle } from '@/flow/usePageTitle';
import { useFlowNavigation } from '@/flow/useFlowNavigation';
import { ROUTES, type RoutePath } from '@/flow/routes';
import workIcon from '@/assets/picker-account-work.svg';
import personalIcon from '@/assets/picker-account-personal.svg';

type AccountTile = {
  id: string;
  titleId: string;
  hintId: string;
  title: string;
  hint: string;
  icon: string;
  /** where picking this account takes you */
  next: RoutePath;
};

const TILES: AccountTile[] = [
  {
    id: 'aadTile',
    titleId: 'aadTileTitle',
    hintId: 'aadTitleHint',
    title: 'Work or school account',
    hint: 'Created by your IT department',
    icon: workIcon,
    next: ROUTES.workPassword,
  },
  {
    id: 'msaTile',
    titleId: 'msaTileTitle',
    hintId: 'msaTileHint',
    title: 'Personal account',
    hint: 'Created by you',
    icon: personalIcon,
    next: ROUTES.getACode,
  },
];

/**
 * "It looks like this email is used with more than one account from Microsoft."
 * Picking one of the tiles is what continues — the page has no Next button.
 */
export function PickAccountPage() {
  usePageTitle('Sign in to your account');

  const { account } = useSession();
  const go = useFlowNavigation();

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      go(TILES[index].next);
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      document.getElementById(TILES[(index + 1) % TILES.length].id)?.focus();
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      document.getElementById(TILES[(index - 1 + TILES.length) % TILES.length].id)?.focus();
    }
  }

  return (
    <ClassicLayout>
      <div className={s['sign-in-box']}>
        <MicrosoftLogo family="classic" className={s.logo} />

        <div className={`${s.row} ${s['text-body']}`}>
          <div id="loginDescription">
            It looks like this email is used with more than one account from Microsoft. Which one do
            you want to use?
          </div>
        </div>

        <div className={s['form-group']} role="list" aria-labelledby="loginDescription">
          {TILES.map((tile, index) => (
            <div key={tile.id} className={`${s.row} ${s.tile}`} role="listitem">
              <div
                id={tile.id}
                className={s.table}
                tabIndex={0}
                role="button"
                onClick={() => go(tile.next)}
                onKeyDown={(event) => handleKeyDown(index, event)}
              >
                <div className={s['table-row']}>
                  <div className={`${s['table-cell']} ${s['tile-img']}`}>
                    <img
                      className={s['tile-img']}
                      width="48"
                      height="48"
                      role="presentation"
                      alt=""
                      src={tile.icon}
                    />
                  </div>
                  <div className={`${s['table-cell']} ${s['text-left']} ${s.content}`}>
                    <div id={tile.titleId}>{tile.title}</div>
                    <div id={tile.hintId}>
                      <small>{tile.hint}</small>
                    </div>
                    <div>
                      <small>{account}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={s['position-buttons']}>
          <div>
            <div className={s['text-13']}>
              <div className={s['form-group']}>
                Tired of seeing this?{' '}
                <a
                  id="iDisambigRenameLink"
                  href="https://go.microsoft.com/fwlink/p/?LinkID=733247"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Rename your personal Microsoft account.
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={s['win-button-pin-bottom']}>
          <div className={s.row}>
            <div className={s['button-field-container']}>
              <input type="button" id="idBtn_Back" value="Back" onClick={() => go(ROUTES.signIn)} />
            </div>
          </div>
        </div>
      </div>
    </ClassicLayout>
  );
}
