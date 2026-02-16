import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0C] text-gray-100 antialiased">
      {/* Nav */}
      <nav className="border-b border-white/[0.06] backdrop-blur-sm sticky top-0 z-50 bg-[#0A0A0C]/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L2 6v8h4v-4h4v4h4V6L8 1z" fill="#000" strokeWidth="0"/></svg>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">MineShift</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-[13px] text-gray-500 hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-[13px] text-gray-500 hover:text-white transition-colors">How it works</Link>
            <Link href="/dashboard" className="text-[13px] bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            <span className="text-[12px] text-amber-400 font-medium">Purpose-built for mining operations</span>
          </div>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.08] tracking-tight mb-6">
            Shift handover that<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">never drops the ball</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            MineShift replaces Word docs, emails, and verbal handovers with a structured, 
            offline-first system that keeps every shift accountable. Audit-grade logs. 
            Zero information loss.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-7 py-3 rounded-lg transition-colors text-[15px]">
              Request demo
            </Link>
            <Link href="#how-it-works" className="border border-white/10 hover:border-white/20 text-gray-300 font-medium px-7 py-3 rounded-lg transition-colors text-[15px]">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-white/[0.06] py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold font-mono text-white">30 min</div>
              <div className="text-[13px] text-gray-500 mt-1">Saved per handover</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono text-white">100%</div>
              <div className="text-[13px] text-gray-500 mt-1">Audit traceability</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono text-white">Offline</div>
              <div className="text-[13px] text-gray-500 mt-1">Works without signal</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono text-white">Zero</div>
              <div className="text-[13px] text-gray-500 mt-1">Information lost between shifts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24" id="how-it-works">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-[13px] text-amber-500 font-medium uppercase tracking-widest mb-4">The problem</p>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Shift handover is broken</h2>
            <p className="text-gray-400 leading-relaxed">
              Every mine site runs 2-3 handovers per day. Most still use Word documents, 
              emails, or verbal updates. Information gets lost. Actions slip through the cracks. 
              Auditors find gaps. Supervisors spend more time writing reports than supervising.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Information loss', desc: 'Critical details disappear between shifts. No searchable history. No accountability trail.' },
              { num: '02', title: 'Manual reporting', desc: 'Supervisors spend 30-60 minutes per handover writing reports that nobody reads systematically.' },
              { num: '03', title: 'Audit exposure', desc: 'When regulators or internal audit ask "who knew what, when?" — you can\'t answer definitively.' },
            ].map(item => (
              <div key={item.num} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                <span className="text-[12px] font-mono text-amber-500/60">{item.num}</span>
                <h3 className="text-[15px] font-semibold mt-3 mb-2">{item.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white/[0.01]" id="features">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-[13px] text-amber-500 font-medium uppercase tracking-widest mb-4">Features</p>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Built for how mines actually work</h2>
            <p className="text-gray-400 leading-relaxed">
              Not another generic workflow tool with a mining template bolted on. 
              MineShift is designed from the ground up for site operations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              { 
                title: 'Structured handover',
                desc: 'Safety, production, equipment, and issues — pre-built sections that match how your crews actually talk. Not a blank text box.',
              },
              { 
                title: 'Offline-first architecture',
                desc: 'Works underground, in the pit, or during network outages. Data syncs automatically when connectivity returns. No data loss, ever.',
              },
              { 
                title: 'Immutable audit trail',
                desc: 'Every entry is cryptographically hashed and timestamped. Who changed what, when, and why. Tamper-evident by design.',
              },
              { 
                title: 'Action tracking',
                desc: 'Assign actions with owners, due times, and priority. Track status from open to evidence-verified closure. Nothing falls through.',
              },
              { 
                title: 'AI-powered summaries',
                desc: 'Automatic shift summaries generated from structured data. Top risks, watch items, and handover briefs — with citations back to source entries.',
              },
              { 
                title: 'Compliance-ready exports',
                desc: 'One-click monthly packs for safety, production, and ESG reporting. Pulls directly from operational data. No more spreadsheet assembly.',
              },
            ].map(f => (
              <div key={f.title} className="flex gap-4">
                <div className="w-1 bg-amber-500/30 rounded-full flex-shrink-0 mt-1" style={{height: '20px'}}></div>
                <div>
                  <h3 className="text-[15px] font-semibold mb-1.5">{f.title}</h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interface Preview */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-[13px] text-amber-500 font-medium uppercase tracking-widest mb-4">Interface</p>
            <h2 className="text-3xl font-bold tracking-tight">Designed for tough conditions</h2>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
              <div>
                <div className="text-[15px] font-semibold">Night Shift — Newman Operations</div>
                <div className="text-[13px] text-gray-500 mt-0.5">Processing Plant / Crew Alpha / 16 Feb 2026</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-[12px] text-green-400 font-medium">Active</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#0A0A0C] rounded-lg p-4">
                <div className="text-[12px] text-gray-600 mb-1">Tonnes Mined</div>
                <div className="text-xl font-mono font-bold">8,247</div>
                <div className="text-[11px] text-green-500 mt-1">+12% vs target</div>
              </div>
              <div className="bg-[#0A0A0C] rounded-lg p-4">
                <div className="text-[12px] text-gray-600 mb-1">Equipment Avail.</div>
                <div className="text-xl font-mono font-bold">94.2%</div>
                <div className="text-[11px] text-gray-500 mt-1">1 truck down</div>
              </div>
              <div className="bg-[#0A0A0C] rounded-lg p-4">
                <div className="text-[12px] text-gray-600 mb-1">Open Actions</div>
                <div className="text-xl font-mono font-bold text-amber-400">3</div>
                <div className="text-[11px] text-red-400 mt-1">1 overdue</div>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-[13px]">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span className="text-gray-400">Safety — 15 days without recordable incident</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                <span className="text-gray-400">Crusher 2 — bearing temperature elevated, monitoring</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                <span className="text-gray-400">HT-07 — hydraulic fault, maintenance dispatched</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[12px] text-gray-600">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Synced 2 min ago
              </div>
              <div className="text-[12px] text-gray-600 font-mono">Hash: a7f3c9...2d1e</div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-24 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-[13px] text-amber-500 font-medium uppercase tracking-widest mb-4">ROI</p>
            <h2 className="text-3xl font-bold tracking-tight">The numbers speak for themselves</h2>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="space-y-6 text-[14px]">
              <div className="flex items-start justify-between pb-4 border-b border-white/[0.06]">
                <div>
                  <div className="font-medium">Supervisor time recovered</div>
                  <div className="text-gray-500 mt-0.5">40 supervisors x 30 min/shift x 2 shifts/day</div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-semibold text-green-400">40 hrs/day</div>
                  <div className="text-[12px] text-gray-600">~A$1.7M/year</div>
                </div>
              </div>
              <div className="flex items-start justify-between pb-4 border-b border-white/[0.06]">
                <div>
                  <div className="font-medium">Missed action reduction</div>
                  <div className="text-gray-500 mt-0.5">Structured tracking vs verbal/email</div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-semibold text-green-400">90%+ closure</div>
                  <div className="text-[12px] text-gray-600">vs ~60% typical</div>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">Audit preparation time</div>
                  <div className="text-gray-500 mt-0.5">One-click vs manual spreadsheet assembly</div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-semibold text-green-400">Hours → minutes</div>
                  <div className="text-[12px] text-gray-600">Full traceability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Stop losing information between shifts</h2>
          <p className="text-gray-400 mb-10 leading-relaxed">
            MineShift deploys in days, not months. No SAP integration required for v1. 
            Start with one area, prove the value, then scale.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-7 py-3.5 rounded-lg transition-colors text-[15px]">
              Request a demo
            </Link>
            <a href="mailto:hello@mineshift.com" className="text-[15px] text-gray-400 hover:text-white transition-colors font-medium">
              Contact sales →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1L2 6v8h4v-4h4v4h4V6L8 1z" fill="#000" strokeWidth="0"/></svg>
            </div>
            <span className="text-[13px] font-medium text-gray-500">MineShift</span>
          </div>
          <div className="text-[12px] text-gray-600">© 2026 MineShift Pty Ltd</div>
        </div>
      </footer>
    </div>
  );
}
