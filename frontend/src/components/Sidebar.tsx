import React from 'react';
import {
  Compass, Cpu, Terminal, Shield, Activity, BarChart2,
  FolderOpen, AlertTriangle, Layers, Award, ShieldAlert,
  Settings, LogOut, Radio, User, Menu
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  currentUser: { name: string; role: string } | null;
}

export default function Sidebar({ currentPage, onNavigate, onLogout, currentUser }: SidebarProps) {
  const groups = [
    {
      title: 'Control Center',
      items: [
        { id: 'dashboard', name: 'Executive Command', icon: Compass },
        { id: 'analytics', name: 'Analytics Center', icon: BarChart2 },
        { id: 'reports', name: 'Reports Center', icon: FolderOpen },
      ]
    },
    {
      title: 'AI Systems',
      items: [
        { id: 'copilot', name: 'AI Copilot', icon: Cpu },
        { id: 'agents', name: 'Multi-Agent Mesh', icon: Layers },
        { id: 'predictive', name: 'Predictive & XAI', icon: Activity },
      ]
    },
    {
      title: 'Simulation & Map',
      items: [
        { id: 'twin', name: 'Digital Twin Sim', icon: Terminal },
        { id: 'map', name: 'Live Route Tracking', icon: Shield },
      ]
    },
    {
      title: 'Operations',
      items: [
        { id: 'intelligence', name: 'Supply Intelligence', icon: Award },
        { id: 'compliance', name: 'Compliance & Risk', icon: ShieldAlert },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'admin', name: 'Admin Panel', icon: Settings },
      ]
    }
  ];

  const profileName = currentUser ? currentUser.name : 'Dr. Sarah Jenkins';
  const profileRole = currentUser ? currentUser.role : 'CTO & Supply Architect';

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-white/10 bg-[#070712]/90 backdrop-blur-xl lg:flex lg:flex-col justify-between">
      {/* Header Logo */}
      <div>
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <span className="text-xl font-bold text-white">Æ</span>
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-white font-sans text-base">AetherOS AI</h1>
            <span className="text-[10px] text-brand-cyan tracking-wider font-semibold uppercase">Enterprise Ops</span>
          </div>
        </div>

        {/* Scrollable Nav Items */}
        <nav className="h-[calc(100vh-200px)] overflow-y-auto px-4 py-6 space-y-6">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                {group.title}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 text-white border-l-2 border-brand-purple font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                        : 'text-brand-muted hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-brand-cyan' : 'text-brand-muted'}`} />
                    <span>{item.name}</span>
                    {item.id === 'dashboard' && (
                      <span className="ml-auto flex h-2 w-2 rounded-full bg-brand-emerald animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Profile */}
      <div className="border-t border-white/10 p-4 space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-purple/30 border border-brand-purple/40">
              <User className="h-4 w-4 text-brand-purple" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white truncate max-w-[130px]">{profileName}</p>
              <p className="text-[10px] text-brand-muted truncate max-w-[130px]">{profileRole}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-brand-muted px-2">
          <div className="flex items-center gap-1.5">
            <Radio className="h-3 w-3 text-brand-emerald animate-pulse" />
            <span>Agent Mesh online</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1 hover:text-brand-danger transition-colors"
          >
            <LogOut className="h-3 w-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
