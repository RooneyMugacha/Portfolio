'use client';

import { useEffect, useRef, useState } from 'react';

/* ── types ─────────────────────────────────────────────────── */
type Line =
  | { kind: 'cmd'; text: string }
  | { kind: 'out'; html: string }
  | { kind: 'plain'; text: string };

/* ── helpers ─────────────────────────────────────────────────── */
function row(key: string, val: string) {
  return `<span class="row"><span class="k">${key}</span><span>${val}</span></span>`;
}
function link(href: string, text: string) {
  return `<a href="${href}">${text}</a>`;
}

/* ── command responses ───────────────────────────────────────── */
const workRows = [
  row(link('#relay', 'relay'), 'Postgres-backed job queue'),
  row(link('#sentinel', 'sentinel'), 'credential-stuffing detection'),
  row(link('#vaultline', 'vaultline'), 'one-time encrypted secrets'),
];

const COMMANDS: Record<string, string[]> = {
  help: [
    'Commands you can run:',
    row('about', 'who I am'),
    row('work', 'selected projects'),
    row('ctf', 'CTF achievements &amp; writeups'),
    row('stack', 'languages and tools'),
    row('notes', 'engineering write-ups'),
    row('contact', 'how to reach me'),
    row('theme', 'switch light or dark page theme'),
    row('clear', 'clear the screen'),
  ],
  whoami: ['rooney: software engineer &amp; CTF player'],
  about: [
    'Backend engineer who cares about reliability and secure defaults.',
    'I build APIs and data services — and I break things on weekends in CTFs.',
  ],
  work: workRows,
  projects: workRows,
  ls: workRows,
  stack: [
    row('languages', 'Go, TypeScript, Python, SQL'),
    row('backend', 'REST, gRPC, PostgreSQL, Redis'),
    row('infra', 'Docker, Kubernetes, Terraform'),
    row('quality', 'unit, integration, and load tests'),
  ],
  ctf: [
    row('platform', 'Hack The Box, TryHackMe, CTFtime'),
    row('focus', 'web, pwn, reverse engineering, crypto'),
    row('certs', 'CompTIA Security+, eJPT'),
    link('#ctf', 'Jump to CTF writeups →'),
  ],
  notes: [
    row(link('#notes', 'job-queues'), 'Postgres as a job queue'),
    row(link('#notes', 'idempotency'), 'idempotent API design'),
    row(link('#notes', 'jwt-bypass'), 'bug bounty, disclosed'),
  ],
  writeups: [
    row(link('#notes', 'job-queues'), 'Postgres as a job queue'),
    row(link('#notes', 'idempotency'), 'idempotent API design'),
    row(link('#notes', 'jwt-bypass'), 'bug bounty, disclosed'),
  ],
  contact: ['Email, PGP key, and profiles: ' + link('#contact', 'jump to contact')],
  sudo: ['Nice try. This site runs with least privilege.'],
};

/* ── boot steps ──────────────────────────────────────────────── */
const BOOT_STEPS: { cmd?: string; out: string[] }[] = [
  { cmd: 'whoami', out: COMMANDS.whoami },
  { cmd: 'ls work/', out: workRows },
  { out: ['Type <strong>help</strong>, or use the buttons below.'] },
];

const CHIPS = ['help', 'about', 'work', 'ctf', 'stack', 'notes', 'contact'];

/* ── component ───────────────────────────────────────────────── */
export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(0);
  const [bootDone, setBootDone] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bootRef = useRef(false);   // prevent double-boot in StrictMode

  function scrollToBottom() {
    requestAnimationFrame(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    });
  }

  function addLines(newLines: Line[]) {
    setLines(prev => [...prev, ...newLines]);
    scrollToBottom();
  }

  /* ── run a command ─────────────────────────────────────────── */
  function runCmd(raw: string, theme?: () => void) {
    const cmd = raw.trim();
    addLines([{ kind: 'cmd', text: cmd }]);
    if (!cmd) return;

    setHistory(h => {
      const next = [...h, cmd];
      setHIdx(next.length);
      return next;
    });

    const name = cmd.split(/\s+/)[0].toLowerCase();

    if (name === 'clear') { setLines([]); return; }
    if (name === 'theme') {
      theme?.();
      addLines([{ kind: 'plain', text: 'Theme toggled.' }]);
      return;
    }
    if (COMMANDS[name]) {
      addLines(COMMANDS[name].map(h => ({ kind: 'out' as const, html: h })));
      return;
    }
    addLines([{ kind: 'plain', text: `Command not found: ${name}. Type help to list commands.` }]);
  }

  /* ── boot animation ────────────────────────────────────────── */
  function endBoot() { setBootDone(true); }

  function skipBoot() {
    if (bootDone) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const flat: Line[] = [];
    for (const st of BOOT_STEPS) {
      if (st.cmd) flat.push({ kind: 'cmd', text: st.cmd });
      for (const o of st.out) flat.push({ kind: 'out', html: o });
    }
    setLines(prev => {
      // Only add boot lines if they're not there yet
      if (prev.length === 0) return flat;
      return prev;
    });
    endBoot();
  }

  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      skipBoot();
      return;
    }

    let stepIdx = 0;
    const allFlat: Line[] = [];

    function runStep() {
      if (stepIdx >= BOOT_STEPS.length) { endBoot(); return; }
      const st = BOOT_STEPS[stepIdx];
      if (!st.cmd) {
        for (const o of st.out) allFlat.push({ kind: 'out', html: o });
        setLines([...allFlat]);
        scrollToBottom();
        stepIdx++;
        timerRef.current = setTimeout(runStep, 0);
        return;
      }
      // Type the command char by char
      allFlat.push({ kind: 'cmd', text: '' });
      let i = 0;
      const cmdIdx = allFlat.length - 1;
      (function tick() {
        i++;
        const updated = [...allFlat];
        updated[cmdIdx] = { kind: 'cmd', text: st.cmd!.slice(0, i) };
        allFlat[cmdIdx] = updated[cmdIdx];
        setLines([...allFlat]);
        scrollToBottom();
        if (i < st.cmd!.length) {
          timerRef.current = setTimeout(tick, 60);
        } else {
          timerRef.current = setTimeout(() => {
            for (const o of st.out) allFlat.push({ kind: 'out', html: o });
            setLines([...allFlat]);
            scrollToBottom();
            stepIdx++;
            timerRef.current = setTimeout(runStep, 400);
          }, 260);
        }
      })();
    }

    runStep();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── keyboard handling ─────────────────────────────────────── */
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    skipBoot();
    if (e.key === 'Enter') {
      runCmd(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistory(h => {
        const next = Math.max(0, hIdx - 1);
        setHIdx(next);
        setInput(h[next] ?? '');
        return h;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistory(h => {
        if (hIdx >= h.length - 1) { setHIdx(h.length); setInput(''); return h; }
        const next = hIdx + 1;
        setHIdx(next);
        setInput(h[next] ?? '');
        return h;
      });
    }
  }

  return (
    <div className="terminal" role="region" aria-label="Interactive terminal">
      <div className="t-bar">
        <span>rooney@portfolio: ~</span>
        <span>Type a command or use the buttons</span>
      </div>

      <div className="t-body" id="tBody" ref={bodyRef} tabIndex={0}
        aria-label="Terminal output" {...(bootDone ? { role: 'log' } : {})}>
        {lines.map((l, i) => {
          if (l.kind === 'cmd') {
            return (
              <div key={i} className="t-line">
                <span className="ps" aria-hidden>$</span>
                <span>{l.text}</span>
              </div>
            );
          }
          if (l.kind === 'out') {
            return (
              <div key={i} className="t-line t-out"
                dangerouslySetInnerHTML={{ __html: l.html }} />
            );
          }
          return (
            <div key={i} className="t-line t-out">{l.text}</div>
          );
        })}
      </div>

      <div className="prompt-row">
        <label className="sr-only" htmlFor="cmd">Terminal command</label>
        <span className="ps" aria-hidden>$</span>
        <input
          id="cmd"
          ref={inputRef}
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="help"
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => skipBoot()}
          onKeyDown={onKeyDown}
        />
      </div>

      <div className="t-foot">
        {CHIPS.map(chip => (
          <button key={chip} className="t-chip" type="button"
            onClick={() => { skipBoot(); runCmd(chip); }}>
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
