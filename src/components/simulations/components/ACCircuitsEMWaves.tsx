'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ACCircuitsParams, SimulationProps } from '../types';
import { Waves, Radio, Sliders, Zap, Activity } from 'lucide-react';

export const ACCircuitsEMWaves: React.FC<SimulationProps<ACCircuitsParams>> = ({ params }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<'3D_EM_WAVE' | 'TRANSFORMER' | 'LCR_RESONANCE' | 'AC_SINE_RMS' | 'FARADAY_FLUX'>(
    params?.mode === 'TRANSFORMER' ? 'TRANSFORMER' : '3D_EM_WAVE'
  );

  // Transformer states (Q31)
  const [primaryTurns, setPrimaryTurns] = useState(500);
  const [targetVs, setTargetVs] = useState(500);
  const [primaryV, setPrimaryV] = useState(250); // Pin = 1000W / 4A = 250V
  const requiredSecondaryTurns = (targetVs / primaryV) * primaryTurns; // (500/250)*500 = 1000

  // Faraday states (Q35)
  const [timeT, setTimeT] = useState(1.0);
  const fluxVal = 6 * timeT * timeT - 5 * timeT + 4;
  const emfVal = Math.abs(12 * timeT - 5);
  const currentVal = emfVal / 7;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const render = () => {
      tick += 0.04;
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

      const cx = width / 2;
      const cy = height / 2;

      if (mode === '3D_EM_WAVE') {
        // Q23: 3D EM Wave Propagation E along Y, B along Z, Propagation along X
        const startX = 50;
        const endX = width - 60;
        const axisY = cy;

        // X-Axis (propagation)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, axisY);
        ctx.lineTo(endX, axisY);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('+X Axis (Propagation Vector S = E × B)', endX - 180, axisY - 12);

        // Wave lines
        const waveL = 100;
        const eAmp = 45;
        const bAmp = 35;

        // Draw E-field (vertical Y-plane sine wave)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = startX; x <= endX; x += 3) {
          const phase = ((x - startX) / waveL) * Math.PI * 2 - tick;
          const y = axisY - Math.sin(phase) * eAmp;
          if (x === startX) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw B-field (isometric Z-plane sine wave)
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = startX; x <= endX; x += 3) {
          const phase = ((x - startX) / waveL) * Math.PI * 2 - tick;
          const sinVal = Math.sin(phase);
          const px = x + sinVal * (bAmp * 0.6);
          const py = axisY + sinVal * (bAmp * 0.4);
          if (x === startX) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Sample vector at center
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Electric Field Vector: E = 7.2 ĵ V/m', 40, 40);
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('Magnetic Field Vector: B = 2.4×10⁻⁸ k̂ T', 40, 60);

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('E = c·B = (3×10⁸)(2.4×10⁻⁸) = 7.2 V/m | Direction: ĵ × k̂ = î (Option A: 7.2 ĵ)', 40, height - 20);
      } else if (mode === 'TRANSFORMER') {
        // Q31: Transformer turns ratio
        const coreW = 200;
        const coreH = 140;
        const coreX = cx - coreW / 2;
        const coreY = cy - coreH / 2 - 10;

        // Iron Core
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(coreX, coreY, coreW, coreH);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 4;
        ctx.strokeRect(coreX, coreY, coreW, coreH);

        // Inner Core window
        ctx.fillStyle = '#090d16';
        ctx.fillRect(coreX + 40, coreY + 30, coreW - 80, coreH - 60);
        ctx.strokeRect(coreX + 40, coreY + 30, coreW - 80, coreH - 60);

        // Primary coil (Left)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        for (let i = 0; i < 7; i++) {
          ctx.beginPath();
          ctx.arc(coreX + 20, coreY + 35 + i * 11, 15, Math.PI * 0.5, Math.PI * 1.5);
          ctx.stroke();
        }

        // Secondary coil (Right)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        for (let i = 0; i < 11; i++) {
          ctx.beginPath();
          ctx.arc(coreX + coreW - 20, coreY + 20 + i * 9, 15, -Math.PI * 0.5, Math.PI * 0.5);
          ctx.stroke();
        }

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Primary: Np = ${primaryTurns} turns`, coreX - 110, coreY + 40);
        ctx.fillText(`Vp = Pin/Ip = 1000W/4A = 250 V`, coreX - 110, coreY + 60);

        ctx.fillStyle = '#10b981';
        ctx.fillText(`Secondary: Ns = ${requiredSecondaryTurns.toFixed(0)} turns`, coreX + coreW + 15, coreY + 40);
        ctx.fillText(`Vs = ${targetVs} V (Step-Up)`, coreX + coreW + 15, coreY + 60);

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Vs / Vp = Ns / Np ⟹ 500 / 250 = Ns / 500 ⟹ Ns = 1000 turns (Option A)`, 40, height - 20);
      } else if (mode === 'LCR_RESONANCE') {
        // Q33: Series LCR Resonance Curve
        const originX = 60;
        const originY = height - 40;
        const graphW = width - 120;
        const graphH = height - 80;

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(originX, originY - graphH);
        ctx.lineTo(originX, originY);
        ctx.lineTo(originX + graphW, originY);
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Current I', originX - 10, originY - graphH - 10);
        ctx.fillText('Frequency ω', originX + graphW + 5, originY + 4);

        // Resonance Curve (Lorentzian shape)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const resX = originX + graphW / 2;
        for (let px = originX; px <= originX + graphW; px += 2) {
          const dx = (px - resX) / 25;
          const curveY = originY - graphH * 0.9 / (1 + dx * dx);
          if (px === originX) ctx.moveTo(px, curveY);
          else ctx.lineTo(px, curveY);
        }
        ctx.stroke();

        // Resonance Peak Mark
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(resX, originY - graphH * 0.9, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Max Current Peak: I_max = V / R', resX - 80, originY - graphH * 0.9 - 15);
        ctx.fillText('Resonance Condition: X_L = X_C (Z = R minimum)', resX - 110, originY - graphH * 0.9 + 25);

        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Z = √(R² + (X_L - X_C)²) ⟹ Current is maximum when X_L = X_C (Option C)', 40, height - 10);
      } else if (mode === 'AC_SINE_RMS') {
        // Q32 & Q34: AC Sine wave RMS vs Average
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('E(t) = 220 sin(100π t - π/15) V', 50, 45);
        ctx.fillText('Peak EMF E₀ = 220 V ⟹ E_rms = 220 / √2 V', 50, 75);
        ctx.fillText('Angular Frequency ω = 100π rad/s ⟹ Frequency f = ω / (2π) = 50 Hz (Option A)', 50, 105);

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('Ratio of RMS to Average over Half Cycle (Q32):', 50, 150);
        ctx.fillStyle = '#10b981';
        ctx.fillText('I_rms = I₀ / √2  and  I_avg = 2 I₀ / π', 50, 180);
        ctx.fillText('⟹ Ratio = (I₀ / √2) / (2 I₀ / π) = π / (2√2) (Option D: π : 2√2)', 50, 210);
      } else if (mode === 'FARADAY_FLUX') {
        // Q35: Faraday Induced Current
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Magnetic Flux: ϕ(t) = 6t² - 5t + 4`, 50, 45);
        ctx.fillText(`Induced EMF: |E| = |dϕ/dt| = |12t - 5|`, 50, 75);
        ctx.fillText(`At time t = ${timeT.toFixed(1)} s: |E| = 12(${timeT.toFixed(1)}) - 5 = ${emfVal.toFixed(1)} V`, 50, 105);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`Circuit Resistance R = 7 Ω`, 50, 145);
        ctx.fillText(`Induced Current: I = |E| / R = ${emfVal.toFixed(1)}V / 7Ω = ${currentVal.toFixed(2)} A (Option D: 1 A at t=1s)`, 50, 175);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mode, primaryTurns, targetVs, primaryV, requiredSecondaryTurns, timeT, fluxVal, emfVal, currentVal]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMode('3D_EM_WAVE')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === '3D_EM_WAVE' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            3D EM Wave (Q23)
          </button>
          <button
            onClick={() => setMode('TRANSFORMER')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'TRANSFORMER' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Transformer (Q31: 1000)
          </button>
          <button
            onClick={() => setMode('LCR_RESONANCE')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'LCR_RESONANCE' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            LCR Resonance (Q33)
          </button>
          <button
            onClick={() => setMode('AC_SINE_RMS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'AC_SINE_RMS' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            AC RMS & Average (Q32, Q34)
          </button>
          <button
            onClick={() => setMode('FARADAY_FLUX')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'FARADAY_FLUX' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Faraday Current (Q35: 1A)
          </button>
        </div>
      </div>

      <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <canvas ref={canvasRef} className="w-full h-[320px] sm:h-[360px] block" />
      </div>

      {mode === 'FARADAY_FLUX' && (
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
          <div className="flex justify-between font-bold mb-1">
            <span className="text-slate-300">Time t (seconds):</span>
            <span className="text-amber-400 font-mono text-sm">{timeT.toFixed(1)} s</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={timeT}
            onChange={(e) => setTimeT(parseFloat(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>
      )}
    </div>
  );
};

export default ACCircuitsEMWaves;
