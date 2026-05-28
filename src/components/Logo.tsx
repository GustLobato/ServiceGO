/** Componente de logo compartilhado — ícone de pin laranja + texto ServiceGO */

interface LogoIconProps {
  size?: number;
}

export const LogoIcon = ({ size = 32 }: LogoIconProps) => (
  <div style={{ width: size, height: Math.round(size * 1.15) }} className="relative flex-shrink-0 flex items-center justify-center">
    <svg
      viewBox="0 0 40 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: Math.round(size * 1.15) }}
    >
      <path
        d="M20 0C8.954 0 0 8.954 0 20c0 7.176 3.794 13.47 9.483 17.013L20 46l10.517-8.987C36.206 33.47 40 27.176 40 20 40 8.954 31.046 0 20 0z"
        fill="url(#pinGrad)"
      />
      <defs>
        <linearGradient id="pinGrad" x1="0" y1="0" x2="40" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fb923c" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
    </svg>
    <span
      className="absolute font-display font-bold text-white select-none"
      style={{ fontSize: size * 0.45, lineHeight: 1, marginTop: `-${size * 0.06}px` }}
    >
      S
    </span>
  </div>
);

interface LogoFullProps {
  iconSize?: number;
  textSize?: string;
  className?: string;
}

export const LogoFull = ({ iconSize = 32, textSize = "text-xl", className = "" }: LogoFullProps) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <LogoIcon size={iconSize} />
    <span className={`font-display font-bold text-gray-900 ${textSize}`}>
      Service<span className="text-primary">GO</span>
    </span>
  </div>
);
