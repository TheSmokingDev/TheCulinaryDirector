import type { ReactNode } from "react";
import ToolIcon from "./ToolIcon";

/**
 * Hand-drawn SVG line-art per tool, in the brand palette.
 * All share a 240×140 canvas; maroon strokes with sand accents.
 */

const MAROON = "#531c1c";
const SAND = "#d9d1c7";
const INK = "#1e1c1d";

function Canvas({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 240 140"
      className="h-full w-full"
      fill="none"
      stroke={MAROON}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const Label = ({
  x,
  y,
  size = 16,
  color = MAROON,
  children,
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
  children: ReactNode;
}) => (
  <text
    x={x}
    y={y}
    fill={color}
    stroke="none"
    fontFamily="Manrope, sans-serif"
    fontWeight={600}
    fontSize={size}
    textAnchor="middle"
  >
    {children}
  </text>
);

const ILLUSTRATIONS: Record<string, ReactNode> = {
  "recipe-cost-sheet": (
    <Canvas>
      <rect x={88} y={26} width={64} height={92} rx={5} />
      <rect x={106} y={18} width={28} height={14} rx={4} fill={SAND} />
      <path d="M100 50h44M100 62h44M100 74h30" stroke={SAND} />
      <circle cx={138} cy={98} r={13} />
      <Label x={138} y={104} size={17}>
        $
      </Label>
    </Canvas>
  ),
  "food-cost-calculator": (
    <Canvas>
      <path d="M62 44v34M56 44v12a6 6 0 0 0 12 0V44M68 44v12" strokeWidth={2.5} />
      <path
        d="M184 34c7 12 7 26 0 36h-11V38c3-2 7-3 11-4Z"
        fill={SAND}
        strokeWidth={2.5}
      />
      <path d="M178 70v18" strokeWidth={2.5} />
      <rect x={96} y={32} width={48} height={76} rx={6} />
      <rect x={104} y={42} width={32} height={16} rx={2} fill={SAND} stroke={SAND} />
      {[0, 1, 2].flatMap((r) =>
        [0, 1, 2].map((c) => (
          <circle
            key={`${r}${c}`}
            cx={108 + c * 12}
            cy={72 + r * 12}
            r={2.4}
            fill={MAROON}
            stroke="none"
          />
        )),
      )}
    </Canvas>
  ),
  "food-cost": (
    <Canvas>
      <path d="M72 92a48 42 0 0 1 96 0" />
      <circle cx={120} cy={44} r={5} />
      <path d="M60 100h120" />
      <circle cx={182} cy={44} r={16} fill={SAND} stroke={MAROON} />
      <Label x={182} y={50}>$</Label>
    </Canvas>
  ),
  "food-cost-percentage": (
    <Canvas>
      <circle cx={96} cy={48} r={14} />
      <circle cx={146} cy={92} r={14} />
      <path d="M150 40 92 100" />
      <ellipse cx={120} cy={118} rx={56} ry={7} stroke={SAND} />
    </Canvas>
  ),
  "selling-price": (
    <Canvas>
      <path d="M136 42H92a8 8 0 0 0-8 8v40a8 8 0 0 0 8 8h44l32-28Z" />
      <circle cx={148} cy={70} r={4.5} fill={SAND} />
      <path d="M150 65c12-14 6-28-6-32" stroke={SAND} />
      <Label x={112} y={78} size={22}>$</Label>
    </Canvas>
  ),
  "dish-profit": (
    <Canvas>
      <circle cx={120} cy={70} r={42} />
      <circle cx={120} cy={70} r={30} stroke={SAND} />
      <path d="M120 40a30 30 0 0 1 26 15L120 70Z" fill={MAROON} stroke="none" />
      <path d="M120 70V40M120 70l26-15" />
    </Canvas>
  ),
  "cost-of-preparation": (
    <Canvas>
      <circle cx={96} cy={70} r={34} />
      <path d="M96 50v20l14 9" />
      <path d="M164 108V80" strokeWidth={2.5} />
      <ellipse cx={164} cy={56} rx={11} ry={25} strokeWidth={2.5} transform="rotate(16 164 56)" />
      <ellipse cx={164} cy={56} rx={11} ry={25} strokeWidth={2.5} transform="rotate(-16 164 56)" />
    </Canvas>
  ),
  "yield-percentage": (
    <Canvas>
      <circle cx={78} cy={70} r={30} />
      <path d="M118 70h34" stroke={INK} />
      <path d="M146 62l10 8-10 8" stroke={INK} />
      <circle cx={182} cy={70} r={19} fill={SAND} stroke={MAROON} />
    </Canvas>
  ),
  "waste-percentage": (
    <Canvas>
      <path d="M86 52l7 60a8 8 0 0 0 8 7h30a8 8 0 0 0 8-7l7-60" />
      <path d="M78 52h76M104 52v-8a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v8" />
      <path d="M104 68v36M116 68v36M128 68v36" stroke={SAND} />
      <circle cx={172} cy={38} r={8} strokeWidth={2.5} />
      <circle cx={198} cy={62} r={8} strokeWidth={2.5} />
      <path d="M200 32 170 68" strokeWidth={2.5} />
    </Canvas>
  ),
  "cooking-loss-percentage": (
    <Canvas>
      <path d="M84 66h72v34a12 12 0 0 1-12 12H96a12 12 0 0 1-12-12Z" />
      <path d="M84 74H68M156 74h16" />
      <path d="M104 52c-4-8 4-10 0-18M120 52c-4-8 4-10 0-18M136 52c-4-8 4-10 0-18" stroke={SAND} />
      <path d="M186 84v24M178 100l8 10 8-10" strokeWidth={2.5} />
    </Canvas>
  ),
  "yield-test-sheet": (
    <Canvas>
      <path d="M120 30v78M84 108h72" />
      <path d="M76 42h88" />
      <path d="M76 42l-14 28h28ZM62 70a14 14 0 0 0 28 0" />
      <path d="M164 42l-14 28h28ZM150 70a14 14 0 0 0 28 0" />
      <circle cx={120} cy={30} r={4} fill={SAND} />
    </Canvas>
  ),
  "purchase-weight": (
    <Canvas>
      <path d="M104 56h32l10 52H94Z" />
      <path d="M112 56v-8a8 8 0 0 1 16 0v8" />
      <Label x={120} y={92} size={16}>kg</Label>
      <path d="M172 92V56M164 66l8-10 8 10" strokeWidth={2.5} />
    </Canvas>
  ),
  "price-per-kg": (
    <Canvas>
      <path d="M88 108l10-44h44l10 44Z" />
      <path d="M110 64v-6a10 10 0 0 1 20 0v6" />
      <Label x={120} y={94} size={17}>1kg</Label>
      <circle cx={178} cy={50} r={14} fill={SAND} stroke={MAROON} />
      <Label x={178} y={56} size={15}>$</Label>
    </Canvas>
  ),
  "wastage-chart": (
    <Canvas>
      <rect x={80} y={26} width={80} height={92} rx={5} />
      <rect x={104} y={18} width={32} height={14} rx={4} fill={SAND} />
      <path d="M96 104V80M112 104V66M128 104V88M144 104V56" />
      <path d="M92 104h60" stroke={SAND} />
    </Canvas>
  ),
  "food-cost-period": (
    <Canvas>
      <rect x={76} y={32} width={88} height={80} rx={6} />
      <path d="M76 52h88" />
      <path d="M96 24v14M144 24v14" />
      {[0, 1, 2].map((c) => (
        <circle key={c} cx={98 + c * 22} cy={68} r={2.5} fill={SAND} stroke="none" />
      ))}
      {[0, 1].map((c) => (
        <circle key={c} cx={98 + c * 22} cy={86} r={2.5} fill={SAND} stroke="none" />
      ))}
      <circle cx={142} cy={86} r={12} />
      <Label x={142} y={92} size={15}>$</Label>
    </Canvas>
  ),
  "weekly-spend": (
    <Canvas>
      <path d="M64 112h112" />
      {[
        [72, 84],
        [88, 68],
        [104, 92],
        [120, 56],
        [136, 76],
        [152, 44],
        [168, 62],
      ].map(([x, y], i) => (
        <rect
          key={x}
          x={x}
          y={y}
          width={10}
          height={112 - y}
          fill={i % 2 ? SAND : MAROON}
          stroke="none"
        />
      ))}
    </Canvas>
  ),
  "sales-vs-purchases": (
    <Canvas>
      <path d="M60 112V32M60 112h124" />
      <path d="M72 92l28-18 26 10 28-28 22 8" />
      <path d="M72 76l28 8 26-22 28 14 22-24" stroke={SAND} />
      <circle cx={176} cy={48} r={4} fill={MAROON} stroke="none" />
    </Canvas>
  ),
  "menu-analysis": (
    <Canvas>
      <path d="M120 40c-12-8-34-8-44-2v66c10-6 32-6 44 2 12-8 34-8 44-2V38c-10-6-32-6-44 2Z" />
      <path d="M120 40v66" />
      <path d="M88 56h20M88 68h20M132 56h20M132 68h20" stroke={SAND} />
      <path
        d="M120 12l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1Z"
        fill={MAROON}
        stroke="none"
      />
    </Canvas>
  ),
  "recipe-scaler": (
    <Canvas>
      <path d="M62 66h44a22 22 0 0 1-44 0Z" />
      <path d="M118 62h44M148 54l10 8-10 8" stroke={INK} strokeWidth={2.5} />
      <path d="M150 80h56a28 28 0 0 1-56 0Z" transform="translate(-22 0)" fill={SAND} stroke={MAROON} />
    </Canvas>
  ),
};

export default function ToolIllustration({
  slug,
  icon,
  className = "",
}: {
  slug: string;
  icon: string;
  className?: string;
}) {
  const art = ILLUSTRATIONS[slug];
  if (!art)
    return (
      <ToolIcon name={icon} className={`text-5xl text-maroon ${className}`} />
    );
  return <div className={`h-full w-full p-3 ${className}`}>{art}</div>;
}
