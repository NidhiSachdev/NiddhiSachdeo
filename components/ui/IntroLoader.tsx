"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { THEMES } from "@/components/theme/ThemeProvider";
import { assetPath } from "@/lib/utils";

const DURATION = 8000;

function ease(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

const LOADER_CSS = `
.il-wrap{position:fixed;inset:0;z-index:99999;background:#06050e;display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;transition:opacity 0.8s ease;overflow:hidden;}
.il-wrap.fade-out{opacity:0;pointer-events:none;}

/* Ambient gradient orbs */
.il-orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.12;animation:il-drift 20s ease-in-out infinite;}
.il-orb-1{width:500px;height:500px;background:#7c3aed;top:-15%;left:-10%;animation-delay:0s;}
.il-orb-2{width:400px;height:400px;background:#0ea5e9;bottom:-10%;right:-8%;animation-delay:-7s;}
.il-orb-3{width:300px;height:300px;background:#a855f7;top:40%;right:20%;animation-delay:-14s;}
@keyframes il-drift{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(30px,-20px) scale(1.05);}66%{transform:translate(-20px,15px) scale(0.95);};}

/* Subtle grid */
.il-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(139,92,246,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.03) 1px,transparent 1px);background-size:60px 60px;opacity:0.6;}

/* Floating particles */
.il-particle{position:absolute;width:2px;height:2px;background:#a78bfa;border-radius:50%;opacity:0;animation:il-float 6s ease-in-out infinite;}
@keyframes il-float{0%{opacity:0;transform:translateY(0);}20%{opacity:0.6;}80%{opacity:0.4;}100%{opacity:0;transform:translateY(-120px);}}

/* Content */
.il-content{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;max-width:520px;padding:0 24px;}

/* Logo mark */
.il-logo{width:72px;height:72px;position:relative;margin-bottom:32px;}
.il-logo-ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid rgba(167,139,250,0.3);animation:il-spin 8s linear infinite;}
.il-logo-ring-2{position:absolute;inset:6px;border-radius:50%;border:1px solid rgba(14,165,233,0.2);animation:il-spin 12s linear infinite reverse;}
.il-logo-center{position:absolute;inset:14px;border-radius:50%;background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(14,165,233,0.1));display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff;letter-spacing:0.5px;}
@keyframes il-spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
.il-logo-dot{position:absolute;width:6px;height:6px;border-radius:50%;background:#a78bfa;top:-3px;left:50%;margin-left:-3px;box-shadow:0 0 8px #a78bfa;}
.il-logo-dot-2{position:absolute;width:4px;height:4px;border-radius:50%;background:#0ea5e9;bottom:4px;right:4px;box-shadow:0 0 6px #0ea5e9;}

/* Title */
.il-title{font-size:clamp(26px,4vw,38px);font-weight:700;color:#fff;letter-spacing:-0.03em;line-height:1.2;margin-bottom:8px;}
.il-title-grad{background:linear-gradient(135deg,#a78bfa,#0ea5e9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.il-subtitle{font-size:clamp(13px,1.8vw,15px);color:rgba(255,255,255,0.4);font-weight:400;margin-bottom:40px;line-height:1.5;}

/* Progress */
.il-progress{width:100%;max-width:320px;margin-bottom:32px;}
.il-prog-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
.il-prog-label{font-size:11px;color:rgba(255,255,255,0.3);letter-spacing:0.12em;text-transform:uppercase;font-weight:500;}
.il-prog-pct{font-size:13px;color:rgba(255,255,255,0.6);font-weight:600;font-variant-numeric:tabular-nums;}
.il-track{width:100%;height:2px;background:rgba(255,255,255,0.06);border-radius:100px;overflow:hidden;}
.il-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,#7c3aed,#a78bfa,#0ea5e9);transition:width 0.1s linear;}

/* Status pills */
.il-status{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:24px;}
.il-pill{font-size:11px;padding:5px 14px;border-radius:100px;border:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.3);font-weight:400;opacity:0;transform:translateY(8px);transition:all 0.4s ease;}
.il-pill.on{opacity:1;transform:translateY(0);color:rgba(255,255,255,0.55);border-color:rgba(167,139,250,0.2);background:rgba(167,139,250,0.05);}

/* Completion */
.il-done{opacity:0;transition:opacity 0.6s;margin-top:8px;}
.il-done.on{opacity:1;}
.il-done p{font-size:13px;color:rgba(255,255,255,0.4);font-weight:400;}

/* Theme button */
.il-theme-btn{position:fixed;bottom:24px;right:24px;z-index:100000;display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:100px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);cursor:pointer;transition:all 0.25s;}
.il-theme-btn:hover{border-color:rgba(167,139,250,0.3);background:rgba(167,139,250,0.08);}
.il-theme-btn img{width:18px;height:18px;border-radius:4px;opacity:0.8;}
.il-theme-btn span{font-size:11px;color:rgba(255,255,255,0.5);font-weight:500;letter-spacing:0.02em;}

/* Theme popup */
.il-theme-popup{position:fixed;bottom:72px;right:24px;z-index:100001;width:210px;background:rgba(12,10,24,0.95);backdrop-filter:blur(20px);border:1px solid rgba(167,139,250,0.15);border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 30px rgba(124,58,237,0.05);padding:12px;opacity:0;transform:translateY(6px) scale(0.96);transition:all 0.2s ease;pointer-events:none;}
.il-theme-popup.open{opacity:1;transform:translateY(0) scale(1);pointer-events:all;}
.il-theme-popup-title{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.3);margin:0 0 8px 8px;}
.il-theme-popup button{display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border:none;background:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;color:rgba(255,255,255,0.75);transition:all 0.15s;}
.il-theme-popup button:hover{background:rgba(167,139,250,0.12);color:#fff;}
.il-theme-popup button svg{width:18px;height:18px;flex-shrink:0;}
`;

const STATUS_PILLS = [
  { label: "Initializing", at: 5 },
  { label: "Loading assets", at: 20 },
  { label: "Building layout", at: 40 },
  { label: "Rendering views", at: 60 },
  { label: "Optimizing", at: 80 },
  { label: "Ready", at: 95 },
];

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  bottom: `${Math.random() * 30}%`,
  delay: `${Math.random() * 6}s`,
  dur: `${4 + Math.random() * 4}s`,
}));

function IntroThemeLogo({ id }: { id: string }) {
  switch (id) {
    case "cosmic":
      return (
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" fill="#bf5af2" />
          <path d="M12 2v3m0 14v3M4.93 4.93l2.12 2.12m9.9 9.9l2.12 2.12M2 12h3m14 0h3M4.93 19.07l2.12-2.12m9.9-9.9l2.12-2.12" stroke="#0a84ff" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="8" stroke="url(#ai-grad-intro)" strokeWidth="1" strokeDasharray="2 3" />
          <defs><linearGradient id="ai-grad-intro" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#0a84ff" /><stop offset="1" stopColor="#bf5af2" /></linearGradient></defs>
        </svg>
      );
    case "macos":
      return (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.81-1.31.05-2.31-1.32-3.15-2.55C4.22 16.86 3 12.87 4.74 10.18c.87-1.33 2.41-2.17 4.06-2.19 1.29-.02 2.51.87 3.29.87.79 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.27-2.15 3.78.03 3 2.63 4 2.65 4.01-.03.07-.41 1.43-1.33 2.78zM15.42 3.5c.74-.9 1.25-2.14 1.11-3.38-1.07.04-2.37.72-3.14 1.62-.69.8-1.29 2.08-1.13 3.3 1.2.09 2.42-.61 3.16-1.54z" fill="#f5f5f7" />
        </svg>
      );
    case "spotify":
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#1db954" />
          <path d="M16.5 8.5c-2.7-1.2-7-.8-7-.8s-.3 0-.3.3.3.3.3.3 3.8-.3 6.3.8c.2.1.4 0 .5-.2s0-.4-.2-.5zm-.5 2.3c-2.3-1-6-.7-6-.7s-.2 0-.2.2.2.3.2.3 3.3-.3 5.5.7c.2.1.3 0 .4-.2.1-.1 0-.3-.1-.3zm-.7 2.2c-2-.8-5-.5-5-.5s-.2 0-.2.2.2.2.2.2 2.7-.2 4.6.5c.2.1.3 0 .3-.1.1-.2 0-.3-.1-.3z" fill="white" />
        </svg>
      );
    case "agentic":
      return (
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="2" y="3" width="20" height="18" rx="3" stroke="#05ce91" strokeWidth="1.5" />
          <path d="M6 9l3 3-3 3" stroke="#05ce91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 15h5" stroke="#ff9d00" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "netflix":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M5 2h4.5l5 14.5V2H19v20h-4.5l-5-14.5V22H5V2z" fill="#e50914" />
        </svg>
      );
    default:
      return null;
  }
}

export default function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [pct, setPct] = useState(0);
  const [themeOpen, setThemeOpen] = useState(false);
  const { setTheme } = useTheme();
  const startRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const raw = Math.min((ts - startRef.current) / DURATION, 1);
      const p = Math.round(ease(raw) * 100);
      setPct(p);

      if (p >= 100 && !doneRef.current) {
        doneRef.current = true;
        setTimeout(() => {
          setFadingOut(true);
          setTimeout(() => setVisible(false), 800);
        }, 1200);
        return;
      }
      if (p < 100) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LOADER_CSS }} />
      <div className={`il-wrap${fadingOut ? " fade-out" : ""}`}>
        {/* Ambient orbs */}
        <div className="il-orb il-orb-1" />
        <div className="il-orb il-orb-2" />
        <div className="il-orb il-orb-3" />
        <div className="il-grid" />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="il-particle"
            style={{ left: p.left, bottom: p.bottom, animationDelay: p.delay, animationDuration: p.dur }}
          />
        ))}

        <div className="il-content">
          {/* Animated logo */}
          <div className="il-logo">
            <div className="il-logo-ring">
              <div className="il-logo-dot" />
            </div>
            <div className="il-logo-ring-2">
              <div className="il-logo-dot-2" />
            </div>
            <div className="il-logo-center">NS</div>
          </div>

          <div className="il-title">
            <span className="il-title-grad">Crafting Experience</span>
          </div>
          <p className="il-subtitle">
            Building something beautiful — hold tight.
          </p>

          {/* Progress bar */}
          <div className="il-progress">
            <div className="il-prog-header">
              <span className="il-prog-label">Progress</span>
              <span className="il-prog-pct">{pct}%</span>
            </div>
            <div className="il-track">
              <div className="il-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Status pills */}
          <div className="il-status">
            {STATUS_PILLS.map((s) => (
              <span key={s.label} className={`il-pill${pct >= s.at ? " on" : ""}`}>
                {s.label}
              </span>
            ))}
          </div>

          {/* Completion message */}
          <div className={`il-done${pct >= 100 ? " on" : ""}`}>
            <p>Welcome to the portfolio.</p>
          </div>
        </div>
      </div>

      {/* Theme picker button */}
      <button className="il-theme-btn" onClick={() => setThemeOpen((v) => !v)}>
        <img src={assetPath("/images/theme-icon.png")} alt="Themes" />
        <span>Try different themes</span>
      </button>

      {/* Theme popup */}
      <div className={`il-theme-popup${themeOpen ? " open" : ""}`}>
        <p className="il-theme-popup-title">Switch theme</p>
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTheme(t.id); setThemeOpen(false); }}
          >
            <IntroThemeLogo id={t.id} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
