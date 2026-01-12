'use client';

import React from 'react';
import { Star, GitFork, ArrowUpRight, LayoutDashboard } from 'lucide-react'; 
import { Project } from '@/lib/github';
import { VercelDeployment } from '@/lib/vercel';
import { useRouter } from 'next/navigation';

export function ProjectCard({ project, vercelDeployment }: { project: Project, vercelDeployment?: VercelDeployment }) {
  const router = useRouter();
  
  // Your Vercel Team Slug
  const VERCEL_TEAM = 'diptarajsinhas-projects'; 

  // --- NEW: ROBUST VERCEL DETECTION ---
  // If API match fails, check if the GitHub "Website" URL looks like Vercel
  const isVercel = vercelDeployment || (project.homepage && project.homepage.includes('.vercel.app'));
  
  // Fallback URL for the "LIVE" button if vercelDeployment data is missing
  const liveUrl = vercelDeployment ? `https://${vercelDeployment.url}` : project.homepage;

  const handleCardClick = () => {
    router.push(`/repo/${project.id}`);
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // This constructs the dashboard link even if API data is missing
    const url = `https://vercel.com/${VERCEL_TEAM}/${project.name}`;
    window.open(url, '_blank');
  };

  const handleLiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liveUrl) window.open(liveUrl, '_blank');
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-neutral-900/50 border border-neutral-800 hover:border-neutral-600 rounded-xl p-5 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
    >
      
      {/* Top Row: Status + Vercel Controls */}
      <div className="flex justify-between items-start mb-4">
        
        {/* Status Dot */}
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${
             project.status === 'Error' ? 'bg-red-500' : 
             project.status === 'Building' ? 'bg-yellow-500 animate-pulse' : 
             'bg-green-500'
           }`} />
           <span className="text-xs font-mono text-neutral-400 uppercase">{project.status}</span>
        </div>

        {/* --- CONTROLS: Show if API matched OR if Homepage looks like Vercel --- */}
        {isVercel && (
          <div className="flex items-center gap-2 z-20">
              
              {/* 1. DASHBOARD BUTTON */}
              <button
                onClick={handleDashboardClick}
                className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-400 hover:text-white bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 px-2 py-1 rounded transition-all"
                title="Open Vercel Dashboard"
              >
                <LayoutDashboard size={12} />
                <span>Dashboard</span>
              </button>

              {/* 2. LIVE BUTTON */}
              {liveUrl && (
                <button
                  onClick={handleLiveClick}
                  className="flex items-center gap-1.5 bg-black border border-neutral-800 hover:border-white text-[10px] px-2 py-1 rounded text-white transition-colors"
                  title="View Production Build"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-bold tracking-wider">LIVE</span>
                </button>
              )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div>
        <h3 className="text-lg font-bold text-neutral-100 mb-2 group-hover:text-red-500 transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
          {project.desc || "No description provided."}
        </p>
      </div>

      {/* Footer Metrics */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-800/50">
        <div className="flex gap-4 text-xs text-neutral-500 font-mono">
           <span className="flex items-center gap-1"><Star size={12} /> {project.stars}</span>
           <span className="flex items-center gap-1"><GitFork size={12} /> {project.issues}</span>
           <span>{project.type}</span>
        </div>
        
        <div className="text-neutral-500 group-hover:text-white transition-colors">
          <ArrowUpRight size={18} />
        </div>
      </div>
    </div>
  );
}