'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const renderedContent = useMemo(() => {
    if (!content) return '';

    // Split text by display math ($$...$$) and inline math ($...$)
    // Regex matches $$...$$ or $...$
    const parts: (string | { math: string; display: boolean })[] = [];
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      const rawMatch = match[0];
      if (rawMatch.startsWith('$$') && rawMatch.endsWith('$$')) {
        parts.push({
          math: rawMatch.slice(2, -2).trim(),
          display: true,
        });
      } else if (rawMatch.startsWith('$') && rawMatch.endsWith('$')) {
        parts.push({
          math: rawMatch.slice(1, -1).trim(),
          display: false,
        });
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.map((part, idx) => {
      if (typeof part === 'string') {
        // Handle basic newlines
        return <span key={idx} dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br/>') }} />;
      } else {
        try {
          const html = katex.renderToString(part.math, {
            displayMode: part.display,
            throwOnError: false,
          });
          return (
            <span
              key={idx}
              className={part.display ? 'block my-2 overflow-x-auto text-center' : 'inline-block px-1 align-baseline'}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={idx} className="text-red-400 font-mono text-xs">{part.math}</span>;
        }
      }
    });
  }, [content]);

  return <div className={`katex-wrapper leading-relaxed ${className}`}>{renderedContent}</div>;
};

export default MathRenderer;
