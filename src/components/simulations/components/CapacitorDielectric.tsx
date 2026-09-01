'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CapacitorParams, SimulationProps } from '../types';
import { Sliders, Zap, BatteryCharging, Shield, Info } from 'lucide-react';

export const CapacitorDielectric: React.FC<SimulationProps<CapacitorParams>> = ({ params }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States
  const [dielectricK, setDielectricK] = useState(params?.finalDielectric ?? 4);
  const [plateDistance, setPlateDistance] = useState(params?.initialDistance ?? 2); // mm
  const [batteryConnected, setBatteryConnected] = useState(true);
  const [insertionFraction, setInsertionFraction] = useState(1.0); // 0 to 1

  // Physical parameters
  const baseArea = 10; // cm^2
  const eps0 = 8.854; // relative unit
  // Effective k
  const effectiveK = 1 + (dielectricK - 1) * insertionFraction;
  const initialCapacitance = (2 * eps0 * baseArea) / 1; // reference
  const currentCapacitance = (effectiveK * eps0 * baseArea) / plateDistance;

  // Battery voltage = 12V if connected
  const voltage = batteryConnected ? 12 : (12 * initialCapacitance) / currentCapacitance;
  const charge = currentCapacitance * voltage;
  const energy = 0.5 * currentCapacitance * (voltage * voltage);
  const electricFieldAir = voltage / (plateDistance * 0.001 || 0.001); // V/m
  const electricFieldDielectric = electricFieldAir / dielectricK;

  // Canvas render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    // Dark background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    const plateW = Math.min(width * 0.65, 340);
    const plateThickness = 12;
    const centerX = width / 2;
    const centerY = height / 2;
    // plate distance in canvas px
    const gapPx = Math.min(180, Math.max(50, plateDistance * 35));

    const topPlateY = centerY - gapPx / 2 - plateThickness;
    const bottomPlateY = centerY + gapPx / 2;

    // 1. Draw Top Plate (+Q, Copper/Amber)
    const topGrad = ctx.createLinearGradient(centerX - plateW / 2, 0, centerX + plateW / 2, 0);
    topGrad.addColorStop(0, '#d97706');
    topGrad.addColorStop(0.5, '#fbbf24');
    topGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = topGrad;
    ctx.beginPath();
    ctx.roundRect(centerX - plateW / 2, topPlateY, plateW, plateThickness, 4);
    ctx.fill();

    // Plus signs on top plate
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 13px system-ui';
    ctx.textAlign = 'center';
    const numCharges = 9;
    for (let i = 0; i < numCharges; i++) {
      const qx = centerX - plateW / 2 + 20 + i * ((plateW - 40) / (numCharges - 1));
      ctx.fillText('+', qx, topPlateY + 10);
    }

    // 2. Draw Bottom Plate (-Q, Steel/Cyan)
    const botGrad = ctx.createLinearGradient(centerX - plateW / 2, 0, centerX + plateW / 2, 0);
    botGrad.addColorStop(0, '#0284c7');
    botGrad.addColorStop(0.5, '#38bdf8');
    botGrad.addColorStop(1, '#0369a1');
    ctx.fillStyle = botGrad;
    ctx.beginPath();
    ctx.roundRect(centerX - plateW / 2, bottomPlateY, plateW, plateThickness, 4);
    ctx.fill();

    // Minus signs on bottom plate
    ctx.fillStyle = '#082f49';
    for (let i = 0; i < numCharges; i++) {
      const qx = centerX - plateW / 2 + 20 + i * ((plateW - 40) / (numCharges - 1));
      ctx.fillText('−', qx, bottomPlateY + 10);
    }

    // 3. Draw Dielectric Slab Insertion
    const slabW = plateW * insertionFraction;
    if (slabW > 2) {
      const slabX = centerX - plateW / 2;
      const slabY = topPlateY + plateThickness + 2;
      const slabH = gapPx - 4;

      // Slab Body (Purple/Blue Glassy Dielectric)
      const slabGrad = ctx.createLinearGradient(slabX, slabY, slabX + slabW, slabY + slabH);
      slabGrad.addColorStop(0, 'rgba(147, 51, 234, 0.45)');
      slabGrad.addColorStop(1, 'rgba(99, 102, 241, 0.35)');
      ctx.fillStyle = slabGrad;
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(slabX, slabY, slabW, slabH, 6);
      ctx.fill();
      ctx.stroke();

      // Bound Induced Charges (+ and - Dipoles inside dielectric)
      ctx.fillStyle = '#e9d5ff';
      ctx.font = '10px monospace';
      const dipolesX = Math.floor(slabW / 36);
      const dipolesY = Math.floor(slabH / 30);
      for (let r = 0; r < dipolesY; r++) {
        for (let c = 0; c < dipolesX; c++) {
          const dx = slabX + 18 + c * 34;
          const dy = slabY + 18 + r * 28;
          ctx.fillText(`[- +]`, dx, dy);
        }
      }

      // Dielectric label
      ctx.fillStyle = '#d8b4fe';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`Dielectric Slab (k = ${dielectricK})`, slabX + slabW / 2, slabY + slabH / 2 + 4);
    }

    // 4. Draw Electric Field Lines in Free Space
    const freeW = plateW * (1 - insertionFraction);
    if (freeW > 15) {
      const freeX = centerX - plateW / 2 + slabW;
      const numLines = Math.floor(freeW / 30);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      for (let i = 0; i < numLines; i++) {
        const lx = freeX + 15 + i * 28;
        ctx.beginPath();
        ctx.moveTo(lx, topPlateY + plateThickness);
        ctx.lineTo(lx, bottomPlateY);
        ctx.stroke();

        // Arrowhead pointing down
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(lx, centerY + 5);
        ctx.lineTo(lx - 3, centerY - 2);
        ctx.lineTo(lx + 3, centerY - 2);
        ctx.fill();
      }
      ctx.setLineDash([]);
    }

    // 5. Connective Leads & Battery
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    // Top lead
    ctx.beginPath();
    ctx.moveTo(centerX, topPlateY);
    ctx.lineTo(centerX, topPlateY - 25);
    ctx.lineTo(centerX + plateW / 2 + 30, topPlateY - 25);
    ctx.lineTo(centerX + plateW / 2 + 30, centerY - 15);
    ctx.stroke();

    // Bottom lead
    ctx.beginPath();
    ctx.moveTo(centerX, bottomPlateY + plateThickness);
    ctx.lineTo(centerX, bottomPlateY + plateThickness + 25);
    ctx.lineTo(centerX + plateW / 2 + 30, bottomPlateY + plateThickness + 25);
    ctx.lineTo(centerX + plateW / 2 + 30, centerY + 15);
    ctx.stroke();

    // Battery / Switch Symbol
    const batX = centerX + plateW / 2 + 30;
    if (batteryConnected) {
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(batX - 12, centerY - 8);
      ctx.lineTo(batX + 12, centerY - 8);
      ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(batX - 7, centerY + 8);
      ctx.lineTo(batX + 7, centerY + 8);
      ctx.stroke();

      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText('12V Battery', batX + 18, centerY + 4);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText('Disconnected (Q = const)', batX + 18, centerY + 4);
    }

    ctx.restore();
  }, [dielectricK, plateDistance, batteryConnected, insertionFraction]);

  return (
    <div className="space-y-4">
      {/* Visual Canvas Area */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-[300px] sm:h-[360px] block" />

        {/* Live Gauges Overlay */}
        <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-xs space-y-1.5 shadow-xl pointer-events-none min-w-[210px]">
          <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 flex justify-between">
            <span>Capacitor State</span>
            <span className="font-mono text-cyan-400">C = kε₀A/d</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Capacitance (C):</span>
            <span className="font-mono text-cyan-300 font-bold">{(currentCapacitance / 10).toFixed(2)} μF</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Potential (V):</span>
            <span className="font-mono text-amber-300 font-bold">{voltage.toFixed(1)} V</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Stored Energy (U):</span>
            <span className="font-mono text-emerald-300 font-bold">{(energy / 100).toFixed(2)} mJ</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Interactive Controls</span>
          </div>
          <button
            onClick={() => setBatteryConnected(!batteryConnected)}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              batteryConnected
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{batteryConnected ? 'Battery Connected (V=const)' : 'Battery Disconnected (Q=const)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Dielectric Constant k */}
          <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-slate-300">
              <span>Dielectric Constant (k):</span>
              <span className="font-bold text-purple-400 font-mono">{dielectricK}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={dielectricK}
              onChange={(e) => setDielectricK(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          {/* Plate Separation d */}
          <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-slate-300">
              <span>Plate Distance (d):</span>
              <span className="font-bold text-cyan-400 font-mono">{plateDistance} mm</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={plateDistance}
              onChange={(e) => setPlateDistance(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Insertion Slider */}
          <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-slate-300">
              <span>Slab Insertion:</span>
              <span className="font-bold text-amber-400 font-mono">{Math.round(insertionFraction * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={insertionFraction}
              onChange={(e) => setInsertionFraction(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Physics Note */}
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-cyan-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Exam Concept:</strong> When plate distance is doubled (<code className="text-amber-300">d → 2d</code>) and dielectric constant is changed from <code className="text-purple-300">k₁ = 2</code> to <code className="text-purple-300">k₂ = 4</code>, the new capacitance is <code className="text-emerald-300">C₂ = (k₂/2d)·ε₀A = (4/2)·(C₁/k₁) = 2 × (3/2) = 3 μF</code>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapacitorDielectric;
