type TokenIconProps = {
  size?: number;
  className?: string;
  label?: string;
};

export function TokenIcon({ size = 24, className, label = "Token icon" }: TokenIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={label}
      className={className}
    >
      <defs>
        <radialGradient id="coin-core" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="55%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <linearGradient id="coin-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      <circle cx="32" cy="32" r="26.5" fill="url(#coin-rim)" stroke="#7c2d12" strokeWidth="2.2" />
      <circle cx="32" cy="32" r="20.8" fill="url(#coin-core)" stroke="#92400e" strokeWidth="1.8" />

      <path
        d="M32 10a22 22 0 1 0 0 44a22 22 0 1 0 0-44z"
        fill="none"
        stroke="#8b3e0d"
        strokeWidth="1.6"
        strokeDasharray="2.6 3.4"
      />

      <circle cx="22" cy="19.8" r="3.3" fill="#fef3c7" stroke="#92400e" strokeWidth="1.05" />
      <circle cx="32" cy="17.9" r="3.3" fill="#fef3c7" stroke="#92400e" strokeWidth="1.05" />
      <circle cx="42" cy="19.8" r="3.3" fill="#fef3c7" stroke="#92400e" strokeWidth="1.05" />

      <text x="32" y="43.5" textAnchor="middle" fontSize="18" fontWeight="700" fill="#78350f">
        G
      </text>
    </svg>
  );
}
