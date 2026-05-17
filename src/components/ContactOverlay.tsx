import { useEffect } from "react";

const NEON = "#FF3B3B";

interface ContactOverlayProps {
  onClose: () => void;
  isNight: boolean;
}

export function ContactOverlay({ onClose, isNight }: ContactOverlayProps) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const paperBg = isNight ? "#1a1a0e" : "#f0e6c4";
  const paperBorder = isNight ? "#3a3830" : "#8a7a50";
  const ink = isNight ? "#f0d860" : "#1a1000";
  const sub = isNight ? "#8a7a50" : "#6A5030";

  const links = [
    { icon: "@", label: "EMAIL", value: "pranavrathodev@gmail.com", href: "mailto:pranavrathodev@gmail.com" },
    { icon: "in", label: "LINKEDIN", value: "linkedin/pranavsrathod", href: "https://www.linkedin.com/in/pranavsrathod/" },
    { icon: "</>", label: "GITHUB", value: "github/pranavsrathod", href: "https://github.com/pranavsrathod" },
  ];

  return (
    <>
      <style>{`
        @keyframes unfold {
          from { opacity: 0; transform: scaleY(0.85); }
          to { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
      <div
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.88)",
          zIndex: 300,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.2s",
        }}
        onClick={onClose}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "relative",
            maxWidth: 820,
            width: "92vw",
            maxHeight: "92vh",
            background: paperBg,
            border: `3px solid ${paperBorder}`,
            fontFamily: "'VT323', monospace",
            color: ink,
            padding: 0,
            display: "flex",
            flexDirection: "row",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 100px rgba(255,59,59,0.15)",
            animation: "unfold 0.5s cubic-bezier(0.2,0.8,0.2,1)",
            transformOrigin: "center center",
            overflow: "hidden",
          }}
        >
          {/* Fold shadow */}
          <div style={{
            position: "absolute", left: "44%", top: 0, bottom: 0, width: 2,
            background: `linear-gradient(to right, transparent, ${paperBorder}55, transparent)`,
            pointerEvents: "none", transform: "translateX(-1px)", zIndex: 1,
          }}/>

          {/* Left — Wada Pav art */}
          <div style={{
            flex: "0 0 44%",
            padding: 20,
            borderRight: `2px dashed ${paperBorder}`,
            background: isNight ? "#141410" : "#e8dcb0",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column",
          }}>
            <div style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: 7, letterSpacing: 2,
              color: sub, marginBottom: 6,
            }}>★ MUMBAI STREET ★</div>
            <WadaPavArt isNight={isNight} />
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: sub, marginTop: 6, fontStyle: "italic" }}>
              one for the road →
            </div>
          </div>

          {/* Right — Classified */}
          <div style={{ flex: 1, padding: "22px 26px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {/* Masthead */}
            <div style={{
              borderTop: `3px double ${paperBorder}`,
              borderBottom: `3px double ${paperBorder}`,
              padding: "6px 0 8px",
              marginBottom: 14,
              textAlign: "center",
            }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, letterSpacing: 4, color: sub }}>
                THE MUMBAI HERALD
              </div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: sub, letterSpacing: 1 }}>
                CLASSIFIEDS · TUESDAY · ANNA 1 · EST. 1901
              </div>
            </div>

            <div style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: 14, letterSpacing: 2,
              color: ink, marginBottom: 4,
              textShadow: isNight ? "0 0 14px rgba(255,220,80,0.6)" : "none",
            }}>
              CONTACT ME
            </div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: sub, lineHeight: 1.3, marginBottom: 18, fontStyle: "italic" }}>
              Seeking connections in design, engineering & creative work.<br />
              Reach out via any channel below —
            </div>

            {/* Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {links.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={e => {
                    const el = e.currentTarget;
                    el.style.borderColor = NEON;
                    el.style.boxShadow = `0 0 8px ${NEON}, inset 0 0 0 1px ${NEON}`;
                    el.style.background = isNight ? "#2a1010" : "#f8e8d0";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget;
                    el.style.borderColor = "transparent";
                    el.style.boxShadow = "none";
                    el.style.background = "transparent";
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "8px 10px",
                    textDecoration: "none",
                    color: ink,
                    border: "2px solid transparent",
                    transition: "all 0.12s",
                  }}
                >
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                    width: 32, height: 32, minWidth: 32,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isNight ? "#2a2820" : "#d8c888",
                    border: `2px solid ${paperBorder}`,
                    color: ink,
                  }}>{l.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, letterSpacing: 1, color: sub, marginBottom: 2 }}>
                      {l.label}
                    </div>
                    <div style={{ fontFamily: "'VT323', monospace", fontSize: 18, letterSpacing: 0.5 }}>
                      {l.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Fake columns footer */}
            <div style={{
              marginTop: "auto", paddingTop: 12,
              borderTop: `1px solid ${paperBorder}`,
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
              fontFamily: "'VT323', monospace", fontSize: 12, color: sub, lineHeight: 1.3,
            }}>
              <div>
                <b style={{ color: ink }}>FOR SALE</b><br />
                1 curious portfolio · lightly used · many projects · apply within
              </div>
              <div>
                <b style={{ color: ink }}>WANTED</b><br />
                interesting problems · good coffee · walks around Juhu
              </div>
            </div>

            <div style={{
              marginTop: 12, fontFamily: "'Press Start 2P', monospace", fontSize: 6,
              color: sub, textAlign: "right", letterSpacing: 1,
            }}>
              [ESC] or click outside to close
            </div>
          </div>

          {/* Corner fold */}
          <div style={{
            position: "absolute", top: 0, right: 0,
            width: 0, height: 0,
            borderStyle: "solid",
            borderWidth: "0 26px 26px 0",
            borderColor: `transparent ${isNight ? "#2a2820" : "#c8b880"} transparent transparent`,
          }}/>
        </div>
      </div>
    </>
  );
}

function WadaPavArt({ isNight }: { isNight: boolean }) {
  const s = 6;
  const pal: Record<string, string | null> = {
    "_": null,
    K: "#111111",
    P: isNight ? "#C8A868" : "#EEC880",
    p: isNight ? "#8E7238" : "#B08A3A",
    V: isNight ? "#8E5A20" : "#C8802A",
    v: isNight ? "#5E3810" : "#8E4E18",
    G: isNight ? "#2A5020" : "#4AAA2A",
    R: isNight ? "#8E2818" : "#C83820",
    N: isNight ? "#3A3020" : "#F0E4C0",
    n: isNight ? "#2A2218" : "#D8CCA8",
    T: isNight ? "#1A1410" : "#4A3820",
  };
  const grid = [
    "__________________________",
    "_NNNNNNNNNNNNNNNNNNNNNNNN_",
    "_NTTnTnnTnTnnnTnTnnTnTnTN_",
    "_NnTTnTnTnnTnTnTnnTnnnTnN_",
    "_NTnnnTnn____TTnnnTnTnnnN_",
    "_Nnn_____KKKKKK________nN_",
    "_NTnn_KKKPPPPPPKK__TnTTnN_",
    "_NnT_KPPPPPPPPPPK__nTnnTN_",
    "_NTn_KPPPPPPPPPPK__TnnTnN_",
    "_Nnn_KPppVVVVVppK__nTnTnN_",
    "_NTn_KVVVVVVVVVVK__TnnTTN_",
    "_NnT_KVvvVVvVVvVK__nTnnTN_",
    "_NTn_KVVVVVVVVVVK_G_TnTnN_",
    "_Nnn_KPpppppppppK_G_nnTnN_",
    "_NTn__KKKKKKKKKK_RG_TnTnN_",
    "_NnTnnnnTnnTnTnnTnTnnTnTN_",
    "_NTnnTTnTnnTnTTnnTnTnTnTN_",
    "_NNNNNNNNNNNNNNNNNNNNNNNN_",
    "__________________________",
  ];
  const H = grid.length;
  const W = grid[0].length;
  return (
    <svg width={W * s} height={H * s} shapeRendering="crispEdges" style={{ imageRendering: "pixelated" }}>
      {grid.map((row, y) =>
        [...row].map((ch, x) => {
          const fill = pal[ch];
          if (!fill) return null;
          return <rect key={`${x},${y}`} x={x * s} y={y * s} width={s} height={s} fill={fill} />;
        })
      )}
    </svg>
  );
}
