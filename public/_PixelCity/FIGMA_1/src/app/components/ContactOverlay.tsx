import { useEffect } from "react";

interface ContactOverlayProps {
  onClose: () => void;
  isNight: boolean;
}

export function ContactOverlay({ onClose, isNight }: ContactOverlayProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const NEON = "#FF3B3B";

  const links = [
    { icon: "✉", label: "EMAIL", value: "pranav@pranavrathod.com", href: "mailto:pranav@pranavrathod.com" },
    { icon: "in", label: "LINKEDIN", value: "linkedin.com/in/pranavrathod", href: "https://linkedin.com/in/pranavrathod" },
    { icon: "⌥", label: "GITHUB", value: "github.com/pranavrathod", href: "https://github.com/pranavrathod" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)", fontFamily: "'Press Start 2P', monospace" }}
      onClick={onClose}
    >
      {/* Newspaper wrap */}
      <div
        className="relative flex flex-col md:flex-row items-stretch"
        style={{
          maxWidth: 780,
          width: "90vw",
          background: isNight ? "#1a1a0e" : "#f0e8c8",
          border: `3px solid ${isNight ? "#3a3830" : "#8a7a50"}`,
          boxShadow: `0 0 40px rgba(0,0,0,0.8), 0 0 80px rgba(0,0,0,0.4)`,
          imageRendering: "pixelated",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Pixel wada pav illustration */}
        <div
          className="flex items-center justify-center p-8"
          style={{
            minWidth: 220,
            background: isNight ? "#141410" : "#e8e0b0",
            borderRight: `3px solid ${isNight ? "#3a3830" : "#8a7a50"}`,
          }}
        >
          <WadaPavPixelArt isNight={isNight} />
        </div>

        {/* Right: Classified ad */}
        <div className="flex-1 p-6 flex flex-col gap-4">
          {/* Newspaper masthead */}
          <div
            style={{
              borderBottom: `2px solid ${isNight ? "#5a5030" : "#3a2a10"}`,
              paddingBottom: 8,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: isNight ? "#6a6040" : "#5a4a20",
                letterSpacing: "0.15em",
                marginBottom: 4,
              }}
            >
              THE MUMBAI HERALD · CLASSIFIEDS
            </div>
            <div
              style={{
                fontSize: 14,
                color: isNight ? "#f0d860" : "#1a1000",
                letterSpacing: "0.08em",
                textShadow: isNight ? `0 0 12px rgba(255,220,80,0.5)` : "none",
              }}
            >
              CONTACT ME
            </div>
          </div>

          {/* Classified body text */}
          <div
            style={{
              fontSize: 7,
              color: isNight ? "#8a8060" : "#4a3a18",
              lineHeight: 2,
              marginBottom: 8,
            }}
          >
            SEEKING CONNECTIONS IN DESIGN,
            <br />
            ENGINEERING & CREATIVE WORK.
            <br />
            REACH OUT VIA ANY CHANNEL BELOW.
          </div>

          {/* Contact rows */}
          <div className="flex flex-col gap-2">
            {links.map(({ icon, label, value, href }) => (
              <ContactRow
                key={label}
                icon={icon}
                label={label}
                value={value}
                href={href}
                isNight={isNight}
                neon={NEON}
              />
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: 12,
              borderTop: `1px solid ${isNight ? "#3a3020" : "#8a7a50"}`,
              fontSize: 6,
              color: isNight ? "#504830" : "#8a7a50",
              lineHeight: 2,
            }}
          >
            © PRANAV RATHOD · EST. MUMBAI
            <br />
            CLICK OUTSIDE TO CLOSE
          </div>
        </div>

        {/* Corner fold decoration */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "0 24px 24px 0",
            borderColor: `transparent ${isNight ? "#2a2820" : "#c8b880"} transparent transparent`,
          }}
        />
      </div>
    </div>
  );
}

function ContactRow({
  icon, label, value, href, isNight, neon,
}: {
  icon: string; label: string; value: string; href: string; isNight: boolean; neon: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 cursor-pointer no-underline"
      style={{ textDecoration: "none" }}
    >
      <div
        className="group-hover:opacity-100"
        style={{
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          background: isNight ? "#2a2820" : "#d8c888",
          border: `2px solid ${isNight ? "#4a4030" : "#8a7a50"}`,
          color: isNight ? "#c0b060" : "#3a2a10",
          flexShrink: 0,
          transition: "all 0.1s",
        }}
      >
        {icon}
      </div>
      <div
        className="flex-1 py-1 px-2 transition-all"
        style={{
          background: "transparent",
          border: `2px solid transparent`,
        }}
      >
        <div style={{ fontSize: 7, color: isNight ? "#5a5030" : "#8a7a50", marginBottom: 2 }}>
          {label}
        </div>
        <div
          className="group-hover:text-current"
          style={{
            fontSize: 8,
            color: isNight ? "#d0c070" : "#2a1a08",
          }}
        >
          {value}
        </div>
      </div>
      <style>{`
        a:hover > div:first-child {
          border-color: ${neon} !important;
          box-shadow: 0 0 8px ${neon}, 0 0 16px ${neon}44;
        }
        a:hover > div:last-child {
          border-color: ${neon} !important;
          box-shadow: 0 0 8px ${neon}44;
        }
      `}</style>
    </a>
  );
}

function WadaPavPixelArt({ isNight }: { isNight: boolean }) {
  const s = 5;

  const palette: Record<string, string> = {
    K: "#111111",
    W: "#F0E8D0",
    B: "#D4A830",
    Y: "#F5D050",
    N: "#8B5A2B",
    C: "#C89040",
    G: "#4A7828",
    R: "#CC3322",
    L: "#E0D8B8",
    M: "#C0B888",
    P: "#E8D090",
    E: "#F5EDD0",
    S: "#3A3020",
  };

  const grid = [
    "___KKKKKKKKK___",
    "__KBBBBBBBBBBK_",
    "_KBBBBBBBBBBBK_",
    "_KYYBBBBBBBYYK_",
    "__KBBBBBBBBBK__",
    "___KKKKKKKKK___",
    "___KPPPPPPK____",
    "__KPPPPPPPPPK__",
    "_KPPPPPPPPPPPPK",
    "_KEPPLPPPPLPPEK",
    "_KPPPPPPPPPPPEK",
    "KKPPPPPPPPPPPKK",
    "KSSSSSSSSSSSSSK",
    "KSSSSSSSSSSSSSK",
    "_______________",
  ];

  const nightPalette = {
    ...palette,
    W: "#E0D8C0",
    B: "#C09828",
    Y: "#E0C040",
    L: "#808060",
    P: "#C0B070",
    E: "#D8D0A8",
  };

  const pal = isNight ? nightPalette : palette;
  const width = Math.max(...grid.map((r) => r.length));
  const height = grid.length;

  return (
    <svg
      width={width * s}
      height={height * s}
      style={{ imageRendering: "pixelated" }}
      shapeRendering="crispEdges"
    >
      {grid.map((row, y) =>
        [...row].map((ch, x) => {
          if (ch === "_") return null;
          const fill = pal[ch];
          if (!fill) return null;
          return (
            <rect
              key={`${x},${y}`}
              x={x * s}
              y={y * s}
              width={s}
              height={s}
              fill={fill}
            />
          );
        })
      )}
    </svg>
  );
}