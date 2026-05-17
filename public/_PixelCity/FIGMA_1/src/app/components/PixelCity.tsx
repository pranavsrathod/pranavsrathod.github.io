import { useState, useCallback } from "react";
import { ContactOverlay } from "./ContactOverlay";

// ─────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────
interface BldgColors { main: string; dark: string; trim: string }
interface Theme {
  isNight: boolean;
  skyTop: string; skyBot: string;
  b: BldgColors[];        // 6 buildings
  winOff: string; winOn: string;
  pavement: string; pavEdge: string; pavCrack: string;
  road: string; roadMark: string;
  outline: string;
  line: string;
  vine: string; vineLeaf: string;
  lampPole: string; lampHalo: string;
  scanAlpha: number;
}

const DAY: Theme = {
  isNight: false,
  skyTop: "#7BBDD8", skyBot: "#B4D8EE",
  b: [
    { main: "#D4956A", dark: "#A87045", trim: "#E8B07A" },
    { main: "#C88050", dark: "#9A6035", trim: "#D89068" },
    { main: "#ECC890", dark: "#C09858", trim: "#F8DCA8" },
    { main: "#D09060", dark: "#A07040", trim: "#E0A870" },
    { main: "#BEC0AE", dark: "#8E9082", trim: "#CECEC0" },
    { main: "#D4956A", dark: "#A87045", trim: "#E8B07A" },
  ],
  winOff: "#5A3A10", winOn: "#FFE880",
  pavement: "#C8B89A", pavEdge: "#8A6840", pavCrack: "#B8A888",
  road: "#9A8870", roadMark: "#E8D890",
  outline: "#1A1A1A",
  line: "#333333",
  vine: "#3A6B22", vineLeaf: "#55A030",
  lampPole: "#7A5A30", lampHalo: "rgba(255,220,100,0.0)",
  scanAlpha: 0.04,
};

const NIGHT: Theme = {
  isNight: true,
  skyTop: "#030812", skyBot: "#0B1428",
  b: [
    { main: "#1A2444", dark: "#0E1830", trim: "#222C55" },
    { main: "#142038", dark: "#0A1428", trim: "#1C2848" },
    { main: "#1E2850", dark: "#121C3C", trim: "#262E60" },
    { main: "#1A2040", dark: "#0E1830", trim: "#222848" },
    { main: "#1C2438", dark: "#101820", trim: "#242C45" },
    { main: "#1A2240", dark: "#0E182E", trim: "#222850" },
  ],
  winOff: "#040810", winOn: "#FFAA40",
  pavement: "#18192A", pavEdge: "#0C0C1E", pavCrack: "#1E2030",
  road: "#0C0C18", roadMark: "#2A2A3A",
  outline: "#0A0A0E",
  line: "#2A2A3A",
  vine: "#1A2A12", vineLeaf: "#2A3820",
  lampPole: "#8A6030", lampHalo: "rgba(255,140,30,0.32)",
  scanAlpha: 0.08,
};

const NEON = "#FF3B3B";

// ─────────────────────────────────────────────
// TOOLTIP STATE
// ─────────────────────────────────────────────
interface TooltipInfo { x: number; y: number; label: string; dest: string }

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function W({ x, y, w = 28, h = 36, on, t }: { x: number; y: number; w?: number; h?: number; on?: boolean; t: Theme }) {
  return (
    <rect x={x} y={y} width={w} height={h}
      fill={on ? t.winOn : t.winOff}
      stroke={t.outline} strokeWidth="1.5" shapeRendering="crispEdges" />
  );
}

// ─────────────────────────────────────────────
// BUILDINGS
// ─────────────────────────────────────────────

function BuildingB1({ t }: { t: Theme }) {
  const x1 = 0, x2 = 186, yB = 374, yT = 82;
  const { main, dark, trim } = t.b[0];
  const ol = t.outline;
  return (
    <g>
      {/* Stepped Art Deco crown */}
      <rect x={0} y={yT} width={186} height={yB - yT} fill={main} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      <rect x={0} y={60} width={186} height={24} fill={trim} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      <rect x={20} y={42} width={146} height={22} fill={main} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      <rect x={44} y={28} width={98} height={18} fill={dark} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      <rect x={64} y={18} width={58} height={14} fill={trim} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      {/* Pilasters */}
      <rect x={6} y={yT} width={10} height={yB - yT} fill={dark} shapeRendering="crispEdges" />
      <rect x={170} y={yT} width={10} height={yB - yT} fill={dark} shapeRendering="crispEdges" />
      {/* Horizontal floor bands */}
      <rect x={0} y={176} width={186} height={5} fill={dark} shapeRendering="crispEdges" />
      <rect x={0} y={256} width={186} height={5} fill={dark} shapeRendering="crispEdges" />
      <rect x={0} y={336} width={186} height={5} fill={dark} shapeRendering="crispEdges" />
      {/* Windows 3×3 */}
      {[22, 78, 136].map((wx, c) =>
        [95, 188, 268].map((wy, r) => (
          <W key={`${c}${r}`} x={wx} y={wy} w={30} h={38} on={c === 1 && r === 1} t={t} />
        ))
      )}
      {/* Ground floor arched openings */}
      <rect x={14} y={342} width={68} height={32} fill={dark} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
      <rect x={104} y={342} width={68} height={32} fill={dark} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
      {/* Arch crowns */}
      <rect x={14} y={338} width={68} height={8} fill={trim} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
      <rect x={104} y={338} width={68} height={8} fill={trim} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
    </g>
  );
}

function BuildingB2({ t }: { t: Theme }) {
  const x1 = 186, x2 = 308, yB = 374, yT = 12;
  const { main, dark, trim } = t.b[1];
  const ol = t.outline;
  return (
    <g>
      <rect x={x1} y={yT} width={x2 - x1} height={yB - yT} fill={main} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      {/* Simple cornice */}
      <rect x={x1} y={yT} width={x2 - x1} height={12} fill={dark} shapeRendering="crispEdges" />
      <rect x={x1 - 4} y={yT + 8} width={x2 - x1 + 8} height={8} fill={trim} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
      {/* Windows 2×9 (small) */}
      {[196, 254].map((wx, c) =>
        [30, 64, 98, 132, 166, 200, 234, 268, 308].map((wy, r) => (
          <W key={`${c}${r}`} x={wx} y={wy} w={22} h={26} on={c === 0 && r === 5} t={t} />
        ))
      )}
      {/* Central door */}
      <rect x={224} y={342} width={36} height={32} fill={dark} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
      <rect x={224} y={338} width={36} height={8} fill={trim} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
    </g>
  );
}

function BuildingB3Garage({ t, hovered, onClick, onEnter, onLeave }: {
  t: Theme; hovered: boolean;
  onClick: () => void; onEnter: () => void; onLeave: () => void;
}) {
  const x1 = 308, x2 = 466, yB = 374, yT = 102;
  const { main, dark, trim } = t.b[2];
  const ol = t.outline;
  const bamboo = t.isNight ? "#4A5A1A" : "#8ABE28";
  const bambooD = t.isNight ? "#2A3A10" : "#6A9A18";
  const metalGray = t.isNight ? "#2A2A3A" : "#8A8A98";

  return (
    <g
      style={{ cursor: "pointer" }}
      filter={hovered ? "url(#neon)" : ""}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Facade */}
      <rect x={x1} y={yT} width={x2 - x1} height={yB - yT} fill={main} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      {/* Art Deco ornamental crown */}
      <rect x={x1} y={84} width={x2 - x1} height={22} fill={trim} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      <rect x={322} y={66} width={124} height={22} fill={main} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      <rect x={342} y={50} width={84} height={20} fill={dark} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      <rect x={362} y={38} width={44} height={16} fill={trim} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      {/* Central spire */}
      <rect x={379} y={28} width={10} height={14} fill={dark} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
      {/* Horizontal floor band */}
      <rect x={x1} y={194} width={x2 - x1} height={5} fill={dark} shapeRendering="crispEdges" />
      {/* Windows upper 3×2 */}
      {[322, 364, 406].map((wx, c) =>
        [114, 204].map((wy, r) => (
          <W key={`${c}${r}`} x={wx} y={wy} w={28} h={34} on={c === 2 && r === 0} t={t} />
        ))
      )}
      {/* ROLLING SHUTTER */}
      <rect x={316} y={252} width={142} height={122} fill={dark} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      {/* Shutter slats */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={316} y={252 + i * 10} width={142} height={7}
          fill={metalGray} stroke={t.outline} strokeWidth="0.5" shapeRendering="crispEdges" />
      ))}
      {/* Shutter handle */}
      <rect x={378} y={340} width={12} height={6} fill={t.isNight ? "#4A4A5A" : "#6A6A78"} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
      {/* Peek inside: workbench */}
      <rect x={316} y={348} width={142} height={26} fill={t.isNight ? "#0A0E18" : "#2A1A0A"} shapeRendering="crispEdges" />
      <rect x={316} y={358} width={142} height={8} fill={t.isNight ? "#1A140A" : "#6E3C18"} shapeRendering="crispEdges" />
      {/* Blueprint rolls on bench */}
      <rect x={326} y={354} width={8} height={6} fill={t.isNight ? "#1A2840" : "#2244BB"} stroke={ol} strokeWidth="0.5" shapeRendering="crispEdges" />
      <rect x={338} y={354} width={8} height={6} fill={t.isNight ? "#1A2840" : "#2244BB"} stroke={ol} strokeWidth="0.5" shapeRendering="crispEdges" />
      <rect x={352} y={355} width={12} height={4} fill={t.isNight ? "#283848" : "#3A5A7A"} shapeRendering="crispEdges" />
      {/* BAMBOO SCAFFOLDING (left side) */}
      <rect x={308} y={yT} width={6} height={yB - yT} fill={bamboo} stroke={bambooD} strokeWidth="0.5" shapeRendering="crispEdges" />
      <rect x={308} y={150} width={32} height={5} fill={bamboo} stroke={bambooD} strokeWidth="0.5" shapeRendering="crispEdges" />
      <rect x={308} y={210} width={32} height={5} fill={bamboo} stroke={bambooD} strokeWidth="0.5" shapeRendering="crispEdges" />
      <rect x={308} y={270} width={32} height={5} fill={bamboo} stroke={bambooD} strokeWidth="0.5" shapeRendering="crispEdges" />
      <rect x={320} y={yT} width={6} height={yB - yT} fill={bambooD} stroke={bambooD} strokeWidth="0.5" shapeRendering="crispEdges" />
      {/* Hover hint label on shutter */}
      {hovered && (
        <text x={387} y={308} textAnchor="middle"
          fill={NEON} fontSize="9" fontFamily="'Press Start 2P'" opacity="0.9">
          /projects
        </text>
      )}
    </g>
  );
}

function BuildingB4({ t }: { t: Theme }) {
  const x1 = 466, x2 = 574, yB = 374, yT = 148;
  const { main, dark, trim } = t.b[3];
  const ol = t.outline;
  return (
    <g>
      <rect x={x1} y={yT} width={x2 - x1} height={yB - yT} fill={main} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      {/* Simple parapet */}
      <rect x={x1 - 4} y={yT - 6} width={x2 - x1 + 8} height={12} fill={trim} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
      {/* Windows 2×3 with shutters */}
      {[482, 530].map((wx, c) =>
        [162, 222, 282].map((wy, r) => (
          <g key={`${c}${r}`}>
            <W x={wx} y={wy} w={32} h={40} on={c === 0 && r === 2} t={t} />
            {/* Shutter panels */}
            <rect x={wx} y={wy} width={14} height={40} fill={main} stroke={ol} strokeWidth="1" opacity={0.7} shapeRendering="crispEdges" />
          </g>
        ))
      )}
      {/* Vines */}
      {[0, 8, 16, 24, 32, 40, 50, 60, 70, 80, 92, 104, 118, 132, 148, 162, 176, 192, 208].map((dy, i) => (
        <rect key={i}
          x={x1 + (i % 2 === 0 ? 2 : 8)} y={yT + dy} width={6} height={10}
          fill={i % 3 === 0 ? t.vineLeaf : t.vine} shapeRendering="crispEdges" />
      ))}
      {/* Shop front */}
      <rect x={x1 + 8} y={340} width={90} height={34} fill={dark} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
    </g>
  );
}

function BuildingB5Office({ t, hovered, onClick, onEnter, onLeave }: {
  t: Theme; hovered: boolean;
  onClick: () => void; onEnter: () => void; onLeave: () => void;
}) {
  const x1 = 574, x2 = 726, yB = 374, yT = 42;
  const { main, dark, trim } = t.b[4];
  const ol = t.outline;
  return (
    <g style={{ cursor: "pointer" }} filter={hovered ? "url(#neon)" : ""}
      onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <rect x={x1} y={yT} width={x2 - x1} height={yB - yT} fill={main} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      {/* Flat roof with cornice */}
      <rect x={x1 - 6} y={yT - 4} width={x2 - x1 + 12} height={14} fill={dark} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      <rect x={x1} y={yT + 10} width={x2 - x1} height={4} fill={trim} shapeRendering="crispEdges" />
      {/* Window grid 4×7 */}
      {[588, 618, 648, 678].map((wx, c) =>
        [58, 94, 130, 166, 202, 238, 274].map((wy, r) => {
          const isLit = (c === 2 && r === 3) || (c === 0 && r === 5) || (c === 3 && r === 1);
          return <W key={`${c}${r}`} x={wx} y={wy} w={22} h={28} on={isLit} t={t} />;
        })
      )}
      {/* Ground floor entrance */}
      <rect x={630} y={338} width={40} height={36} fill={dark} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      <rect x={622} y={334} width={56} height={8} fill={trim} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
      {/* Steps */}
      <rect x={626} y={370} width={48} height={4} fill={dark} shapeRendering="crispEdges" />
      {/* Office name plate */}
      <rect x={584} y={316} width={130} height={18} fill={dark} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
      {t.isNight && (
        <text x={649} y={329} textAnchor="middle"
          fill={t.winOn} fontSize="7" fontFamily="'Press Start 2P'" opacity="0.8">
          RESUME
        </text>
      )}
      {hovered && (
        <text x={649} y={329} textAnchor="middle"
          fill={NEON} fontSize="7" fontFamily="'Press Start 2P'">
          Resume PDF
        </text>
      )}
    </g>
  );
}

function BuildingB6Billboard({ t, hovered, onClick, onEnter, onLeave }: {
  t: Theme; hovered: boolean;
  onClick: () => void; onEnter: () => void; onLeave: () => void;
}) {
  const x1 = 726, x2 = 1000, yB = 374, yT = 80;
  const { main, dark, trim } = t.b[5];
  const ol = t.outline;
  return (
    <g style={{ cursor: "pointer" }} filter={hovered ? "url(#neon)" : ""}
      onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <rect x={x1} y={yT} width={x2 - x1} height={yB - yT} fill={main} stroke={ol} strokeWidth="1.5" shapeRendering="crispEdges" />
      {/* Billboard frame */}
      <rect x={x1 - 4} y={52} width={x2 - x1 + 8} height={34} fill={dark} stroke={ol} strokeWidth="2" shapeRendering="crispEdges" />
      <rect x={x1 + 4} y={56} width={x2 - x1 - 8} height={26} fill={t.isNight ? "#1A2850" : "#2A1A08"} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
      {/* Billboard content */}
      {hovered ? (
        <text x={863} y={73} textAnchor="middle"
          fill={NEON} fontSize="9" fontFamily="'Press Start 2P'" letterSpacing="1">
          FEATURED
        </text>
      ) : (
        <>
          <text x={863} y={70} textAnchor="middle"
            fill={t.isNight ? "#6080A0" : "#8A6840"} fontSize="7" fontFamily="'Press Start 2P'" letterSpacing="1">
            PRANAV RATHOD
          </text>
          <text x={863} y={78} textAnchor="middle"
            fill={t.isNight ? "#4A6080" : "#6A5030"} fontSize="5" fontFamily="'Press Start 2P'" letterSpacing="2">
            PORTFOLIO
          </text>
        </>
      )}
      {/* Billboard supports */}
      <rect x={790} y={80} width={6} height={18} fill={dark} shapeRendering="crispEdges" />
      <rect x={930} y={80} width={6} height={18} fill={dark} shapeRendering="crispEdges" />
      {/* Floor bands */}
      <rect x={x1} y={178} width={x2 - x1} height={4} fill={dark} shapeRendering="crispEdges" />
      <rect x={x1} y={258} width={x2 - x1} height={4} fill={dark} shapeRendering="crispEdges" />
      {/* Windows 4×4 */}
      {[740, 800, 870, 936].map((wx, c) =>
        [94, 190, 270, 336].map((wy, r) => {
          const isLit = (c === 1 && r === 2) || (c === 3 && r === 0) || (c === 0 && r === 3);
          return <W key={`${c}${r}`} x={wx} y={wy} w={36} h={44} on={isLit} t={t} />;
        })
      )}
      {/* Ground floor - 3 shops */}
      {[730, 820, 912].map((sx) => (
        <g key={sx}>
          <rect x={sx} y={342} width={70} height={32} fill={dark} stroke={ol} strokeWidth="1" shapeRendering="crispEdges" />
          <rect x={sx} y={338} width={70} height={7} fill={trim} stroke={ol} strokeWidth="0.5" shapeRendering="crispEdges" />
        </g>
      ))}
    </g>
  );
}

// ─────────────────────────────────────────────
// ENVIRONMENT
// ─────────────────────────────────────────────

function PowerLines({ t }: { t: Theme }) {
  const pts = [
    // pole-to-pole lines
    [[93, 60], [250, 15]],
    [[250, 15], [390, 102]],
    [[390, 102], [520, 42]],
    [[520, 42], [660, 80]],
    [[660, 80], [870, 52]],
  ] as [number, number][][];
  return (
    <g>
      {pts.map(([[x1, y1], [x2, y2]], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={t.line} strokeWidth="1.5" shapeRendering="crispEdges" />
      ))}
      {/* Crows */}
      {[[180, 14], [340, 52], [580, 44], [740, 64]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <rect x={-4} y={-3} width={8} height={4} fill={t.isNight ? "#3A3A4A" : "#1A1A1A"} shapeRendering="crispEdges" />
          <rect x={-2} y={-6} width={4} height={4} fill={t.isNight ? "#3A3A4A" : "#1A1A1A"} shapeRendering="crispEdges" />
          <rect x={-6} y={-2} width={4} height={2} fill={t.isNight ? "#3A3A4A" : "#1A1A1A"} shapeRendering="crispEdges" />
          <rect x={2} y={-2} width={4} height={2} fill={t.isNight ? "#3A3A4A" : "#1A1A1A"} shapeRendering="crispEdges" />
        </g>
      ))}
    </g>
  );
}

function Clouds({ t }: { t: Theme }) {
  if (t.isNight) {
    // Stars
    const stars = [[80, 45], [150, 20], [240, 55], [350, 28], [420, 48], [500, 18], [600, 38], [680, 22],
      [760, 50], [850, 30], [920, 14], [960, 45], [30, 30], [480, 62], [545, 10], [720, 38]];
    return (
      <g>
        {stars.map(([sx, sy], i) => (
          <rect key={i} x={sx} y={sy} width={i % 3 === 0 ? 3 : 2} height={i % 3 === 0 ? 3 : 2}
            fill="white" opacity={0.4 + (i % 4) * 0.15} shapeRendering="crispEdges" />
        ))}
      </g>
    );
  }
  // Clouds
  const clouds = [
    { x: 80, y: 22, scale: 1 },
    { x: 420, y: 14, scale: 1.4 },
    { x: 750, y: 30, scale: 0.9 },
  ];
  return (
    <g>
      {clouds.map(({ x, y, scale }, i) => (
        <g key={i} transform={`translate(${x},${y}) scale(${scale})`}>
          <rect x={0} y={10} width={48} height={10} fill="white" opacity="0.75" shapeRendering="crispEdges" />
          <rect x={4} y={4} width={20} height={10} fill="white" opacity="0.75" shapeRendering="crispEdges" />
          <rect x={20} y={2} width={16} height={10} fill="white" opacity="0.75" shapeRendering="crispEdges" />
          <rect x={6} y={0} width={10} height={6} fill="white" opacity="0.65" shapeRendering="crispEdges" />
          <rect x={28} y={8} width={18} height={8} fill="white" opacity="0.75" shapeRendering="crispEdges" />
        </g>
      ))}
    </g>
  );
}

function StreetLamp({ x, t }: { x: number; t: Theme }) {
  return (
    <g>
      {/* Halo glow (night only) */}
      {t.isNight && (
        <ellipse cx={x + 16} cy={374 - 78} rx={44} ry={44}
          fill={t.lampHalo} />
      )}
      {/* Pole */}
      <rect x={x + 14} y={374 - 90} width={4} height={90}
        fill={t.lampPole} stroke={t.outline} strokeWidth="0.5" shapeRendering="crispEdges" />
      {/* Arm */}
      <rect x={x} y={374 - 92} width={18} height={4}
        fill={t.lampPole} stroke={t.outline} strokeWidth="0.5" shapeRendering="crispEdges" />
      {/* Lamp head */}
      <rect x={x - 2} y={374 - 98} width={14} height={8}
        fill={t.isNight ? "#FFD060" : "#C8A040"} stroke={t.outline} strokeWidth="1" shapeRendering="crispEdges" />
      {/* Glass diffuser */}
      <rect x={x} y={374 - 96} width={10} height={5}
        fill={t.isNight ? "#FFFFC0" : "#E8C060"} opacity="0.9" shapeRendering="crispEdges" />
    </g>
  );
}

function PavementAndRoad({ t }: { t: Theme }) {
  return (
    <g>
      {/* Pavement */}
      <rect x={0} y={374} width={1000} height={90} fill={t.pavement} shapeRendering="crispEdges" />
      {/* Pavement top edge */}
      <rect x={0} y={372} width={1000} height={4} fill={t.pavEdge} shapeRendering="crispEdges" />
      {/* Pavement texture lines */}
      {[390, 406, 422, 438, 454].map((py) => (
        <rect key={py} x={0} y={py} width={1000} height={1} fill={t.pavCrack} opacity="0.5" shapeRendering="crispEdges" />
      ))}
      {/* Kerb */}
      <rect x={0} y={462} width={1000} height={5} fill={t.pavEdge} shapeRendering="crispEdges" />
      {/* Road */}
      <rect x={0} y={467} width={1000} height={133} fill={t.road} shapeRendering="crispEdges" />
      {/* Road center line dashes */}
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={i * 76} y={535} width={44} height={5}
          fill={t.roadMark} opacity="0.7" shapeRendering="crispEdges" />
      ))}
    </g>
  );
}

// ─────────────────────────────────────────────
// PROP SPRITES
// ─────────────────────────────────────────────

function BulletinBoard({ cx, t, hovered, onClick, onEnter, onLeave }: {
  cx: number; t: Theme; hovered: boolean;
  onClick: () => void; onEnter: () => void; onLeave: () => void;
}) {
  const s = 4;
  const bx = cx - 24; // 48px wide
  const by = 374 - 80; // top of sprite (80px tall total)
  const wood = t.isNight ? "#3A2818" : "#7A4A22";
  const cork = t.isNight ? "#2A2218" : "#EDD8A0";
  const outline = t.outline;

  const flyers = [
    { x: bx + 8, y: by + 8, w: 10, h: 10, c: t.isNight ? "#2A3855" : "#2244BB" },
    { x: bx + 20, y: by + 8, w: 10, h: 10, c: t.isNight ? "#441820" : "#CC2222" },
    { x: bx + 32, y: by + 8, w: 8, h: 10, c: t.isNight ? "#2A4520" : "#4A9A28" },
    { x: bx + 8, y: by + 20, w: 14, h: 8, c: t.isNight ? "#402808" : "#D86818" },
    { x: bx + 24, y: by + 20, w: 8, h: 8, c: t.isNight ? "#441820" : "#CC2222" },
    { x: bx + 8, y: by + 30, w: 10, h: 8, c: t.isNight ? "#2A3855" : "#2244BB" },
    { x: bx + 20, y: by + 30, w: 16, h: 8, c: t.isNight ? "#3A2808" : "#FFD022" },
  ];

  return (
    <g style={{ cursor: "pointer" }}
      filter={hovered ? "url(#neon)" : ""}
      onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {/* Board frame */}
      <rect x={bx} y={by} width={48} height={44} fill={wood} stroke={outline} strokeWidth="2" shapeRendering="crispEdges" />
      {/* Cork surface */}
      <rect x={bx + 4} y={by + 4} width={40} height={36} fill={cork} shapeRendering="crispEdges" />
      {/* Push pins */}
      {[[bx + 6, by + 6], [bx + 36, by + 6], [bx + 6, by + 34], [bx + 36, by + 34]].map(([px, py], i) => (
        <rect key={i} x={px} y={py} width={4} height={4} fill={t.isNight ? "#882020" : "#CC2222"} shapeRendering="crispEdges" />
      ))}
      {/* Flyers */}
      {flyers.map((f, i) => (
        <rect key={i} x={f.x} y={f.y} width={f.w} height={f.h}
          fill={f.c} stroke={outline} strokeWidth="0.5" opacity="0.9" shapeRendering="crispEdges" />
      ))}
      {/* Board outline */}
      <rect x={bx} y={by} width={48} height={44} fill="none" stroke={outline} strokeWidth="2" shapeRendering="crispEdges" />
      {/* Post */}
      <rect x={cx - 5} y={by + 44} width={10} height={32} fill={wood} stroke={outline} strokeWidth="1" shapeRendering="crispEdges" />
      {/* Base */}
      <rect x={cx - 14} y={by + 72} width={28} height={8} fill={t.isNight ? "#2A1A10" : "#B87838"} stroke={outline} strokeWidth="1" shapeRendering="crispEdges" />
    </g>
  );
}

function ChaiwalaSatll({ cx, t, hovered, onClick, onEnter, onLeave }: {
  cx: number; t: Theme; hovered: boolean;
  onClick: () => void; onEnter: () => void; onLeave: () => void;
}) {
  const bx = cx - 36;
  const by = 374 - 88; // 88px tall
  const wood = t.isNight ? "#2A1A10" : "#6E3C18";
  const woodL = t.isNight ? "#3A2818" : "#B87838";
  const aw1 = t.isNight ? "#882008" : "#FFCC22";
  const aw2 = t.isNight ? "#1A0A08" : "#E07020";
  const skin = t.isNight ? "#C08060" : "#F5C090";
  const shirt = t.isNight ? "#1A2A3A" : "#2244BB";
  const outline = t.outline;
  const teaColor = t.isNight ? "#3A2810" : "#8B4513";
  const metalColor = t.isNight ? "#2A2A3A" : "#8A8A98";

  return (
    <g style={{ cursor: "pointer" }}
      filter={hovered ? "url(#neon)" : ""}
      onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {/* Awning (stripes) */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={bx + i * 8} y={by} width={8} height={14}
          fill={i % 2 === 0 ? aw1 : aw2} shapeRendering="crispEdges" />
      ))}
      <rect x={bx} y={by} width={72} height={14} fill="none" stroke={outline} strokeWidth="1.5" shapeRendering="crispEdges" />
      {/* Awning fringe tabs */}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={bx + 6 + i * 10} y={by + 12} width={6} height={6}
          fill={aw1} stroke={outline} strokeWidth="1" shapeRendering="crispEdges" />
      ))}
      {/* Person area (behind counter) */}
      <rect x={bx + 10} y={by + 18} width={52} height={28} fill={t.isNight ? "#100A08" : "#3A1A08"} shapeRendering="crispEdges" />
      {/* Person head */}
      <rect x={cx - 10} y={by + 14} width={20} height={16} fill={skin} stroke={outline} strokeWidth="0.5" shapeRendering="crispEdges" />
      {/* Hair */}
      <rect x={cx - 10} y={by + 14} width={20} height={5} fill={t.isNight ? "#3A2818" : "#1A0800"} shapeRendering="crispEdges" />
      {/* Eyes */}
      <rect x={cx - 6} y={by + 22} width={4} height={3} fill={outline} shapeRendering="crispEdges" />
      <rect x={cx + 2} y={by + 22} width={4} height={3} fill={outline} shapeRendering="crispEdges" />
      {/* Person torso */}
      <rect x={cx - 14} y={by + 30} width={28} height={16} fill={shirt} shapeRendering="crispEdges" />
      {/* Counter top */}
      <rect x={bx} y={by + 46} width={72} height={6} fill={woodL} stroke={outline} strokeWidth="1.5" shapeRendering="crispEdges" />
      {/* Kettle (on counter) */}
      <rect x={bx + 8} y={by + 30} width={14} height={18} fill={metalColor} stroke={outline} strokeWidth="1" shapeRendering="crispEdges" />
      <rect x={bx + 10} y={by + 26} width={10} height={5} fill={metalColor} stroke={outline} strokeWidth="0.5" shapeRendering="crispEdges" />
      {/* Steam */}
      {t.isNight && (
        <>
          <rect x={bx + 13} y={by + 20} width={2} height={6} fill="white" opacity="0.3" shapeRendering="crispEdges" />
          <rect x={bx + 17} y={by + 18} width={2} height={6} fill="white" opacity="0.3" shapeRendering="crispEdges" />
        </>
      )}
      {/* Chai cups */}
      {[bx + 32, bx + 44, bx + 54].map((cx2, i) => (
        <g key={i}>
          <rect x={cx2} y={by + 36} width={8} height={10}
            fill={teaColor} stroke={outline} strokeWidth="0.5" shapeRendering="crispEdges" />
          <rect x={cx2} y={by + 34} width={8} height={4}
            fill={t.isNight ? "#1A0E08" : "#D4A040"} shapeRendering="crispEdges" />
        </g>
      ))}
      {/* Stall front */}
      <rect x={bx} y={by + 52} width={72} height={36} fill={wood} stroke={outline} strokeWidth="1.5" shapeRendering="crispEdges" />
      {/* Stall front panel decoration */}
      <rect x={bx + 4} y={by + 56} width={30} height={28} fill={woodL} opacity="0.4" shapeRendering="crispEdges" />
      <rect x={bx + 38} y={by + 56} width={30} height={28} fill={woodL} opacity="0.4" shapeRendering="crispEdges" />
    </g>
  );
}

function PranavSprite({ cx, t, hovered, onClick, onEnter, onLeave }: {
  cx: number; t: Theme; hovered: boolean;
  onClick: () => void; onEnter: () => void; onLeave: () => void;
}) {
  const bx = cx - 16;
  const by = 374 - 78;
  const skin = t.isNight ? "#C08060" : "#F5C090";
  const hair = t.isNight ? "#2A1A0A" : "#1A0800";
  const shirt = t.isNight ? "#1A2848" : "#2B44BB";
  const shirtD = t.isNight ? "#101828" : "#1A2A7A";
  const pants = t.isNight ? "#101828" : "#2A3855";
  const shoe = t.isNight ? "#0A0A10" : "#1A1A10";
  const outline = t.outline;

  return (
    <g style={{ cursor: "pointer" }}
      filter={hovered ? "url(#neon)" : ""}
      onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {/* Hair */}
      <rect x={bx + 4} y={by} width={24} height={8} fill={hair} stroke={outline} strokeWidth="0.5" shapeRendering="crispEdges" />
      {/* Head */}
      <rect x={bx + 4} y={by + 8} width={24} height={18} fill={skin} shapeRendering="crispEdges" />
      {/* Side of head */}
      <rect x={bx + 2} y={by + 10} width={4} height={12} fill={skin} shapeRendering="crispEdges" />
      <rect x={bx + 26} y={by + 10} width={4} height={12} fill={skin} shapeRendering="crispEdges" />
      {/* Ear bits */}
      <rect x={bx + 2} y={by + 12} width={3} height={6} fill={skin} shapeRendering="crispEdges" />
      <rect x={bx + 27} y={by + 12} width={3} height={6} fill={skin} shapeRendering="crispEdges" />
      {/* Eyes */}
      <rect x={bx + 8} y={by + 14} width={5} height={4} fill={outline} shapeRendering="crispEdges" />
      <rect x={bx + 19} y={by + 14} width={5} height={4} fill={outline} shapeRendering="crispEdges" />
      {/* Brows */}
      <rect x={bx + 7} y={by + 11} width={7} height={2} fill={hair} shapeRendering="crispEdges" />
      <rect x={bx + 18} y={by + 11} width={7} height={2} fill={hair} shapeRendering="crispEdges" />
      {/* Mouth */}
      <rect x={bx + 12} y={by + 22} width={8} height={2} fill={t.isNight ? "#8A5040" : "#C07050"} shapeRendering="crispEdges" />
      {/* Chin */}
      <rect x={bx + 6} y={by + 24} width={20} height={4} fill={skin} shapeRendering="crispEdges" />
      {/* Neck */}
      <rect x={bx + 11} y={by + 26} width={10} height={4} fill={skin} shapeRendering="crispEdges" />
      {/* Collar */}
      <rect x={bx + 4} y={by + 30} width={24} height={4} fill={shirt} shapeRendering="crispEdges" />
      {/* Shirt body */}
      <rect x={bx} y={by + 34} width={32} height={22} fill={shirt} shapeRendering="crispEdges" />
      {/* Shirt shadow/depth */}
      <rect x={bx + 14} y={by + 34} width={2} height={22} fill={shirtD} shapeRendering="crispEdges" />
      {/* Pocket */}
      <rect x={bx + 4} y={by + 36} width={8} height={7} fill={shirtD} stroke={shirtD} strokeWidth="0.5" shapeRendering="crispEdges" />
      {/* Left arm (hands in pockets) */}
      <rect x={bx} y={by + 34} width={4} height={22} fill={shirt} shapeRendering="crispEdges" />
      <rect x={bx} y={by + 48} width={6} height={8} fill={skin} shapeRendering="crispEdges" />
      {/* Right arm */}
      <rect x={bx + 28} y={by + 34} width={4} height={22} fill={shirt} shapeRendering="crispEdges" />
      <rect x={bx + 26} y={by + 48} width={6} height={8} fill={skin} shapeRendering="crispEdges" />
      {/* Belt */}
      <rect x={bx + 2} y={by + 56} width={28} height={4} fill={outline} shapeRendering="crispEdges" />
      {/* Pants */}
      <rect x={bx + 2} y={by + 60} width={12} height={18} fill={pants} shapeRendering="crispEdges" />
      <rect x={bx + 18} y={by + 60} width={12} height={18} fill={pants} shapeRendering="crispEdges" />
      {/* Shoes */}
      <rect x={bx} y={by + 74} width={14} height={4} fill={shoe} stroke={outline} strokeWidth="0.5" shapeRendering="crispEdges" />
      <rect x={bx + 18} y={by + 74} width={14} height={4} fill={shoe} stroke={outline} strokeWidth="0.5" shapeRendering="crispEdges" />
    </g>
  );
}

function PhotographerSprite({ cx, t, hovered, onClick, onEnter, onLeave }: {
  cx: number; t: Theme; hovered: boolean;
  onClick: () => void; onEnter: () => void; onLeave: () => void;
}) {
  const bx = cx - 20;
  const by = 374 - 58; // crouching — shorter
  const skin = t.isNight ? "#B87858" : "#F5C090";
  const hair = t.isNight ? "#2A1A0A" : "#1A0800";
  const shirt = t.isNight ? "#182818" : "#2D5520";
  const pants = t.isNight ? "#101828" : "#2A3855";
  const cameraBody = t.isNight ? "#2A2A30" : "#1A1A22";
  const cameraLens = t.isNight ? "#404050" : "#3A3A4A";
  const outline = t.outline;

  return (
    <g style={{ cursor: "pointer" }}
      filter={hovered ? "url(#neon)" : ""}
      onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {/* Crouching body */}
      {/* Legs (bent, crouching) */}
      <rect x={bx + 2} y={by + 34} width={10} height={12} fill={pants} shapeRendering="crispEdges" />
      <rect x={bx + 4} y={by + 44} width={14} height={10} fill={pants} shapeRendering="crispEdges" />
      <rect x={bx + 24} y={by + 34} width={10} height={12} fill={pants} shapeRendering="crispEdges" />
      <rect x={bx + 20} y={by + 44} width={14} height={10} fill={pants} shapeRendering="crispEdges" />
      {/* Torso (leaning forward) */}
      <rect x={bx + 4} y={by + 14} width={28} height={22} fill={shirt} shapeRendering="crispEdges" />
      {/* Head (tilted toward camera) */}
      <rect x={bx + 6} y={by} width={20} height={16} fill={skin} shapeRendering="crispEdges" />
      <rect x={bx + 6} y={by} width={20} height={5} fill={hair} shapeRendering="crispEdges" />
      {/* Eye behind camera */}
      <rect x={bx + 8} y={by + 7} width={4} height={4} fill={outline} shapeRendering="crispEdges" />
      {/* CAMERA */}
      <rect x={bx - 2} y={by + 4} width={16} height={12} fill={cameraBody} stroke={outline} strokeWidth="1" shapeRendering="crispEdges" />
      {/* Lens */}
      <rect x={bx - 4} y={by + 6} width={6} height={8} fill={cameraLens} stroke={outline} strokeWidth="1" shapeRendering="crispEdges" />
      {/* Lens glass */}
      <rect x={bx - 3} y={by + 7} width={4} height={6} fill={t.isNight ? "#1A2840" : "#2244CC"} shapeRendering="crispEdges" />
      {/* Camera grip */}
      <rect x={bx + 10} y={by + 2} width={6} height={4} fill={cameraBody} shapeRendering="crispEdges" />
      {/* Viewfinder bump */}
      <rect x={bx + 2} y={by + 2} width={8} height={4} fill={cameraBody} shapeRendering="crispEdges" />
      {/* Camera strap */}
      <rect x={bx + 12} y={by + 8} width={16} height={3} fill={t.isNight ? "#3A2818" : "#8B4513"} shapeRendering="crispEdges" />
      {/* Shoes */}
      <rect x={bx + 2} y={by + 54} width={18} height={4} fill={outline} shapeRendering="crispEdges" />
      <rect x={bx + 18} y={by + 54} width={18} height={4} fill={outline} shapeRendering="crispEdges" />
      {/* Pigeons (small, near the photographer) */}
      <rect x={cx + 28} y={by + 46} width={8} height={4} fill={t.isNight ? "#3A3A44" : "#7A7A88"} shapeRendering="crispEdges" />
      <rect x={cx + 30} y={by + 43} width={4} height={4} fill={t.isNight ? "#3A3A44" : "#7A7A88"} shapeRendering="crispEdges" />
      <rect x={cx + 42} y={by + 48} width={7} height={3} fill={t.isNight ? "#3A3A44" : "#7A7A88"} shapeRendering="crispEdges" />
    </g>
  );
}

function WadaPavStall({ cx, t, hovered, onClick, onEnter, onLeave }: {
  cx: number; t: Theme; hovered: boolean;
  onClick: () => void; onEnter: () => void; onLeave: () => void;
}) {
  const bx = cx - 32;
  const by = 374 - 86;
  const wood = t.isNight ? "#2A1A10" : "#6E3C18";
  const woodL = t.isNight ? "#3A2818" : "#B87838";
  const aw1 = t.isNight ? "#601808" : "#EE6820";
  const aw2 = t.isNight ? "#380808" : "#C84010";
  const skin = t.isNight ? "#B07050" : "#F5C090";
  const outline = t.outline;
  const foodColor = t.isNight ? "#3A2808" : "#C89038";
  const breadColor = t.isNight ? "#2A1A08" : "#D4A840";

  return (
    <g style={{ cursor: "pointer" }}
      filter={hovered ? "url(#neon)" : ""}
      onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {/* Awning stripes (orange theme) */}
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={bx + i * 8} y={by} width={8} height={14}
          fill={i % 2 === 0 ? aw1 : aw2} shapeRendering="crispEdges" />
      ))}
      <rect x={bx} y={by} width={64} height={14} fill="none" stroke={outline} strokeWidth="1.5" shapeRendering="crispEdges" />
      {/* Awning fringe */}
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={bx + 8 + i * 10} y={by + 12} width={6} height={8}
          fill={aw1} stroke={outline} strokeWidth="0.5" shapeRendering="crispEdges" />
      ))}
      {/* Stall sign */}
      <rect x={bx + 4} y={by + 20} width={56} height={12} fill={t.isNight ? "#1A0A08" : "#8B4513"} stroke={outline} strokeWidth="1" shapeRendering="crispEdges" />
      <text x={cx} y={by + 30} textAnchor="middle"
        fill={t.isNight ? "#A87030" : "#FFD040"} fontSize="6" fontFamily="'Press Start 2P'">
        WADA PAV
      </text>
      {/* Person area */}
      <rect x={bx + 8} y={by + 32} width={48} height={20} fill={t.isNight ? "#100808" : "#3A1A08"} shapeRendering="crispEdges" />
      {/* Person head */}
      <rect x={cx - 8} y={by + 30} width={16} height={14} fill={skin} stroke={outline} strokeWidth="0.5" shapeRendering="crispEdges" />
      <rect x={cx - 8} y={by + 30} width={16} height={5} fill={t.isNight ? "#2A1A0A" : "#1A0800"} shapeRendering="crispEdges" />
      {/* Counter */}
      <rect x={bx} y={by + 52} width={64} height={6} fill={woodL} stroke={outline} strokeWidth="1.5" shapeRendering="crispEdges" />
      {/* Wada Pav items on counter */}
      {[bx + 8, bx + 24, bx + 40].map((ix, i) => (
        <g key={i}>
          {/* Pav (bread) */}
          <rect x={ix} y={by + 40} width={12} height={12} fill={breadColor} stroke={outline} strokeWidth="0.5" shapeRendering="crispEdges" />
          {/* Vada (round ball) */}
          <rect x={ix + 2} y={by + 43} width={8} height={7} fill={foodColor} shapeRendering="crispEdges" />
        </g>
      ))}
      {/* Newspaper stack */}
      <rect x={bx + 48} y={by + 40} width={12} height={12} fill={t.isNight ? "#2A2018" : "#EDD8A0"} stroke={outline} strokeWidth="0.5" shapeRendering="crispEdges" />
      <rect x={bx + 49} y={by + 42} width={10} height={2} fill={t.isNight ? "#1A1210" : "#8B7A50"} shapeRendering="crispEdges" />
      <rect x={bx + 49} y={by + 46} width={10} height={2} fill={t.isNight ? "#1A1210" : "#8B7A50"} shapeRendering="crispEdges" />
      {/* Stall front */}
      <rect x={bx} y={by + 58} width={64} height={28} fill={wood} stroke={outline} strokeWidth="1.5" shapeRendering="crispEdges" />
      <rect x={bx + 4} y={by + 62} width={26} height={20} fill={woodL} opacity="0.4" shapeRendering="crispEdges" />
      <rect x={bx + 34} y={by + 62} width={26} height={20} fill={woodL} opacity="0.4" shapeRendering="crispEdges" />
    </g>
  );
}

// ─────────────────────────────────────────────
// TOOLTIP
// ─────────────────────────────────────────────
function Tooltip({ info }: { info: TooltipInfo }) {
  const charW = 7.5;
  const label = `→ ${info.dest}`;
  const tw = Math.max(label.length * charW + 16, 80);
  const tx = Math.min(Math.max(info.x - tw / 2, 4), 1000 - tw - 4);
  const ty = info.y - 36;

  return (
    <g style={{ pointerEvents: "none" }}>
      {/* Shadow */}
      <rect x={tx + 2} y={ty + 2} width={tw} height={22} fill="black" opacity="0.5" shapeRendering="crispEdges" />
      {/* Background */}
      <rect x={tx} y={ty} width={tw} height={22} fill="#111" stroke={NEON} strokeWidth="1.5" shapeRendering="crispEdges" />
      {/* Arrow */}
      <rect x={info.x - 3} y={ty + 22} width={6} height={4} fill="#111" shapeRendering="crispEdges" />
      <rect x={info.x - 1} y={ty + 26} width={2} height={2} fill="#111" shapeRendering="crispEdges" />
      {/* Text */}
      <text x={tx + tw / 2} y={ty + 15} textAnchor="middle"
        fill={NEON} fontSize="8" fontFamily="'Press Start 2P'" letterSpacing="0.5">
        {label}
      </text>
    </g>
  );
}

// ─────────────────────────────────────────────
// MAIN SCENE
// ─────────────────────────────────────────────
const PROPS = [
  { id: "bulletin", label: "Tags", dest: "/tags", x: 62 },
  { id: "chaiwala", label: "Blog", dest: "/blog", x: 192 },
  { id: "garage", label: "Projects", dest: "/projects", x: 387 },   // building
  { id: "pranav", label: "About", dest: "/about", x: 490 },
  { id: "photographer", label: "Photos", dest: "photos.pranavrathod.com", x: 548 },
  { id: "wadapav", label: "Contact", dest: "Contact overlay", x: 628 },
  { id: "office", label: "Resume", dest: "Resume PDF", x: 649 },     // building
  { id: "billboard", label: "Featured", dest: "Featured Projects", x: 863 }, // building
];

export function PixelCity() {
  const [isNight, setIsNight] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);

  const t = isNight ? NIGHT : DAY;

  const enter = useCallback((id: string) => setHovered(id), []);
  const leave = useCallback(() => setHovered(null), []);

  const handleClick = (id: string) => {
    if (id === "wadapav") {
      setShowContact(true);
    }
    // Other props: would navigate in real site
  };

  const tooltipInfo: TooltipInfo | null = hovered
    ? (() => {
        const p = PROPS.find((p) => p.id === hovered);
        if (!p) return null;
        return { x: p.x, y: 285, label: p.label, dest: p.dest };
      })()
    : null;

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        height: "100svh",
        background: t.skyTop,
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {/* Sky gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${t.skyTop} 0%, ${t.skyBot} 55%, ${t.pavement} 100%)`,
        }}
      />

      {/* Main SVG scene */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        shapeRendering="crispEdges"
      >
        <defs>
          {/* Neon glow filter */}
          <filter id="neon" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
            <feColorMatrix in="blur1" type="matrix"
              values="3 0 0 0 1  0 0 0 0 0.23  0 0 0 0 0.23  0 0 0 1.5 0" result="red1" />
            <feColorMatrix in="blur2" type="matrix"
              values="2 0 0 0 1  0 0 0 0 0.23  0 0 0 0 0.23  0 0 0 0.8 0" result="red2" />
            <feMerge>
              <feMergeNode in="red2" />
              <feMergeNode in="red1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Scanline pattern */}
          <pattern id="scanlines" x="0" y="0" width="1" height="4" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1000" height="1" fill="black" opacity={t.scanAlpha} />
          </pattern>
        </defs>

        {/* Sky */}
        <rect x={0} y={0} width={1000} height={374} fill="transparent" />

        {/* Clouds / Stars */}
        <Clouds t={t} />

        {/* ── BUILDINGS ── */}
        <BuildingB1 t={t} />
        <BuildingB2 t={t} />
        <BuildingB3Garage t={t}
          hovered={hovered === "garage"}
          onClick={() => handleClick("garage")}
          onEnter={() => enter("garage")}
          onLeave={leave}
        />
        <BuildingB4 t={t} />
        <BuildingB5Office t={t}
          hovered={hovered === "office"}
          onClick={() => handleClick("office")}
          onEnter={() => enter("office")}
          onLeave={leave}
        />
        <BuildingB6Billboard t={t}
          hovered={hovered === "billboard"}
          onClick={() => handleClick("billboard")}
          onEnter={() => enter("billboard")}
          onLeave={leave}
        />

        {/* Power lines + crows */}
        <PowerLines t={t} />

        {/* Pavement + Road */}
        <PavementAndRoad t={t} />

        {/* Street lamps */}
        <StreetLamp x={140} t={t} />
        <StreetLamp x={470} t={t} />
        <StreetLamp x={780} t={t} />

        {/* ── PROPS ── */}
        <BulletinBoard cx={62} t={t}
          hovered={hovered === "bulletin"}
          onClick={() => handleClick("bulletin")}
          onEnter={() => enter("bulletin")}
          onLeave={leave}
        />
        <ChaiwalaSatll cx={192} t={t}
          hovered={hovered === "chaiwala"}
          onClick={() => handleClick("chaiwala")}
          onEnter={() => enter("chaiwala")}
          onLeave={leave}
        />
        <PranavSprite cx={490} t={t}
          hovered={hovered === "pranav"}
          onClick={() => handleClick("pranav")}
          onEnter={() => enter("pranav")}
          onLeave={leave}
        />
        <PhotographerSprite cx={548} t={t}
          hovered={hovered === "photographer"}
          onClick={() => handleClick("photographer")}
          onEnter={() => enter("photographer")}
          onLeave={leave}
        />
        <WadaPavStall cx={628} t={t}
          hovered={hovered === "wadapav"}
          onClick={() => handleClick("wadapav")}
          onEnter={() => enter("wadapav")}
          onLeave={leave}
        />

        {/* Tooltip */}
        {tooltipInfo && <Tooltip info={tooltipInfo} />}

        {/* Scanline overlay */}
        <rect x={0} y={0} width={1000} height={600} fill="url(#scanlines)" style={{ pointerEvents: "none" }} />

        {/* Pixel vignette */}
        {t.isNight && (
          <rect x={0} y={0} width={1000} height={600}
            fill="none"
            style={{
              pointerEvents: "none",
              filter: "drop-shadow(inset 0 0 80px rgba(0,0,0,0.6))",
            }}
          />
        )}
      </svg>

      {/* ── UI OVERLAY ── */}

      {/* Day/Night toggle */}
      <button
        onClick={() => setIsNight(!isNight)}
        className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 cursor-pointer transition-all"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 9,
          background: isNight ? "#0E1530" : "#1A2A3A",
          color: isNight ? "#FFAA30" : "#88BBFF",
          border: `2px solid ${isNight ? "#FFAA30" : "#88BBFF"}`,
          boxShadow: isNight
            ? "0 0 8px rgba(255,170,48,0.4), 0 0 16px rgba(255,170,48,0.2)"
            : "0 0 8px rgba(136,187,255,0.3)",
          imageRendering: "pixelated",
        }}
      >
        <span style={{ fontSize: 12 }}>{isNight ? "☀" : "🌙"}</span>
        {isNight ? "DAY" : "NIGHT"}
      </button>

      {/* PR logo watermark */}
      <div
        className="absolute top-4 left-4 z-10"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 13,
          color: NEON,
          textShadow: `0 0 8px ${NEON}, 0 0 16px ${NEON}44`,
          letterSpacing: "0.05em",
        }}
      >
        PR
      </div>

      {/* Bottom instruction */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 7,
          color: isNight ? "rgba(200,200,180,0.4)" : "rgba(80,60,40,0.45)",
          letterSpacing: "0.12em",
          pointerEvents: "none",
        }}
      >
        HOVER TO EXPLORE · CLICK TO NAVIGATE
      </div>

      {/* Contact overlay */}
      {showContact && (
        <ContactOverlay
          onClose={() => setShowContact(false)}
          isNight={isNight}
        />
      )}
    </div>
  );
}
