'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ElectricFluxParams, SimulationProps } from '../types';
import { RotateCw, Play, Pause, RefreshCcw, Info, Sliders } from 'lucide-react';

export const ElectricFlux3D: React.FC<SimulationProps<ElectricFluxParams>> = ({ params }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation Parameters state
  const [ex, setEx] = useState(params?.fieldVector?.[0] ?? 3);
  const [ey, setEy] = useState(params?.fieldVector?.[1] ?? -4);
  const [ez, setEz] = useState(params?.fieldVector?.[2] ?? 2);
  const [side, setSide] = useState(params?.side ?? 2);
  const [selectedPlane, setSelectedPlane] = useState<'YZ' | 'XZ' | 'XY'>(params?.plane ?? 'YZ');

  // Animation & Camera State
  const [isRotating, setIsRotating] = useState(true);
  const [showComponents, setShowComponents] = useState(true);
  const [camera, setCamera] = useState({ pitch: 0.35, yaw: -0.65 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Calculated values
  const area = side * side;
  const areaVector: [number, number, number] =
    selectedPlane === 'YZ' ? [area, 0, 0] : selectedPlane === 'XZ' ? [0, area, 0] : [0, 0, area];
  const calculatedFlux = ex * areaVector[0] + ey * areaVector[1] + ez * areaVector[2];

  // 3D Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Resize handling
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

      // Gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) / 8;

      // 3D projection matrix math
      const cosP = Math.cos(camera.pitch);
      const sinP = Math.sin(camera.pitch);
      const cosY = Math.cos(camera.yaw);
      const sinY = Math.sin(camera.yaw);

      const project = (x: number, y: number, z: number) => {
        // Rotate around Y (yaw)
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        // Rotate around X (pitch)
        const y2 = y * cosP - z1 * sinP;
        const z2 = y * sinP + z1 * cosP;

        // Perspective depth
        const fov = 6;
        const pScale = fov / (fov + z2 * 0.4);
        return {
          x: cx + x1 * scale * pScale,
          y: cy - y2 * scale * pScale,
          z: z2,
        };
      };

      // Draw Grid / Coordinate Axes
      const drawAxis = (x: number, y: number, z: number, color: string, label: string) => {
        const origin = project(0, 0, 0);
        const end = project(x, y, z);
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = color;
        ctx.font = 'bold 11px system-ui';
        ctx.fillText(label, end.x + 5, end.y + 3);
      };

      drawAxis(3.5, 0, 0, '#ef4444', '+X (i)');
      drawAxis(0, 3.5, 0, '#22c55e', '+Y (j)');
      drawAxis(0, 0, 3.5, '#3b82f6', '+Z (k)');

      // Draw Plane (Square)
      const half = side / 2;
      let squareVertices: [number, number, number][] = [];
      if (selectedPlane === 'YZ') {
        squareVertices = [
          [0, -half, -half],
          [0, half, -half],
          [0, half, half],
          [0, -half, half],
        ];
      } else if (selectedPlane === 'XZ') {
        squareVertices = [
          [-half, 0, -half],
          [half, 0, -half],
          [half, 0, half],
          [-half, 0, half],
        ];
      } else {
        squareVertices = [
          [-half, -half, 0],
          [half, -half, 0],
          [half, half, 0],
          [-half, half, 0],
        ];
      }

      const projSquare = squareVertices.map((v) => project(v[0], v[1], v[2]));

      // Fill plane
      ctx.beginPath();
      ctx.moveTo(projSquare[0].x, projSquare[0].y);
      for (let i = 1; i < projSquare.length; i++) {
        ctx.lineTo(projSquare[i].x, projSquare[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw Area Vector arrow
      const normalOrigin = project(0, 0, 0);
      const normalLength = 2.0;
      const normalTarget =
        selectedPlane === 'YZ'
          ? project(normalLength, 0, 0)
          : selectedPlane === 'XZ'
          ? project(0, normalLength, 0)
          : project(0, 0, normalLength);

      ctx.beginPath();
      ctx.moveTo(normalOrigin.x, normalOrigin.y);
      ctx.lineTo(normalTarget.x, normalTarget.y);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Area Vector Label
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px system-ui';
      ctx.fillText(`Area Vector A (${area} m²)`, normalTarget.x + 8, normalTarget.y - 4);

      // Draw Electric Field Vector lines passing through
      const drawArrow = (
        from: { x: number; y: number },
        to: { x: number; y: number },
        color: string,
        width: number
      ) => {
        const headlen = 8;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const angle = Math.atan2(dy, dx);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(to.x, to.y);
        ctx.lineTo(to.x - headlen * Math.cos(angle - Math.PI / 6), to.y - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(to.x - headlen * Math.cos(angle + Math.PI / 6), to.y - headlen * Math.sin(angle + Math.PI / 6));
        ctx.fillStyle = color;
        ctx.fill();
      };

      // Grid of electric field arrows
      const eNorm = Math.sqrt(ex * ex + ey * ey + ez * ez) || 1;
      const eVectorScaled: [number, number, number] = [
        (ex / eNorm) * 2.2,
        (ey / eNorm) * 2.2,
        (ez / eNorm) * 2.2,
      ];

      const offsets = [-0.7, 0, 0.7];
      offsets.forEach((ox) => {
        offsets.forEach((oy) => {
          let startPos: [number, number, number];
          if (selectedPlane === 'YZ') startPos = [-1.5, ox, oy];
          else if (selectedPlane === 'XZ') startPos = [ox, -1.5, oy];
          else startPos = [ox, oy, -1.5];

          const endPos: [number, number, number] = [
            startPos[0] + eVectorScaled[0],
            startPos[1] + eVectorScaled[1],
            startPos[2] + eVectorScaled[2],
          ];

          const pStart = project(startPos[0], startPos[1], startPos[2]);
          const pEnd = project(endPos[0], endPos[1], endPos[2]);

          drawArrow(pStart, pEnd, 'rgba(52, 211, 153, 0.85)', 2);
        });
      });

      // Show Components breakdown if enabled
      if (showComponents) {
        const origin = project(0, 0, 0);
        const exProj = project(ex * 0.4, 0, 0);
        const eyProj = project(0, ey * 0.4, 0);
        const ezProj = project(0, 0, ez * 0.4);

        if (ex !== 0) drawArrow(origin, exProj, 'rgba(239, 68, 68, 0.6)', 1.5);
        if (ey !== 0) drawArrow(origin, eyProj, 'rgba(34, 197, 94, 0.6)', 1.5);
        if (ez !== 0) drawArrow(origin, ezProj, 'rgba(59, 130, 246, 0.6)', 1.5);
      }

      ctx.restore();

      // Auto rotation
      if (isRotating && !isDragging.current) {
        setCamera((prev) => ({
          pitch: prev.pitch,
          yaw: prev.yaw + 0.006,
        }));
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [ex, ey, ez, side, selectedPlane, isRotating, showComponents, camera]);

  // Mouse & Touch Drag Handlers for 3D Camera
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setCamera((prev) => ({
      yaw: prev.yaw + dx * 0.01,
      pitch: Math.max(-1.4, Math.min(1.4, prev.pitch - dy * 0.01)),
    }));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMousePos.current.x;
    const dy = e.touches[0].clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setCamera((prev) => ({
      yaw: prev.yaw + dx * 0.01,
      pitch: Math.max(-1.4, Math.min(1.4, prev.pitch - dy * 0.01)),
    }));
  };

  return (
    <div className="space-y-4">
      {/* 3D Canvas Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className="w-full h-[320px] sm:h-[400px] cursor-grab active:cursor-grabbing block"
        />

        {/* Live Calculation Floating HUD */}
        <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md border border-slate-800/90 p-3 rounded-xl text-xs space-y-1.5 shadow-xl pointer-events-none max-w-[240px]">
          <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 flex justify-between">
            <span>Live Calculation</span>
            <span className="font-mono text-emerald-400">Φ = E · A</span>
          </div>
          <div className="text-slate-300 font-mono text-[11px]">
            E = ({ex}i {ey >= 0 ? `+ ${ey}` : `- ${Math.abs(ey)}`}j {ez >= 0 ? `+ ${ez}` : `- ${Math.abs(ez)}`}k)
          </div>
          <div className="text-cyan-300 font-mono text-[11px]">
            A = {areaVector[0]}i + {areaVector[1]}j + {areaVector[2]}k (m²)
          </div>
          <div className="pt-1 text-white font-bold border-t border-slate-800 flex justify-between items-center">
            <span className="text-amber-300">Total Flux (Φ):</span>
            <span className="text-emerald-400 font-mono text-sm px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
              {calculatedFlux} V·m
            </span>
          </div>
        </div>

        {/* Floating Controls Overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl shadow-lg transition text-xs flex items-center gap-1.5 backdrop-blur-md"
            title={isRotating ? 'Pause auto-rotate' : 'Resume auto-rotate'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isRotating ? 'Pause' : 'Rotate'}</span>
          </button>
          <button
            onClick={() => setCamera({ pitch: 0.35, yaw: -0.65 })}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl shadow-lg transition text-xs flex items-center gap-1.5 backdrop-blur-md"
            title="Reset View"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Reset View</span>
          </button>
        </div>
      </div>

      {/* Interactive Sliders & Parameter Controls */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Interactive Parameters</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Drag sliders to test physical concepts
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* E_x Component Slider */}
          <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-slate-300">
              <span>E_x (pierces YZ-plane):</span>
              <span className="font-bold text-red-400 font-mono">{ex} V/m</span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={ex}
              onChange={(e) => setEx(Number(e.target.value))}
              className="w-full accent-red-400 cursor-pointer"
            />
          </div>

          {/* E_y Component Slider */}
          <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-slate-300">
              <span>E_y (parallel to YZ-plane):</span>
              <span className="font-bold text-green-400 font-mono">{ey} V/m</span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={ey}
              onChange={(e) => setEy(Number(e.target.value))}
              className="w-full accent-green-400 cursor-pointer"
            />
          </div>

          {/* E_z Component Slider */}
          <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-slate-300">
              <span>E_z (parallel to YZ-plane):</span>
              <span className="font-bold text-blue-400 font-mono">{ez} V/m</span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={ez}
              onChange={(e) => setEz(Number(e.target.value))}
              className="w-full accent-blue-400 cursor-pointer"
            />
          </div>

          {/* Square Side Length Slider */}
          <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-slate-300">
              <span>Square Side (a):</span>
              <span className="font-bold text-cyan-400 font-mono">{side} m (A={area}m²)</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={side}
              onChange={(e) => setSide(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Physics Key Insight Box */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Physics Insight (পদার্থবিজ্ঞানের মূল ধারণা):</strong> For any planar area in the <code className="text-cyan-300">YZ-plane</code>, the area vector points along <code className="text-amber-300">+X (î)</code>. The <code className="text-green-300">ĵ</code> and <code className="text-blue-300">k̂</code> components graze parallel to the surface without crossing it (<code className="text-slate-300">ĵ · î = 0, k̂ · î = 0</code>). Therefore, only the <code className="text-red-300">E_x (3î)</code> component creates electric flux!
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricFlux3D;
