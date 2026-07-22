import React, { useEffect, useRef, useState } from 'react';
import { Shield, CloudRain, Anchor, Eye, RefreshCw, AlertOctagon, HelpCircle, Activity } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  type: 'ship' | 'plane' | 'truck';
  path: { x: number; y: number }[];
  progress: number;
  speed: number;
  origin: string;
  destination: string;
  cargo: string;
  risk: number;
  carbon: number;
  statusText?: string;
}

export default function DigitalTwinPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedAsset, setSelectedAsset] = useState<Vehicle | null>(null);
  const [showWeather, setShowWeather] = useState(true);
  const [showCongestion, setShowCongestion] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [stormDisruption, setStormDisruption] = useState(false);
  const [disruptionLogs, setDisruptionLogs] = useState<string[]>([
    "System Hub listening for weather anomalies...",
    "All trade corridors operating under normal threshold."
  ]);

  // List of active assets in simulation
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 'AETHER-994',
      name: 'Pacific Titan',
      type: 'ship',
      path: [
        { x: 120, y: 180 }, // Shanghai
        { x: 250, y: 220 }, // Midway
        { x: 380, y: 230 }  // Los Angeles
      ],
      progress: 0.25,
      speed: 0.0006,
      origin: 'Shanghai Port (PVG)',
      destination: 'Los Angeles (LAX)',
      cargo: 'High-Density Lithium Battery Packs',
      risk: 14,
      carbon: 14.8,
      statusText: 'In Transit (On Time)'
    },
    {
      id: 'AETHER-104',
      name: 'Atlas Air 482',
      type: 'plane',
      path: [
        { x: 380, y: 230 }, // LA
        { x: 500, y: 150 }, // Chicago
        { x: 620, y: 130 }  // Frankfurt
      ],
      progress: 0.1,
      speed: 0.003,
      origin: 'LA Cargo Hub',
      destination: 'Frankfurt Airport (FRA)',
      cargo: 'Medical Grade Temperature-Controlled Injections',
      risk: 4,
      carbon: 28.2,
      statusText: 'In Transit (Optimal)'
    },
    {
      id: 'AETHER-882',
      name: 'Euro Route Carrier',
      type: 'truck',
      path: [
        { x: 620, y: 130 }, // Frankfurt
        { x: 600, y: 110 }, // Rotterdam
        { x: 580, y: 120 }  // Antwerp
      ],
      progress: 0.6,
      speed: 0.0018,
      origin: 'Rotterdam Terminal',
      destination: 'Antwerp Port',
      cargo: 'Semi-conductor Fabrication Parts',
      risk: 8,
      carbon: 2.1,
      statusText: 'Local Delivery'
    }
  ]);

  // World map coordinates mock contours for canvas rendering
  const landmasses = [
    // North America
    [{ x: 320, y: 100 }, { x: 440, y: 100 }, { x: 500, y: 170 }, { x: 470, y: 280 }, { x: 390, y: 280 }, { x: 340, y: 200 }],
    // Eurasia / Africa
    [{ x: 560, y: 80 }, { x: 740, y: 80 }, { x: 800, y: 200 }, { x: 760, y: 320 }, { x: 650, y: 380 }, { x: 600, y: 280 }, { x: 550, y: 180 }],
    // Australia
    [{ x: 760, y: 380 }, { x: 820, y: 380 }, { x: 800, y: 440 }, { x: 740, y: 420 }]
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = 900);
    const height = (canvas.height = 480);

    const render = () => {
      // Clear backdrop
      ctx.fillStyle = '#060611';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid overlay
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // Draw land outlines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;
      landmasses.forEach(contour => {
        ctx.beginPath();
        ctx.moveTo(contour[0].x, contour[0].y);
        for (let i = 1; i < contour.length; i++) {
          ctx.lineTo(contour[i].x, contour[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      // Draw Congestion risk zones
      if (showCongestion) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.lineWidth = 1;
        // Tokyo Congestion Zone
        ctx.beginPath();
        ctx.arc(120, 180, 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Rotterdam Congestion Zone
        ctx.beginPath();
        ctx.arc(600, 110, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Draw Storm overlays (Typhoon)
      if (showWeather) {
        ctx.fillStyle = stormDisruption ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.08)';
        ctx.strokeStyle = stormDisruption ? 'rgba(239, 68, 68, 0.4)' : 'rgba(139, 92, 246, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(230, 210, stormDisruption ? 55 : 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Label storm name
        ctx.fillStyle = stormDisruption ? '#ef4444' : '#8b5cf6';
        ctx.font = 'bold 9px Inter';
        ctx.fillText(stormDisruption ? 'TYPHOON HINNAMNOR (CRITICAL)' : 'Atlantic Headwinds (Low)', 240 - 50, 210 - 45);
      }

      // Draw shipping lines / vector routes
      vehicles.forEach(veh => {
        ctx.beginPath();
        ctx.moveTo(veh.path[0].x, veh.path[0].y);
        for (let i = 1; i < veh.path.length; i++) {
          ctx.lineTo(veh.path[i].x, veh.path[i].y);
        }
        ctx.strokeStyle = veh.type === 'plane' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(139, 92, 246, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash(veh.type === 'plane' ? [4, 4] : []);
        ctx.stroke();
        ctx.setLineDash([]); // reset
      });

      // Update positions & Draw Vehicles
      setVehicles(prevVehs =>
        prevVehs.map(veh => {
          let nextProgress = veh.progress + veh.speed * simSpeed;
          if (nextProgress > 1) nextProgress = 0;

          // Interpolate coordinate along path segments
          const numSegments = veh.path.length - 1;
          const segmentIndex = Math.min(
            Math.floor(nextProgress * numSegments),
            numSegments - 1
          );
          const segmentProgress = (nextProgress * numSegments) - segmentIndex;

          const p1 = veh.path[segmentIndex];
          const p2 = veh.path[segmentIndex + 1];

          const currentX = p1.x + (p2.x - p1.x) * segmentProgress;
          const currentY = p1.y + (p2.y - p1.y) * segmentProgress;

          // Draw asset symbol
          ctx.fillStyle = veh.type === 'plane' ? '#06b6d4' : veh.type === 'ship' ? '#8b5cf6' : '#10b981';
          ctx.beginPath();
          ctx.arc(currentX, currentY, 5.5, 0, Math.PI * 2);
          ctx.fill();

          // Outer pulsing ring
          ctx.strokeStyle = ctx.fillStyle;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(currentX, currentY, 8.5 + Math.sin(Date.now() / 150) * 2, 0, Math.PI * 2);
          ctx.stroke();

          // Text labels for carriers
          ctx.fillStyle = '#8e8e9f';
          ctx.font = '8px Monospace';
          ctx.fillText(veh.id, currentX + 8, currentY - 5);

          return { ...veh, progress: nextProgress, currentX, currentY };
        })
      );

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [showWeather, showCongestion, simSpeed, stormDisruption, vehicles.length]);

  // Handle canvas mouse click to select vehicles
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedVeh = vehicles.find(veh => {
      // @ts-ignore
      const vx = veh.currentX;
      // @ts-ignore
      const vy = veh.currentY;
      if (!vx || !vy) return false;
      const distance = Math.sqrt((x - vx) ** 2 + (y - vy) ** 2);
      return distance < 18;
    });

    if (clickedVeh) {
      setSelectedAsset(clickedVeh);
    }
  };

  // Trigger storm outage override simulation
  const handleTriggerStorm = () => {
    setStormDisruption(true);
    setDisruptionLogs(prev => [
      "[ALERT] Storm sensor triggered: Typhoon Hinnamnor path intersecting pacific lane.",
      "[COGNITIVE] Risk Agent recalculating transit timelines...",
      "[COGNITIVE] Carbon Agent evaluating green reroutes...",
      "[DECISION] Executive Agent dispatched path rewrite: Rerouting Carrier AETHER-994 via Hawaii coordinates (+1.2t CO2, saves 38h storm lag).",
      ...prev
    ]);

    // Update AETHER-994 path bending around the storm
    setVehicles(prev =>
      prev.map(veh => {
        if (veh.id === 'AETHER-994') {
          return {
            ...veh,
            statusText: 'Rerouted (Storm Mitigation)',
            risk: 8, // reduced by successful mitigation
            carbon: 16.0, // increased due to distance
            path: [
              { x: 120, y: 180 }, // Shanghai
              { x: 200, y: 320 }, // Bending south via Hawaii coordinates
              { x: 300, y: 300 },
              { x: 380, y: 230 }  // Los Angeles
            ]
          };
        }
        return veh;
      })
    );

    // Auto update selected details if selected
    setSelectedAsset(prev => {
      if (prev && prev.id === 'AETHER-994') {
        return {
          ...prev,
          statusText: 'Rerouted (Storm Mitigation)',
          risk: 8,
          carbon: 16.0,
          path: [
            { x: 120, y: 180 },
            { x: 200, y: 320 },
            { x: 300, y: 300 },
            { x: 380, y: 230 }
          ]
        };
      }
      return prev;
    });
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-sans tracking-tight text-white flex items-center gap-3">
            <span>Supply Chain Digital Twin</span>
            <span className="rounded bg-brand-cyan/20 px-2.5 py-0.5 text-xs text-brand-cyan font-bold tracking-wider uppercase">
              Simulation Center
            </span>
          </h2>
          <p className="text-xs text-brand-muted mt-1">Simulated world map tracing logistics lines, storms, and port queue lengths</p>
        </div>
        <button
          onClick={handleTriggerStorm}
          className="flex items-center gap-2 rounded-xl bg-brand-danger/20 border border-brand-danger/30 text-brand-danger px-4 py-2.5 text-xs font-bold hover:bg-brand-danger/30 transition-all shadow-[0_0_15px_rgba(239,68,68,0.15)]"
        >
          <CloudRain className="h-4 w-4" />
          <span>Simulate Typhoon Disruption</span>
        </button>
      </div>

      {/* Control Panel Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Toggle 1 */}
        <button
          onClick={() => setShowWeather(!showWeather)}
          className={`flex items-center justify-between rounded-xl border p-4 text-xs font-semibold transition-all ${
            showWeather ? 'border-brand-purple bg-brand-purple/5 text-white' : 'border-white/5 bg-white/5 text-brand-muted'
          }`}
        >
          <span>Storm Risk Gradients</span>
          <CloudRain className="h-4 w-4" />
        </button>

        {/* Toggle 2 */}
        <button
          onClick={() => setShowCongestion(!showCongestion)}
          className={`flex items-center justify-between rounded-xl border p-4 text-xs font-semibold transition-all ${
            showCongestion ? 'border-brand-cyan bg-brand-cyan/5 text-white' : 'border-white/5 bg-white/5 text-brand-muted'
          }`}
        >
          <span>Port Congestion Circles</span>
          <Anchor className="h-4 w-4" />
        </button>

        {/* Toggle 3 */}
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 text-xs">
          <span className="text-brand-muted font-semibold">Sim Speed Rate:</span>
          <div className="flex gap-2">
            {[1, 2, 4].map(speed => (
              <button
                key={speed}
                onClick={() => setSimSpeed(speed)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  simSpeed === speed ? 'bg-brand-cyan text-black' : 'bg-white/5 text-brand-muted'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Selected asset alert shortcut */}
        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-brand-muted">
          <Eye className="h-4.5 w-4.5 text-brand-cyan" />
          <span>Click on nodes on map to inspect cargo</span>
        </div>
      </div>

      {/* Main Map Box & Detail Card */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Canvas World Map */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-4 overflow-x-auto">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full min-w-[800px] h-[480px] cursor-pointer rounded-2xl"
          />
        </div>

        {/* Right Asset Inspection Panel */}
        <div className="space-y-6 flex flex-col">
          {/* Detail card */}
          <div className="glass-panel rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden flex-1">
            {selectedAsset ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      selectedAsset.type === 'plane' ? 'bg-brand-cyan/20 text-brand-cyan' :
                      selectedAsset.type === 'ship' ? 'bg-brand-purple/20 text-brand-purple' :
                      'bg-brand-emerald/20 text-brand-emerald'
                    }`}>
                      {selectedAsset.type}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">{selectedAsset.name}</h3>
                    <span className="text-[10px] text-brand-muted font-mono">{selectedAsset.id}</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <p className="text-brand-muted uppercase text-[9px] font-bold">Status</p>
                    <p className="text-brand-cyan font-bold">{selectedAsset.statusText}</p>
                  </div>
                  <div>
                    <p className="text-brand-muted uppercase text-[9px] font-bold">Lanes</p>
                    <p className="text-white font-medium">{selectedAsset.origin} → {selectedAsset.destination}</p>
                  </div>
                  <div>
                    <p className="text-brand-muted uppercase text-[9px] font-bold">Active Cargo Contents</p>
                    <p className="text-white font-medium">{selectedAsset.cargo}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-brand-muted uppercase text-[9px] font-bold">Delay Risk</p>
                      <p className={`font-bold ${selectedAsset.risk > 20 ? 'text-brand-danger' : 'text-brand-emerald'}`}>
                        {selectedAsset.risk}%
                      </p>
                    </div>
                    <div>
                      <p className="text-brand-muted uppercase text-[9px] font-bold">CO2 Output</p>
                      <p className="text-white font-bold">{selectedAsset.carbon} tonnes</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <Activity className="h-10 w-10 text-brand-purple animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold text-white">No Asset Selected</h4>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                    Click on an active carrier tag or glowing route line on the map coordinates to inspect telemetry status.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Local logs ticker */}
          <div className="glass-panel rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Agent cognitive trace</h3>
            <div className="max-h-32 overflow-y-auto space-y-2 text-[10px] font-mono text-brand-muted">
              {disruptionLogs.map((log, idx) => (
                <div key={idx} className={log.includes("[ALERT]") ? 'text-brand-danger' : log.includes("[DECISION]") ? 'text-brand-cyan' : 'text-brand-muted'}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
