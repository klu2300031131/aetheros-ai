import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, AlertTriangle, Battery, Shield, Cpu, RefreshCw, Layers, DollarSign, Box, Ship, CheckCircle } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [recApproved, setRecApproved] = useState(false);

  const [liveKpis, setLiveKpis] = useState({
    revenue: 41295000,
    inventory: 94820,
    shipments: 482,
    risk: 18,
    carbon: 42.4
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', msg: 'Rotterdam Port Congestion Index rose to 8.2 (Heavy delay risk)', time: 'Just now' },
    { id: 2, type: 'warning', msg: 'Weather system detected off coast of Japan. Carrier 48-B has adjusted course', time: '5m ago' },
    { id: 3, type: 'info', msg: 'Compliance check passed for Shanghai exports batch X-99', time: '14m ago' }
  ]);

  // Adjust KPIs if action is approved
  useEffect(() => {
    if (recApproved) {
      setLiveKpis(prev => ({
        ...prev,
        risk: 8, // Risk drops as typhoon is bypassed
        carbon: 43.6 // Carbon footprint increases by +1.2t
      }));

      // Add success log to ticker
      setAlerts(prev => [
        { id: Date.now(), type: 'info', msg: '[SUCCESS] Executive route override dispatched to Carrier AETHER-994 (Hawaii path)', time: 'Just now' },
        ...prev
      ]);
    }
  }, [recApproved]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveKpis(prev => {
        // Keep mitigated risk and carbon locked to success values
        const currentRisk = recApproved ? 8 : prev.risk;
        const currentCarbon = recApproved ? 43.6 : prev.carbon;

        return {
          revenue: prev.revenue + Math.floor(Math.random() * 200) + 50,
          inventory: prev.inventory + Math.floor(Math.random() * 10) - 5,
          shipments: prev.shipments + (Math.random() > 0.8 ? 1 : 0),
          risk: recApproved ? 8 : Math.max(10, Math.min(90, currentRisk + (Math.random() > 0.5 ? 1 : -1))),
          carbon: recApproved ? 43.6 : parseFloat((currentCarbon + (Math.random() * 0.2 - 0.1)).toFixed(1))
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [recApproved]);

  const chartData = [
    { name: '08:00', revenue: 3200, inventory: 4000, risk: 12 },
    { name: '10:00', revenue: 3600, inventory: 3800, risk: 14 },
    { name: '12:00', revenue: 4100, inventory: 3500, risk: 15 },
    { name: '14:00', revenue: 4800, inventory: 3600, risk: 18 },
    { name: '16:00', revenue: 5200, inventory: 3200, risk: 17 },
    { name: '18:00', revenue: 5900, inventory: 3100, risk: 19 }
  ];

  const pieData = [
    { name: 'In Transit', value: 240, color: '#3b82f6' },
    { name: 'Delayed', value: 34, color: '#ef4444' },
    { name: 'At Port', value: 110, color: '#06b6d4' },
    { name: 'Customs Clear', value: 98, color: '#10b981' }
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-sans tracking-tight text-white">Executive Command</h2>
          <p className="text-xs text-brand-muted mt-1">Autonomous orchestration across 6 core channels</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('copilot')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple px-4 py-2.5 text-xs font-bold hover:opacity-90 transition-opacity"
          >
            <Cpu className="h-4 w-4" />
            <span>Consult Copilot</span>
          </button>
          <button
            onClick={() => {
              setRecApproved(false);
              setLiveKpis(prev => ({ ...prev, risk: 48 }));
              setAlerts(prev => [
                { id: Date.now(), type: 'critical', msg: '[SIMULATED ALERT] Tokyo typhoon pathway coordinates updated: High delay risk.', time: 'Just now' },
                ...prev
              ]);
            }}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="h-4 w-4 animate-spin-slow" />
            <span>Simulate Outage</span>
          </button>
        </div>
      </div>

      {/* Live KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-brand-muted uppercase font-semibold">Total Revenue</span>
            <DollarSign className="h-4 w-4 text-brand-cyan" />
          </div>
          <p className="text-xl lg:text-2xl font-bold mt-4 font-sans text-glow-blue">
            ${(liveKpis.revenue / 1000000).toFixed(3)}M
          </p>
          <span className="text-[10px] text-brand-emerald font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> +14.2% YoY
          </span>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-brand-muted uppercase font-semibold">Active Inventory</span>
            <Box className="h-4 w-4 text-brand-purple" />
          </div>
          <p className="text-xl lg:text-2xl font-bold mt-4 font-sans">
            {liveKpis.inventory.toLocaleString()}
          </p>
          <span className="text-[10px] text-brand-muted mt-1 block">94.2% warehouse cap</span>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-brand-muted uppercase font-semibold">Transit Shipments</span>
            <Ship className="h-4 w-4 text-[#10b981]" />
          </div>
          <p className="text-xl lg:text-2xl font-bold mt-4 font-sans">
            {liveKpis.shipments}
          </p>
          <span className="text-[10px] text-brand-cyan mt-1 block">42 lanes active</span>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-brand-muted uppercase font-semibold">Carbon Score</span>
            <AlertTriangle className="h-4 w-4 text-[#eab308]" />
          </div>
          <p className="text-xl lg:text-2xl font-bold mt-4 font-sans">
            {liveKpis.carbon}t
          </p>
          <span className="text-[10px] text-brand-emerald mt-1 block">
            {recApproved ? '+1.2t detour adjustment' : '-2.4t offset standard'}
          </span>
        </div>

        {/* KPI 5 */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-xs text-brand-muted uppercase font-semibold">Risk Index</span>
            <Shield className="h-4 w-4 text-brand-danger" />
          </div>
          <p className={`text-xl lg:text-2xl font-bold mt-4 font-sans ${liveKpis.risk > 30 ? 'text-brand-danger animate-pulse' : 'text-white'}`}>
            {liveKpis.risk}%
          </p>
          <span className="text-[10px] text-brand-muted mt-1 block">
            {recApproved ? 'Bypassing danger sector' : 'Threshold limits normal'}
          </span>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className={`relative glass-panel rounded-2xl p-6 border-l-4 overflow-hidden transition-all duration-300 ${
        recApproved ? 'border-brand-emerald bg-brand-emerald/[0.02]' : 'border-brand-purple'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/5 to-transparent z-0"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex gap-4 items-start">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
              recApproved ? 'bg-brand-emerald/20 text-brand-emerald' : 'bg-brand-purple/20 text-brand-purple'
            }`}>
              {recApproved ? <CheckCircle className="h-5 w-5" /> : <Cpu className="h-5 w-5 animate-pulse" />}
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Autonomous Action Recommendation</span>
                <span className={`rounded px-2 py-0.5 text-[9px] font-semibold ${
                  recApproved ? 'bg-brand-emerald/20 text-brand-emerald' : 'bg-brand-purple/20 text-brand-purple'
                }`}>
                  {recApproved ? 'APPROVED & DISPATCHED' : 'Risk Agent'}
                </span>
              </h4>
              <p className="text-xs text-brand-muted max-w-3xl leading-relaxed">
                {recApproved 
                  ? "Route override command successfully executed. Carrier AETHER-994 has been instructed to deviate via Hawaii to bypass Typhoon Hinnamnor."
                  : "Logistics Agent detected an upcoming storm front off Tokyo. Rerouting Carrier AETHER-994 via Hawaii adds 1.2t CO2, but mitigates a projected 94h delay saving $38k in contract stockout penalties."
                }
              </p>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => onNavigate('predictive')}
              className="rounded-lg bg-white/5 border border-white/10 px-3.5 py-2 text-xs font-semibold hover:bg-white/10 transition-all text-white"
            >
              Explain SHAP
            </button>
            {!recApproved && (
              <button
                onClick={() => setRecApproved(true)}
                className="rounded-lg bg-brand-purple px-3.5 py-2 text-xs font-bold hover:opacity-90 transition-all text-white"
              >
                Approve Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Chart 1 - Area Revenue */}
        <div className="glass-panel rounded-3xl p-6 md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white">Live System Revenue vs. Safety Stock</h3>
              <p className="text-xs text-brand-muted mt-0.5">Tuned real-time logistics valuation</p>
            </div>
            <span className="rounded-full bg-brand-blue/15 px-2.5 py-1 text-[10px] text-brand-cyan font-bold tracking-wider uppercase">
              10s updates
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#8e8e9f" fontSize={11} />
                <YAxis stroke="#8e8e9f" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0c0c16', borderColor: 'rgba(255,255,255,0.1)', color: '#f1f1f6' }} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Revenue ($)" />
                <Area type="monotone" dataKey="inventory" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorInv)" name="Stock Level" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 - Pie Shipment Distribution */}
        <div className="glass-panel rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white">Active Cargo Status</h3>
            <p className="text-xs text-brand-muted mt-0.5">Aggregate transit volume details</p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0c0c16', borderColor: 'rgba(255,255,255,0.1)', color: '#f1f1f6' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <div>
                  <p className="text-[10px] text-brand-muted">{item.name}</p>
                  <p className="text-xs font-bold text-white">{item.value} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications and Alerts Ticker */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Live Operations Log Ticker</h3>
          <span className="h-2 w-2 rounded-full bg-brand-emerald animate-ping"></span>
        </div>
        <div className="divide-y divide-white/5">
          {alerts.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${
                  item.type === 'critical' ? 'bg-brand-danger shadow-[0_0_10px_#ef4444]' :
                  item.type === 'warning' ? 'bg-[#eab308] shadow-[0_0_10px_#eab308]' :
                  'bg-brand-cyan'
                }`}></span>
                <span className="text-xs text-brand-text font-medium">{item.msg}</span>
              </div>
              <span className="text-[10px] text-brand-muted shrink-0 ml-4">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
