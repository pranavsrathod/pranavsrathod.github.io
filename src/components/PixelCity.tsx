import { useState, useEffect, useRef, useCallback } from "react";
import { ContactOverlay } from "./ContactOverlay";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const BG_W = 1536;
const BG_H = 1024;
const PAVEMENT_Y = 952;
const WALK_MIN = 80;
const WALK_MAX = BG_W - 80;
const NEON = "#FF3B3B";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface T { isNight: boolean }

interface PropDef {
  id: string; label: string; dest: string;
  cx: number; anchorY: number;
  type: "img" | "svg-bulletin" | "svg-office" | "svg-billboard";
  imgW: number; imgH: number; // scene-space bounds
  external?: boolean; overlay?: boolean; floating?: boolean;
}

// ─────────────────────────────────────────────
// PROPS DATA
// (imgW/imgH = scene-space bounding box for each prop)
// ─────────────────────────────────────────────
const PROPS: PropDef[] = [
  { id: "bulletin",     label: "Tags",    dest: "/tags",         cx: 120,  anchorY: 955, type: "svg-bulletin",  imgW: 260,  imgH: 360 },
  { id: "chaiwala",     label: "Blog",    dest: "/blog",         cx: 330,  anchorY: 958, type: "img",           imgW: 340,  imgH: 280 },
  { id: "photographer", label: "Photos",  dest: "https://photos.pranavrathod.com", cx: 560, anchorY: 950, type: "img", imgW: 320, imgH: 200, external: true },
  { id: "garage",       label: "Projects",dest: "/projects",     cx: 900,  anchorY: 955, type: "img",           imgW: 400,  imgH: 280 },
  { id: "wadapav",      label: "Contact", dest: "contact",       cx: 1180, anchorY: 960, type: "img",           imgW: 340,  imgH: 260, overlay: true },
  { id: "office",       label: "Resume",  dest: "/Resume/Pranav_Rathod_Resume.pdf", cx: 1410, anchorY: 958, type: "svg-office", imgW: 360, imgH: 540, external: true },
  { id: "billboard",    label: "Featured",dest: "/projects",     cx: 1050, anchorY: 230, type: "svg-billboard", imgW: 440,  imgH: 260, floating: true },
];

// ─────────────────────────────────────────────
// ANIMATED EXTRAS
// ─────────────────────────────────────────────
function SteamPuffs() {
  return (
    <div style={{ position: "absolute", left: "55%", top: "5%", pointerEvents: "none" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute", left: i * 4 - 6, top: i * -3,
          width: 10, height: 10, borderRadius: "50%",
          background: "rgba(255,255,255,0.7)",
          filter: "blur(2px)",
          animation: `steam ${2 + i * 0.3}s ${i * 0.4}s infinite`,
        }}/>
      ))}
      <style>{`@keyframes steam{0%{transform:translateY(0) scale(.6);opacity:.8}100%{transform:translateY(-40px) scale(1.6);opacity:0}}`}</style>
    </div>
  );
}

function FliesBuzz() {
  return (
    <div style={{ position: "absolute", left: "45%", top: "20%", pointerEvents: "none" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute", left: 0, top: i * 4,
          width: 3, height: 3, background: "#1a0a00",
          animation: `fly${i} 1.${4 + i}s infinite`,
        }}/>
      ))}
      <style>{`
        @keyframes fly0{0%,100%{transform:translate(0,0)}25%{transform:translate(8px,-4px)}50%{transform:translate(-4px,4px)}75%{transform:translate(6px,2px)}}
        @keyframes fly1{0%,100%{transform:translate(0,0)}25%{transform:translate(-6px,3px)}50%{transform:translate(4px,-6px)}75%{transform:translate(-3px,4px)}}
        @keyframes fly2{0%,100%{transform:translate(0,0)}25%{transform:translate(5px,5px)}50%{transform:translate(-6px,-2px)}75%{transform:translate(3px,-5px)}}
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// SVG PROP COMPONENTS
// ─────────────────────────────────────────────

function BulletinBoard({ t, hovered }: { t: T; hovered: boolean }) {
  const ol = "#1a0e06";
  const wood = t.isNight ? "#2A1810" : "#6E3C18";
  const woodL = t.isNight ? "#3A2818" : "#8E5428";
  const woodD = t.isNight ? "#1A0E08" : "#3E1E08";
  const cork = t.isNight ? "#2A2218" : "#E8C888";
  const corkD = t.isNight ? "#1A1410" : "#B89848";
  const flyers = [
    { x: 60, y: 100, w: 50, h: 42, c: t.isNight ? "#223355" : "#3357AA", r: -3, title: "★ HIRE" },
    { x: 114, y: 98, w: 54, h: 36, c: t.isNight ? "#551818" : "#D43A22", r: 2, title: "BLOG" },
    { x: 172, y: 104, w: 50, h: 48, c: t.isNight ? "#2A4020" : "#55AA30", r: -2, title: "OPEN" },
    { x: 56, y: 150, w: 64, h: 36, c: t.isNight ? "#3A2808" : "#E8A030", r: 1, title: "NEWS" },
    { x: 126, y: 142, w: 46, h: 46, c: t.isNight ? "#3A2E10" : "#FFD040", r: -3, title: "MTG" },
    { x: 176, y: 160, w: 46, h: 36, c: t.isNight ? "#2A1A1E" : "#E8D8B0", r: 2, title: "LOST" },
    { x: 70, y: 196, w: 60, h: 36, c: t.isNight ? "#442830" : "#C83A5A", r: 0, title: "HELP" },
    { x: 138, y: 200, w: 74, h: 40, c: t.isNight ? "#223A55" : "#3A88E0", r: -1, title: "TAGS" },
  ];
  return (
    <svg width="100%" height="100%" viewBox="0 0 280 380" shapeRendering="crispEdges"
      style={{ filter: hovered ? "drop-shadow(0 0 24px #FF3B3B) drop-shadow(0 0 8px #FF3B3B)" : "drop-shadow(0 20px 16px rgba(0,0,0,0.4))", overflow: "visible" }}>
      <ellipse cx="140" cy="368" rx="90" ry="10" fill="#000" opacity={t.isNight ? 0.6 : 0.35} />
      <rect x="60" y="170" width="10" height="200" fill={woodD} stroke={ol} strokeWidth="2" />
      <rect x="60" y="170" width="3" height="200" fill={wood} />
      <rect x="210" y="170" width="10" height="200" fill={woodD} stroke={ol} strokeWidth="2" />
      <rect x="210" y="170" width="3" height="200" fill={wood} />
      <rect x="50" y="358" width="30" height="14" fill={woodD} stroke={ol} strokeWidth="2" />
      <rect x="200" y="358" width="30" height="14" fill={woodD} stroke={ol} strokeWidth="2" />
      <polygon points="30,70 250,70 240,50 40,50" fill={wood} stroke={ol} strokeWidth="2" />
      <rect x="30" y="70" width="220" height="8" fill={woodD} stroke={ol} strokeWidth="2" />
      <rect x="34" y="58" width="212" height="2" fill={woodL} />
      <rect x="40" y="78" width="200" height="200" fill={wood} stroke={ol} strokeWidth="3" />
      <rect x="44" y="82" width="192" height="192" fill={woodL} />
      <rect x="52" y="90" width="176" height="176" fill={cork} />
      {Array.from({ length: 50 }).map((_, i) => {
        const x = 54 + ((i * 17) % 172);
        const y = 92 + ((i * 31) % 172);
        return <rect key={i} x={x} y={y} width="2" height="2" fill={corkD} opacity="0.6" />;
      })}
      {flyers.map((f, i) => (
        <g key={i} transform={`translate(${f.x + f.w / 2},${f.y + f.h / 2}) rotate(${f.r}) translate(${-f.w / 2},${-f.h / 2})`}>
          <rect x="2" y="2" width={f.w} height={f.h} fill="#000" opacity="0.3" />
          <rect width={f.w} height={f.h} fill={f.c} stroke={ol} strokeWidth="1" />
          <text x={f.w / 2} y={14} textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="7"
            fill={t.isNight ? "#f0d880" : "#fff"} letterSpacing="1">{f.title}</text>
          <rect x="4" y="20" width={f.w - 8} height="1" fill="#000" opacity="0.4" />
          <rect x="4" y="24" width={f.w - 12} height="1" fill="#000" opacity="0.3" />
          <rect x="4" y="28" width={f.w - 8} height="1" fill="#000" opacity="0.3" />
        </g>
      ))}
      {([[60, 100], [168, 104], [60, 260], [220, 260], [170, 102]] as [number, number][]).map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill="#000" opacity="0.4" />
          <circle cx={x} cy={y - 1} r="3.5" fill={i % 2 ? "#CC2222" : "#FFCC22"} stroke={ol} strokeWidth="0.8" />
          <circle cx={x - 1} cy={y - 2} r="1" fill="#FFF" opacity="0.7" />
        </g>
      ))}
      <g style={{ animation: "pigeonBob 1.6s infinite" }}>
        <ellipse cx="180" cy="52" rx="12" ry="6" fill={t.isNight ? "#3a3a44" : "#8a8a98"} stroke={ol} strokeWidth="1" />
        <circle cx="172" cy="46" r="5" fill={t.isNight ? "#3a3a44" : "#8a8a98"} stroke={ol} strokeWidth="1" />
        <polygon points="168,46 163,45 168,48" fill="#c88040" />
        <circle cx="171" cy="45" r="1" fill="#000" />
        <rect x="180" y="58" width="1" height="4" fill={ol} />
        <rect x="184" y="58" width="1" height="4" fill={ol} />
      </g>
      <g>
        <line x1="140" y1="278" x2="140" y2="294" stroke={woodD} strokeWidth="2" />
        <rect x="104" y="294" width="72" height="26" fill={t.isNight ? "#1A0E08" : "#6E3C18"} stroke={ol} strokeWidth="2" />
        <rect x="106" y="296" width="68" height="22" fill={t.isNight ? "#3A2810" : "#E8C880"} />
        <text x="140" y="312" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="11"
          fill={t.isNight ? "#f0d880" : "#3E1E08"} letterSpacing="2">TAGS</text>
      </g>
    </svg>
  );
}

function OfficeFront({ t, hovered }: { t: T; hovered: boolean }) {
  const ol = "#0a0602";
  const stone = t.isNight ? "#3a2e20" : "#e4c488";
  const stoneD = t.isNight ? "#24180f" : "#b48850";
  const stoneL = t.isNight ? "#4a3e30" : "#f4d498";
  const brass = t.isNight ? "#b8902a" : "#e8b848";
  const brassD = t.isNight ? "#6a5018" : "#a07820";
  const door = t.isNight ? "#3a1d0c" : "#5e2e10";
  const doorGlow = t.isNight ? "#FFAA40" : "#ecd098";
  return (
    <svg width="100%" height="100%" viewBox="0 0 220 360" shapeRendering="crispEdges"
      style={{ filter: hovered ? "drop-shadow(0 0 24px #FF3B3B) drop-shadow(0 0 8px #FF3B3B)" : "drop-shadow(0 8px 14px rgba(0,0,0,0.45))", overflow: "visible" }}>
      <ellipse cx="110" cy="352" rx="100" ry="8" fill="#000" opacity={t.isNight ? 0.55 : 0.3} />
      <rect x="10" y="10" width="200" height="340" fill={stone} stroke={ol} strokeWidth="2.5" />
      {Array.from({ length: 40 }).map((_, i) => (
        <rect key={i} x={14 + ((i * 17) % 192)} y={14 + ((i * 31) % 330)} width="2" height="2" fill={stoneD} opacity="0.35" />
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={i % 2 === 0 ? 12 : 16} y={20 + i * 18} width="4" height="5"
          fill={i % 3 === 0 ? (t.isNight ? "#2a3820" : "#4aaa30") : (t.isNight ? "#1a2a12" : "#3a6b22")} />
      ))}
      <rect x="16" y="14" width="188" height="14" fill={stoneD} stroke={ol} strokeWidth="1.5" />
      {Array.from({ length: 12 }).map((_, i) => (
        <polygon key={i} points={`${22 + i * 16},28 ${30 + i * 16},16 ${38 + i * 16},28`} fill={brass} stroke={ol} strokeWidth="0.5" />
      ))}
      <rect x="70" y="50" width="80" height="70" fill={stoneD} stroke={ol} strokeWidth="2" />
      <rect x="74" y="54" width="72" height="62" fill={t.isNight ? "#FFAA40" : "#88bacc"}
        style={t.isNight ? { filter: "drop-shadow(0 0 8px #FFAA40)" } : {}} />
      <rect x="108" y="54" width="4" height="62" fill={stoneD} />
      <rect x="74" y="82" width="72" height="4" fill={stoneD} />
      <rect x="66" y="120" width="88" height="6" fill={stoneD} stroke={ol} strokeWidth="1.5" />
      <rect x="60" y="54" width="6" height="62" fill={t.isNight ? "#2a1810" : "#4e2818"} stroke={ol} strokeWidth="1" />
      <rect x="154" y="54" width="6" height="62" fill={t.isNight ? "#2a1810" : "#4e2818"} stroke={ol} strokeWidth="1" />
      <rect x="66" y="122" width="88" height="10" fill={t.isNight ? "#3a2510" : "#7a4218"} stroke={ol} strokeWidth="1.5" />
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <rect x={72 + i * 13} y="118" width="6" height="6" fill={t.isNight ? "#553a18" : "#cc5533"} />
          <rect x={74 + i * 13} y="116" width="2" height="2" fill={t.isNight ? "#aa7720" : "#ffcc00"} />
        </g>
      ))}
      <rect x="34" y="180" width="152" height="28" fill={brassD} stroke={ol} strokeWidth="2" />
      <rect x="36" y="182" width="148" height="24" fill={brass}
        style={t.isNight ? { filter: "drop-shadow(0 0 6px #e8b848)" } : {}} />
      <text x="110" y="200" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="10"
        fill={t.isNight ? "#1a0a00" : "#3E1E08"} letterSpacing="2">RATHOD & CO.</text>
      <rect x="52" y="212" width="116" height="130" fill={door} stroke={ol} strokeWidth="2" />
      <rect x="52" y="212" width="116" height="18" fill={doorGlow} stroke={ol} strokeWidth="2"
        style={t.isNight ? { filter: "drop-shadow(0 0 8px #FFAA40)" } : {}} />
      {[60, 76, 92, 108, 124, 140, 156].map(x => (
        <rect key={x} x={x} y="212" width="1.5" height="18" fill={ol} />
      ))}
      <rect x="58" y="236" width="48" height="40" fill="none" stroke={brassD} strokeWidth="1.5" />
      <rect x="114" y="236" width="48" height="40" fill="none" stroke={brassD} strokeWidth="1.5" />
      <rect x="58" y="282" width="48" height="54" fill="none" stroke={brassD} strokeWidth="1.5" />
      <rect x="114" y="282" width="48" height="54" fill="none" stroke={brassD} strokeWidth="1.5" />
      <circle cx="105" cy="290" r="2.8" fill={brass} />
      <circle cx="115" cy="290" r="2.8" fill={brass} />
      <rect x="42" y="342" width="136" height="6" fill={stoneD} stroke={ol} strokeWidth="1" />
      <rect x="36" y="348" width="148" height="4" fill={stoneD} stroke={ol} strokeWidth="1" />
      <g>
        <rect x="28" y="218" width="5" height="20" fill={brassD} stroke={ol} strokeWidth="0.5" />
        <polygon points="22,238 40,238 36,250 26,250" fill={brass} stroke={ol} strokeWidth="1" />
        {t.isNight && (
          <>
            <ellipse cx="31" cy="248" rx="22" ry="8" fill="#FFAA40" opacity="0.4" />
            <rect x="27" y="242" width="8" height="6" fill="#FFE080" style={{ animation: "bulb 2s infinite" }} />
          </>
        )}
        <rect x="187" y="218" width="5" height="20" fill={brassD} stroke={ol} strokeWidth="0.5" />
        <polygon points="180,238 198,238 194,250 184,250" fill={brass} stroke={ol} strokeWidth="1" />
        {t.isNight && (
          <>
            <ellipse cx="189" cy="248" rx="22" ry="8" fill="#FFAA40" opacity="0.4" />
            <rect x="185" y="242" width="8" height="6" fill="#FFE080" style={{ animation: "bulb 2.2s infinite" }} />
          </>
        )}
      </g>
      <g transform="translate(165,158)">
        <rect x="0" y="0" width="28" height="16" fill={t.isNight ? "#1a0808" : "#c83820"} stroke={ol} strokeWidth="1.5" />
        <text x="14" y="11" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="5"
          fill={t.isNight ? "#ff6040" : "#ffe880"} letterSpacing="1">OPEN</text>
        <line x1="14" y1="-8" x2="14" y2="0" stroke={ol} strokeWidth="1" />
      </g>
    </svg>
  );
}

function RooftopBillboard({ t, hovered }: { t: T; hovered: boolean }) {
  const ol = "#0a0602";
  const metal = t.isNight ? "#1a1a2a" : "#2a2030";
  const bulbC = t.isNight ? "#FFE880" : "#e0b040";
  const board = t.isNight ? "#1a2850" : "#f4e8c0";
  const ink = t.isNight ? "#FF3B3B" : "#8B2A20";
  const accent = t.isNight ? "#FFE880" : "#3E1E08";
  return (
    <svg width="100%" height="100%" viewBox="0 0 440 260" shapeRendering="crispEdges"
      style={{ filter: hovered ? "drop-shadow(0 0 28px #FF3B3B)" : "drop-shadow(0 16px 24px rgba(0,0,0,0.6))", overflow: "visible" }}>
      <rect x="40" y="150" width="8" height="100" fill={metal} stroke={ol} strokeWidth="1.5" />
      <rect x="392" y="150" width="8" height="100" fill={metal} stroke={ol} strokeWidth="1.5" />
      <line x1="48" y1="150" x2="392" y2="250" stroke={metal} strokeWidth="2" />
      <line x1="48" y1="250" x2="392" y2="150" stroke={metal} strokeWidth="2" />
      <rect x="40" y="200" width="360" height="6" fill={metal} stroke={ol} strokeWidth="1.5" />
      <rect x="16" y="20" width="408" height="140" fill={metal} stroke={ol} strokeWidth="3" />
      <rect x="28" y="32" width="384" height="116" fill={board} stroke={ol} strokeWidth="2" />
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={`t${i}`} x={30 + i * 20} y="24" width="6" height="6" fill={bulbC}
          style={t.isNight ? { animation: `bulb ${1.2 + (i % 3) * 0.3}s ${(i % 5) * 0.1}s infinite` } : {}} />
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={`b${i}`} x={30 + i * 20} y="150" width="6" height="6" fill={bulbC}
          style={t.isNight ? { animation: `bulb ${1.2 + (i % 3) * 0.3}s ${(i % 5) * 0.13}s infinite` } : {}} />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i}>
          <rect x="20" y={36 + i * 18} width="6" height="6" fill={bulbC}
            style={t.isNight ? { animation: `bulb ${1.2 + (i % 3) * 0.3}s ${(i % 5) * 0.17}s infinite` } : {}} />
          <rect x="414" y={36 + i * 18} width="6" height="6" fill={bulbC}
            style={t.isNight ? { animation: `bulb ${1.2 + (i % 3) * 0.3}s ${(i % 5) * 0.21}s infinite` } : {}} />
        </g>
      ))}
      <text x="220" y="68" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="10" letterSpacing="3" fill={accent}>
        NOW FEATURING
      </text>
      <rect x="60" y="76" width="320" height="2" fill={accent} />
      <text x="220" y="108" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="18" letterSpacing="3"
        fill={ink} style={t.isNight ? { filter: "drop-shadow(0 0 8px #FF3B3B)" } : {}}>
        URBAN RENDERER
      </text>
      <text x="220" y="134" textAnchor="middle" fontFamily="'VT323', monospace" fontSize="18" letterSpacing="3" fill={accent}>
        ★ featured ★
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────
// PRANAV SPRITE — walking + idle
// ─────────────────────────────────────────────
function PranavSprite({ facing, mode, t, hovered }: {
  facing: number; mode: "idle" | "walk"; t: T; hovered: boolean
}) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (mode !== "walk") { setFrame(0); return; }
    const id = setInterval(() => setFrame(f => (f + 1) % 4), 130);
    return () => clearInterval(id);
  }, [mode]);

  const skin = t.isNight ? "#c88868" : "#ecb48a";
  const skinD = t.isNight ? "#9a6848" : "#c48860";
  const hair = t.isNight ? "#1a0c04" : "#1a0800";
  const hairH = t.isNight ? "#3a2010" : "#5a3018";
  const shirt = t.isNight ? "#28406a" : "#4478cc";
  const shirtD = t.isNight ? "#1a2a4a" : "#2a548a";
  const shirtH = t.isNight ? "#385078" : "#5888dd";
  const pants = t.isNight ? "#2a1e10" : "#5a3a20";
  const pantsD = t.isNight ? "#180e04" : "#3a2414";
  const shoe = "#0a0606";
  const shoeW = t.isNight ? "#c8b8a0" : "#e8dcc0";

  const legL = mode === "walk" ? [0, -4, 0, 4][frame] : 0;
  const legR = mode === "walk" ? [0, 4, 0, -4][frame] : 0;
  const armL = mode === "walk" ? [0, 3, 0, -3][frame] : 0;
  const armR = mode === "walk" ? [0, -3, 0, 3][frame] : 0;
  const bodyBob = mode === "walk" ? [0, -2, 0, -2][frame] : 0;

  const idleAnim = mode === "idle" ? "breathe 2.8s ease-in-out infinite" : "none";

  return (
    <svg width="120" height="180" viewBox="-60 -170 120 180" shapeRendering="crispEdges"
      style={{ filter: hovered ? `drop-shadow(0 0 18px ${NEON})` : "drop-shadow(0 2px 3px rgba(0,0,0,0.5))", overflow: "visible" }}>
      <ellipse cx="0" cy="-2" rx="22" ry="5" fill="#000" opacity={t.isNight ? 0.55 : 0.35} />
      <g transform={`scale(${facing},1)`}>
        <g transform={`translate(0,${bodyBob})`} style={{ animation: idleAnim, transformOrigin: "center bottom" }}>
          <rect x="-14" y="-50" width="12" height={36 + Math.abs(legL)} fill={pants} stroke="#000" strokeWidth="0.5" />
          <rect x="-14" y="-50" width="3" height={36 + Math.abs(legL)} fill={pantsD} />
          <rect x="-14" y={-50 + 30 + legL} width="12" height="6" fill={pantsD} />
          <rect x="2" y="-50" width="12" height={36 + Math.abs(legR)} fill={pants} stroke="#000" strokeWidth="0.5" />
          <rect x="2" y="-50" width="3" height={36 + Math.abs(legR)} fill={pantsD} />
          <rect x="2" y={-50 + 30 + legR} width="12" height="6" fill={pantsD} />
          <rect x="-16" y={-18 + legL} width="16" height="7" fill={shoe} stroke="#000" strokeWidth="0.5" />
          <rect x="-16" y={-14 + legL} width="16" height="3" fill={shoeW} />
          <rect x="0" y={-18 + legR} width="16" height="7" fill={shoe} stroke="#000" strokeWidth="0.5" />
          <rect x="0" y={-14 + legR} width="16" height="3" fill={shoeW} />
          <rect x="-15" y="-52" width="30" height="4" fill="#0a0606" stroke="#000" strokeWidth="0.5" />
          <rect x="0" y="-51" width="2" height="2" fill="#c89030" />
          <rect x="-15" y="-88" width="30" height="36" fill={shirt} stroke="#000" strokeWidth="0.8" />
          <rect x="8" y="-88" width="7" height="36" fill={shirtD} />
          <rect x="-15" y="-88" width="4" height="36" fill={shirtH} opacity="0.8" />
          <polygon points="-6,-88 6,-88 0,-80" fill={skinD} stroke="#000" strokeWidth="0.5" />
          <polygon points="-4,-88 4,-88 0,-82" fill={skin} />
          <rect x="-0.5" y="-80" width="1" height="26" fill={shirtD} />
          <rect x="-11" y="-76" width="8" height="8" fill="none" stroke={shirtD} strokeWidth="0.7" />
          <rect x="-17" y="-88" width="4" height="14" fill={shirtD} stroke="#000" strokeWidth="0.5" />
          <rect x="13" y="-88" width="4" height="14" fill={shirtD} stroke="#000" strokeWidth="0.5" />
          <g transform={`translate(${armL},0)`}>
            <rect x="-20" y="-74" width="8" height="22" fill={shirt} stroke="#000" strokeWidth="0.5" />
            <rect x="-20" y="-74" width="2" height="22" fill={shirtH} />
            <rect x="-18" y="-55" width="6" height="3" fill={shirtD} />
            <rect x="-19" y="-53" width="6" height="7" fill={skin} stroke="#000" strokeWidth="0.5" />
            <rect x="-19" y="-49" width="6" height="3" fill={skinD} />
          </g>
          <g transform={`translate(${armR},0)`}>
            <rect x="12" y="-74" width="8" height="22" fill={shirt} stroke="#000" strokeWidth="0.5" />
            <rect x="16" y="-74" width="4" height="22" fill={shirtD} />
            <rect x="12" y="-55" width="8" height="3" fill={shirtD} />
            <rect x="13" y="-53" width="6" height="7" fill={skin} stroke="#000" strokeWidth="0.5" />
            <rect x="13" y="-49" width="6" height="3" fill={skinD} />
          </g>
          <rect x="-5" y="-94" width="10" height="6" fill={skinD} stroke="#000" strokeWidth="0.3" />
          <rect x="-11" y="-114" width="22" height="20" fill={skin} stroke="#000" strokeWidth="0.8" />
          <rect x="7" y="-112" width="4" height="17" fill={skinD} opacity="0.6" />
          <rect x="-13" y="-107" width="2" height="6" fill={skin} stroke="#000" strokeWidth="0.3" />
          <rect x="11" y="-107" width="2" height="6" fill={skin} stroke="#000" strokeWidth="0.3" />
          <rect x="-11" y="-120" width="22" height="8" fill={hair} />
          <polygon points="-11,-114 -13,-110 -11,-107" fill={hair} />
          <polygon points="11,-114 13,-110 11,-107" fill={hair} />
          <rect x="-8" y="-123" width="4" height="3" fill={hair} />
          <rect x="-2" y="-124" width="5" height="4" fill={hair} />
          <rect x="5" y="-122" width="4" height="3" fill={hair} />
          <rect x="-6" y="-119" width="3" height="1" fill={hairH} />
          <rect x="2" y="-120" width="3" height="1" fill={hairH} />
          <rect x="-10" y="-112" width="8" height="3" fill={hair} />
          <rect x="3" y="-112" width="6" height="3" fill={hair} />
          <rect x="-8" y="-108" width="5" height="1.5" fill={hair} />
          <rect x="3" y="-108" width="5" height="1.5" fill={hair} />
          <rect x="-7" y="-106" width="3" height="3" fill="#ffffff" />
          <rect x="-6" y="-106" width="2" height="2" fill="#1a0a00" />
          <rect x="4" y="-106" width="3" height="3" fill="#ffffff" />
          <rect x="5" y="-106" width="2" height="2" fill="#1a0a00" />
          <rect x="-1" y="-102" width="2" height="3" fill={skinD} />
          <rect x="-3" y="-98" width="6" height="1.3" fill="#8e4a30" />
          <rect x="-2" y="-97" width="4" height="0.8" fill="#c08060" />
        </g>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────
// TOOLTIP
// ─────────────────────────────────────────────
function Tooltip({ label, dest, x, y }: { label: string; dest: string; x: number; y: number }) {
  return (
    <div style={{
      position: "absolute",
      left: x, top: y,
      transform: "translate(-50%, -100%)",
      background: "#0b0b12",
      color: NEON,
      border: `2px solid ${NEON}`,
      padding: "6px 10px",
      fontFamily: "'Press Start 2P', monospace",
      fontSize: 9,
      letterSpacing: 1,
      pointerEvents: "none",
      whiteSpace: "nowrap",
      boxShadow: `0 0 14px rgba(255,59,59,0.55), 0 0 28px rgba(255,59,59,0.25)`,
      zIndex: 50,
      marginBottom: 8,
    }}>
      → {label}
      <span style={{ display: "block", color: "#f0e8c8", fontSize: 7, marginTop: 4, letterSpacing: 0.5 }}>
        {dest}
      </span>
      <div style={{
        position: "absolute", left: "50%", bottom: -7,
        transform: "translateX(-50%)",
        width: 0, height: 0,
        borderLeft: "6px solid transparent",
        borderRight: "6px solid transparent",
        borderTop: `7px solid ${NEON}`,
      }}/>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export function PixelCity() {
  const [isNight, setIsNight] = useState(() =>
    typeof window !== "undefined" ? document.documentElement.classList.contains("dark") : false
  );
  const [hovered, setHovered] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [flash, setFlash] = useState(false);

  // Viewport
  const [vw, setVw] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1400);
  const [vh, setVh] = useState(() => typeof window !== "undefined" ? window.innerHeight : 800);
  useEffect(() => {
    const onR = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  // Camera
  const [cam, setCam] = useState(0);
  const scale = Math.min(vh / BG_H, vw / BG_W);
  const scaledW = BG_W * scale;
  const scaledH = BG_H * scale;
  const camMax = Math.max(0, scaledW - vw);

  // Sprite
  const [spriteX, setSpriteX] = useState(700);
  const [spriteFacing, setSpriteFacing] = useState(1);
  const [spriteMode, setSpriteMode] = useState<"idle" | "walk">("idle");
  const walkTargetRef = useRef<number | null>(null);
  const onArriveRef = useRef<(() => void) | null>(null);

  // Walk loop
  useEffect(() => {
    if (spriteMode !== "walk") return;
    let raf: number;
    const step = () => {
      setSpriteX(prev => {
        const tgt = walkTargetRef.current;
        if (tgt == null) return prev;
        const dx = tgt - prev;
        if (Math.abs(dx) < 4) {
          walkTargetRef.current = null;
          setSpriteMode("idle");
          const cb = onArriveRef.current;
          onArriveRef.current = null;
          if (cb) setTimeout(cb, 100);
          return tgt;
        }
        const dir = Math.sign(dx);
        setSpriteFacing(dir);
        return prev + dir * 6;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [spriteMode]);

  // Camera follow
  useEffect(() => {
    const target = spriteX * scale - vw / 2;
    const clamped = Math.max(0, Math.min(camMax, target));
    let raf: number;
    const step = () => {
      setCam(prev => {
        const dx = clamped - prev;
        if (Math.abs(dx) < 0.5) return clamped;
        return prev + dx * 0.1;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [spriteX, scale, vw, camMax]);

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (showContact) { if (e.key === "Escape") setShowContact(false); return; }
      if (e.key === "ArrowLeft" || e.key === "a") setSpriteX(x => Math.max(WALK_MIN, x - 60));
      if (e.key === "ArrowRight" || e.key === "d") setSpriteX(x => Math.min(WALK_MAX, x + 60));
      if (e.key === "n" || e.key === "N") toggleTheme();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [showContact]);

  // Theme sync
  useEffect(() => {
    const obs = new MutationObserver(() => setIsNight(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const toggleTheme = () => {
    const next = !isNight;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const walkTo = useCallback((x: number, onArrive?: () => void) => {
    walkTargetRef.current = Math.max(WALK_MIN, Math.min(WALK_MAX, x));
    onArriveRef.current = onArrive ?? null;
    setSpriteMode("walk");
  }, []);

  const handlePropClick = useCallback((p: PropDef) => {
    const side = p.cx > spriteX ? -1 : 1;
    const walkTarget = p.cx + side * Math.max(60, p.imgW / 3);
    walkTo(walkTarget, () => {
      setSpriteFacing(p.cx > spriteX ? 1 : -1);
      if (p.overlay) { setShowContact(true); return; }
      if (p.id === "photographer") {
        setFlash(true);
        setTimeout(() => setFlash(false), 360);
        setTimeout(() => {
          window.open(p.dest, "_blank", "noreferrer");
        }, 280);
        return;
      }
      if (p.external) { window.open(p.dest, "_blank", "noreferrer"); return; }
      window.location.href = p.dest;
    });
  }, [spriteX, walkTo]);

  const onSceneMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showContact) return;
    const el = e.target as HTMLElement;
    if (el.closest("[data-prop]")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xInScene = (e.clientX - rect.left + cam) / scale;
    if (xInScene < WALK_MIN || xInScene > WALK_MAX) return;
    walkTo(xInScene);
  };

  const t: T = { isNight };
  const bgSrc = isNight ? "/pixel-city/city-night.png" : "/pixel-city/city-day.png";

  // Tooltip screen coords
  const hovProp = hovered ? PROPS.find(p => p.id === hovered) : null;
  const tooltipX = hovProp
    ? (vw - scaledW) / 2 - cam + hovProp.cx * scale
    : 0;
  const tooltipY = hovProp
    ? (vh - scaledH) / 2 + (hovProp.anchorY - (hovProp.floating ? 0 : 180)) * scale
    : 0;

  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      position: "relative",
      background: isNight ? "#0a0a1a" : "#88bacc",
      cursor: spriteMode === "walk" ? "progress" : "default",
      userSelect: "none",
    }}>
      {/* ── SCENE ── */}
      <div
        onMouseDown={onSceneMouseDown}
        style={{
          position: "absolute",
          left: (vw - scaledW) / 2 - cam,
          top: (vh - scaledH) / 2,
          width: scaledW,
          height: scaledH,
        }}
      >
        {/* Background */}
        <img src={bgSrc} alt="" draggable={false} style={{
          position: "absolute", left: 0, top: 0,
          width: scaledW, height: scaledH,
          imageRendering: "pixelated",
          pointerEvents: "none", userSelect: "none",
        }} />

        {/* Night tint */}
        {isNight && (
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 30%, rgba(50,40,90,0.08) 0%, rgba(10,10,30,0.4) 100%)",
            pointerEvents: "none",
          }}/>
        )}

        {/* ── IMAGE PROPS (full-scene overlays with crop + edge mask) ── */}
        {PROPS.filter(p => p.type === "img").map(p => {
          const src = isNight ? `/pixel-city/${p.id}-night.png` : `/pixel-city/${p.id}-day.png`;
          const propLeft = (p.cx - p.imgW / 2) * scale;
          const propTop = (p.anchorY - p.imgH) * scale;
          const isHov = hovered === p.id;

          // edge softening mask (relative to the crop div)
          const edgeMask =
            p.id === "photographer"
              ? "radial-gradient(ellipse 72% 88% at 50% 92%, black 42%, transparent 100%)"
              : [
                  "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                  "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
                ].join(", ");

          return (
            <div
              key={p.id}
              data-prop={p.id}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => { e.stopPropagation(); handlePropClick(p); }}
              style={{
                position: "absolute",
                left: propLeft,
                top: propTop,
                width: p.imgW * scale,
                height: p.imgH * scale,
                backgroundImage: `url(${src})`,
                backgroundSize: `${scaledW}px ${scaledH}px`,
                backgroundPosition: `-${propLeft}px -${propTop}px`,
                backgroundRepeat: "no-repeat",
                maskImage: edgeMask,
                WebkitMaskImage: edgeMask,
                maskComposite: p.id !== "photographer" ? "intersect" : "auto",
                WebkitMaskComposite: p.id !== "photographer" ? "source-in" : "auto",
                imageRendering: "pixelated",
                cursor: "pointer",
                zIndex: 10,
                filter: isHov
                  ? `drop-shadow(0 0 18px ${NEON}) drop-shadow(0 0 8px ${NEON}) brightness(1.08)`
                  : undefined,
              }}
            >
              {p.id === "chaiwala" && <SteamPuffs />}
              {p.id === "wadapav" && !isNight && <FliesBuzz />}
            </div>
          );
        })}

        {/* ── SVG PROPS ── */}
        {PROPS.filter(p => p.type !== "img").map(p => {
          const left = (p.cx - p.imgW / 2) * scale;
          const top = (p.anchorY - p.imgH) * scale;
          const isHov = hovered === p.id;
          return (
            <div
              key={p.id}
              data-prop={p.id}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => { e.stopPropagation(); handlePropClick(p); }}
              style={{
                position: "absolute",
                left, top,
                width: p.imgW * scale,
                height: p.imgH * scale,
                zIndex: p.floating ? 5 : 10,
                cursor: "pointer",
              }}
            >
              {p.type === "svg-bulletin" && <BulletinBoard t={t} hovered={isHov} />}
              {p.type === "svg-office" && <OfficeFront t={t} hovered={isHov} />}
              {p.type === "svg-billboard" && <RooftopBillboard t={t} hovered={isHov} />}
            </div>
          );
        })}

        {/* ── PRANAV SPRITE ── */}
        <div
          data-prop="pranav"
          onMouseEnter={() => setHovered("pranav")}
          onMouseLeave={() => setHovered(null)}
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = "/about";
          }}
          style={{
            position: "absolute",
            left: (spriteX - 60) * scale,
            top: (PAVEMENT_Y - 168) * scale,
            width: 120 * scale,
            height: 180 * scale,
            zIndex: 20,
            cursor: "pointer",
          }}
        >
          <PranavSprite
            facing={spriteFacing}
            mode={spriteMode}
            t={t}
            hovered={hovered === "pranav"}
          />
        </div>
      </div>

      {/* ── SCANLINES ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0 2px, rgba(0,0,0,0.06) 2px 3px)",
        mixBlendMode: "multiply",
        zIndex: 60,
      }}/>

      {/* ── VIGNETTE ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        boxShadow: "inset 0 0 180px rgba(0,0,0,0.55), inset 0 0 60px rgba(0,0,0,0.35)",
        zIndex: 61,
      }}/>

      {/* ── CAMERA FLASH ── */}
      {flash && (
        <div style={{
          position: "fixed", inset: 0, background: "white",
          zIndex: 400, pointerEvents: "none",
          animation: "flashAnim 0.35s ease-out forwards",
        }}/>
      )}

      {/* ── PAN HINTS ── */}
      {cam > 2 && (
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: 0, width: 80,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(255,255,255,0.25)", fontSize: 20,
          background: "linear-gradient(to right, rgba(0,0,0,0.35), transparent)",
          fontFamily: "'Press Start 2P', monospace",
          zIndex: 30, pointerEvents: "none",
        }}>‹</div>
      )}
      {cam < camMax - 2 && (
        <div style={{
          position: "absolute", top: 0, bottom: 0, right: 0, width: 80,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(255,255,255,0.25)", fontSize: 20,
          background: "linear-gradient(to left, rgba(0,0,0,0.35), transparent)",
          fontFamily: "'Press Start 2P', monospace",
          zIndex: 30, pointerEvents: "none",
        }}>›</div>
      )}

      {/* ── TOOLTIP ── */}
      {hovProp && hovered !== "pranav" && (
        <Tooltip label={hovProp.label} dest={hovProp.dest} x={tooltipX} y={tooltipY} />
      )}

      {/* ── TOP CHROME LEFT ── */}
      <div style={{
        position: "fixed", top: 16, left: 16,
        display: "flex", gap: 8, zIndex: 70, alignItems: "center",
      }}>
        <div style={{
          width: 36, height: 36,
          border: "2px solid #f0e8c8",
          background: "rgba(10,14,28,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10, color: "#f0e8c8",
        }}>PR</div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 9, letterSpacing: 1,
          color: "#f0e8c8",
          padding: "10px 0",
          textShadow: "0 1px 3px rgba(0,0,0,0.6)",
        }}>
          PIXEL CITY<br/>
          <span style={{ fontSize: 6, color: "rgba(240,232,200,0.5)", letterSpacing: 2 }}>
            CLICK TO WALK · VISIT PROPS · N NIGHT
          </span>
        </div>
      </div>

      {/* ── TOP CHROME RIGHT ── */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 70 }}>
        <button
          onClick={toggleTheme}
          style={{
            background: "rgba(10,14,28,0.85)",
            color: "#f0e8c8",
            border: "2px solid #f0e8c8",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9, padding: "8px 12px",
            cursor: "pointer", letterSpacing: 1,
            backdropFilter: "blur(4px)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = NEON;
            (e.currentTarget as HTMLButtonElement).style.color = NEON;
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 10px rgba(255,59,59,0.45)`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#f0e8c8";
            (e.currentTarget as HTMLButtonElement).style.color = "#f0e8c8";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
          }}
        >
          {isNight ? "☀ DAY" : "☾ NIGHT"}
        </button>
      </div>

      {/* ── MINIMAP ── */}
      <div style={{
        position: "absolute",
        height: 14,
        left: 60, right: 60, bottom: 16,
        zIndex: 40, pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", inset: "5px 0",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}/>
        {PROPS.map(p => {
          const pct = (p.cx / BG_W) * 100;
          return (
            <div key={p.id} title={p.label} style={{
              position: "absolute", left: `calc(${pct}% - 3px)`, top: 2,
              width: 6, height: 10,
              background: hovered === p.id ? NEON : "rgba(240,232,200,0.8)",
              border: "1px solid #000",
            }}/>
          );
        })}
        <div style={{
          position: "absolute", top: 0, bottom: 0,
          background: "rgba(255,59,59,0.25)",
          border: `1px solid ${NEON}`,
          left: `${(cam / Math.max(scaledW, 1)) * 100}%`,
          width: `${(vw / Math.max(scaledW, 1)) * 100}%`,
        }}/>
        <div style={{
          position: "absolute", top: -3,
          width: 8, height: 20,
          background: "#f0e8c8",
          border: "1px solid #000",
          left: `calc(${(spriteX / BG_W) * 100}% - 4px)`,
        }}/>
      </div>

      {/* ── HINT ── */}
      <div style={{
        position: "fixed", bottom: 34, left: "50%", transform: "translateX(-50%)",
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 8, color: "rgba(240,232,200,0.55)",
        letterSpacing: 1, zIndex: 40, pointerEvents: "none",
        textAlign: "center", lineHeight: 1.8,
      }}>
        <span style={{ display: "inline-block", padding: "2px 5px", border: "1px solid rgba(240,232,200,0.4)", borderRadius: 2, margin: "0 2px" }}>←</span>
        <span style={{ display: "inline-block", padding: "2px 5px", border: "1px solid rgba(240,232,200,0.4)", borderRadius: 2, margin: "0 2px" }}>→</span>
        {" "}walk ·{" "}
        <span style={{ display: "inline-block", padding: "2px 5px", border: "1px solid rgba(240,232,200,0.4)", borderRadius: 2, margin: "0 2px" }}>click</span>
        {" "}prop to visit ·{" "}
        <span style={{ display: "inline-block", padding: "2px 5px", border: "1px solid rgba(240,232,200,0.4)", borderRadius: 2, margin: "0 2px" }}>N</span>
        {" "}night ·{" "}
        <span style={{ display: "inline-block", padding: "2px 5px", border: "1px solid rgba(240,232,200,0.4)", borderRadius: 2, margin: "0 2px" }}>ESC</span>
        {" "}close
      </div>

      {/* ── KEYFRAMES ── */}
      <style>{`
        @keyframes breathe { 0%,100%{transform:translateY(0) scaleY(1)} 50%{transform:translateY(-0.5px) scaleY(1.015)} }
        @keyframes pigeonBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-1px)} }
        @keyframes bulb { 0%,100%{opacity:1;filter:drop-shadow(0 0 4px #FFE880)} 50%{opacity:.75;filter:drop-shadow(0 0 1px #FFE880)} }
        @keyframes flashAnim { 0%{opacity:0} 8%{opacity:1} 100%{opacity:0} }
      `}</style>

      {/* ── CONTACT OVERLAY ── */}
      {showContact && (
        <ContactOverlay onClose={() => setShowContact(false)} isNight={isNight} />
      )}
    </div>
  );
}
