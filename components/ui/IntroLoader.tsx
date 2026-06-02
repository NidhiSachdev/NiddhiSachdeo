"use client";

import { useEffect, useRef, useState } from "react";

const MESSAGES = [
  "she is slaying...",
  "serving looks, one kilobyte at a time",
  "your fave dev said 'i woke up like this'",
  "no cap this is gonna go crazy",
  "she understood the assignment. wait for it.",
  "the audacity, the talent, the drip",
  "it's giving genius with a side of slay",
  "touch grass? she builds forests",
  "almost done cooking... chef's kiss incoming",
  "ok bestie, clear your schedule for this",
];

const DURATION = 10000;

function ease(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

const LOADER_CSS = `
.intro-lw{width:100%;min-height:100vh;background:#080810;display:flex;flex-direction:column;align-items:center;justify-content:center;position:fixed;inset:0;z-index:99999;overflow:hidden;padding:2rem;font-family:'Space Grotesk',sans-serif;transition:opacity 0.6s ease-in-out;}
.intro-lw.fade-out{opacity:0;pointer-events:none;}
.intro-grid-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(139,92,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.04) 1px,transparent 1px);background-size:36px 36px;z-index:0;}
.intro-star{position:absolute;border-radius:50%;background:#fff;animation:intro-twinkle ease-in-out infinite;z-index:0;}
@keyframes intro-twinkle{0%,100%{opacity:0.1;transform:scale(1);}50%{opacity:0.6;transform:scale(1.4);}}
.intro-orb{position:absolute;border-radius:50%;z-index:0;animation:intro-orbDrift ease-in-out infinite;}
@keyframes intro-orbDrift{0%,100%{transform:translate(0,0);}50%{transform:translate(20px,-20px);}}
.intro-cl{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;width:100%;max-width:500px;}
.intro-vibes-pill{display:flex;align-items:center;gap:8px;background:rgba(139,92,246,0.12);border:0.5px solid rgba(139,92,246,0.3);border-radius:100px;padding:5px 14px 5px 6px;margin-bottom:24px;}
.intro-vdot{width:26px;height:26px;border-radius:50%;background:#7c3aed;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;font-weight:700;}
.intro-vibes-pill span{font-size:11px;color:rgba(139,92,246,0.9);letter-spacing:0.1em;text-transform:uppercase;font-weight:500;}
.intro-coffee-stage{width:190px;height:200px;position:relative;margin-bottom:20px;padding-top:10px;}
.intro-cup-shadow{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);width:90px;height:14px;background:rgba(80,30,0,0.4);border-radius:50%;filter:blur(5px);animation:intro-shad 3s ease-in-out infinite;}
@keyframes intro-shad{0%,100%{width:90px;opacity:0.35;}50%{width:72px;opacity:0.55;}}
.intro-cup3d{animation:intro-cupbob 3.2s ease-in-out infinite;}
@keyframes intro-cupbob{0%,100%{transform:translateY(0) rotate(-1.5deg);}50%{transform:translateY(-10px) rotate(1.5deg);}}
.intro-stm{stroke-dasharray:38;stroke-dashoffset:38;animation:intro-steamgo 2.2s ease-in-out infinite;}
.intro-stm:nth-child(2){animation-delay:0.5s;}
.intro-stm:nth-child(3){animation-delay:1s;}
@keyframes intro-steamgo{0%{stroke-dashoffset:38;opacity:0;}25%{opacity:1;}100%{stroke-dashoffset:-38;opacity:0;}}
.intro-hline{text-align:center;margin-bottom:6px;}
.intro-hline h1{font-size:30px;font-weight:700;color:#fff;line-height:1.15;letter-spacing:-0.03em;margin:0;}
.intro-hline h1 .intro-gr{background:linear-gradient(90deg,#a78bfa,#f472b6,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.intro-tmsg{font-size:13px;color:rgba(255,255,255,0.4);text-align:center;min-height:22px;margin-bottom:28px;letter-spacing:0.01em;font-weight:300;}
.intro-cur{display:inline-block;width:2px;height:13px;background:#a78bfa;margin-left:2px;vertical-align:middle;animation:intro-blink 0.65s infinite;}
@keyframes intro-blink{0%,100%{opacity:1;}50%{opacity:0;}}
.intro-progress-wrap{width:100%;margin-bottom:18px;}
.intro-prog-top{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:10px;}
.intro-prog-status{font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:0.1em;text-transform:uppercase;}
.intro-prog-num{font-size:32px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;line-height:1;}
.intro-track{width:100%;height:3px;background:rgba(255,255,255,0.07);border-radius:100px;position:relative;}
.intro-fill{height:100%;background:linear-gradient(90deg,#6d28d9,#a78bfa,#f472b6);border-radius:100px;width:0%;transition:width 0.08s linear;position:relative;}
.intro-glow-dot{position:absolute;right:-5px;top:50%;transform:translateY(-50%);width:9px;height:9px;background:#f472b6;border-radius:50%;box-shadow:0 0 6px #f472b6,0 0 14px rgba(244,114,182,0.6);}
.intro-sub-track{width:100%;height:2px;background:rgba(255,255,255,0.04);border-radius:100px;margin-top:6px;}
.intro-sub-fill{height:100%;background:rgba(167,139,250,0.3);border-radius:100px;width:0%;transition:width 0.1s linear;}
.intro-slang-wall{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin-top:16px;margin-bottom:4px;}
.intro-s-tag{font-size:11px;padding:4px 13px;border-radius:100px;border:0.5px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.28);letter-spacing:0.05em;font-weight:400;opacity:0;transform:translateY(10px) scale(0.9);transition:opacity 0.4s,transform 0.4s,color 0.4s,border-color 0.4s,background 0.3s;}
.intro-s-tag.on{opacity:1;transform:translateY(0) scale(1);}
.intro-s-tag:hover{color:#fff;border-color:rgba(167,139,250,0.5);background:rgba(139,92,246,0.1);cursor:default;}
.intro-fun-strip{display:flex;gap:10px;justify-content:center;margin-top:18px;flex-wrap:wrap;}
.intro-fun-card{background:rgba(255,255,255,0.04);border:0.5px solid rgba(255,255,255,0.07);border-radius:10px;padding:10px 14px;display:flex;flex-direction:column;align-items:center;gap:4px;opacity:0;transform:translateY(12px);transition:opacity 0.5s,transform 0.5s;}
.intro-fun-card.on{opacity:1;transform:translateY(0);}
.intro-fun-card .fc-ico{font-size:20px;line-height:1;}
.intro-fun-card .fc-lbl{font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:0.08em;text-transform:uppercase;font-weight:500;}
.intro-fun-card .fc-val{font-size:14px;color:rgba(255,255,255,0.75);font-weight:600;letter-spacing:-0.01em;}
.intro-mood-rows{display:flex;flex-direction:column;gap:6px;width:100%;margin-top:20px;opacity:0;transition:opacity 0.6s;}
.intro-mood-rows.on{opacity:1;}
.intro-mb-row{display:flex;align-items:center;gap:8px;}
.intro-mb-label{font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:0.08em;text-transform:uppercase;white-space:nowrap;width:72px;}
.intro-mb-track{flex:1;height:2px;background:rgba(255,255,255,0.06);border-radius:100px;}
.intro-mb-fill{height:100%;border-radius:100px;width:0%;transition:width 1.4s ease-out;}
.intro-mb-val{font-size:11px;color:rgba(255,255,255,0.25);min-width:28px;}
.intro-done-zone{text-align:center;margin-top:22px;opacity:0;transition:opacity 0.7s;pointer-events:none;}
.intro-done-zone.on{opacity:1;pointer-events:all;}
.intro-done-zone p{font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:14px;}
`;

const STARS = [
  { size: 1.8, left: "12%", top: "8%", dur: "4.2s", del: "0.5s" },
  { size: 1.2, left: "28%", top: "15%", dur: "3.1s", del: "1.2s" },
  { size: 2.1, left: "45%", top: "5%", dur: "5.0s", del: "0.3s" },
  { size: 1.5, left: "67%", top: "12%", dur: "3.8s", del: "2.1s" },
  { size: 1.9, left: "82%", top: "9%", dur: "4.5s", del: "0.8s" },
  { size: 1.3, left: "93%", top: "20%", dur: "3.4s", del: "1.5s" },
  { size: 2.3, left: "8%", top: "45%", dur: "5.2s", del: "0.1s" },
  { size: 1.6, left: "22%", top: "62%", dur: "3.6s", del: "2.8s" },
  { size: 1.1, left: "38%", top: "78%", dur: "4.8s", del: "1.0s" },
  { size: 2.0, left: "55%", top: "85%", dur: "3.2s", del: "0.6s" },
  { size: 1.4, left: "72%", top: "70%", dur: "4.1s", del: "3.2s" },
  { size: 1.7, left: "88%", top: "55%", dur: "5.5s", del: "1.8s" },
  { size: 2.5, left: "15%", top: "90%", dur: "3.9s", del: "0.4s" },
  { size: 1.3, left: "50%", top: "35%", dur: "4.6s", del: "2.5s" },
  { size: 1.8, left: "75%", top: "40%", dur: "3.3s", del: "1.1s" },
  { size: 1.0, left: "60%", top: "92%", dur: "5.1s", del: "3.0s" },
  { size: 2.2, left: "35%", top: "50%", dur: "4.3s", del: "0.9s" },
  { size: 1.6, left: "5%", top: "30%", dur: "3.7s", del: "2.3s" },
];

const ORBS_DATA = [
  { size: 100, left: "15%", top: "25%", color: "#7c3aed", dur: "12s", del: "1s" },
  { size: 140, left: "70%", top: "35%", color: "#a78bfa", dur: "14s", del: "2s" },
  { size: 80, left: "40%", top: "65%", color: "#f472b6", dur: "10s", del: "0.5s" },
  { size: 90, left: "85%", top: "75%", color: "#fb923c", dur: "13s", del: "3s" },
];

const SLANG_TAGS = [
  { label: "that girl energy", at: 8 },
  { label: "it's giving", at: 18 },
  { label: "slay queen", at: 28 },
  { label: "no cap", at: 38 },
  { label: "understood the assignment", at: 48 },
  { label: "very demure", at: 57 },
  { label: "hits different", at: 65 },
  { label: "rizz unlocked", at: 73 },
  { label: "ate and left no crumbs", at: 82 },
  { label: "periodt.", at: 91 },
];

const FUN_CARDS = [
  { icon: "☕", label: "coffees today", valueId: "coffee", at: 30 },
  { icon: "🐛", label: "bugs squashed", value: "∞", at: 45 },
  { icon: "🔥", label: "hot streak", value: "4 yrs", at: 60 },
  { icon: "💅", label: "vibe check", value: "passed", at: 75 },
];

const MOOD_BARS = [
  { label: "charisma", color: "#a78bfa", target: 92 },
  { label: "drip level", color: "#f472b6", target: 99 },
  { label: "big brain", color: "#34d399", target: 88 },
  { label: "slay factor", color: "#fb923c", target: 100 },
];

export default function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [pct, setPct] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [moodVisible, setMoodVisible] = useState(false);
  const [moodFill, setMoodFill] = useState(false);
  const startRef = useRef<number | null>(null);
  const doneRef = useRef(false);
  const typeRef = useRef({ mi: 0, ci: 0, deleting: false });

  // Typing effect
  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const s = typeRef.current;
      const cur = MESSAGES[s.mi];
      if (!s.deleting) {
        s.ci++;
        if (s.ci > cur.length) {
          s.deleting = true;
          setTimeout(tick, 1900);
          return;
        }
      } else {
        s.ci--;
        if (s.ci < 0) {
          s.deleting = false;
          s.ci = 0;
          s.mi = (s.mi + 1) % MESSAGES.length;
          setTimeout(tick, 280);
          return;
        }
      }
      setTypedText(MESSAGES[s.mi].slice(0, s.ci));
      setTimeout(tick, s.deleting ? 38 : 52);
    };
    tick();
    return () => { cancelled = true; };
  }, []);

  // Progress animation
  useEffect(() => {
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const raw = Math.min((ts - startRef.current) / DURATION, 1);
      const p = Math.round(ease(raw) * 100);
      setPct(p);

      if (p >= 50 && !moodVisible) {
        setMoodVisible(true);
        setTimeout(() => setMoodFill(true), 200);
      }

      if (p >= 100 && !doneRef.current) {
        doneRef.current = true;
        setTimeout(() => {
          setFadingOut(true);
          setTimeout(() => setVisible(false), 600);
        }, 1500);
        return;
      }
      if (p < 100) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [moodVisible]);

  if (!visible) return null;

  const coffeeCount = pct < 30 ? 0 : Math.min(Math.round(((pct - 30) / 70) * 3) + 1, 4);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LOADER_CSS }} />
      <div className={`intro-lw${fadingOut ? " fade-out" : ""}`}>
        <div className="intro-grid-bg" />

        {STARS.map((s, i) => (
          <div
            key={i}
            className="intro-star"
            style={{
              width: s.size, height: s.size,
              left: s.left, top: s.top,
              animationDuration: s.dur, animationDelay: s.del,
            }}
          />
        ))}

        {ORBS_DATA.map((o, i) => (
          <div
            key={i}
            className="intro-orb"
            style={{
              width: o.size, height: o.size,
              left: o.left, top: o.top,
              background: o.color, opacity: 0.04,
              animationDuration: o.dur, animationDelay: o.del,
            }}
          />
        ))}

        <div className="intro-cl">
          <div className="intro-vibes-pill">
            <div className="intro-vdot">N</div>
            <span>main character has entered the chat</span>
          </div>

          <div className="intro-coffee-stage">
            <div className="intro-cup-shadow" />
            <svg className="intro-cup3d" width="180" height="180" viewBox="0 0 180 180">
              <path className="intro-stm" d="M68 62 C68 52,76 50,73 40" fill="none" stroke="#d4a76a" strokeWidth="2.5" strokeLinecap="round" />
              <path className="intro-stm" d="M83 57 C83 46,93 44,89 32" fill="none" stroke="#d4a76a" strokeWidth="2.5" strokeLinecap="round" />
              <path className="intro-stm" d="M97 62 C97 52,105 50,101 40" fill="none" stroke="#d4a76a" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="90" cy="155" rx="48" ry="7" fill="#1a0d00" opacity="0.5" />
              <ellipse cx="90" cy="150" rx="48" ry="7" fill="#3a1f00" />
              <ellipse cx="90" cy="147" rx="48" ry="7" fill="#5a3200" />
              <ellipse cx="82" cy="145" rx="18" ry="3" fill="#7a4a18" opacity="0.6" />
              <path d="M56 102 L124 102 L113 142 L67 142 Z" fill="#6b3a1f" />
              <path d="M56 102 L67 142 L61 142 L52 102 Z" fill="#3a1f09" opacity="0.6" />
              <path d="M124 102 L113 142 L119 142 L128 102 Z" fill="#3a1f09" opacity="0.5" />
              <ellipse cx="90" cy="102" rx="34" ry="9" fill="#45250e" />
              <ellipse cx="90" cy="102" rx="28" ry="7.5" fill="#180b02" />
              <ellipse cx="90" cy="102" rx="24" ry="6" fill="#2e1305" />
              <path d="M82 100 C82 97,87 96,90 99 C93 96,98 97,98 100 C98 104,90 108,90 108 C90 108,82 104,82 100 Z" fill="#8b5a2b" opacity="0.65" />
              <ellipse cx="84" cy="99" rx="5" ry="2" fill="#c9a96e" opacity="0.2" />
              <path d="M124 111 C146 111,150 121,150 127 C150 133,146 139,124 139" fill="none" stroke="#6b3a1f" strokeWidth="9" strokeLinecap="round" />
              <path d="M124 111 C142 111,146 121,146 127 C146 133,142 139,124 139" fill="none" stroke="#8b5235" strokeWidth="5" strokeLinecap="round" />
              <path d="M69 104 C71 104,75 103,77 112 C75 124,73 134,75 140" fill="none" stroke="rgba(255,195,100,0.15)" strokeWidth="4" strokeLinecap="round" />
              <text x="90" y="126" textAnchor="middle" fontFamily="Space Grotesk" fontSize="9" fontWeight="700" fill="rgba(255,200,100,0.3)" letterSpacing="2">NS</text>
            </svg>
          </div>

          <div className="intro-hline">
            <h1>no cap, this portfolio<br />is <span className="intro-gr">lowkey iconic ✨</span></h1>
          </div>

          <div className="intro-tmsg">
            <span>{typedText}</span>
            <span className="intro-cur" />
          </div>

          <div className="intro-progress-wrap">
            <div className="intro-prog-top">
              <span className="intro-prog-status">slay-o-meter</span>
              <span className="intro-prog-num" style={pct >= 100 ? { color: "#a78bfa" } : undefined}>{pct}%</span>
            </div>
            <div className="intro-track">
              <div className="intro-fill" style={{ width: `${pct}%` }}>
                <div className="intro-glow-dot" />
              </div>
            </div>
            <div className="intro-sub-track">
              <div className="intro-sub-fill" style={{ width: `${Math.min(pct * 1.2, 100)}%` }} />
            </div>
          </div>

          <div className="intro-slang-wall">
            {SLANG_TAGS.map((tag) => (
              <span key={tag.label} className={`intro-s-tag${pct >= tag.at ? " on" : ""}`}>
                {tag.label}
              </span>
            ))}
          </div>



          <div className={`intro-done-zone${pct >= 100 ? " on" : ""}`}>
            <p>bestie, it&apos;s ready. you&apos;re so gonna love this era.</p>
          </div>
        </div>
      </div>
    </>
  );
}
