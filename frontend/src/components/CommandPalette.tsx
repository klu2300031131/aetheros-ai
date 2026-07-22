import React, { useState, useEffect, useRef } from 'react';
import { Search, Compass, Terminal, Shield, Cpu, RefreshCw, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // Call to toggle or open
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const commands = [
    { category: 'Navigation', name: 'Go to Executive Dashboard', shortcut: 'G + D', action: () => onNavigate('dashboard'), icon: Compass },
    { category: 'Navigation', name: 'Go to AI Copilot', shortcut: 'G + C', action: () => onNavigate('copilot'), icon: Cpu },
    { category: 'Navigation', name: 'Go to Supply Chain Digital Twin', shortcut: 'G + T', action: () => onNavigate('twin'), icon: Terminal },
    { category: 'Navigation', name: 'Go to Live Map & Shipments', shortcut: 'G + M', action: () => onNavigate('map'), icon: Shield },
    { category: 'Analytics', name: 'Run Demand Forecast Simulation', shortcut: 'Alt + F', action: () => { onNavigate('predictive'); onClose(); }, icon: RefreshCw },
    { category: 'System', name: 'Configure API Keys', shortcut: 'Alt + A', action: () => { onNavigate('admin'); onClose(); }, icon: Shield },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.name.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#030308]/80 backdrop-blur-md" onClick={onClose}></div>

      {/* Palette Body */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0c0c16]/95 shadow-2xl backdrop-blur-xl transition-all duration-300">
        <div className="flex items-center border-b border-white/10 p-4">
          <Search className="mr-3 h-5 w-5 text-brand-muted" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-sm text-[#f1f1f6] placeholder-brand-muted focus:outline-none"
            placeholder="Type a command or search shipments, routes, nodes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="rounded-lg p-1 text-brand-muted hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filteredCommands.length > 0 ? (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-purple">
                AetherOS Command Center
              </div>
              {filteredCommands.map((cmd, idx) => {
                const IconComponent = cmd.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      cmd.action();
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-brand-text hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-4 w-4 text-brand-cyan" />
                      <div>
                        <span className="font-medium">{cmd.name}</span>
                        <span className="ml-2 text-xs text-brand-muted">({cmd.category})</span>
                      </div>
                    </div>
                    <kbd className="hidden rounded bg-white/10 px-2 py-0.5 text-xs text-brand-muted sm:inline-block">
                      {cmd.shortcut}
                    </kbd>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-brand-muted">
              No results found for "{query}".
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-brand-muted">
          <span>Use <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">↑↓</kbd> to navigate, <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">Enter</kbd> to select</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
