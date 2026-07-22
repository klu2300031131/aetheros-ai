import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, HelpCircle, Activity, Sparkles, TrendingUp, AlertOctagon } from 'lucide-react';

export default function PredictiveAI() {
  const [selectedModel, setSelectedModel] = useState<string>('delay');
  const [explainOpen, setExplainOpen] = useState(true);

  // Mock model list
  const models = [
    { id: 'delay', name: 'Delay Prediction model', accuracy: '94.2%', riskScore: 82, field: 'Logistics' },
    { id: 'stockout', name: 'Stockout probability', accuracy: '91.8%', riskScore: 74, field: 'Warehouse Inventory' },
    { id: 'supplier', name: 'Supplier failure forecast', accuracy: '89.5%', riskScore: 12, field: 'Supplier Relations' }
  ];

  // SHAP importance features for Explainable AI
  const shapData = [
    { feature: 'Port Congestion Index', weight: 45, color: '#3b82f6' },
    { feature: 'Japan Typhoon headwinds', weight: 30, color: '#8b5cf6' },
    { feature: 'Carrier historical speed', weight: 15, color: '#06b6d4' },
    { feature: 'Customs queue wait time', weight: 10, color: '#10b981' }
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div>
        <h2 className="text-3xl font-bold font-sans tracking-tight text-white flex items-center gap-3">
          <span>Predictive AI & Explainable AI (XAI)</span>
          <span className="rounded bg-brand-blue/20 px-2.5 py-0.5 text-xs text-brand-cyan font-bold tracking-wider uppercase">
            Model Explanation
          </span>
        </h2>
        <p className="text-xs text-brand-muted mt-1">Audit predictive confidence ratings, features weights, and alternate routing recommendations</p>
      </div>

      {/* Grid of models */}
      <div className="grid md:grid-cols-3 gap-6">
        {models.map(model => (
          <button
            key={model.id}
            onClick={() => { setSelectedModel(model.id); setExplainOpen(true); }}
            className={`text-left glass-panel rounded-2xl p-5 relative overflow-hidden border transition-all ${
              selectedModel === model.id ? 'border-brand-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <span className="text-[10px] text-brand-cyan uppercase tracking-wider font-bold">{model.field}</span>
            <h3 className="text-sm font-bold text-white mt-2">{model.name}</h3>
            <div className="flex justify-between items-center mt-4 border-t border-white/5 pt-3">
              <div>
                <p className="text-[10px] text-brand-muted">Accuracy Rate</p>
                <p className="text-xs font-bold text-[#10b981]">{model.accuracy}</p>
              </div>
              <div>
                <p className="text-[10px] text-brand-muted">Active Risk</p>
                <p className="text-xs font-bold text-white">{model.riskScore}%</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Explainable AI block drawer */}
      {explainOpen && (
        <div className="glass-panel rounded-3xl p-6 lg:p-8 grid lg:grid-cols-3 gap-8 relative overflow-hidden">
          {/* background design element */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-brand-cyan/5 blur-[50px] pointer-events-none"></div>

          {/* Column 1: Model details & Accuracy Gauge */}
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Model Telemetry: {models.find(m => m.id === selectedModel)?.name}
              </h3>
              <p className="text-xs text-brand-muted mt-1">Explaining prediction via SHAP game-theory values</p>
            </div>

            {/* Confidence Gauge Graphic */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4">
              <div className="h-16 w-16 rounded-full border-4 border-brand-cyan/20 border-t-brand-cyan flex items-center justify-center animate-spin-slow">
                <span className="text-xs font-bold text-white animate-pulse">94%</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Confidence Score Verified</h4>
                <p className="text-[10px] text-brand-muted mt-0.5 leading-relaxed">
                  The model ran 12,000 Monte Carlo route projections. Residual error holds beneath 1.2%.
                </p>
              </div>
            </div>

            {/* Business Impact Card */}
            <div className="bg-brand-danger/5 border border-brand-danger/20 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-brand-danger">
                <AlertOctagon className="h-4.5 w-4.5" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Business Impact Risk</h4>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">
                If unmitigated, cargo stockout at Dallas Hub will trigger contract late penalties of **$38,000** and affect 4 distribution paths.
              </p>
            </div>
          </div>

          {/* Column 2: SHAP Feature Importance Bars */}
          <div className="space-y-6 lg:col-span-2">
            <div>
              <h3 className="text-sm font-bold text-white">Feature Weight Contribution (SHAP values)</h3>
              <p className="text-xs text-brand-muted mt-0.5">Which features skewed the prediction towards risk</p>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shapData} layout="vertical" margin={{ top: 10, right: 10, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis type="number" stroke="#8e8e9f" fontSize={11} />
                  <YAxis dataKey="feature" type="category" stroke="#8e8e9f" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0c0c16', borderColor: 'rgba(255,255,255,0.1)', color: '#f1f1f6' }} />
                  <Bar dataKey="weight" radius={[0, 4, 4, 0]} name="SHAP Value (%)">
                    {shapData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Suggested alternative */}
            <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-brand-cyan" />
                  <span>XAI Recommended Action</span>
                </h4>
                <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
                  Reroute Pacific Titan to Port of Oakland. Save 38h delay time. Rerouting fee: $14,000.
                </p>
              </div>
              <button
                onClick={() => alert("Mitigation strategy applied. Core model retraining initiated.")}
                className="rounded-lg bg-brand-cyan text-black px-4 py-2 text-xs font-bold hover:opacity-90 shrink-0 transition-opacity"
              >
                Execute Mitigation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
