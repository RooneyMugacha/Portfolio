
import ThemeToggle from './components/ThemeToggle';
import EmailReveal from './components/EmailReveal';
import { getSortedContentData } from '../lib/markdown';

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */
export default function Home() {
  const workEntries = getSortedContentData('work');
  const ctfEntries = getSortedContentData('ctf');
  const noteEntries = getSortedContentData('notes');

  // Dynamically calculate stats based on the 'type' field
  const machinesOwned = ctfEntries.filter(entry => entry.type === 'machine').length;
  const ctfEvents = ctfEntries.filter(entry => entry.type === 'ctf event').length;

  const CTF_STATS = [
    { val: machinesOwned.toString(), label: 'machines owned' },
    { val: ctfEvents.toString(), label: 'CTF events' },
  ];

  return (
    <>
      {/* Skip link */}
      <a className="sr-only" href="#work">Skip to selected work</a>

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="site-header">
        <div className="wrap bar">
          <a className="wordmark" href="#top">Rooney Mugacha</a>
          <nav className="nav" aria-label="Primary">
            <ul className="nav-list">
              <li><a href="#work"><span>./</span>work</a></li>
              <li><a href="#code"><span>./</span>code</a></li>
              <li><a href="#stack"><span>./</span>stack</a></li>
              <li><a href="#ctf"><span>./</span>ctf</a></li>
              <li><a href="#notes"><span>./</span>notes</a></li>
              <li><a href="#approach"><span>./</span>approach</a></li>
              <li><a href="#contact"><span>./</span>contact</a></li>
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="top">

        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="wrap hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">I build systems that hold up.</h1>
            <p className="lede">
              Security researcher & software engineer with experience in APIs, data services, and infrastructure.
            </p>
            <div className="actions">
              <a className="btn btn-primary" href="#work">See selected work</a>
              <a className="btn" href="#contact">Get in touch</a>
            </div>
          </div>
        </section>

        {/* ── Selected work ──────────────────────────────────── */}
        <section className="section" id="work" aria-labelledby="work-title">
          <div className="wrap split">
            <div className="split-head">
              <h2 id="work-title">Selected work</h2>
              <p>Each project shows the problem, what I built, and the decision that shaped it.</p>
            </div>
            <div className="split-body">

              {workEntries.map((entry) => (
                <article className="case" id={entry.id} key={entry.id}>
                  <h3>{entry.title}</h3>
                  <p className="tagline">{entry.tagline}</p>
                  <dl>
                    <dt>Problem</dt>
                    <dd>{entry.problem}</dd>
                    <dt>What I did</dt>
                    <dd>{entry.solution}</dd>
                    <dt>Key decision</dt>
                    <dd>{entry.decision}</dd>
                    <dt>Result</dt>
                    <dd>{entry.result}</dd>
                    <dt>Stack</dt>
                    <dd>
                      <ul className="chips">
                        {(entry.stack || []).map((s: string) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </dd>
                  </dl>
                  <p className="case-links">
                    {entry.githubUrl && <a href={entry.githubUrl}>Source on GitHub</a>}
                    {entry.notesUrl && <a href={entry.notesUrl}>Read the design notes</a>}
                    {entry.liveUrl && <a href={entry.liveUrl}>Live demo</a>}
                  </p>
                </article>
              ))}

            </div>
          </div>
        </section>

        {/* ── Stack ──────────────────────────────────────────── */}
        <section className="section" id="stack" aria-labelledby="stack-title">
          <div className="wrap split">
            <div className="split-head">
              <h2 id="stack-title">Stack</h2>
              <p>What I reach for, and how I check that it works.</p>
            </div>
            <div className="split-body">
              <dl className="facts">
                <dt>Languages</dt>
                <dd><ul className="chips"><li>Go</li><li>TypeScript</li><li>Python</li><li>SQL</li></ul></dd>
                <dt>Backend</dt>
                <dd><ul className="chips"><li>REST</li><li>gRPC</li><li>PostgreSQL</li><li>Redis</li></ul></dd>
                <dt>Infrastructure</dt>
                <dd><ul className="chips"><li>Docker</li><li>Kubernetes</li><li>Terraform</li><li>GitHub Actions</li></ul></dd>
                <dt>Quality</dt>
                <dd><ul className="chips"><li>Unit tests</li><li>Integration tests</li><li>k6 load tests</li><li>OpenTelemetry</li></ul></dd>
                <dt>Security</dt>
                <dd><ul className="chips"><li>Burp Suite</li><li>Ghidra</li><li>pwndbg</li><li>Wireshark</li><li>nmap</li></ul></dd>
              </dl>
            </div>
          </div>
        </section>

        {/* ── CTF ────────────────────────────────────────────── */}
        <section className="section" id="ctf" aria-labelledby="ctf-title">
          <div className="wrap split">
            <div className="split-head">
              <h2 id="ctf-title">CTF &amp; Security Research</h2>
              <p>Machines owned, competitions entered, and findings worth writing up.</p>
            </div>
            <div className="split-body">

              {/* Stats bar */}
              <div className="ctf-stats" role="list" aria-label="CTF statistics">
                {CTF_STATS.map(s => (
                  <div key={s.label} className="ctf-stat" role="listitem">
                    <span className="ctf-stat-val">{s.val}</span>
                    <span className="ctf-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Cards grid */}
              <ul className="ctf-grid">
                {ctfEntries.map(entry => (
                  <li key={entry.id} id={entry.id}>
                    <article className="ctf-card">
                      <div className="ctf-card-head">
                        <h3>{entry.name}</h3>
                        <span className="ctf-badge" data-diff={entry.difficulty}>
                          {entry.difficulty}
                        </span>
                      </div>
                      <span className="ctf-event">{entry.event}</span>
                      <p>{entry.body || entry.summary}</p>
                      <ul className="ctf-tags">
                        {(entry.tags || []).map((t: string) => <li key={t}>{t}</li>)}
                      </ul>
                      {entry.writeupHref && (
                        <a className="ctf-link" href={entry.writeupHref}>
                          Read writeup →
                        </a>
                      )}
                    </article>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </section>

        {/* ── Engineering notes ──────────────────────────────── */}
        <section className="section" id="notes" aria-labelledby="notes-title">
          <div className="wrap split">
            <div className="split-head">
              <h2 id="notes-title">Engineering notes</h2>
              <p>Design write-ups, plus the occasional security finding.</p>
            </div>
            <div className="split-body">
              {noteEntries.map((note) => (
                <article className="writeup" key={note.id}>
                  <div className="w-meta">
                    <time dateTime={note.date}>{note.date}</time>
                    <span>{note.category}</span>
                  </div>
                  <div>
                    <h3><a href={note.url || '#'}>{note.title}</a></h3>
                    <p>{note.body || note.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Approach ───────────────────────────────────────── */}
        <section className="section" id="approach" aria-labelledby="approach-title">
          <div className="wrap split">
            <div className="split-head">
              <h2 id="approach-title">How I build a new service</h2>
            </div>
            <div className="split-body">
              <ol className="steps">
                <li><div>
                  <h3>Write the interface first</h3>
                  <p>Sketch the API and its failure modes in a short design doc before writing code.</p>
                </div></li>
                <li><div>
                  <h3>Make it testable</h3>
                  <p>Inject time, randomness, and I/O so tests run fast and give the same answer every time.</p>
                </div></li>
                <li><div>
                  <h3>Make it observable</h3>
                  <p>Ship logs, metrics, and traces with the first version, not after the first outage.</p>
                </div></li>
                <li><div>
                  <h3>Threat-model before release</h3>
                  <p>Ask how it could be abused, and add a test for each answer.</p>
                </div></li>
              </ol>
            </div>
          </div>
        </section>

        {/* ── Contact ────────────────────────────────────────── */}
        <section className="section" id="contact" aria-labelledby="contact-title">
          <div className="wrap split">
            <div className="split-head">
              <h2 id="contact-title">Contact</h2>
              <p>Email is the fastest way to reach me.</p>
            </div>
            <div className="split-body">
              <dl className="facts">
                <dt>Email</dt>
                <dd id="emailSlot"><EmailReveal /></dd>
                <dt>Profiles</dt>
                <dd className="profiles">
                  <a href="https://github.com/RooneyMugacha">GitHub</a>
                  <a href="#">LinkedIn</a>
                  <a href="#">Hack The Box</a>
                  <a href="#">CTFtime</a>
                </dd>
                <dt>Certifications</dt>
                <dd>CompTIA Security+, eJPT</dd>
              </dl>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="wrap">
          <span>© 2026 yourname</span>
          <a href="#">Security contact (security.txt)</a>
        </div>
      </footer>
    </>
  );
}
