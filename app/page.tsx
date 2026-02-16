import Link from 'next/link';

const industries = [
  { emoji: '⛏️', name: 'Mining', desc: 'Open pit, underground, processing plants' },
  { emoji: '🏨', name: 'Hospitality', desc: 'Hotels, restaurants, resorts, events' },
  { emoji: '🏥', name: 'Healthcare', desc: 'Hospitals, aged care, clinics' },
  { emoji: '🏭', name: 'Manufacturing', desc: 'Production lines, quality, maintenance' },
  { emoji: '🛒', name: 'Retail', desc: 'Stores, warehouses, distribution' },
  { emoji: '🔧', name: 'Trades', desc: 'Electricians, plumbers, HVAC, construction' },
  { emoji: '📦', name: 'Warehousing', desc: 'Logistics, inventory, fulfilment' },
  { emoji: '🚛', name: 'Transport', desc: 'Fleet, dispatch, freight operations' },
  { emoji: '🛡️', name: 'Security', desc: 'Patrols, access control, incidents' },
  { emoji: '🧹', name: 'Cleaning', desc: 'Commercial, industrial, facility services' },
];

const features = [
  { icon: '🔄', title: 'Structured handover', desc: 'Pre-built sections that match how your crews actually talk. Safety, operations, equipment, issues — covered.' },
  { icon: '📡', title: 'Offline-first', desc: 'Works without signal. Data syncs automatically when connectivity returns. Built for the real world.' },
  { icon: '🔒', title: 'Immutable audit trail', desc: 'Every entry is cryptographically hashed and timestamped. Tamper-evident by design.' },
  { icon: '✅', title: 'Action tracking', desc: 'Assign actions with owners, due times, and priority. Track from open to evidence-verified closure.' },
  { icon: '🤖', title: 'AI summaries', desc: 'Automatic shift summaries from structured data. Top risks, watch items, and handover briefs with citations.' },
  { icon: '📋', title: 'Industry templates', desc: 'Purpose-built templates for mining, hospitality, healthcare, manufacturing, trades, retail and more.' },
];

const pricing = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    desc: 'Get started with one team',
    features: ['1 team', '30-day history', 'Structured handover', 'Offline-first', 'Audit trail'],
    cta: 'Get started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mo',
    desc: 'For growing operations',
    features: ['Unlimited teams', 'Full history', 'AI-powered summaries', 'Action tracking', 'Priority support'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Business',
    price: '$149',
    period: '/mo',
    desc: 'Multi-site with compliance',
    features: ['Multi-site management', 'Advanced analytics', 'SSO integration', 'Compliance exports', 'Dedicated support'],
    cta: 'Contact sales',
    highlight: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0C] text-gray-100 antialiased">
      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <span className="text-base font-bold text-black">S</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">ShiftSync</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-[13px] text-gray-400 hover:text-white transition-colors hidden sm:block">Features</Link>
            <Link href="#industries" className="text-[13px] text-gray-400 hover:text-white transition-colors hidden sm:block">Industries</Link>
            <Link href="#pricing" className="text-[13px] text-gray-400 hover:text-white transition-colors hidden sm:block">Pricing</Link>
            <Link href="#roi" className="text-[13px] text-gray-400 hover:text-white transition-colors hidden sm:block">ROI</Link>
            <Link href="/signin" className="text-[13px] bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              <span className="text-[12px] text-amber-400 font-medium">Structured shift handover for every industry</span>
            </div>
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-tight mb-6">
              Your shift handover<br />
              <span className="text-amber-500">actually works now</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-xl mb-10">
              No more Word docs. No more &quot;I thought you told night shift.&quot;
              ShiftSync gives every crew a structured, searchable handover that works
              offline and holds up under audit.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/signin" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-7 py-3.5 rounded-lg transition-colors text-[15px]">
                Get started free
              </Link>
              <Link href="#features" className="border border-white/15 hover:border-white/25 text-gray-300 font-medium px-7 py-3.5 rounded-lg transition-colors text-[15px]">
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

      {/* Industries */}
      <section className="py-24" id="industries">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[13px] text-amber-500 font-medium uppercase tracking-widest mb-4">Industries</p>
            <h2 className="text-3xl font-bold tracking-tight mb-4">One platform, every shift-based industry</h2>
            <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Wherever teams hand over between shifts, ShiftSync makes sure nothing falls through the cracks.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {industries.map(ind => (
              <div key={ind.name} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 text-center hover:border-amber-500/30 transition-colors">
                <div className="text-3xl mb-3">{ind.emoji}</div>
                <h3 className="text-[14px] font-semibold mb-1">{ind.name}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white/[0.01]" id="features">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[13px] text-amber-500 font-medium uppercase tracking-widest mb-4">Features</p>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Built for how shift teams actually work</h2>
            <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
              This isn&apos;t a generic form builder. It&apos;s built for supervisors who need
              something that works when the network doesn&apos;t.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-[15px] font-semibold mb-2">{f.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24" id="pricing">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[13px] text-amber-500 font-medium uppercase tracking-widest mb-4">Pricing</p>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricing.map(plan => (
              <div key={plan.name} className={`rounded-2xl p-8 ${plan.highlight ? 'bg-amber-500/10 border-2 border-amber-500/40' : 'bg-white/[0.02] border border-white/[0.06]'}`}>
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <p className="text-[13px] text-gray-500 mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 text-[14px]">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-[14px] text-gray-300">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signin"
                  className={`block text-center py-3 rounded-lg font-medium text-[14px] transition-colors ${plan.highlight ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'border border-white/15 hover:border-white/25 text-gray-300'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-24 bg-white/[0.01]" id="roi">
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
                  <div className="text-gray-500 mt-0.5">30 min saved per handover × 2 shifts/day</div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-semibold text-green-400">1 hr/day per team</div>
                  <div className="text-[12px] text-gray-600">Compounds fast</div>
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
                  <div className="font-semibold text-green-400">Hours → minutes</div>
                  <div className="text-[12px] text-gray-600">Full traceability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white/[0.02] border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Try it on one crew. See what happens.</h2>
          <p className="text-gray-300 mb-10 leading-relaxed">
            No six-month rollout. No complex integration. Pick one team,
            run it for a month, and see if your handovers get better. They will.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signin" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-7 py-3.5 rounded-lg transition-colors text-[15px]">
              Get started free
            </Link>
            <a href="mailto:hello@shiftsync.com" className="text-[15px] text-gray-400 hover:text-white transition-colors font-medium">
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
              <span className="text-xs font-bold text-black">S</span>
            </div>
            <span className="text-[13px] font-medium text-gray-500">ShiftSync</span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-gray-600">
            <span>Built in Australia</span>
            <span>© 2026 ShiftSync Pty Ltd</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
