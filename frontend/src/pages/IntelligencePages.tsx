import React, { useState } from 'react';
import { ShieldCheck, Leaf, UserCheck, AlertOctagon, HelpCircle, BarChart2 } from 'lucide-react';

export default function IntelligencePages() {
  const [activeSubTab, setActiveSubTab] = useState<'carbon' | 'compliance' | 'supplier'>('carbon');

  const suppliers = [
    { name: 'Ningbo Electronics Co.', location: 'China', reliability: '98.2%', delayAvg: '14h', status: 'Optimal' },
    { name: 'Tokyo Micro Semi', location: 'Japan', reliability: '94.8%', delayAvg: '32h', status: 'Moderate Risk' },
    { name: 'Heidelberg Gears GmbH', location: 'Germany', reliability: '88.5%', delayAvg: '94h', status: 'Severe Delay' },
    { name: 'Austin Silicon Labs', location: 'USA', reliability: '99.4%', delayAvg: '2h', status: 'Optimal' }
  ];

  const carbonOffsets = [
    { lane: 'Shanghai → Los Angeles (Ocean)', emissions: '14.8t CO2', benchmark: 'Target: <18t', status: 'Within Budget' },
    { lane: 'Los Angeles → Frankfurt (Air)', emissions: '28.2t CO2', benchmark: 'Target: <20t', status: 'Excess' },
    { lane: 'Rotterdam → Antwerp (Road)', emissions: '2.1t CO2', benchmark: 'Target: <4t', status: 'Within Budget' }
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Sub Tabs Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-bold font-sans tracking-tight text-white">Operations intelligence</h2>
          <p className="text-xs text-brand-muted mt-1">Audit carbon footprints, regulations compliance, and supplier metrics</p>
        </div>
        
        <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 shrink-0">
          <button
            onClick={() => setActiveSubTab('carbon')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeSubTab === 'carbon' ? 'bg-brand-purple text-white shadow-md' : 'text-brand-muted hover:text-white'
            }`}
          >
            Carbon footprint
          </button>
          <button
            onClick={() => setActiveSubTab('compliance')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeSubTab === 'compliance' ? 'bg-brand-purple text-white shadow-md' : 'text-brand-muted hover:text-white'
            }`}
          >
            Compliance & Rules
          </button>
          <button
            onClick={() => setActiveSubTab('supplier')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeSubTab === 'supplier' ? 'bg-brand-purple text-white shadow-md' : 'text-brand-muted hover:text-white'
            }`}
          >
            Supplier Registry
          </button>
        </div>
      </div>

      {/* Render active subtab */}
      {activeSubTab === 'carbon' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
              <span className="text-xs text-brand-muted font-bold uppercase">Emission Footprint</span>
              <p className="text-2xl font-bold text-white mt-4">42.4 tonnes</p>
              <span className="text-[10px] text-brand-emerald font-semibold block mt-1">✓ Under system tax ceiling</span>
            </div>
            <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
              <span className="text-xs text-brand-muted font-bold uppercase">Offset Credits pool</span>
              <p className="text-2xl font-bold text-white mt-4">$14,200</p>
              <span className="text-[10px] text-brand-cyan font-semibold block mt-1">Allocated to green shipping</span>
            </div>
            <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
              <span className="text-xs text-brand-muted font-bold uppercase">Average Lane Index</span>
              <p className="text-2xl font-bold text-brand-purple mt-4">0.82</p>
              <span className="text-[10px] text-brand-muted block mt-1">Eco-efficiency rating</span>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Leaf className="h-4.5 w-4.5 text-brand-emerald" />
              <span>Lane Carbon Audit Logs</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-brand-muted">
                    <th className="pb-3 font-semibold">Active Lane</th>
                    <th className="pb-3 font-semibold">Calculated Emissions</th>
                    <th className="pb-3 font-semibold">Target Benchmark</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {carbonOffsets.map((c, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01]">
                      <td className="py-4 font-medium text-white">{c.lane}</td>
                      <td className="py-4 text-brand-cyan">{c.emissions}</td>
                      <td className="py-4 text-brand-muted">{c.benchmark}</td>
                      <td className="py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          c.status === 'Within Budget' ? 'bg-brand-emerald/20 text-[#10b981]' : 'bg-brand-danger/20 text-brand-danger'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'compliance' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-brand-purple" />
              <span>Custom Audit Compliance Checklist</span>
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Our automated Compliance Agent queries global trade regulations indexes, certifying tariff documents, customs checks, and import duty declarations.
            </p>

            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">Shanghai Exporters Cert (S-99)</h4>
                  <p className="text-[10px] text-brand-muted mt-1">Verified on 2026-07-14</p>
                </div>
                <span className="rounded bg-brand-emerald/10 px-2 py-0.5 text-[9px] text-[#10b981] font-bold">APPROVED</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">Frankfurt Import Declarations</h4>
                  <p className="text-[10px] text-brand-muted mt-1">Due in 2 days (AETHER-104)</p>
                </div>
                <span className="rounded bg-brand-cyan/10 px-2 py-0.5 text-[9px] text-brand-cyan font-bold">IN PROCESS</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">Rotterdam Custom Bond Check</h4>
                  <p className="text-[10px] text-brand-muted mt-1">Verification failed (Missing Carrier code)</p>
                </div>
                <span className="rounded bg-brand-danger/10 px-2 py-0.5 text-[9px] text-brand-danger font-bold">EXCEPTION</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">Tokyo Export Clearance</h4>
                  <p className="text-[10px] text-brand-muted mt-1">Cleared automatically</p>
                </div>
                <span className="rounded bg-brand-emerald/10 px-2 py-0.5 text-[9px] text-[#10b981] font-bold">APPROVED</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'supplier' && (
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <UserCheck className="h-4.5 w-4.5 text-brand-cyan" />
            <span>Active Supplier HealthRegistry</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-brand-muted">
                  <th className="pb-3 font-semibold">Vendor Name</th>
                  <th className="pb-3 font-semibold">HQ Continent</th>
                  <th className="pb-3 font-semibold">Delivery Reliability</th>
                  <th className="pb-3 font-semibold">Avg Delay Lag</th>
                  <th className="pb-3 font-semibold">Health Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {suppliers.map((s, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01]">
                    <td className="py-4 font-medium text-white">{s.name}</td>
                    <td className="py-4 text-brand-muted">{s.location}</td>
                    <td className="py-4 text-brand-cyan">{s.reliability}</td>
                    <td className="py-4 text-brand-muted">{s.delayAvg}</td>
                    <td className="py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        s.status === 'Optimal' ? 'bg-brand-emerald/20 text-[#10b981]' :
                        s.status === 'Moderate Risk' ? 'bg-[#eab308]/15 text-[#eab308]' :
                        'bg-brand-danger/20 text-brand-danger'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
