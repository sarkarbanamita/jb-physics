'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EarthMagnetismDipoleParams, SimulationProps } from '../types';
import { Compass, RotateCw, Sparkles, Layers } from 'lucide-react';

export const EarthMagnetismDipole: React.FC<SimulationProps<EarthMagnetismDipoleParams>> = ({ params }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<'DIP_CIRCLE' | 'BENT_WIRE' | 'FIELD_LINES' | 'NULL_POINT' | 'ROTATED_DIPOLE'>(
    params?.mode || 'DIP_CIRCLE'
  );

  const [bvRatio, setBvRatio] = useState(params?.bvRatio || 2.0);
  const [dipoleAngle, setDipoleAngle] = useState(0); // 0 = axial, 90 = equatorial
  const [chargeRatio, setChargeRatio] = useState(4); // q2 = 4*q1

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

      const cx = width / 2;
      const cy = height / 2;

      if (mode === 'DIP_CIRCLE') {
        // Q9: Earth's Dip Circle (Bv = 2 Bh => tan theta = 2)
        const compassR = 90;

        // Compass Ring
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, compassR, 0, Math.PI * 2);
        ctx.stroke();

        // Horizontal & Vertical Reference Axes
        ctx.strokeStyle = '#475569';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(cx - compassR - 20, cy);
        ctx.lineTo(cx + compassR + 20, cy);
        ctx.moveTo(cx, cy - compassR - 20);
        ctx.lineTo(cx, cy + compassR + 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Component Vectors
        const bhLen = 60;
        const bvLen = bhLen * bvRatio; // Bv = 2 * Bh

        // Draw Bh (Horizontal vector)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + bhLen, cy);
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`B_h`, cx + bhLen + 8, cy + 4);

        // Draw Bv (Vertical vector downwards)
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(cx + bhLen, cy);
        ctx.lineTo(cx + bhLen, cy + Math.min(compassR, bvLen));
        ctx.stroke();
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`B_v = ${bvRatio.toFixed(1)} B_h`, cx + bhLen + 8, cy + bvLen / 2);

        // Resultant B needle
        const dipAngleRad = Math.atan(bvRatio);
        const needleX = cx + compassR * Math.cos(dipAngleRad);
        const needleY = cy + compassR * Math.sin(dipAngleRad);

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx - compassR * 0.7 * Math.cos(dipAngleRad), cy - compassR * 0.7 * Math.sin(dipAngleRad));
        ctx.lineTo(needleX, needleY);
        ctx.stroke();

        // Needle tip
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(needleX, needleY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Formula readout
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Angle of Dip θ: tan θ = B_v / B_h = (${bvRatio.toFixed(1)} B_h) / B_h = ${bvRatio.toFixed(1)} (Option A: 2)`, 40, height - 20);
      } else if (mode === 'BENT_WIRE') {
        // Q12: Straight wire bent into semicircle
        // Straight Wire
        const startX = 60;
        const wireL = 160;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX, cy - 40);
        ctx.lineTo(startX + wireL, cy - 40);
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Initial Straight Wire: Length L, Dipole Moment M = m · L`, startX, cy - 55);

        // Semicircular Bent Wire
        const semiR = wireL / Math.PI; // L = pi * r => r = L / pi
        const semiCX = cx + 80;
        const semiCY = cy + 20;

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(semiCX, semiCY, semiR, Math.PI, 0, false);
        ctx.stroke();

        // Diameter distance between poles
        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(semiCX - semiR, semiCY);
        ctx.lineTo(semiCX + semiR, semiCY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`New Pole Separation = 2r = 2L / π`, semiCX - 70, semiCY + 20);

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`New Magnetic Dipole Moment: M' = m(2r) = m(2L/π) = 2M / π (Option B)`, 40, height - 20);
      } else if (mode === 'FIELD_LINES') {
        // Q16: Electric Field Lines Density
        // Converging field lines on left (Point A) spreading to B, C, D on right
        const lines = 7;
        for (let i = 0; i < lines; i++) {
          const t = (i - (lines - 1) / 2) / ((lines - 1) / 2);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx - 160, cy + t * 25);
          ctx.bezierCurveTo(cx - 50, cy + t * 45, cx + 50, cy + t * 80, cx + 160, cy + t * 110);
          ctx.stroke();
        }

        // Draw Points A, B, C, D
        const drawPoint = (x: number, y: number, label: string, isMax: boolean) => {
          ctx.fillStyle = isMax ? '#10b981' : '#f59e0b';
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(label, x - 5, y - 10);
        };

        drawPoint(cx - 120, cy, 'Point A (Maximum)', true);
        drawPoint(cx - 20, cy - 35, 'Point B', false);
        drawPoint(cx + 80, cy + 55, 'Point C', false);
        drawPoint(cx + 100, cy - 70, 'Point D', false);

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Line Density is Highest near Point A ⟹ Electric Field Intensity is Maximum at A (Option A)`, 40, height - 20);
      } else if (mode === 'NULL_POINT') {
        // Q17: Null Point of Two Point Charges (q and 4q, d = 0.18m)
        const q1X = cx - 120;
        const q2X = cx + 120;
        const d = 0.18;
        const xNull = 0.06; // 0.06m from smaller charge
        const nullX = q1X + (240 * (xNull / d));

        // Line joining charges
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(q1X, cy);
        ctx.lineTo(q2X, cy);
        ctx.stroke();

        // Charge 1 (q)
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(q1X, cy, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('+q', q1X - 8, cy - 15);

        // Charge 2 (4q)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(q2X, cy, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('+4q', q2X - 10, cy - 25);

        // Null Point P
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(nullX, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('Null Point P (E = 0)', nullX - 45, cy + 25);
        ctx.fillText('0.06 m', (q1X + nullX) / 2 - 15, cy - 8);
        ctx.fillText('0.12 m', (nullX + q2X) / 2 - 15, cy - 8);

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`kq/x² = k(4q)/(0.18-x)² ⟹ 1/x = 2/(0.18-x) ⟹ x = 0.06 m from smaller charge (Option B)`, 40, height - 20);
      } else if (mode === 'ROTATED_DIPOLE') {
        // Q18: Electric Dipole Rotated 90 degrees
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Axial Position: E_axial = 2kp / r³ = E`, cx - 140, cy - 40);
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`Rotated 90° ⟹ Equatorial Position: E_equatorial = kp / r³`, cx - 140, cy);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`⟹ New Field = E_axial / 2 = E / 2 (Option C)`, cx - 140, cy + 40);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mode, bvRatio, dipoleAngle, chargeRatio]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMode('DIP_CIRCLE')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'DIP_CIRCLE' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dip Circle (Q9: tanθ=2)
          </button>
          <button
            onClick={() => setMode('BENT_WIRE')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'BENT_WIRE' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bent Wire (Q12: 2M/π)
          </button>
          <button
            onClick={() => setMode('FIELD_LINES')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'FIELD_LINES' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Field Lines Density (Q16)
          </button>
          <button
            onClick={() => setMode('NULL_POINT')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'NULL_POINT' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Charges Null Point (Q17)
          </button>
          <button
            onClick={() => setMode('ROTATED_DIPOLE')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'ROTATED_DIPOLE' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rotated Dipole (Q18: E/2)
          </button>
        </div>
      </div>

      <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <canvas ref={canvasRef} className="w-full h-[320px] sm:h-[360px] block" />
      </div>

      {mode === 'DIP_CIRCLE' && (
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
          <div className="flex justify-between font-bold mb-1">
            <span className="text-slate-300">Vertical to Horizontal Ratio (B_v / B_h):</span>
            <span className="text-amber-400 font-mono text-sm">{bvRatio.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="4.0"
            step="0.5"
            value={bvRatio}
            onChange={(e) => setBvRatio(parseFloat(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>
      )}
    </div>
  );
};

export default EarthMagnetismDipole;
