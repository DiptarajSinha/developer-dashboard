"use client";

import React from 'react';
import { ExternalLink, GitBranch, AlertCircle, Loader2, CheckCircle2, Server } from 'lucide-react';
import { VercelDeployment } from '@/lib/vercel';

// Updated to accept props
export function VercelActivity({ data }: { data: VercelDeployment[] }) {
  
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 h-full min-h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Server size={18} className="text-white" />
          Vercel Status
        </h3>
        <span className="text-xs text-neutral-500 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live
        </span>
      </div>

      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[150px] text-neutral-500 text-sm">
            <p>No active deployments found.</p>
          </div>
        ) : (
          data.map((d) => (
            <div key={d.uid} className="flex items-start gap-3 group border-b border-neutral-800/50 pb-3 last:border-0 last:pb-0">
              {/* Status Icon */}
              <div className="mt-1 shrink-0">
                {d.state === 'READY' ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : d.state === 'BUILDING' || d.state === 'QUEUED' ? (
                  <Loader2 size={16} className="text-yellow-500 animate-spin" />
                ) : (
                  <AlertCircle size={16} className="text-red-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-neutral-200 truncate pr-2">{d.name}</h4>
                  <a 
                    href={`https://${d.url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-white transition-colors"
                    title="Visit Deployment"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* Branch & Message */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                  <span className="flex items-center gap-1 bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400 font-mono text-[10px]">
                    <GitBranch size={10} />
                    {d.meta?.githubCommitRef || 'cli'}
                  </span>
                  <span className="truncate max-w-[150px] italic">
                    {d.meta?.githubCommitMessage || 'Manual Deployment'}
                  </span>
                </div>
                
                {/* Time */}
                <p className="text-[10px] text-neutral-600 mt-1 font-mono">
                  {new Date(d.created).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}