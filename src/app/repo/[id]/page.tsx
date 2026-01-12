"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation'; // Added useRouter
import { 
  ArrowLeft, GitCommit, ShieldAlert, Users, Star, 
  Github, ExternalLink, LayoutDashboard, ChevronRight 
} from 'lucide-react';
import { LanguageComposition } from '@/components/LanguageComposition';
import { Sidebar } from '@/components/Sidebar';
import { BuildTerminal } from '@/components/BuildTerminal';
import { Project } from '@/lib/github';
import { VercelDeployment } from '@/lib/vercel'; 

export default function RepoDetail() {
  const params = useParams();
  const router = useRouter(); // Initialize router
  const [project, setProject] = useState<Project | null>(null);
  
  const [languages, setLanguages] = useState<Record<string, number>>({});
  const [terminalData, setTerminalData] = useState<any[]>([]);
  const [vercelDeployment, setVercelDeployment] = useState<VercelDeployment | null>(null);
  
  const [loading, setLoading] = useState(true);

  const VERCEL_TEAM = 'diptarajsinhas-projects'; 

  useEffect(() => {
    async function loadProject() {
      if (!params?.id) return;
      
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);

          if (data.name) {
             fetch(`/api/languages/${data.name}`)
                .then(r => r.json())
                .then(setLanguages)
                .catch(err => console.error("Language Fetch Error", err));

             fetch(`/api/repo-details/${data.name}?branch=${data.branch || 'main'}`)
              .then(r => r.json())
              .then(details => {
                 if (details.workflows && details.workflows.length > 0) {
                    setTerminalData(details.workflows);
                 } else {
                    setTerminalData(details.recentCommits || []);
                 }
              })
              .catch(err => console.error("Detail Fetch Error", err));
            
             fetch('/api/vercel')
                .then(r => r.json())
                .then((deployments: VercelDeployment[]) => {
                   const found = deployments.find(d => d.name.toLowerCase() === data.name.toLowerCase());
                   setVercelDeployment(found || null);
                })
                .catch(err => console.error("Vercel Fetch Error", err));
          }
        } 
      } catch (error) {
        console.error("Error loading project", error);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-500 font-mono text-sm">Accessing Repository Data...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
        <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Project Not Found</h1>
            <Link href="/" className="text-red-500 hover:underline">Return Home</Link>
        </div>
    );
  }

  const liveUrl = vercelDeployment ? `https://${vercelDeployment.url}` : project.homepage;

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans text-left">
      <Sidebar />
      <main className="pl-0 md:pl-20 lg:pl-64 pt-10 md:pt-0 transition-all duration-300">
        
        {/* Top Navigation & Breadcrumbs */}
        <div className="p-6 pb-0 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-red-500 transition-colors">Dashboard</Link>
          <ChevronRight size={12} />
          <span className="text-neutral-300">{project.name}</span>
        </div>

          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-neutral-800 pb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${project.status === 'Error' ? 'bg-red-600' : 'bg-green-600'}`}>
                  {project.status}
                </span>
                <span className="text-neutral-500 font-mono text-sm">Last updated: {project.updated}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 break-all">{project.name}</h1>
              
              <p className="text-neutral-400 max-w-xl text-lg mt-2">
                {project.desc || "No description provided for this project."}
              </p>
            </div>
            
            <div className="flex gap-3 flex-wrap">
               {vercelDeployment && (
                  <a 
                    href={`https://vercel.com/${VERCEL_TEAM}/${project.name}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-neutral-800 text-white px-6 py-3 rounded font-bold flex items-center gap-2 hover:bg-neutral-700 transition-colors border border-neutral-700"
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </a>
               )}

               {liveUrl && (
                 <a 
                   href={liveUrl} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="bg-red-600 text-white px-6 py-3 rounded font-bold flex items-center gap-2 hover:bg-red-500 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                 >
                   <ExternalLink size={18} /> Live Demo
                 </a>
               )}

               <a href={project.url} target="_blank" rel="noopener noreferrer" className="bg-neutral-800 text-white px-6 py-3 rounded font-bold flex items-center gap-2 hover:bg-neutral-700 transition-colors border border-neutral-700">
                 <Github size={18} /> GitHub
               </a>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="min-h-[180px]">
                <LanguageComposition languages={languages} />
              </div>
              
              <div className="bg-neutral-900/30 border border-neutral-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Latest Push</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start border-l-2 border-neutral-800 pl-4 hover:border-red-600 transition-colors">
                    <div className="mt-1"><GitCommit size={16} className="text-neutral-500" /></div>
                    <div>
                      <p className="text-sm text-white">Latest update to {project.branch}</p>
                      <p className="text-xs text-neutral-500">Updated {project.updated}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
               <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-xs rounded-full border border-neutral-700">
                    {project.type}
                  </span>
                  <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-xs rounded-full border border-neutral-700">
                    GitHub
                  </span>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-4">Health Check</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-sm text-neutral-300"><Star size={14} /> Stars</span>
                    <span className="text-yellow-500 text-sm">{project.stars}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-sm text-neutral-300"><Users size={14} /> Issues</span>
                    <span className="text-white text-sm">{project.issues}</span>
                  </div>
                   <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-sm text-neutral-300"><ShieldAlert size={14} /> Vulnerabilities</span>
                    <span className="text-neutral-500 text-sm">0 found</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="pt-8 mt-8 border-t border-neutral-800">
             <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Activity Log</h2>
                <p className="text-neutral-400 text-sm">Recent commits and system events.</p>
              </div>
            </div>
            <BuildTerminal data={terminalData} />
          </section>

        </div>
      </main>
    </div>
  );
}