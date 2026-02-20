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

      <circle cx="32" cy="32" r="28" fill="url(#coin-rim)" stroke="#7c2d12" strokeWidth="2" />
      <circle cx="32" cy="32" r="22.5" fill="url(#coin-core)" stroke="#92400e" strokeWidth="1.75" />

      <circle cx="21" cy="22" r="3.6" fill="#fef3c7" stroke="#92400e" strokeWidth="1.1" />
      <circle cx="32" cy="19.5" r="3.6" fill="#fef3c7" stroke="#92400e" strokeWidth="1.1" />
      <circle cx="43" cy="22" r="3.6" fill="#fef3c7" stroke="#92400e" strokeWidth="1.1" />
      <circle cx="24.5" cy="31.5" r="3.1" fill="#fde68a" stroke="#92400e" strokeWidth="1" />
      <circle cx="39.5" cy="31.5" r="3.1" fill="#fde68a" stroke="#92400e" strokeWidth="1" />

      <text x="32" y="45" textAnchor="middle" fontSize="13" fontWeight="700" fill="#78350f" letterSpacing="0.8">
        GT
      </text>
    </svg>
  );
}
