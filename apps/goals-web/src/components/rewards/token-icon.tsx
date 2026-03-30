import goalTogetherCoin from "../../assets/images/goal-together-coin.png";

type TokenIconProps = {
  size?: number;
  className?: string;
  label?: string;
};

export function TokenIcon({ size = 24, className, label = "Token icon" }: TokenIconProps) {
  return (
    <img
      src={goalTogetherCoin}
      alt={label}
      width={size}
      height={size}
      className={className}
    />
  );
}
