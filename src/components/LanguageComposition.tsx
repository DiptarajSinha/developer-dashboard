"use client";

import React from 'react';
import { Code2, FileCode } from 'lucide-react';

// GitHub Language Colors mapping
const COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Shell: '#89e051',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  Unknown: '#ccc'
};

export function LanguageComposition({ languages = {} }: { languages: Record<string, number> }) {
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  
  // Convert bytes to percentages
  const distribution = Object.entries(languages)
    .map(([name, bytes]) => ({
      name,
      percentage: ((bytes / totalBytes) * 100),
      color: COLORS[name] || '#8b949e'
    }))
    .sort((a, b) => b.percentage - a.percentage) // Sort huge to small
    .slice(0, 6); // Only show top 6 to prevent clutter

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Code2 size={18} className="text-neutral-400" /> 
          Code Composition
        </h3>
        <span className="text-xs text-neutral-500">Language Breakdown</span>
      </div>

      {totalBytes === 0 ? (
        <div className="flex flex-col items-center justify-center h-[100px] text-neutral-600">
           <FileCode size={24} className="mb-2 opacity-50" />
           <p className="text-sm">No language data detected</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* The Multi-Colored Bar */}
          <div className="flex h-3 w-full rounded-full overflow-hidden bg-neutral-800">
            {distribution.map((lang) => (
              <div 
                key={lang.name}
                style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                className="h-full hover:opacity-80 transition-opacity"
                title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
              />
            ))}
          </div>

          {/* The Legend Grid */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-6">
            {distribution.map((lang) => (
              <div key={lang.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: lang.color }} 
                  />
                  <span className="text-neutral-200 font-medium">{lang.name}</span>
                </div>
                <span className="text-neutral-500 font-mono text-xs">
                  {lang.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}