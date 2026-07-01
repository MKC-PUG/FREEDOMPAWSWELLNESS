import type { ReactNode } from 'react';
import EyebrowLabel from './EyebrowLabel';

type Props = {
  eyebrow?: string;
  eyebrowVariant?: 'gold' | 'emerald' | 'muted';
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  icon?: string;
  center?: boolean;
  className?: string;
};

export default function PageHeader({
  eyebrow,
  eyebrowVariant = 'gold',
  title,
  subtitle,
  badge,
  icon,
  center = false,
  className = '',
}: Props) {
  const align = center ? 'text-center' : '';

  return (
    <header className={`mb-8 ${align} ${className}`}>
      {eyebrow ? (
        <EyebrowLabel variant={eyebrowVariant} className={center ? '' : 'mb-2'}>
          {eyebrow}
        </EyebrowLabel>
      ) : null}

      <div
        className={`flex flex-wrap items-start gap-4 ${center ? 'justify-center' : 'justify-between'}`}
      >
        <div className={`flex items-center gap-4 ${center ? 'flex-col' : ''}`}>
          {icon ? (
            <span className="text-4xl sm:text-5xl" aria-hidden>
              {icon}
            </span>
          ) : null}
          <div>
            <h1
              className={`font-bold tracking-tight leading-tight ${
                center ? 'text-3xl sm:text-4xl mt-2' : 'text-3xl sm:text-5xl'
              }`}
            >
              {title}
            </h1>
            {subtitle ? (
              <p
                className={`mt-2 text-sm sm:text-lg leading-relaxed ${
                  eyebrowVariant === 'emerald' ? 'text-white/70' : 'text-[#F5C242]/90'
                }`}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
        {badge ? <div className="shrink-0">{badge}</div> : null}
      </div>
    </header>
  );
}
