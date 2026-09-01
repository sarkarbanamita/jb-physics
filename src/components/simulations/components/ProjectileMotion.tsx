'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProjectileParams, SimulationProps } from '../types';
import { Play, RotateCcw, Sliders, Target, Zap, Info } from 'lucide-react';

export const ProjectileMotion: React.FC<SimulationProps<ProjectileParams>> = ({ params }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States
  const [velocity, setVelocity] = useState(params?.velocity ?? 25); // m/s
  const [angleDeg, setAngleDeg] = useState(params?.angle ?? 45);   // degrees
  const [gravity, setGravity] = useState(params?.gravity ?? 9.8);   // m/s^2

  const [isPlaying, setIsPlaying] = useState(false);
  const [flightTime, setFlightTime] = useState(0);
  const [targetX, setTargetX] = useState(55); // target at 55 meters
  const [hitTarget, setHitTarget] = useState(false);

  // Trajectory physics math
  const angleRad = (angleDeg * Math.PI) / 180;
  const vx0 = velocity * Math.cos(angleRad);
  const vy0 = velocity * Math.sin(angleRad);

  const totalTimeOfFlight = (2 * vy0) / gravity;
  const maxHeight = (vy0 * vy0) / (2 * gravity);
  const range = (velocity * velocity * Math.sin(2 * angleRad)) / gravity;

  // Animation frame loop
  useEffect(() => {
    let animationId: number;
    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setFlightTime((prev) => {
          const next = prev + dt * 1.5; // slight speedup
          if (next >= totalTimeOfFlight) {
            setIsPlaying(false);
            // Check hit
            if (Math.abs(range - targetX) < 3.5) {
              setHitTarget(true);
            }
            return totalTimeOfFlight;
          }
          return next;
        });
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, totalTimeOfFlight, range, targetX]);

  // Canvas drawing
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

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#0c172e');
    skyGrad.addColorStop(1, '#020617');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    const groundY = height - 40;
    const originX = 40;
    const meterScale = Math.min((width - 80) / Math.max(80, range * 1.2, targetX + 15), (height - 80) / Math.max(30, maxHeight * 1.4));

    // Draw Ground
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, groundY, width, 40);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // Ground distance markers
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    for (let m = 0; m <= 100; m += 10) {
      const mx = originX + m * meterScale;
      if (mx < width - 10) {
        ctx.beginPath();
        ctx.moveTo(mx, groundY);
        ctx.lineTo(mx, groundY + 6);
        ctx.strokeStyle = '#475569';
        ctx.stroke();
        ctx.fillText(`${m}m`, mx, groundY + 18);
      }
    }

    // Draw Target Bullseye
    const targetPxX = originX + targetX * meterScale;
    ctx.fillStyle = hitTarget ? '#22c55e' : '#ef4444';
    ctx.beginPath();
    ctx.arc(targetPxX, groundY - 8, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(targetPxX, groundY - 8, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hitTarget ? '#4ade80' : '#f87171';
    ctx.font = 'bold 10px system-ui';
    ctx.fillText(`Target: ${targetX}m`, targetPxX, groundY - 22);

    // Draw Complete Theoretical Parabolic Trajectory
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    const numPoints = 80;
    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * totalTimeOfFlight;
      const px = originX + (vx0 * t) * meterScale;
      const py = groundY - (vy0 * t - 0.5 * gravity * t * t) * meterScale;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Trajectory Traced So Far
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    const currentSteps = Math.floor((flightTime / totalTimeOfFlight) * numPoints);
    for (let i = 0; i <= currentSteps; i++) {
      const t = (i / numPoints) * totalTimeOfFlight;
      const px = originX + (vx0 * t) * meterScale;
      const py = groundY - (vy0 * t - 0.5 * gravity * t * t) * meterScale;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current Projectile Position & Velocity Vectors
    const curX = vx0 * flightTime;
    const curY = Math.max(0, vy0 * flightTime - 0.5 * gravity * flightTime * flightTime);
    const curPxX = originX + curX * meterScale;
    const curPxY = groundY - curY * meterScale;

    const curVx = vx0;
    const curVy = vy0 - gravity * flightTime;

    // Draw Projectile Ball
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(curPxX, curPxY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Velocity Vector Arrow (v)
    const vScale = 1.2;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(curPxX, curPxY);
    ctx.lineTo(curPxX + curVx * vScale, curPxY - curVy * vScale);
    ctx.stroke();

    // Cannon Barrel at origin
    const barrelLen = 22;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(originX, groundY);
    ctx.lineTo(originX + barrelLen * Math.cos(angleRad), groundY - barrelLen * Math.sin(angleRad));
    ctx.stroke();

    ctx.restore();
  }, [velocity, angleRad, gravity, flightTime, totalTimeOfFlight, range, maxHeight, vx0, vy0, targetX, hitTarget]);

  const handleLaunch = () => {
    setFlightTime(0);
    setHitTarget(false);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setFlightTime(0);
    setHitTarget(false);
  };

  return (
    <div className="space-y-4">
      {/* Canvas View */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-[300px] sm:h-[380px] block" />

        {/* Live Gauges */}
        <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-xs space-y-1.5 shadow-xl pointer-events-none min-w-[220px]">
          <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 flex justify-between">
            <span>Projectile Metrics</span>
            <span className="font-mono text-cyan-400">θ = {angleDeg}°</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Range (R):</span>
            <span className="font-mono text-cyan-300 font-bold">{range.toFixed(1)} m</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Max Height (H_max):</span>
            <span className="font-mono text-emerald-300 font-bold">{maxHeight.toFixed(1)} m</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Flight Time (T):</span>
            <span className="font-mono text-amber-300 font-bold">{totalTimeOfFlight.toFixed(2)} s</span>
          </div>
          {hitTarget && (
            <div className="mt-1 py-1 px-2 bg-emerald-500/20 text-emerald-300 font-bold rounded text-center border border-emerald-500/30 animate-bounce">
              🎯 Target Hit!
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={handleLaunch}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Launch</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl shadow-lg transition text-xs"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sliders */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Trajectory Controls</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Adjust angle and speed to hit the bullseye
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Velocity Slider */}
          <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-slate-300">
              <span>Velocity (v₀):</span>
              <span className="font-bold text-amber-400 font-mono">{velocity} m/s</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={velocity}
              onChange={(e) => {
                setVelocity(Number(e.target.value));
                setHitTarget(false);
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Launch Angle Slider */}
          <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-slate-300">
              <span>Launch Angle (θ):</span>
              <span className="font-bold text-cyan-400 font-mono">{angleDeg}°</span>
            </div>
            <input
              type="range"
              min="10"
              max="85"
              step="1"
              value={angleDeg}
              onChange={(e) => {
                setAngleDeg(Number(e.target.value));
                setHitTarget(false);
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Gravity Selector */}
          <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-slate-300">
              <span>Gravity (g):</span>
              <span className="font-bold text-emerald-400 font-mono">{gravity} m/s²</span>
            </div>
            <div className="flex gap-1 pt-0.5">
              {[
                { label: 'Earth (9.8)', val: 9.8 },
                { label: 'Moon (1.6)', val: 1.6 },
                { label: 'Mars (3.7)', val: 3.7 },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setGravity(item.val)}
                  className={`flex-1 py-1 text-[10px] font-semibold rounded ${
                    gravity === item.val
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Physics Note */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Formulas (সূত্র):</strong> Maximum Range occurs at <code className="text-amber-300">θ = 45°</code> where <code className="text-cyan-300">R = v₀²/g</code>. Time of flight is <code className="text-emerald-300">T = (2v₀ sin θ)/g</code>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectileMotion;
