import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChart2, ShieldAlert, Award, Activity } from 'lucide-react';

export default function AnalyticsCenter() {
  const radarData = [
    { subject: 'Carbon Index', A: 82, B: 65, fullMark: 100 },
    { subject: 'Cost Efficiency', A: 94, B: 85, fullMark: 100 },
    { subject: 'Delay Mitigation', A: 78, B: 90, fullMark: 100 },
    { subject: 'Compliance Rating', A: 88, B: 80, fullMark: 100 },
    { subject: 'Carrier Reliability', A: 92, B: 75, fullMark: 100 },
    { subject: 'Route Density', A: 85, B: 90, fullMark: 100 }
  ];

  const warehouseOccupancy = [
    { name: 'Shanghai Hub', capacity: 94, occupied: 82, color: '#3b82f6' },
    { name: 'Los Angeles Depot', capacity: 85, occupied: 78, color: '#8b5cf6' },
    { name: 'Rotterdam Port', capacity: 90, occupied: 88, color: '#06b6d4' },
    { name: 'Dallas Terminal', capacity: 70, occupied: 65, color: '#10b981' }
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div>
        <h2 className="text-3xl font-bold font-sans tracking-tight text-white flex items-center gap-3">
          <span>Analytics Center</span>
          <span className="rounded bg-brand-cyan/20 px-2.5 py-0.5 text-xs text-brand-cyan font-bold tracking-wider uppercase">
            Deep Analysis
          </span>
        </h2>
        <p className="text-xs text-brand-muted mt-1">Cross-modal radar profiles and warehouse storage allocations</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Radar Operational Chart */}
        <div className="glass-panel rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white">Multidimensional Operational Health</h3>
            <p className="text-xs text-brand-muted mt-0.5">Comparing target baseline against current performance</p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" stroke="#8e8e9f" fontSize={11} />
                <PolarRadiusAxis stroke="#8e8e9f" fontSize={10} />
                <Radar name="Current Path" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                <Radar name="Target Baseline" dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#f1f1f6' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Warehouse Density Bars */}
        <div className="glass-panel rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white">Warehouse Allocations & Capacities</h3>
            <p className="text-xs text-brand-muted mt-0.5">Maximum vs. active storage occupied</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={warehouseOccupancy} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#8e8e9f" fontSize={11} />
                <YAxis stroke="#8e8e9f" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0c0c16', borderColor: 'rgba(255,255,255,0.1)', color: '#f1f1f6' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="capacity" fill="rgba(255,255,255,0.08)" name="Total Cap (k units)" />
                <Bar dataKey="occupied" fill="#8b5cf6" name="Occupied Stock" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Sankey Simulated Supply Flows */}
      <div className="glass-panel rounded-3xl p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-white font-sans">Active Cargo Flow Mesh</h3>
          <p className="text-xs text-brand-muted mt-0.5">Visual trace of bulk container flows across global ports</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 items-center border border-white/5 bg-white/[0.01] rounded-2xl p-6 relative overflow-hidden">
          {/* Node 1 */}
          <div className="text-center p-4 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl">
            <p className="text-xs font-bold text-brand-cyan uppercase">Shanghai Port</p>
            <p className="text-[10px] text-brand-muted mt-1">14,200 units</p>
          </div>

          {/* Flow line */}
          <div className="hidden md:flex flex-col items-center">
            <span className="text-[10px] text-brand-purple font-mono animate-pulse">Ocean Lanes</span>
            <div className="w-full h-0.5 bg-gradient-to-r from-brand-cyan to-brand-purple relative">
              <span className="absolute right-0 -top-1 h-2.5 w-2.5 rounded-full bg-brand-purple animate-ping"></span>
            </div>
          </div>

          {/* Node 2 */}
          <div className="text-center p-4 bg-brand-purple/10 border border-brand-purple/20 rounded-xl">
            <p className="text-xs font-bold text-brand-purple uppercase">LA Gateway</p>
            <p className="text-[10px] text-brand-muted mt-1">11,000 units</p>
          </div>

          {/* Flow line */}
          <div className="hidden md:flex flex-col items-center">
            <span className="text-[10px] text-brand-emerald font-mono animate-pulse">Rail Corridor</span>
            <div className="w-full h-0.5 bg-gradient-to-r from-brand-purple to-[#10b981] relative">
              <span className="absolute right-0 -top-1 h-2.5 w-2.5 rounded-full bg-[#10b981] animate-ping"></span>
            </div>
          </div>

          {/* Node 3 */}
          <div className="text-center p-4 bg-brand-emerald/10 border border-brand-emerald/20 rounded-xl">
            <p className="text-xs font-bold text-[#10b981] uppercase">Dallas Hub</p>
            <p className="text-[10px] text-brand-muted mt-1">8,400 units</p>
          </div>

          {/* Flow line */}
          <div className="hidden md:flex flex-col items-center">
            <span className="text-[10px] text-brand-cyan font-mono animate-pulse">Last-mile Truck</span>
            <div className="w-full h-0.5 bg-gradient-to-r from-[#10b981] to-brand-cyan relative">
              <span className="absolute right-0 -top-1 h-2.5 w-2.5 rounded-full bg-brand-cyan animate-ping"></span>
            </div>
          </div>

          {/* Node 4 */}
          <div className="text-center p-4 bg-[#eab308]/10 border border-[#eab308]/20 rounded-xl">
            <p className="text-xs font-bold text-[#eab308] uppercase">Customers</p>
            <p className="text-[10px] text-brand-muted mt-1">8,200 delivered</p>
          </div>
        </div>
      </div>
    </div>
  );
}
