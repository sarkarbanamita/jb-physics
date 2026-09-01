'use client';

import React from 'react';
import { CheckCircle2, Lightbulb, FunctionSquare, Video } from 'lucide-react';
import BilingualText from '../ui/BilingualText';
import MathRenderer from '../ui/MathRenderer';
import SimulationContainer from '../simulations/SimulationContainer';
import YouTubeEmbed from '../ui/YouTubeEmbed';

interface ExplanationBoxProps {
  correctOption: string;
  explanationEn: string;
  explanationBn: string;
  formula?: string | null;
  youtubeUrl?: string | null;
  youtubeTimestamp?: number | null;
  simulationType?: string | null;
  simulationParams?: any;
}

export const ExplanationBox: React.FC<ExplanationBoxProps> = ({
  correctOption,
  explanationEn,
  explanationBn,
  formula,
  youtubeUrl,
  youtubeTimestamp = 0,
  simulationType,
  simulationParams,
}) => {
  return (
    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Correct Answer & Formula Bar */}
      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
              Correct Answer (সঠিক উত্তর)
            </div>
            <div className="text-base font-extrabold text-white">
              Option ({correctOption})
            </div>
          </div>
        </div>

        {formula && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs shadow-inner">
            <FunctionSquare className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 font-medium hidden sm:inline">Formula:</span>
            <div className="text-amber-300 font-bold">
              <MathRenderer content={formula} />
            </div>
          </div>
        )}
      </div>

      {/* Step-by-Step Solution Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
          <Lightbulb className="w-4 h-4" />
          <span>Step-by-Step Solution (বিশদ সমাধান)</span>
        </div>

        <BilingualText
          en={explanationEn}
          bn={explanationBn}
          layout="stacked"
          bnClassName="text-slate-100 leading-relaxed text-sm"
          enClassName="text-slate-300 leading-relaxed text-xs sm:text-sm"
        />
      </div>

      {/* Interactive Simulation Section if present */}
      {simulationType && (
        <SimulationContainer
          type={simulationType}
          params={simulationParams}
          initialExpanded={true}
        />
      )}

      {/* Video Solution if present */}
      {youtubeUrl && (
        <YouTubeEmbed
          url={youtubeUrl}
          timestamp={youtubeTimestamp || 0}
          title="Watch JB Physics Video Solution"
        />
      )}
    </div>
  );
};

export default ExplanationBox;
