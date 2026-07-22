import React, { useState } from 'react';
import { Key, Shield, User, Clipboard, Plus, Trash2, List } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  scope: string;
  created: string;
}

export default function AdminSettings() {
  const [keys, setKeys] = useState<ApiKey[]>([
    { id: '1', name: 'FastAPI AI Engine Connect', key: 'aes_live_9f2k8d1239asd019f2', scope: 'Autonomous Execute', created: '2026-06-12' },
    { id: '2', name: 'Spring Boot REST Client', key: 'aes_live_382k9s2310asdf8234', scope: 'Read & Write', created: '2026-07-02' }
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState('Read Only');

  const auditLogs = [
    { user: 'Dr. Sarah Jenkins', action: 'Approved carrier route override (AETHER-994)', target: 'System Command', time: '14m ago' },
    { user: 'API Key (FastAPI Connect)', action: 'Retrained Forecast model (Japan lane)', target: 'AI Models', time: '1h ago' },
    { user: 'Dr. Sarah Jenkins', action: 'Regenerated Spring Boot access token', target: 'Security Credentials', time: '4h ago' },
    { user: 'System Hub Node', action: 'Dispatched warning alert: Rotterdam Congestion', target: 'Live Map Ticker', time: '12h ago' }
  ];

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const generated = `aes_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const newKeyObj: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: generated,
      scope: newKeyScope,
      created: new Date().toISOString().split('T')[0]
    };

    setKeys([...keys, newKeyObj]);
    setNewKeyName('');
  };

  const handleDeleteKey = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div>
        <h2 className="text-3xl font-bold font-sans tracking-tight text-white flex items-center gap-3">
          <span>Admin & Settings Panel</span>
          <span className="rounded bg-brand-danger/20 px-2.5 py-0.5 text-xs text-brand-danger font-bold tracking-wider uppercase">
            Security Controls
          </span>
        </h2>
        <p className="text-xs text-brand-muted mt-1">Configure developer APIs, inspect audit logs, and administer system access</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* API Key management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="h-4.5 w-4.5 text-brand-purple" />
              <span>Developer API Keys</span>
            </h3>

            <form onSubmit={handleCreateKey} className="flex flex-col md:flex-row gap-4 items-end bg-white/[0.01] border border-white/5 p-4 rounded-xl">
              <div className="flex-1 space-y-1.5 w-full">
                <label className="text-[10px] font-bold text-brand-muted uppercase">Key Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Docker Nginx Webhook"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full glass-input px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 w-full md:w-48">
                <label className="text-[10px] font-bold text-brand-muted uppercase">Access Scope</label>
                <select
                  value={newKeyScope}
                  onChange={(e) => setNewKeyScope(e.target.value)}
                  className="w-full bg-[#0c0c16] border border-white/10 rounded-lg text-xs p-2 text-white focus:outline-none"
                >
                  <option>Read Only</option>
                  <option>Read & Write</option>
                  <option>Autonomous Execute</option>
                </select>
              </div>

              <button type="submit" className="rounded-lg bg-brand-purple px-4 py-2.5 text-xs font-bold text-white hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0 w-full md:w-auto">
                <Plus className="h-4 w-4" />
                <span>Create Key</span>
              </button>
            </form>

            <div className="space-y-4">
              {keys.map((k) => (
                <div key={k.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/5 rounded-xl p-4 bg-white/[0.02]">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-white">{k.name}</h4>
                    <div className="flex items-center gap-2">
                      <code className="text-[10px] text-brand-cyan select-all">{k.key}</code>
                      <button
                        onClick={() => { navigator.clipboard.writeText(k.key); alert("Copied key!"); }}
                        className="text-brand-muted hover:text-white"
                      >
                        <Clipboard className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-4 text-[10px] text-brand-muted">
                      <span>Scope: <b className="text-white font-medium">{k.scope}</b></span>
                      <span>Created: <b>{k.created}</b></span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteKey(k.id)}
                    className="p-2 rounded-lg text-brand-muted hover:bg-brand-danger/10 hover:text-brand-danger transition-colors self-end md:self-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit logs panel */}
        <div className="glass-panel rounded-3xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <List className="h-4.5 w-4.5 text-brand-cyan" />
            <span>Operational Audit Logs</span>
          </h3>

          <div className="space-y-4">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="border-b border-white/5 pb-4 last:border-0 last:pb-0 space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-white">{log.user}</span>
                  <span className="text-brand-muted">{log.time}</span>
                </div>
                <p className="text-xs text-brand-muted leading-relaxed">{log.action}</p>
                <span className="inline-block rounded bg-white/5 px-2 py-0.5 text-[9px] text-brand-cyan uppercase tracking-wider font-semibold">
                  {log.target}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
