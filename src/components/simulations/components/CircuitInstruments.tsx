'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CircuitInstrumentsParams, SimulationProps } from '../types';
import { Gauge, Sliders, Zap, CheckCircle2 } from 'lucide-react';

export const CircuitInstruments: React.FC<SimulationProps<CircuitInstrumentsParams>> = ({ params }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<'AMMETER_SHUNT' | 'POTENTIOMETER' | 'PARALLEL_CELLS' | 'WHEATSTONE'>(
    params?.mode || 'POTENTIOMETER'
  );

  // Potentiometer state (Q27)
  const [sliderLength, setSliderLength] = useState(params?.balanceLength || 40);
  const [resistorR, setResistorR] = useState(790);

  // Shunt ammeter state (Q7)
  const [voltmeterRg, setVoltmeterRg] = useState(300);
  const [maxV, setMaxV] = useState(150);
  const [targetI, setTargetI] = useState(8);

  // Parallel cells state (Q30)
  const [e1, setE1] = useState(3);
  const [e2, setE2] = useState(2);
  const [r1, setR1] = useState(0.2);
  const [r2, setR2] = useState(0.3);

  // Calculated values
  const ig = maxV / voltmeterRg; // 150 / 300 = 0.5A
  const calculatedShunt = (ig * voltmeterRg) / (targetI - ig); // 150 / 7.5 = 20 ohms

  const primaryCurrent = 2 / (resistorR + 10);
  const potWireVoltage = primaryCurrent * 10;
  const potentialGradient = potWireVoltage / 100;
  const measuredV = potentialGradient * sliderLength;

  const eqEmf = (e1 / r1 + e2 / r2) / (1 / r1 + 1 / r2);
  const eqR = 1 / (1 / r1 + 1 / r2);

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

      if (mode === 'POTENTIOMETER') {
        // Q27: Potentiometer Wire Balancing
        const wireStartX = 60;
        const wireEndX = width - 80;
        const wireY = cy - 20;
        const wireL = wireEndX - wireStartX;

        // Draw Potentiometer wire
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(wireStartX, wireY);
        ctx.lineTo(wireEndX, wireY);
        ctx.stroke();

        // Primary circuit (top battery + R)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(wireStartX, wireY);
        ctx.lineTo(wireStartX, wireY - 60);
        ctx.lineTo(cx - 50, wireY - 60);
        // Battery 2V
        ctx.moveTo(cx + 50, wireY - 60);
        ctx.lineTo(wireEndX, wireY - 60);
        ctx.lineTo(wireEndX, wireY);
        ctx.stroke();

        // Battery symbol & R box
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Primary Battery: 2V`, cx - 40, wireY - 70);
        ctx.fillText(`Series Resistor R = ${resistorR} Ω`, cx - 60, wireY - 45);

        // Potentiometer wire label
        ctx.fillStyle = '#fde68a';
        ctx.fillText(`Potentiometer Wire (L = 100 cm, Rw = 10 Ω)`, cx - 110, wireY + 20);

        // Secondary circuit (10 mV galvanometer branch)
        const balanceFrac = sliderLength / 100;
        const jockeyX = wireStartX + wireL * balanceFrac;

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(wireStartX, wireY);
        ctx.lineTo(wireStartX, wireY + 70);
        ctx.lineTo(cx - 30, wireY + 70);
        // Secondary cell 10mV
        ctx.moveTo(cx + 30, wireY + 70);
        ctx.lineTo(jockeyX, wireY + 70);
        ctx.lineTo(jockeyX, wireY);
        ctx.stroke();

        // Jockey pointer
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(jockeyX, wireY);
        ctx.lineTo(jockeyX - 6, wireY + 12);
        ctx.lineTo(jockeyX + 6, wireY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.fillText(`Test Cell: 10 mV (0.01 V) | Jockey at l = ${sliderLength} cm`, cx - 110, wireY + 90);

        // Balance readout
        const isBalanced = Math.abs(measuredV - 0.01) < 0.0005;
        ctx.fillStyle = isBalanced ? '#10b981' : '#f59e0b';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(
          isBalanced
            ? `✔ NULL BALANCE ACHIEVED! E' = k·l ⟹ 0.01V = (0.2 / (${resistorR}+10)) × 40 ⟹ R = 790 Ω`
            : `Measuring: V(l) = ${(measuredV * 1000).toFixed(2)} mV (Adjust R to 790 Ω for 10 mV balance)`,
          40,
          height - 20
        );
      } else if (mode === 'AMMETER_SHUNT') {
        // Q7: Voltmeter to Ammeter Shunt Conversion
        const leftX = cx - 140;
        const rightX = cx + 140;

        // Main line
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(leftX - 40, cy);
        ctx.lineTo(leftX, cy);
        ctx.moveTo(rightX, cy);
        ctx.lineTo(rightX + 40, cy);
        ctx.stroke();

        // Voltmeter branch (Top)
        ctx.strokeStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(leftX, cy);
        ctx.lineTo(leftX, cy - 50);
        ctx.lineTo(rightX, cy - 50);
        ctx.lineTo(rightX, cy);
        ctx.stroke();

        // Shunt branch (Bottom)
        ctx.beginPath();
        ctx.moveTo(leftX, cy);
        ctx.lineTo(leftX, cy + 50);
        ctx.lineTo(rightX, cy + 50);
        ctx.lineTo(rightX, cy);
        ctx.stroke();

        // Top Voltmeter Box
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cx - 80, cy - 70, 160, 40);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(cx - 80, cy - 70, 160, 40);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Voltmeter: G = 300 Ω`, cx - 65, cy - 52);
        ctx.fillText(`Ig = 150V / 300Ω = 0.5 A`, cx - 65, cy - 36);

        // Bottom Shunt Box
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cx - 80, cy + 30, 160, 40);
        ctx.strokeStyle = '#10b981';
        ctx.strokeRect(cx - 80, cy + 30, 160, 40);
        ctx.fillStyle = '#10b981';
        ctx.fillText(`Shunt S = ${calculatedShunt.toFixed(1)} Ω (in parallel)`, cx - 75, cy + 48);
        ctx.fillText(`Is = 8A - 0.5A = 7.5 A`, cx - 55, cy + 64);

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Total Ammeter Current I = 8 A | S = Ig·G / (I - Ig) = (0.5 × 300) / 7.5 = 20 Ω in parallel`, 40, height - 20);
      } else if (mode === 'PARALLEL_CELLS') {
        // Q30: Parallel Cells Equivalent EMF
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Cell 1: E₁ = ${e1} V, r₁ = ${r1} Ω`, cx - 100, cy - 50);
        ctx.fillText(`Cell 2: E₂ = ${e2} V, r₂ = ${r2} Ω`, cx - 100, cy + 40);

        // Equivalent Formula
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`E_eq = (E₁/r₁ + E₂/r₂) / (1/r₁ + 1/r₂) = (${e1}/${r1} + ${e2}/${r2}) / (1/${r1} + 1/${r2})`, 40, cy + 90);
        ctx.fillStyle = '#10b981';
        ctx.fillText(`= (15 + 6.67) / (5 + 3.33) = 65/25 = ${eqEmf.toFixed(1)} V (Option D: 2.6 volt)`, 40, height - 25);
      } else if (mode === 'WHEATSTONE') {
        // Q15: Wheatstone bridge
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Wheatstone Bridge Balance Condition: P / Q = R / S`, cx - 150, cy - 40);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText(`- Interchanging battery & galvanometer DOES NOT alter balance.`, cx - 150, cy - 10);
        ctx.fillText(`- Changing battery EMF or Galvanometer resistance DOES NOT alter balance.`, cx - 150, cy + 15);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`✔ Balance changes ONLY when arm resistances P, Q, R, or S are changed (Option A).`, cx - 150, cy + 45);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mode, sliderLength, resistorR, maxV, voltmeterRg, targetI, e1, e2, r1, r2, measuredV, calculatedShunt, eqEmf]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMode('POTENTIOMETER')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'POTENTIOMETER' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Potentiometer (Q27: 790Ω)
          </button>
          <button
            onClick={() => setMode('AMMETER_SHUNT')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'AMMETER_SHUNT' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Shunt Ammeter (Q7: 20Ω)
          </button>
          <button
            onClick={() => setMode('PARALLEL_CELLS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'PARALLEL_CELLS' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Parallel Cells (Q30: 2.6V)
          </button>
          <button
            onClick={() => setMode('WHEATSTONE')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'WHEATSTONE' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Wheatstone Null (Q15)
          </button>
        </div>
      </div>

      <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <canvas ref={canvasRef} className="w-full h-[320px] sm:h-[360px] block" />
      </div>

      {/* Controls */}
      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {mode === 'POTENTIOMETER' && (
          <>
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Series Resistor R:</span>
                <span className="text-amber-400 font-mono">{resistorR} Ω</span>
              </div>
              <input
                type="range"
                min="600"
                max="900"
                step="5"
                value={resistorR}
                onChange={(e) => setResistorR(parseInt(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Balancing Length (l):</span>
                <span className="text-cyan-400 font-mono">{sliderLength} cm</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={sliderLength}
                onChange={(e) => setSliderLength(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CircuitInstruments;
