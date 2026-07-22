import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Cpu, Database, Compass, Terminal, ArrowRight, Layers, MessageSquare, Play, HelpCircle, ChevronRight, Mail, ExternalLink } from 'lucide-react';

interface LandingPageProps {
  onEnterOS: () => void;
  onEnterLogin: () => void;
}

export default function LandingPage({ onEnterOS, onEnterLogin }: LandingPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // 3D Supply Chain Network Globe Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 500);

    // Responsive resize
    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 500;
      }
    };
    window.addEventListener('resize', handleResize);

    // Generate dense particle points representing continents
    const landPoints: { lat: number; lon: number }[] = [];
    const landRanges = [
      // North America
      { minLat: 18, maxLat: 65, minLon: -125, maxLon: -70 },
      // South America
      { minLat: -50, maxLat: 10, minLon: -75, maxLon: -40 },
      // Africa
      { minLat: -30, maxLat: 34, minLon: -15, maxLon: 45 },
      // Eurasia
      { minLat: 12, maxLat: 72, minLon: -10, maxLon: 140 },
      // Australia
      { minLat: -35, maxLat: -12, minLon: 113, maxLon: 150 }
    ];

    // Seed dot grid
    landRanges.forEach(range => {
      for (let lat = range.minLat; lat <= range.maxLat; lat += 10) {
        for (let lon = range.minLon; lon <= range.maxLon; lon += 10) {
          // Add organic variation
          if ((lat > 40 && lon > 100) || Math.random() > 0.25) {
            landPoints.push({ lat, lon });
          }
        }
      }
    });

    // Supply chain nodes
    const nodes = [
      { name: 'Shanghai Port', lat: 31.2, lon: 121.4, size: 6, color: '#06b6d4' },
      { name: 'Rotterdam Terminal', lat: 51.9, lon: 4.4, size: 6, color: '#8b5cf6' },
      { name: 'Los Angeles Port', lat: 33.7, lon: -118.2, size: 7, color: '#3b82f6' },
      { name: 'Singapore Hub', lat: 1.3, lon: 103.8, size: 5, color: '#10b981' },
      { name: 'Houston Depot', lat: 29.7, lon: -95.3, size: 5, color: '#eab308' },
      { name: 'Hamburg Port', lat: 53.5, lon: 9.9, size: 5, color: '#ef4444' }
    ];

    // Shipment paths moving along connections
    const paths = [
      { from: 0, to: 2, progress: 0.1, speed: 0.003 },
      { from: 0, to: 3, progress: 0.5, speed: 0.005 },
      { from: 3, to: 1, progress: 0.2, speed: 0.002 },
      { from: 1, to: 4, progress: 0.7, speed: 0.004 },
      { from: 2, to: 4, progress: 0.3, speed: 0.006 },
      { from: 5, to: 1, progress: 0.9, speed: 0.003 }
    ];

    let rotation = 0;
    const radius = 180;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      rotation += 0.003;

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw outer atmosphere glow
      const atmosphere = ctx.createRadialGradient(centerX, centerY, radius - 20, centerX, centerY, radius + 40);
      atmosphere.addColorStop(0, 'rgba(139, 92, 246, 0.02)');
      atmosphere.addColorStop(0.5, 'rgba(59, 130, 246, 0.06)');
      atmosphere.addColorStop(1, 'rgba(3, 3, 8, 0)');
      ctx.fillStyle = atmosphere;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 45, 0, Math.PI * 2);
      ctx.fill();

      // Draw Globe Sphere outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Project and draw the Continent Particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      landPoints.forEach(pt => {
        const phi = (90 - pt.lat) * (Math.PI / 180);
        const theta = (pt.lon + 180) * (Math.PI / 180) + rotation;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        // Draw particle if on front side
        if (z > 0) {
          const px = centerX + x;
          const py = centerY - y;
          const size = 1.2 + (z / radius) * 0.8; // simple depth scale
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      const projectedNodes = nodes.map(node => {
        // Convert polar coordinates to 3D Cartesian coordinates
        const phi = (90 - node.lat) * (Math.PI / 180);
        const theta = (node.lon + 180) * (Math.PI / 180) + rotation;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        return {
          ...node,
          px: centerX + x,
          py: centerY - y,
          visible: z > -50,
          depth: z
        };
      });

      // Draw connections/arcs
      paths.forEach(path => {
        const fromNode = projectedNodes[path.from];
        const toNode = projectedNodes[path.to];

        if (fromNode.visible && toNode.visible && fromNode.depth > 0 && toNode.depth > 0) {
          ctx.beginPath();
          ctx.moveTo(fromNode.px, fromNode.py);

          // Control point for curve
          const midX = (fromNode.px + toNode.px) / 2;
          const midY = (fromNode.py + toNode.py) / 2 - 40;

          ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.quadraticCurveTo(midX, midY, toNode.px, toNode.py);
          ctx.stroke();

          // Draw cargo shipment dot moving
          path.progress += path.speed;
          if (path.progress > 1) path.progress = 0;

          const t = path.progress;
          // Quadratic Bezier interpolation formulas
          const dotX = (1 - t) * (1 - t) * fromNode.px + 2 * (1 - t) * t * midX + t * t * toNode.px;
          const dotY = (1 - t) * (1 - t) * fromNode.py + 2 * (1 - t) * t * midY + t * t * toNode.py;

          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
          ctx.fill();

          // Pulse glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#06b6d4';
          ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.beginPath();
          ctx.arc(dotX, dotY, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      // Draw node locations
      projectedNodes
        .sort((a, b) => a.depth - b.depth)
        .forEach(node => {
          if (node.visible && node.depth > -30) {
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(node.px, node.py, node.size, 0, Math.PI * 2);
            ctx.fill();

            // Glow rings
            ctx.strokeStyle = node.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(node.px, node.py, node.size + 6 + Math.sin(Date.now() / 200) * 3, 0, Math.PI * 2);
            ctx.stroke();

            // Node Name Label
            ctx.fillStyle = 'rgba(241, 241, 246, 0.85)';
            ctx.font = '9px Inter';
            ctx.fillText(node.name, node.px + 10, node.py + 3);
          }
        });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const faqs = [
    { q: 'How does the Autonomous Agent Mesh communicate?', a: 'Agents collaborate asynchronously via LangGraph and CrewAI execution blocks. Each agent is responsible for a supply chain vector (e.g., carbon mapping, pricing, logistics optimization) and generates structured decisions approved by the Executive Hub Agent.' },
    { q: 'What AI LLMs back AetherOS?', a: 'AetherOS leverages Google Gemini 1.5 Pro models tuned with enterprise RAG systems, embedding documents including maritime rules, local carbon compliance guidelines, and procurement terms for exact predictions.' },
    { q: 'Can we integrate historical ERP data?', a: 'Absolutely. AetherOS links natively to standard ERP services (SAP, Oracle, Dynamics 365) via encrypted OpenAPI architecture pipelines.' },
    { q: 'What latency guarantees do shipment tracks hold?', a: 'Live shipment tracking runs microsecond WebSocket listeners querying marine traffic, IoT flight devices, and highway weather feeds for delay risk predictions.' }
  ];

  return (
    <div className="min-h-screen bg-[#030308] text-white selection:bg-brand-purple">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030308]/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple">
              <span className="text-lg font-bold">Æ</span>
            </div>
            <span className="font-sans font-bold text-lg tracking-tight">AetherOS AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-brand-muted font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={onEnterLogin} className="text-sm font-semibold text-brand-muted hover:text-white transition-colors">
              Sign In
            </button>
            <button
              onClick={onEnterOS}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-blue to-brand-purple px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              <span>Launch OS</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Animated Background glows */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[20%] left-[10%] h-[350px] w-[350px] rounded-full bg-brand-purple/10 blur-[120px] animate-pulse-slow"></div>
          <div className="absolute top-[30%] right-[10%] h-[400px] w-[400px] rounded-full bg-brand-blue/10 blur-[130px] animate-pulse-slow"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-purple/30 bg-brand-purple/5 px-4 py-1.5 text-xs text-brand-purple">
              <span className="flex h-2 w-2 rounded-full bg-brand-cyan animate-pulse"></span>
              <span>Next Generation Enterprise OS Platform</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold font-sans tracking-tight leading-[1.1] bg-gradient-to-r from-white via-brand-text to-brand-muted bg-clip-text text-transparent">
              Enterprise Autonomous Supply Chain Intelligence Platform
            </h1>

            <p className="text-lg text-brand-muted leading-relaxed">
              Model, forecast, and automate your global logistics operation in a glassmorphic Digital Twin powered by multi-agent AI. Mitigate port delay risks and optimize supplier paths in real time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onEnterOS}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black hover:bg-[#e4e4e9] transition-all"
              >
                <span>Enter Command Center</span>
                <ArrowRight className="h-4 w-4 text-black" />
              </button>
              <button
                onClick={onEnterLogin}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition-all"
              >
                <span>Request Executive Access</span>
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-bold text-white font-sans text-glow-blue">$4.2B</p>
                <p className="text-xs text-brand-muted mt-1">Cargo Monitored</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white font-sans text-glow-purple">14.2%</p>
                <p className="text-xs text-brand-muted mt-1">Lead Time Reduced</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#10b981] font-sans">0.82</p>
                <p className="text-xs text-brand-muted mt-1">System Risk Factor</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            {/* Globe Canvas Container */}
            <div className="relative w-full max-w-[500px] border border-white/5 bg-[#0a0a14]/30 backdrop-blur-xl rounded-3xl p-4 overflow-hidden">
              <canvas ref={canvasRef} className="w-full h-[450px]" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-brand-muted">
                <span>Autonomous Mesh Node Connection</span>
                <span className="flex items-center gap-1.5 text-brand-cyan">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-ping"></span>
                  LIVE ROTATION
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Logos */}
      <section className="border-t border-b border-white/5 bg-[#05050c]/80 py-10">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-semibold tracking-widest text-brand-muted uppercase mb-8">
            TRUSTED BY LEADERS IN GLOBAL ENERGY, TRANSPORT, AND RETAIL
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20 opacity-30 grayscale contrast-200">
            <span className="text-xl font-bold font-sans tracking-widest">PALANTIR</span>
            <span className="text-xl font-bold font-sans tracking-widest">LINEAR</span>
            <span className="text-xl font-bold font-sans tracking-widest">STRIPE</span>
            <span className="text-xl font-bold font-sans tracking-widest">VERCEL</span>
            <span className="text-xl font-bold font-sans tracking-widest">TESLA</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
          <h2 className="text-xs font-bold text-brand-cyan uppercase tracking-widest">Engineered for Complexity</h2>
          <h3 className="text-3xl lg:text-4xl font-bold font-sans">Autonomous intelligence for every node</h3>
          <p className="text-brand-muted text-sm">
            Deploy independent AI agents to map and execute your supply chain rules across dynamic ecosystems.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="relative glass-panel rounded-2xl p-8 hover:border-brand-purple/30 transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-cyan mb-6">
              <Layers className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold font-sans mb-3 text-white">Collaborative Multi-Agent Mesh</h4>
            <p className="text-sm text-brand-muted leading-relaxed">
              Logistics, compliance, and carbon footprint agents exchange context, automatically rerouting shipments to avoid delays and high taxes.
            </p>
          </div>

          {/* Card 2 */}
          <div className="relative glass-panel rounded-2xl p-8 hover:border-brand-blue/30 transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-6">
              <Terminal className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold font-sans mb-3 text-white">Digital Twin Simulations</h4>
            <p className="text-sm text-brand-muted leading-relaxed">
              Simulate major weather disruptions, supplier factory outages, and custom tariffs on a real-time responsive world shipping map.
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative glass-panel rounded-2xl p-8 hover:border-brand-cyan/30 transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-brand-emerald/10 flex items-center justify-center text-[#10b981] mb-6">
              <Cpu className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold font-sans mb-3 text-white">Explainable Prediction Engine</h4>
            <p className="text-sm text-brand-muted leading-relaxed">
              Every delay risk assessment comes with confidence gauges, primary feature weights (SHAP values), and custom mitigation actions.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#05050c]/50 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold text-brand-purple uppercase tracking-widest">Global Scale Plans</h2>
            <h3 className="text-3xl lg:text-4xl font-bold font-sans">Engineered for any operation size</h3>
            <div className="mt-6 inline-flex items-center rounded-full bg-white/5 p-1 border border-white/10">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${billingPeriod === 'monthly' ? 'bg-brand-purple text-white' : 'text-brand-muted hover:text-white'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${billingPeriod === 'yearly' ? 'bg-brand-purple text-white' : 'text-brand-muted hover:text-white'}`}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Plan 1 */}
            <div className="glass-panel rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Aether Core</h4>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold font-sans">$2,400</span>
                  <span className="text-brand-muted text-xs ml-2">/ month</span>
                </div>
                <p className="text-xs text-brand-muted mt-2">Perfect for regional distributors looking for autonomous delay monitoring.</p>
                <ul className="mt-8 space-y-4 text-xs text-brand-text">
                  <li className="flex items-center gap-2">✓ Real-time map routes with weather overlays</li>
                  <li className="flex items-center gap-2">✓ Dynamic stock level predictions</li>
                  <li className="flex items-center gap-2">✓ Standard ChatGPT copilot responses</li>
                  <li className="flex items-center gap-2">✓ Up to 10 API Key registers</li>
                </ul>
              </div>
              <button onClick={onEnterOS} className="mt-8 w-full rounded-xl bg-white/5 border border-white/10 py-3 text-xs font-semibold hover:bg-white/10 transition-colors">
                Launch Core OS
              </button>
            </div>

            {/* Plan 2 - Promoted */}
            <div className="glass-panel rounded-3xl p-8 border-brand-purple bg-[#0b0b18]/60 flex flex-col justify-between relative shadow-[0_0_30px_rgba(139,92,246,0.15)]">
              <div className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                RECOMMENDED
              </div>
              <div>
                <h4 className="text-sm font-semibold text-brand-cyan uppercase tracking-wider">Autonomous Mesh OS</h4>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold font-sans">$6,800</span>
                  <span className="text-brand-muted text-xs ml-2">/ month</span>
                </div>
                <p className="text-xs text-brand-muted mt-2">For multinational businesses running multi-modal trade corridors.</p>
                <ul className="mt-8 space-y-4 text-xs text-brand-text font-medium">
                  <li className="flex items-center gap-2 text-brand-cyan">✓ Collaborating Multi-Agent mesh timeline</li>
                  <li className="flex items-center gap-2">✓ Interactive digital twin simulator</li>
                  <li className="flex items-center gap-2">✓ Explainable SHAP factor drawers</li>
                  <li className="flex items-center gap-2">✓ Complete Spring Boot REST endpoints</li>
                  <li className="flex items-center gap-2">✓ Live automated compliance audit checks</li>
                </ul>
              </div>
              <button onClick={onEnterOS} className="mt-8 w-full rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple py-3 text-xs font-semibold hover:opacity-90 transition-opacity">
                Enter Autonomous OS
              </button>
            </div>

            {/* Plan 3 */}
            <div className="glass-panel rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Custom Enterprise</h4>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold font-sans">Contact CTO</span>
                </div>
                <p className="text-xs text-brand-muted mt-2">Dedicated clusters with custom LangGraph pipelines & on-prem models.</p>
                <ul className="mt-8 space-y-4 text-xs text-brand-text">
                  <li className="flex items-center gap-2">✓ Fully dedicated model deployment</li>
                  <li className="flex items-center gap-2">✓ Custom API and database pipeline</li>
                  <li className="flex items-center gap-2">✓ SLA response time &lt; 20ms</li>
                  <li className="flex items-center gap-2">✓ Dedicated DevOps support architect</li>
                </ul>
              </div>
              <a href="#contact" className="mt-8 block text-center w-full rounded-xl bg-white/5 border border-white/10 py-3 text-xs font-semibold hover:bg-white/10 transition-colors">
                Contact Architect
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-center font-sans mb-12">Frequently Answered Queries</h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-medium transition-colors hover:bg-white/[0.02]"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`h-5 w-5 text-brand-muted transition-transform duration-200 ${activeFaq === idx ? 'rotate-90' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="p-6 pt-0 border-t border-white/5 text-sm text-brand-muted leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 max-w-2xl mx-auto px-6 border-t border-white/5">
        <div className="glass-panel rounded-3xl p-10 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold font-sans text-white">Initiate Platform Onboarding</h3>
            <p className="text-sm text-brand-muted">Speak directly with our CTOS, principal architects, and model engineers.</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); alert("System Request Sent! Our CTO will contact you in < 2 hours."); }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">Corporate Email</label>
              <input type="email" required placeholder="sarah.jenkins@company.com" className="w-full glass-input px-4 py-3 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">Operation Details</label>
              <textarea placeholder="Describe your warehouse size, average shipment volume, and ERP stack..." rows={4} className="w-full glass-input px-4 py-3 text-sm focus:outline-none" />
            </div>
            <button type="submit" className="w-full rounded-xl bg-white text-black py-3 text-sm font-bold hover:bg-[#e4e4e9] transition-all flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Submit Architecture Request</span>
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#030308] py-12 text-center text-xs text-brand-muted">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple">
              <span className="text-xs font-bold">Æ</span>
            </div>
            <span className="font-sans font-bold text-sm text-white">AetherOS AI</span>
          </div>
          <p>© 2026 AetherOS AI, Inc. Enterprise Autonomous Supply Chain Intelligence Platform. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Security Audit</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
