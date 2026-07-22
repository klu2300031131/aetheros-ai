import React, { useState } from 'react';
import { Cpu, Layers, MessageSquare, Terminal, Activity, Play, CheckCircle } from 'lucide-react';

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string>('executive');
  const [simulationActive, setSimulationActive] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const agents = [
    { id: 'executive', name: 'Executive Agent', status: 'Idle', color: 'text-brand-purple', border: 'border-brand-purple/20', bg: 'bg-brand-purple/5', capabilities: 'Coordinates all sub-agents, resolves route and warehouse optimization, issues final execution orders.' },
    { id: 'forecast', name: 'Forecast Agent', status: 'Online', color: 'text-brand-cyan', border: 'border-brand-cyan/20', bg: 'bg-brand-cyan/5', capabilities: 'Monitors historical sales trends and external market demand vectors. Runs regression models.' },
    { id: 'logistics', name: 'Logistics Agent', status: 'Active', color: 'text-brand-blue', border: 'border-brand-blue/20', bg: 'bg-brand-blue/5', capabilities: 'Interfaces with shipping API tunnels, marine traffic charts, flight telemetry, and highway logistics.' },
    { id: 'supplier', name: 'Supplier Agent', status: 'Online', color: 'text-[#eab308]', border: 'border-[#eab308]/20', bg: 'bg-[#eab308]/5', capabilities: 'Monitors manufacturer factory capacity levels, supply lead times, and financial health scores.' },
    { id: 'risk', name: 'Risk Agent', status: 'Active', color: 'text-brand-danger', border: 'border-brand-danger/20', bg: 'bg-brand-danger/5', capabilities: 'Analyzes global weather reports, political risk factors, and port labor contract disputes.' },
    { id: 'finance', name: 'Finance Agent', status: 'Online', color: 'text-brand-emerald', border: 'border-brand-emerald/20', bg: 'bg-brand-emerald/5', capabilities: 'Calculates cargo margins, tax tariffs, delay penalty costs, and optimal insurance thresholds.' },
    { id: 'carbon', name: 'Carbon Agent', status: 'Online', color: 'text-brand-emerald', border: 'border-brand-emerald/20', bg: 'bg-brand-emerald/5', capabilities: 'Estimates carbon offset metrics for maritime lanes, flights, and distribution centers.' },
    { id: 'compliance', name: 'Compliance Agent', status: 'Online', color: 'text-brand-purple', border: 'border-brand-purple/20', bg: 'bg-brand-purple/5', capabilities: 'Validates trade guidelines, customs certificates, custom duties tariffs, and global regulations.' }
  ];

  const agentLogs: Record<string, string[]> = {
    executive: [
      "[SYSTEM] Executive Command Node listening...",
      "[INFO] Processing request 'Audit Tokyo Trade Path'...",
      "[INFO] Querying Forecast Agent for target lane demand...",
      "[INFO] Dispatched compliance validation check to Compliance Agent..."
    ],
    forecast: [
      "[MODEL] Demand prediction model initialized...",
      "[INFO] Input metrics: Lane Tokyo-SF, seasonality factor 1.25",
      "[MODEL] Projected demand: 18,200 units for Q3 (94% confidence)"
    ],
    logistics: [
      "[TELEMETRY] Connection established with Maersk API Gateway...",
      "[INFO] Tracking Carrier AETHER-994. Current speed: 18 knots.",
      "[WARN] Severe weather alert off Tokyo coast. Speed slowing."
    ],
    risk: [
      "[ALERT] Storm category 3 forming off Honshu Island.",
      "[INFO] Running simulated impact on shipping lanes...",
      "[INFO] Projection: 94h approach delay risk (High probability)."
    ]
  };

  const simTimeline = [
    { title: 'Demand Anomaly Triggered', agent: 'Forecast Agent', log: 'Projected demand surge +18% in Dallas warehouse.' },
    { title: 'Stockout Risk Assessment', agent: 'Risk Agent', log: 'Stock levels projected to deplete in 4 days. Stockout probability: 92%.' },
    { title: 'Alternative Path Mapping', agent: 'Logistics Agent', log: 'Identified 3 alternate ocean carriers from Shanghai to Port of LA.' },
    { title: 'Tax & Compliance Audit', agent: 'Compliance Agent', log: 'Checked trade tariffs for new carrier. Duty is matching standard 4.2%.' },
    { title: 'Carbon Footprint Optimization', agent: 'Carbon Agent', log: 'Alternate route adds +0.8t carbon dioxide. Recommends offsetting via carbon credit pools.' },
    { title: 'Action Dispatched', agent: 'Executive Agent', log: 'Approved plan. Rerouting Carrier Alpha. System safety index restored to 0.88.' }
  ];

  const runSimulation = () => {
    setSimulationActive(true);
    setSimStep(0);
    const interval = setInterval(() => {
      setSimStep(prev => {
        if (prev >= simTimeline.length - 1) {
          clearInterval(interval);
          return simTimeline.length - 1;
        }
        return prev + 1;
      });
    }, 1800);
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-sans tracking-tight text-white flex items-center gap-3">
            <span>Autonomous Multi-Agent Mesh</span>
            <span className="rounded bg-brand-purple/20 px-2.5 py-0.5 text-xs text-brand-purple font-bold tracking-wider uppercase">
              LangGraph Mesh
            </span>
          </h2>
          <p className="text-xs text-brand-muted mt-1">Specialized sub-agents collaborating on global logistics paths</p>
        </div>
        <button
          onClick={runSimulation}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple px-4 py-2.5 text-xs font-bold hover:opacity-90 transition-opacity"
        >
          <Play className="h-4 w-4" />
          <span>Trigger Agent Simulation</span>
        </button>
      </div>

      {/* Main layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Agent Grid Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`text-left glass-panel rounded-2xl p-5 relative overflow-hidden transition-all duration-200 border ${
                  selectedAgent === agent.id ? 'border-brand-purple shadow-[0_0_20px_rgba(139,92,246,0.1)]' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-xs font-bold uppercase tracking-wider ${agent.color}`}>
                    {agent.name}
                  </span>
                  <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-brand-muted font-mono uppercase">
                    {agent.status}
                  </span>
                </div>
                <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                  {agent.capabilities}
                </p>
              </button>
            ))}
          </div>

          {/* Reasoning logger for selected agent */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Terminal className="h-5 w-5 text-brand-cyan" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Reasoning Terminal: {agents.find(a => a.id === selectedAgent)?.name}
              </h3>
            </div>
            <div className="rounded-2xl bg-black/40 border border-white/5 p-4 font-mono text-xs text-brand-text space-y-2 h-44 overflow-y-auto">
              {(agentLogs[selectedAgent] || [
                `[SYSTEM] Connecting to ${selectedAgent} agent...`,
                "[INFO] Thread listening for telemetry updates...",
                "[INFO] System logs normal."
              ]).map((log, idx) => (
                <div key={idx} className={log.includes("[ALERT]") || log.includes("[WARN]") ? 'text-brand-danger' : 'text-brand-text'}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Simulation Timeline */}
        <div className="glass-panel rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Live Execution Steps</h3>
            {simulationActive && (
              <span className="flex items-center gap-1.5 text-xs text-brand-purple">
                <Activity className="h-4.5 w-4.5 animate-spin" />
                Processing...
              </span>
            )}
          </div>

          <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {simTimeline.map((item, idx) => {
              const isActive = simulationActive && idx <= simStep;
              return (
                <div key={idx} className={`relative pl-10 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-25'}`}>
                  <div className={`absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 bg-brand-dark transition-all duration-300 ${
                    isActive ? 'border-brand-purple bg-brand-purple shadow-[0_0_10px_#8b5cf6]' : 'border-white/20'
                  }`}></div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[10px] text-brand-cyan mt-0.5">{item.agent}</p>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">{item.log}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
