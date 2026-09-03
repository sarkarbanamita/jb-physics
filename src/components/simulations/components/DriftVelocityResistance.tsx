'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DriftResistanceParams, SimulationProps } from '../types';
import { Play, Pause, RotateCcw, Sliders, Zap, Thermometer, ArrowRight } from 'lucide-react';

export const DriftVelocityResistance: React.FC<SimulationProps<DriftResistanceParams>> = ({ params }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<'STRETCH' | 'DRIFT' | 'IV_TEMP'>(params?.mode || 'STRETCH');
  const [stretchFactor, setStretchFactor] = useState(params?.stretchFactor || 2.0);
  const [voltage, setVoltage] = useState(params?.voltage || 5);
  const [temperature, setTemperature] = useState(params?.temperature || 300); // Kelvin
  const [isPlaying, setIsPlaying] = useState(true);

  // Particles for drift simulation
  const particles = useRef<Array<{ x: number; y: number; vx: number; vy: number }>>([]);

  // Initialize electrons
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      arr.push({
        x: Math.random() * 400,
        y: 50 + Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }
    particles.current = arr;
  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      if (mode === 'STRETCH') {
        // Wire Stretching Mode
        const initialL = 120;
        const initialA = 70;
        const xFactor = stretchFactor;
        const currentL = Math.min(width - 80, initialL * xFactor);
        const currentA = initialA / xFactor;

        // Original wire outline (faint)
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        const startX = 40;
        const centerY = height / 2 - 30;
        ctx.strokeRect(startX, centerY - initialA / 2, initialL, initialA);
        ctx.fillStyle = '#64748b';
        ctx.font = '11px sans-serif';
        ctx.fillText('Original Wire (L, A, R)', startX, centerY - initialA / 2 - 8);

        // Stretched wire
        const grad = ctx.createLinearGradient(startX, 0, startX + currentL, 0);
        grad.addColorStop(0, '#f59e0b');
        grad.addColorStop(1, '#ef4444');
        ctx.fillStyle = grad;
        ctx.setLineDash([]);
        ctx.fillRect(startX, centerY - currentA / 2, currentL, currentA);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(startX, centerY - currentA / 2, currentL, currentA);

        // Dimension arrows
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Length: L' = ${xFactor.toFixed(1)} × L`, startX + currentL / 2 - 40, centerY + currentA / 2 + 22);
        ctx.fillText(`Area: A' = A / ${xFactor.toFixed(1)}`, startX + currentL / 2 - 40, centerY + currentA / 2 + 38);

        // Formula callout
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Resistance R' = x² R = (${xFactor.toFixed(1)})² R = ${(xFactor * xFactor).toFixed(2)} R`, startX, height - 30);
      } else if (mode === 'DRIFT') {
        // Drift velocity mode
        const driftSpeed = (voltage / 5) * 1.5;
        const tempJitter = (temperature / 300) * 1.2;

        // Wire container
        const wireX = 40;
        const wireY = 40;
        const wireW = width - 80;
        const wireH = height - 100;

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(wireX, wireY, wireW, wireH);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.strokeRect(wireX, wireY, wireW, wireH);

        // Electric field arrow
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(wireX + 20, wireY + 20);
        ctx.lineTo(wireX + wireW - 20, wireY + 20);
        ctx.stroke();
        ctx.fillText(`Applied Electric Field E = V/l (Voltage = ${voltage}V)`, wireX + 25, wireY + 15);

        // Update and draw electrons
        if (isPlaying) {
          particles.current.forEach((p) => {
            p.x += (Math.random() - 0.5) * tempJitter - driftSpeed; // drift to left (opposite to E)
            p.y += (Math.random() - 0.5) * tempJitter;

            if (p.x < wireX + 10) p.x = wireX + wireW - 10;
            if (p.x > wireX + wireW - 10) p.x = wireX + 10;
            if (p.y < wireY + 30) p.y = wireY + wireH - 10;
            if (p.y > wireY + wireH - 10) p.y = wireY + 30;
          });
        }

        particles.current.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();
          ctx.strokeStyle = '#0284c7';
          ctx.stroke();
        });

        // Current density formula
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Current Density: j = σ E = σ(V/l) ∝ V | Drift Velocity: vd = μ(V/l) ∝ V`, wireX, height - 20);
      } else if (mode === 'IV_TEMP') {
        // IV Graph at Different Temperatures
        const originX = 60;
        const originY = height - 50;
        const graphW = width - 100;
        const graphH = height - 90;

        // Axes
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(originX, originY - graphH);
        ctx.lineTo(originX, originY);
        ctx.lineTo(originX + graphW, originY);
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('I (Current)', originX - 10, originY - graphH - 10);
        ctx.fillText('V (Voltage)', originX + graphW + 5, originY + 4);

        // Lines for T1, T2, T3 (slope = 1/R)
        // High slope = low R = low T
        const drawLine = (slope: number, color: string, label: string) => {
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          const endX = originX + graphW * 0.85;
          const endY = originY - graphW * 0.85 * slope;
          ctx.lineTo(endX, endY);
          ctx.stroke();
          ctx.fillStyle = color;
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(label, endX + 8, endY + 4);
        };

        drawLine(0.7, '#10b981', 'T₁ (Highest slope = Min R = Lowest Temp)');
        drawLine(0.45, '#f59e0b', 'T₂ (Medium slope)');
        drawLine(0.25, '#ef4444', 'T₃ (Lowest slope = Max R = Highest Temp)');

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Conclusion: slope = 1/R ⟹ R₁ < R₂ < R₃ ⟹ T₁ < T₂ < T₃', originX + 20, originY - graphH + 20);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mode, stretchFactor, voltage, temperature, isPlaying]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMode('STRETCH')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'STRETCH' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Wire Stretch (Q5: x²R)
          </button>
          <button
            onClick={() => setMode('DRIFT')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'DRIFT' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Drift & Current (Q4)
          </button>
          <button
            onClick={() => setMode('IV_TEMP')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'IV_TEMP' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            I-V Characteristics (Q29)
          </button>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 font-bold"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
      </div>

      <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <canvas ref={canvasRef} className="w-full h-[320px] sm:h-[360px] block" />
      </div>

      {/* Interactive Controls */}
      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {mode === 'STRETCH' && (
          <div className="space-y-1.5 col-span-full">
            <div className="flex justify-between font-bold">
              <span className="text-slate-300">Stretching Factor (x):</span>
              <span className="text-amber-400 font-mono text-sm">{stretchFactor.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={stretchFactor}
              onChange={(e) => setStretchFactor(parseFloat(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
        )}

        {mode === 'DRIFT' && (
          <>
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Applied Voltage (V):</span>
                <span className="text-cyan-400 font-mono">{voltage} V</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={voltage}
                onChange={(e) => setVoltage(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Temperature (T):</span>
                <span className="text-rose-400 font-mono">{temperature} K</span>
              </div>
              <input
                type="range"
                min="100"
                max="600"
                step="20"
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full accent-rose-400"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DriftVelocityResistance;
