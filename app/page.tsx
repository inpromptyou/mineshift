import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0C] text-gray-100 antialiased">
      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L2 6v8h4v-4h4v4h4V6L8 1z" fill="#000" strokeWidth="0"/></svg>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">MineShift</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-[13px] text-gray-400 hover:text-white transition-colors hidden sm:block">Features</Link>
            <Link href="#roi" className="text-[13px] text-gray-400 hover:text-white transition-colors hidden sm:block">ROI</Link>
            <Link href="/dashboard" className="text-[13px] bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero with background image */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1562078809-c5391dc9f390?w=1920&q=80&auto=format" 
            alt="Open pit mine operations"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C] via-[#0A0A0C]/90 to-[#0A0A0C]/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-[#0A0A0C]/40"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              <span className="text-[12px] text-amber-400 font-medium">Purpose-built for mining operations</span>
            </div>
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-tight mb-6">
              Your shift handover<br />
              <span className="text-amber-500">actually works now</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-xl mb-10">
              No more Word docs. No more &quot;I thought you told night shift.&quot; 
              MineShift gives every crew a structured, searchable handover that works 
              offline and holds up under audit.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-7 py-3.5 rounded-lg transition-colors text-[15px]">
                Request demo
              </Link>
              <Link href="#how-it-works" className="border border-white/15 hover:border-white/25 text-gray-300 font-medium px-7 py-3.5 rounded-lg transition-colors text-[15px] backdrop-blur-sm">
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/[0.06] py-10 bg-[#0A0A0C]">
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

      {/* Problem section with image */}
      <section className="py-24" id="how-it-works">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[13px] text-amber-500 font-medium uppercase tracking-widest mb-4">The problem</p>
              <h2 className="text-3xl font-bold tracking-tight mb-6">You already know this is broken</h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Night shift didn&apos;t mention the bearing temp on Crusher 2. 
                The action from Tuesday never got closed out. 
                The auditor wants to know who signed off on the risk assessment. 
                Sound familiar?
              </p>
              <div className="space-y-5">
                {[
                  { num: '01', title: 'Information loss', desc: 'Critical details disappear between shifts. No searchable history. No accountability.' },
                  { num: '02', title: 'Manual reporting', desc: 'Supervisors spend 30-60 minutes per handover writing reports instead of supervising.' },
                  { num: '03', title: 'Audit exposure', desc: 'When regulators ask "who knew what, when?" — you can\'t answer definitively.' },
                ].map(item => (
                  <div key={item.num} className="flex gap-4">
                    <span className="text-[12px] font-mono text-amber-500/50 mt-0.5">{item.num}</span>
                    <div>
                      <h3 className="text-[15px] font-semibold mb-1">{item.title}</h3>
                      <p className="text-[14px] text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1580058572462-98e2c0e0e2f0?w=800&q=80&auto=format" 
                alt="Mining haul truck"
                className="w-full h-[500px] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C]/60 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white/[0.01]" id="features">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[13px] text-amber-500 font-medium uppercase tracking-widest mb-4">Features</p>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Built for how mines actually work</h2>
            <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
              This isn&apos;t ServiceNow with a mining skin. It&apos;s built for supervisors 
              who work in 45-degree heat and need something that works when the network doesn&apos;t.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80&auto=format',
                title: 'Structured handover',
                desc: 'Safety, production, equipment, and issues — pre-built sections that match how your crews actually talk.',
              },
              { 
                img: 'https://images.unsplash.com/photo-1557761469-7eb05db7abd5?w=600&q=80&auto=format',
                title: 'Offline-first architecture',
                desc: 'Works underground, in the pit, or during outages. Data syncs automatically when connectivity returns.',
              },
              { 
                img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80&auto=format',
                title: 'Immutable audit trail',
                desc: 'Every entry is cryptographically hashed and timestamped. Tamper-evident by design.',
              },
            ].map(f => (
              <div key={f.title} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden group">
                <div className="h-48 overflow-hidden">
                  <img src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-[15px] font-semibold mb-2">{f.title}</h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* More features list */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {[
              { title: 'Action tracking', desc: 'Assign actions with owners, due times, and priority. Track from open to evidence-verified closure.' },
              { title: 'AI-powered summaries', desc: 'Automatic shift summaries from structured data. Top risks, watch items, and handover briefs with citations.' },
              { title: 'Compliance-ready exports', desc: 'One-click monthly packs for safety, production, and ESG reporting. No spreadsheet assembly.' },
            ].map(f => (
              <div key={f.title} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <div className="w-1 h-5 bg-amber-500/30 rounded-full mb-4"></div>
                <h3 className="text-[15px] font-semibold mb-2">{f.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interface Preview */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[13px] text-amber-500 font-medium uppercase tracking-widest mb-4">Interface</p>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Looks like this on your iPad</h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Big buttons because gloves exist. Dark screen because the Pilbara sun 
                doesn&apos;t care about your UI. Everything a supervisor needs, nothing they don&apos;t.
              </p>
              <div className="space-y-4">
                {[
                  'Tablet-optimized with 44px minimum touch targets',
                  'Works offline — syncs when connectivity returns',
                  'Cryptographic hash chain for every entry',
                  'Role-based access by site, crew, and position',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-[14px]">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* App preview */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
                <div>
                  <div className="text-[15px] font-semibold">Night Shift — Newman Operations</div>
                  <div className="text-[13px] text-gray-500 mt-0.5">Processing Plant / Crew Alpha / 16 Feb 2026</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-[12px] text-green-400 font-medium">Active</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-[#0A0A0C] rounded-lg p-4">
                  <div className="text-[11px] text-gray-600 mb-1">Tonnes Mined</div>
                  <div className="text-xl font-mono font-bold">8,247</div>
                  <div className="text-[11px] text-green-500 mt-1">+12% vs target</div>
                </div>
                <div className="bg-[#0A0A0C] rounded-lg p-4">
                  <div className="text-[11px] text-gray-600 mb-1">Equipment</div>
                  <div className="text-xl font-mono font-bold">94.2%</div>
                  <div className="text-[11px] text-gray-500 mt-1">1 truck down</div>
                </div>
                <div className="bg-[#0A0A0C] rounded-lg p-4">
                  <div className="text-[11px] text-gray-600 mb-1">Open Actions</div>
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
              <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Synced 2 min ago
                </div>
                <div className="text-[12px] text-gray-600 font-mono">Hash: a7f3c9...2d1e</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width image break */}
      <section className="relative h-[400px]">
        <img 
          src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=1920&q=80&auto=format" 
          alt="Aerial view of mine site"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0A0A0C]/70"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-2xl px-6">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Built for Australian conditions</h2>
            <p className="text-gray-300 leading-relaxed">Pilbara heat. Goldfields dust. Underground dead zones. If your crew can get there, MineShift works there.</p>
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-24" id="roi">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-[13px] text-amber-500 font-medium uppercase tracking-widest mb-4">ROI</p>
            <h2 className="text-3xl font-bold tracking-tight">The numbers speak for themselves</h2>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="space-y-6 text-[14px]">
              <div className="flex items-start justify-between pb-5 border-b border-white/[0.06]">
                <div>
                  <div className="font-medium">Supervisor time recovered</div>
                  <div className="text-gray-500 mt-0.5">40 supervisors x 30 min/shift x 2 shifts/day</div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-semibold text-green-400">40 hrs/day</div>
                  <div className="text-[12px] text-gray-600">~A$1.7M/year</div>
                </div>
              </div>
              <div className="flex items-start justify-between pb-5 border-b border-white/[0.06]">
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
                  <div className="font-semibold text-green-400">Hours to minutes</div>
                  <div className="text-[12px] text-gray-600">Full traceability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1920&q=80&auto=format" 
            alt="Industrial mining landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0A0A0C]/85"></div>
        </div>
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Try it on one crew. See what happens.</h2>
          <p className="text-gray-300 mb-10 leading-relaxed">
            No six-month rollout. No SAP integration. Pick one area, 
            run it for a month, and see if your handovers get better. They will.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-7 py-3.5 rounded-lg transition-colors text-[15px]">
              Request a demo
            </Link>
            <a href="mailto:hello@mineshift.com" className="text-[15px] text-gray-400 hover:text-white transition-colors font-medium">
              Contact sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10 bg-[#0A0A0C]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1L2 6v8h4v-4h4v4h4V6L8 1z" fill="#000" strokeWidth="0"/></svg>
            </div>
            <span className="text-[13px] font-medium text-gray-500">MineShift</span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-gray-600">
            <span>Built in Australia</span>
            <span>© 2026 MineShift Pty Ltd</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
