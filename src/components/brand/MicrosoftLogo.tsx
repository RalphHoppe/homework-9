import classicLogo from '@/assets/microsoft-logo-108.svg';
import fluentLogo from '@/assets/microsoft-logo-114.svg';

/** Which of Microsoft's two sign-in designs a page belongs to. */
export type DesignFamily = 'classic' | 'fluent';

type Props = {
  /** The classic pages ship a 108×24 logo, the Fluent ones a 114×24 logo. */
  family?: DesignFamily;
  className?: string;
};

export function MicrosoftLogo({ family = 'fluent', className }: Props) {
  return (
    <img
      className={className}
      role="img"
      alt="Microsoft"
      src={family === 'classic' ? classicLogo : fluentLogo}
    />
  );
}
