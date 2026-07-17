"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import { assetPath } from "@/lib/utils";

const ASCII_ART = `
 _   _ _     _     _ _     _   ____             _         _            
| \\ | (_) __| | __| | |__ (_) / ___|  __ _  ___| |__   __| | ___  ___  
|  \\| | |/ _\` |/ _\` | '_ \\| | \\___ \\ / _\` |/ __| '_ \\ / _\` |/ _ \\/ _ \\ 
| |\\  | | (_| | (_| | | | | |  ___) | (_| | (__| | | | (_| |  __/ (_) |
|_| \\_|_|\\__,_|\\__,_|_| |_|_| |____/ \\__,_|\\___|_| |_|\\__,_|\\___|\\___/ 
`;

type OutputLine = { type: "prompt" | "output" | "error" | "ascii" | "link"; content: string; url?: string };

const COMMANDS: { cmd: string; desc: string }[] = [
  { cmd: "about", desc: "about Niddhi Sachdeo" },
  { cmd: "skills", desc: "view my technical skills" },
  { cmd: "experience", desc: "my work experience" },
  { cmd: "projects", desc: "view projects I've built" },
  { cmd: "education", desc: "my education background" },
  { cmd: "contact", desc: "get my contact info" },
  { cmd: "socials", desc: "check out my social accounts" },
  { cmd: "resume", desc: "download my resume" },
  { cmd: "clear", desc: "clear the terminal" },
  { cmd: "help", desc: "list available commands" },
  { cmd: "whoami", desc: "about current visitor" },
  { cmd: "welcome", desc: "display welcome message" },
];

function getWelcomeOutput(): OutputLine[] {
  return [
    { type: "ascii", content: ASCII_ART },
    { type: "output", content: "Welcome to Niddhi Sachdeo's terminal portfolio. (v2.0)" },
    { type: "output", content: "----" },
    { type: "output", content: "Type 'help' for a list of available commands." },
    { type: "output", content: "" },
  ];
}

function runCommand(cmd: string): OutputLine[] {
  const trimmed = cmd.trim().toLowerCase();
  const parts = trimmed.split(" ");
  const base = parts[0];

  switch (base) {
    case "help":
      return [
        { type: "output", content: "Available Commands:\n" },
        ...COMMANDS.map(({ cmd, desc }) => ({
          type: "output" as const,
          content: `  ${cmd.padEnd(14)}${desc}`,
        })),
        { type: "output", content: "\n  Tab          => autocomplete command" },
        { type: "output", content: "  Up/Down      => navigate command history" },
        { type: "output", content: "  Ctrl + L     => clear the terminal" },
      ];

    case "about":
      return [
        { type: "output", content: "" },
        { type: "output", content: "  Hi, my name is \x1b[1mNiddhi Sachdeo\x1b[0m!" },
        { type: "output", content: "  I'm a Software Developer based in Mumbai, India." },
        { type: "output", content: "" },
        { type: "output", content: "  I'm passionate about building AI-powered solutions," },
        { type: "output", content: "  automating complex workflows, and developing" },
        { type: "output", content: "  intelligent systems that solve real problems." },
        { type: "output", content: "" },
        { type: "output", content: "  Currently working at Amdocs, building agentic AI" },
        { type: "output", content: "  systems that reduced ticket resolution time by 40%." },
        { type: "output", content: "" },
      ];

    case "skills":
      return [
        { type: "output", content: "" },
        { type: "output", content: "  \x1b[33m── Languages ──\x1b[0m" },
        { type: "output", content: "  Java • Python • TypeScript • JavaScript • SQL" },
        { type: "output", content: "" },
        { type: "output", content: "  \x1b[33m── AI & ML ──\x1b[0m" },
        { type: "output", content: "  Agentic AI • LangChain • RAG • NLP • Automation" },
        { type: "output", content: "" },
        { type: "output", content: "  \x1b[33m── Cloud & DevOps ──\x1b[0m" },
        { type: "output", content: "  AWS • Docker • Kubernetes • Terraform • CI/CD" },
        { type: "output", content: "" },
        { type: "output", content: "  \x1b[33m── Web & Frameworks ──\x1b[0m" },
        { type: "output", content: "  React • Next.js • Node.js • Spring Boot • REST" },
        { type: "output", content: "" },
        { type: "output", content: "  \x1b[33m── Databases ──\x1b[0m" },
        { type: "output", content: "  PostgreSQL • MongoDB • Couchbase • Redis • Elasticsearch" },
        { type: "output", content: "" },
      ];

    case "experience":
      return [
        { type: "output", content: "" },
        { type: "output", content: "  \x1b[32m▸ Software Developer\x1b[0m @ Amdocs (2021 - Present)" },
        { type: "output", content: "    • Built DORA - AI agent reducing resolution time by 40%" },
        { type: "output", content: "    • Automated JIRA workflows with agentic solutions" },
        { type: "output", content: "    • Developed microservices on AWS Lambda" },
        { type: "output", content: "    • Mentored junior developers" },
        { type: "output", content: "" },
        { type: "output", content: "  \x1b[32m▸ Cloud & DevOps Certification\x1b[0m @ IIT Roorkee (2024 - Present)" },
        { type: "output", content: "    • AWS, Docker, Kubernetes, Terraform" },
        { type: "output", content: "    • CI/CD pipelines & infrastructure as code" },
        { type: "output", content: "" },
      ];

    case "projects":
      return [
        { type: "output", content: "" },
        { type: "output", content: '  "Talk is cheap. Show me the code"' },
        { type: "output", content: "" },
        { type: "output", content: "  \x1b[33m1.\x1b[0m DORA Agent" },
        { type: "output", content: "     AI-powered Digital Order Routing Automation" },
        { type: "output", content: "     Stack: Python, AWS Lambda, Agentic AI" },
        { type: "output", content: "" },
        { type: "output", content: "  \x1b[33m2.\x1b[0m MoodMiles" },
        { type: "output", content: "     Mood-based AI travel planner" },
        { type: "output", content: "     Stack: Python, AI/ML, JavaScript" },
        { type: "output", content: "" },
        { type: "output", content: "  \x1b[33m3.\x1b[0m S4 Spine Physiotherapy" },
        { type: "output", content: "     Healthcare app with 40+ treatments, body map" },
        { type: "output", content: "     Stack: Next.js, TypeScript, Tailwind CSS" },
        { type: "output", content: "" },
        { type: "output", content: "  \x1b[33m4.\x1b[0m Intrusion Detection System" },
        { type: "output", content: "     Keystroke ML-based user authentication" },
        { type: "output", content: "     Stack: Machine Learning, Python, MySQL" },
        { type: "output", content: "" },
      ];

    case "education":
      return [
        { type: "output", content: "" },
        { type: "output", content: "  \x1b[32m▸ IIT Roorkee\x1b[0m (2024 - Present)" },
        { type: "output", content: "    Advanced Certification in Cloud Computing & DevOps" },
        { type: "output", content: "" },
        { type: "output", content: "  \x1b[32m▸ University of Mumbai\x1b[0m (2017 - 2021)" },
        { type: "output", content: "    B.E. Computer Engineering — CGPA: 8.34" },
        { type: "output", content: "" },
      ];

    case "contact":
      return [
        { type: "output", content: "" },
        { type: "output", content: "  \x1b[33mEmail:\x1b[0m    nidhisachdeo2000@gmail.com" },
        { type: "output", content: "  \x1b[33mLinkedIn:\x1b[0m linkedin.com/in/niddhisachdeo465a53187" },
        { type: "output", content: "  \x1b[33mGitHub:\x1b[0m   github.com/NidhiSachdev" },
        { type: "output", content: "" },
      ];

    case "socials":
      return [
        { type: "output", content: "" },
        { type: "link", content: "  GitHub    github.com/NidhiSachdev", url: "https://github.com/NidhiSachdev" },
        { type: "link", content: "  LinkedIn  linkedin.com/in/niddhisachdeo465a53187", url: "https://linkedin.com/in/niddhisachdeo465a53187" },
        { type: "output", content: "" },
      ];

    case "resume":
      if (typeof window !== "undefined") {
        window.open(assetPath("/Niddhi_Sachdeo_2026.docx"), "_blank");
      }
      return [{ type: "output", content: "  Opening resume in a new tab..." }];

    case "whoami":
      return [{ type: "output", content: "  visitor" }];

    case "welcome":
      return getWelcomeOutput();

    case "clear":
      return [];

    case "pwd":
      return [{ type: "output", content: "  /home/visitor/niddhisachdeo.dev" }];

    case "date":
      return [{ type: "output", content: `  ${new Date().toString()}` }];

    case "":
      return [];

    default:
      return [{ type: "error", content: `  command not found: ${trimmed}` }];
  }
}

function formatOutput(content: string): string {
  return content
    .replace(/\x1b\[1m(.*?)\x1b\[0m/g, '<span class="font-bold text-white">$1</span>')
    .replace(/\x1b\[32m(.*?)\x1b\[0m/g, '<span class="text-[#05ce91]">$1</span>')
    .replace(/\x1b\[33m(.*?)\x1b\[0m/g, '<span class="text-[#ff9d00]">$1</span>');
}

export default function TerminalView() {
  const [history, setHistory] = useState<OutputLine[]>(getWelcomeOutput());
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hints, setHints] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [history]);

  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    document.addEventListener("click", focus);
    return () => document.removeEventListener("click", focus);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();

    const promptLine: OutputLine = { type: "prompt", content: cmd };

    if (cmd.toLowerCase() === "clear") {
      setHistory([]);
    } else {
      const output = runCommand(cmd);
      setHistory((prev) => [...prev, promptLine, ...output]);
    }

    if (cmd) setCmdHistory((prev) => [cmd, ...prev]);
    setInput("");
    setHistoryIndex(-1);
    setHints([]);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (!input) return;
      const matches = COMMANDS.filter((c) => c.cmd.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0].cmd);
        setHints([]);
      } else if (matches.length > 1) {
        setHints(matches.map((m) => m.cmd));
      }
      return;
    }

    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setHistory([]);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const newIdx = historyIndex + 1;
        setHistoryIndex(newIdx);
        setInput(cmdHistory[newIdx]);
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setInput(cmdHistory[newIdx]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }

    setHints([]);
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-[#1d2a35] font-mono">
      {/* Title bar */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-white/10 bg-[#19252e] px-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[12px] text-white/40">visitor@niddhisachdeo.dev: ~</span>
        <ThemeSwitcher />
      </div>

      {/* Terminal body */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 text-[14px] leading-[1.8] sm:p-6"
      >
        {history.map((line, i) => {
          if (line.type === "prompt") {
            return (
              <div key={i} className="flex flex-wrap">
                <span className="text-[#05ce91]">visitor</span>
                <span className="text-white/50">@</span>
                <span className="text-[#ff9d00]">niddhisachdeo.dev</span>
                <span className="text-white/50">:~$ </span>
                <span className="text-[#cbd5e1]">{line.content}</span>
              </div>
            );
          }
          if (line.type === "ascii") {
            return (
              <pre key={i} className="text-[#05ce91] text-[10px] leading-[1.2] sm:text-[12px]">
                {line.content}
              </pre>
            );
          }
          if (line.type === "error") {
            return (
              <div key={i} className="text-red-400">{line.content}</div>
            );
          }
          if (line.type === "link") {
            return (
              <div key={i}>
                <a
                  href={line.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#cbd5e1] underline decoration-[#05ce91]/50 hover:text-[#05ce91]"
                  dangerouslySetInnerHTML={{ __html: formatOutput(line.content) }}
                />
              </div>
            );
          }
          return (
            <div
              key={i}
              className="whitespace-pre-wrap text-[#b2bdcc]"
              dangerouslySetInnerHTML={{ __html: formatOutput(line.content) }}
            />
          );
        })}

        {/* Hints */}
        {hints.length > 0 && (
          <div className="flex gap-4 text-[#64748b]">
            {hints.map((h) => <span key={h}>{h}</span>)}
          </div>
        )}

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex flex-wrap items-center">
          <span className="text-[#05ce91]">visitor</span>
          <span className="text-white/50">@</span>
          <span className="text-[#ff9d00]">niddhisachdeo.dev</span>
          <span className="text-white/50">:~$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-[#cbd5e1] caret-[#05ce91] outline-none"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="off"
          />
        </form>
      </div>
    </div>
  );
}
