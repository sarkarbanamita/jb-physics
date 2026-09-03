'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MagneticFieldParams, SimulationProps } from '../types';
import { Play, Pause, RotateCcw, Compass, ArrowUp, ArrowDown } from 'lucide-react';

export const MagneticFieldCurrents: React.FC<SimulationProps<MagneticFieldParams>> = ({ params }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<'SEMICIRCLE' | 'SOLENOID' | 'PARALLEL_WIRES' | 'CIRCULAR_LOOP'>(
    params?.mode || 'SEMICIRCLE'
  );
  const [current, setCurrent] = useState(params?.current || 2);
  const [radius, setRadius] = useState(params?.radius || 50);
  const [wireDistance, setWireDistance] = useState(60);
  const [current2, setCurrent2] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const render = () => {
      tick += 0.03;
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

      if (mode === 'SEMICIRCLE') {
        // Q8: Semicircular Wire Biot-Savart
        const r = radius * 1.5;
        const startX = cx - r - 80;
        const endX = cx + r + 80;

        // Left straight wire
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX, cy);
        ctx.lineTo(cx - r, cy);
        ctx.stroke();

        // Right straight wire
        ctx.beginPath();
        ctx.moveTo(cx + r, cy);
        ctx.lineTo(endX, cy);
        ctx.stroke();

        // Semicircular arc (upper half)
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI, 0, false);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Current flow arrows
        const drawArrow = (x: number, y: number, angle: number) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(0, -6);
          ctx.lineTo(12, 0);
          ctx.lineTo(0, 6);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        };

        drawArrow(startX + 40, cy, 0);
        drawArrow(cx + r + 40, cy, 0);
        // Arrow on arc
        const arcAngle = Math.PI - 0.5 + (Math.sin(tick) * 0.2);
        drawArrow(cx + r * Math.cos(arcAngle), cy - r * Math.sin(arcAngle), arcAngle - Math.PI / 2);

        // Center Point O
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('Center O', cx - 24, cy + 22);

        // Radius line
        ctx.strokeStyle = '#94a3b8';
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy - r);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#fde68a';
        ctx.fillText(`Radius a = ${radius} mm`, cx + 8, cy - r / 2);

        // Field representation at O (into the page ⊗)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.fillText('⊗ B = μ₀ i / (4a)', cx + 20, cy + 4);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Straight segments contribute 0 (collinear). Semicircle gives exactly half of full circle!', cx - 180, height - 20);
      } else if (mode === 'SOLENOID') {
        // Q6: Solenoid
        const solL = 240;
        const solH = radius * 1.2;
        const solX = cx - solL / 2;
        const solY = cy - solH / 2;

        // Coil loops
        const turns = 14;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        for (let i = 0; i < turns; i++) {
          const x = solX + (i * (solL / turns));
          ctx.beginPath();
          ctx.ellipse(x, cy, 8, solH / 2, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Field lines inside (axial uniform lines)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        for (let dy = -solH / 3; dy <= solH / 3; dy += solH / 3) {
          ctx.beginPath();
          ctx.moveTo(solX - 20, cy + dy);
          ctx.lineTo(solX + solL + 20, cy + dy);
          ctx.stroke();
        }

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Uniform Axial Field: B = μ₀ n I`, cx - 90, cy - solH / 2 - 20);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText(`Independent of Solenoid Radius r! (Option D)`, cx - 120, height - 25);
      } else if (mode === 'PARALLEL_WIRES') {
        // Q13: Parallel Wires
        const w1X = cx - wireDistance;
        const w2X = cx + wireDistance;

        // Draw Wire 1
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(w1X, 40);
        ctx.lineTo(w1X, height - 60);
        ctx.stroke();

        // Draw Wire 2
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(w2X, 40);
        ctx.lineTo(w2X, height - 60);
        ctx.stroke();

        // Current labels
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Wire 1 (I₁ = ${current}A)`, w1X - 45, 30);
        ctx.fillStyle = '#10b981';
        ctx.fillText(`Wire 2 (I₂ = ${current2}A)`, w2X - 45, 30);

        // Force Arrows (Attraction if same direction)
        ctx.strokeStyle = '#ef4444';
        ctx.fillStyle = '#ef4444';
        ctx.lineWidth = 3;

        // Force on 1
        ctx.beginPath();
        ctx.moveTo(w1X, cy);
        ctx.lineTo(w1X + 35, cy);
        ctx.stroke();

        // Force on 2
        ctx.beginPath();
        ctx.moveTo(w2X, cy);
        ctx.lineTo(w2X - 35, cy);
        ctx.stroke();

        ctx.fillText('F', w1X + 15, cy - 8);
        ctx.fillText('F', w2X - 25, cy - 8);

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Force F = (μ₀ I₁ I₂) / (2π d) ⟹ If currents double (2×2) & distance triples (3d): F' = 4F/3`, cx - 220, height - 20);
      } else if (mode === 'CIRCULAR_LOOP') {
        // Q14: Circular Loop Dipole Moment
        const r1 = 40;
        const r2 = 80;

        // Loop 1
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx - 100, cy, r1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Coil 1: r₁ = 1, I₁ = 2`, cx - 135, cy + r1 + 25);

        // Loop 2
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx + 100, cy, r2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`Coil 2: r₂ = 2, I₂ = 1`, cx + 65, cy + r2 + 25);

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`M = I · (π r²) ⟹ M₁/M₂ = (I₁/I₂) × (r₁/r₂)² = (2/1) × (1/4) = 1/2 ⟹ I₁:I₂ = 2:1`, cx - 210, height - 20);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mode, current, radius, wireDistance, current2, isPlaying]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMode('SEMICIRCLE')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'SEMICIRCLE' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semicircle Arc (Q8)
          </button>
          <button
            onClick={() => setMode('SOLENOID')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'SOLENOID' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ideal Solenoid (Q6)
          </button>
          <button
            onClick={() => setMode('PARALLEL_WIRES')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'PARALLEL_WIRES' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Parallel Wires (Q13)
          </button>
          <button
            onClick={() => setMode('CIRCULAR_LOOP')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'CIRCULAR_LOOP' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Coil Moment (Q14)
          </button>
        </div>
      </div>

      <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <canvas ref={canvasRef} className="w-full h-[320px] sm:h-[360px] block" />
      </div>
    </div>
  );
};

export default MagneticFieldCurrents;
