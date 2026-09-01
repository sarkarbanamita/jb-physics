'use client';

import React, { useState } from 'react';
import { getSimulation } from './registry';
import { Sparkles, Maximize2, Minimize2, ChevronDown, ChevronUp } from 'lucide-react';

interface SimulationContainerProps {
  type: string;
  params?: any;
  title?: string;
  initialExpanded?: boolean;
}

export const SimulationContainer: React.FC<SimulationContainerProps> = ({
  type,
  params,
  title,
  initialExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const simInfo = getSimulation(type);
  if (!simInfo) return null;

  const SimComponent = simInfo.component;
  const parsedParams = typeof params === 'string' ? JSON.parse(params || '{}') : params;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-4 sm:p-6 overflow-y-auto'
          : 'bg-slate-900/90 border-slate-800 my-4 shadow-xl overflow-hidden'
      }`}
    >
      {/* Simulation Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/10 via-slate-900 to-cyan-500/10 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                {title || simInfo.name}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wide">
                Interactive Sim
              </span>
            </div>
            <p className="text-xs text-amber-300/90 font-bengali">
              {simInfo.nameBn}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition text-xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {!isFullscreen && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition text-xs"
              title={isExpanded ? 'Collapse Simulation' : 'Expand Simulation'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Simulation Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5">
          <SimComponent params={parsedParams} />
        </div>
      )}
    </div>
  );
};

export default SimulationContainer;
