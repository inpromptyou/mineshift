import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#111114] text-gray-100">
      {/* Header */}
      <header className="border-b border-[#2a2a30]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⛏️</span>
              <div>
                <h1 className="text-xl font-bold text-amber-500">MineShift</h1>
                <p className="text-xs text-gray-500">Mining Operations</p>
              </div>
            </div>
            <Link href="/dashboard" className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-black font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm">
              Open Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">⛏️</div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Structured Shift Handover
            <br />
            <span className="text-amber-500">for Mining Operations</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Professional-grade handover system designed specifically for mining operations.
            Capture every detail, ensure continuity, and maintain operational excellence
            across all shifts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shifts/new" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-lg px-8 py-4 rounded-lg transition-colors">
              Start New Shift →
            </Link>
            <Link href="/shifts" className="border border-[#2a2a30] hover:border-gray-600 text-gray-300 font-medium text-lg px-8 py-4 rounded-lg transition-colors">
              View Past Shifts
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-[#1a1a1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Built for Mining Excellence</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Every feature designed with mining operations in mind. From safety protocols
              to production metrics, we understand your challenges.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '📡', title: 'Offline-First', desc: 'Works underground, in remote areas, or during network outages. Sync automatically when connected.' },
              { icon: '🔒', title: 'Audit-Grade', desc: 'Tamper-evident logging with cryptographic verification. Full audit trail for compliance and investigation.' },
              { icon: '✨', title: 'AI Summaries', desc: 'Intelligent shift summaries highlighting key issues, trends, and action items for management review.' },
              { icon: '📋', title: 'Compliance Reports', desc: 'Automated regulatory reporting with safety metrics, incident tracking, and equipment status.' },
            ].map(item => (
              <div key={item.title} className="bg-[#111114] border border-[#2a2a30] rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8">Everything Mining Supervisors Need</h2>
              <div className="space-y-6">
                {[
                  { title: 'Safety Incident Tracking', desc: 'Record incidents, hazards, toolbox talks, and PPE issues with full workflow.' },
                  { title: 'Production Metrics', desc: 'Track tonnes mined, hauled, processed. Monitor targets, delays, and ROM levels.' },
                  { title: 'Equipment Status', desc: 'Monitor excavators, trucks, support equipment. Track breakdowns and maintenance.' },
                  { title: 'Action Management', desc: 'Create, assign, and track action items. Evidence capture with photos and documents.' },
                  { title: 'Tablet-Optimized', desc: 'Large touch targets and clear typography designed for iPad use in harsh environments.' },
                ].map(f => (
                  <div key={f.title} className="flex items-start gap-4">
                    <span className="text-amber-500 mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold">{f.title}</h3>
                      <p className="text-gray-500 text-sm">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-[#1a1a1f] rounded-lg p-8 border border-[#2a2a30]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-amber-500 font-semibold">Night Shift — 2026-02-16</span>
                <span className="px-3 py-1 bg-green-600/20 text-green-400 text-sm rounded-full">Active</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#111114] p-4 rounded-lg">
                  <div className="text-gray-500 text-sm">Tonnes Mined</div>
                  <div className="text-2xl font-mono font-bold text-green-400">8,247</div>
                </div>
                <div className="bg-[#111114] p-4 rounded-lg">
                  <div className="text-gray-500 text-sm">Equipment Up</div>
                  <div className="text-2xl font-mono font-bold text-green-400">94%</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-gray-400">Safety: 15 days without incident</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                  <span className="text-sm text-gray-400">Production: 3 active delays</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-sm text-gray-400">Equipment: Truck-07 down for repair</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1a1a1f] border-t border-[#2a2a30]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold mb-4">Ready to Improve Your Shift Handovers?</h2>
          <p className="text-gray-400 mb-8">Professional, audit-grade shift management for mining operations.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shifts/new" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-lg px-8 py-4 rounded-lg transition-colors">
              Create New Shift
            </Link>
            <Link href="/dashboard" className="border border-[#2a2a30] hover:border-gray-600 text-gray-300 font-medium text-lg px-8 py-4 rounded-lg transition-colors">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a30] py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⛏️</span>
            <div>
              <div className="text-lg font-bold text-amber-500">MineShift</div>
              <div className="text-sm text-gray-600">Mining Operations Platform</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">© 2026 MineShift</div>
        </div>
      </footer>
    </div>
  );
}
