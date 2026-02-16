import Link from 'next/link';
import { 
  CheckCircleIcon, 
  CloudArrowDownIcon, 
  DocumentCheckIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="text-3xl">⛏️</div>
              <div>
                <h1 className="text-xl font-bold text-orange-500">MineShift</h1>
                <p className="text-xs text-gray-400">Mining Operations</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <Link 
                href="/dashboard"
                className="action-button"
              >
                Open Dashboard
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-6">⛏️</div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-100 mb-6">
              Structured Shift Handover
              <br />
              <span className="text-orange-500">for Mining Operations</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Professional-grade handover system designed specifically for mining operations. 
              Capture every detail, ensure continuity, and maintain operational excellence 
              across all shifts.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="action-button touch-target-lg text-lg px-8 py-4"
              >
                Start New Shift
                <ArrowRightIcon className="ml-2 h-6 w-6" />
              </Link>
              
              <Link
                href="/shifts"
                className="secondary-button touch-target-lg text-lg px-8 py-4"
              >
                View Past Shifts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-100 mb-4">
              Built for Mining Excellence
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every feature designed with mining operations in mind. From safety protocols 
              to production metrics, we understand your challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Offline-First */}
            <div className="metric-card text-center">
              <CloudArrowDownIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Offline-First</h3>
              <p className="text-gray-400">
                Works underground, in remote areas, or during network outages. 
                Sync automatically when connected.
              </p>
            </div>

            {/* Audit-Grade */}
            <div className="metric-card text-center">
              <DocumentCheckIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Audit-Grade</h3>
              <p className="text-gray-400">
                Tamper-evident logging with cryptographic verification. 
                Full audit trail for compliance and investigation.
              </p>
            </div>

            {/* AI Summaries */}
            <div className="metric-card text-center">
              <ChartBarIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-100 mb-2">AI Summaries</h3>
              <p className="text-gray-400">
                Intelligent shift summaries highlighting key issues, 
                trends, and action items for management review.
              </p>
            </div>

            {/* Compliance Reports */}
            <div className="metric-card text-center">
              <ShieldCheckIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Compliance Reports</h3>
              <p className="text-gray-400">
                Automated regulatory reporting with safety metrics, 
                incident tracking, and equipment status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Features List */}
            <div>
              <h2 className="text-3xl font-bold text-gray-100 mb-8">
                Everything Mining Supervisors Need
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircleIcon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-100">Safety Incident Tracking</h3>
                    <p className="text-gray-400">Record incidents, hazards, toolbox talks, and PPE issues with full workflow.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircleIcon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-100">Production Metrics</h3>
                    <p className="text-gray-400">Track tonnes mined, hauled, processed. Monitor targets, delays, and ROM levels.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircleIcon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-100">Equipment Status</h3>
                    <p className="text-gray-400">Monitor excavators, trucks, support equipment. Track breakdowns and maintenance.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircleIcon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-100">Action Management</h3>
                    <p className="text-gray-400">Create, assign, and track action items. Evidence capture with photos and documents.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircleIcon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-100">Tablet-Optimized</h3>
                    <p className="text-gray-400">Large touch targets and clear typography designed for iPad use in harsh environments.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Elements */}
            <div className="relative">
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500 font-semibold">Night Shift - 2024-02-16</span>
                    <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">Active</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 p-4 rounded">
                      <div className="text-gray-400 text-sm">Tonnes Mined</div>
                      <div className="text-2xl font-mono font-bold text-green-400">8,247</div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded">
                      <div className="text-gray-400 text-sm">Equipment Up</div>
                      <div className="text-2xl font-mono font-bold text-green-400">94%</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Safety: 15 days without incident</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Production: 3 active delays</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Equipment: Truck-07 down for repair</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gray-800 border-t border-gray-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">
            Ready to Improve Your Shift Handovers?
          </h2>
          <p className="text-gray-300 mb-8">
            Join mining operations worldwide using MineShift for professional, 
            audit-grade shift management.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shifts/new"
              className="action-button touch-target-lg text-lg px-8 py-4"
            >
              <WrenchScrewdriverIcon className="mr-2 h-6 w-6" />
              Create New Shift
            </Link>
            
            <Link
              href="/dashboard"
              className="secondary-button touch-target-lg text-lg px-8 py-4"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">⛏️</div>
              <div>
                <div className="text-lg font-bold text-orange-500">MineShift</div>
                <div className="text-sm text-gray-400">Mining Operations Platform</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-400">
              © 2024 MineShift. Professional mining operations management.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}