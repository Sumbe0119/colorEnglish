// frontend/src/components/type-rush/car-sprite.tsx
'use client';

export const CAR_W = 60;

export function CarSprite({
  color,
  dark,
  width = CAR_W,
  className = '',
}: {
  color: string;
  dark: string;
  width?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={width / 2}
      viewBox="0 0 64 32"
      className={className}
      aria-hidden
      style={{ filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.45))' }}
    >
      {/* дугуй */}
      <rect x="9" y="1" width="11" height="6" rx="2" fill="#15181F" />
      <rect x="42" y="1" width="11" height="6" rx="2" fill="#15181F" />
      <rect x="9" y="25" width="11" height="6" rx="2" fill="#15181F" />
      <rect x="42" y="25" width="11" height="6" rx="2" fill="#15181F" />
      {/* арын далавч */}
      <rect x="0" y="6" width="5" height="20" rx="1.5" fill={dark} />
      {/* их бие */}
      <rect x="3" y="5" width="59" height="22" rx="7" fill={color} />
      <rect x="3" y="5" width="59" height="11" rx="7" fill="#FFFFFF" opacity="0.14" />
      <rect x="3" y="20" width="59" height="7" rx="4" fill="#000000" opacity="0.22" />
      {/* уралдааны зураас */}
      <rect x="8" y="14.5" width="50" height="3" fill="#FFFFFF" opacity="0.55" />
      {/* арын шил */}
      <rect x="19" y="9" width="7" height="14" rx="2" fill="#7FC4EE" opacity="0.9" />
      {/* бүхээг + урд шил */}
      <rect x="27" y="8" width="17" height="16" rx="3.5" fill={dark} opacity="0.85" />
      <rect x="37" y="9.5" width="8" height="13" rx="2.5" fill="#A9DDFF" />
      {/* гэрэл */}
      <rect x="58" y="8" width="4" height="4.5" rx="1" fill="#FFF4B0" />
      <rect x="58" y="19.5" width="4" height="4.5" rx="1" fill="#FFF4B0" />
      <rect x="3" y="8" width="3" height="4.5" rx="1" fill="#FF3B3B" />
      <rect x="3" y="19.5" width="3" height="4.5" rx="1" fill="#FF3B3B" />
    </svg>
  );
}
