"use client";

import React, { useEffect, useState } from 'react';
import { 
  Bell, Terminal, GitPullRequest, Search, Download, TrendingUp, Github, Star, Users, Activity, FolderGit, Share2
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { ProjectCard } from '@/components/ProjectCard';
import { Notifications } from '@/components/Notifications';
import { useRole } from '@/lib/role-context';
import { Project, UserStats, ActivityItem } from '@/lib/github';

// Section Title Component
const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-xl md:text-2xl font-bold text-white mb-4 mt-8 flex items-center gap-2 group cursor-pointer">
    {title}
    <span className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">Explore All &gt;</span>
  </h2>
);

export default function Dashboard() {
  const { role } = useRole(); 

  // --- REAL DATA STATE ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [prs, setPrs] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH ALL DATA ---
  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Fetch in parallel for speed
        const [reposRes, statsRes, prsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/stats'),
          fetch('/api/activity')
        ]);

        const reposData = await reposRes.json();
        const statsData = await statsRes.json();
        const prsData = await prsRes.json();

        setProjects(reposData);
        setStats(statsData);
        setPrs(prsData);
      } catch (e) {
        console.error("Dashboard Fetch Error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // --- REAL STATS LOGIC ---
  // Helper to calculate top language
  const topLanguage = projects.reduce((acc, repo) => {
    if (!repo.type) return acc;
    acc[repo.type] = (acc[repo.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantLang = Object.keys(topLanguage).sort((a, b) => topLanguage[b] - topLanguage[a])[0] || "N/A";

  // Helper to calculate Average Health
  const avgHealth = projects.length > 0 
    ? Math.round(projects.reduce((acc, repo) => acc + repo.health, 0) / projects.length) 
    : 100;

  const REAL_ANALYTICS = [
    { 
      label: "Total Repositories", 
      value: stats?.totalRepos.toString() || "0", 
      trend: "Public", 
      icon: FolderGit 
    },
    { 
      label: "Total Stars", 
      value: stats?.totalStars.toString() || "0", 
      trend: "All Time", 
      icon: Star 
    },
    // REPLACED 'Followers' with 'Top Technology'
    { 
      label: "Top Technology", 
      value: dominantLang, 
      trend: "Most Used", 
      icon: Terminal 
    },
    // REPLACED 'Following' with 'Code Health'
    { 
      label: "Code Health", 
      value: `${avgHealth}%`, 
      trend: "Average", 
      icon: Activity 
    },
  ];

  const latestProject = projects[0];

  // Hero Content Logic
  const HERO_CONTENT = {
    'recruiter': {
      label: "Open for Work",
      title: "Senior Frontend \nEngineer",
      desc: "Specializing in React, Next.js, and High-Performance UI. Proven track record of delivering scalable web applications.",
      primaryBtn: "Download Resume",
      primaryIcon: Download,
      alertColor: "bg-green-600"
    },
    'tech-lead': {
      // DYNAMIC: Shows your actual latest repo status
      label: `Latest Push: ${latestProject?.status || 'Loading'}`,
      title: latestProject ? `${latestProject.name} \nUpdate` : "System \nStandby",
      desc: latestProject 
        ? `Latest activity detected on ${latestProject.branch} branch. Health status is currently at ${latestProject.health}%.` 
        : "No active repositories detected.",
      primaryBtn: "View Repo",
      primaryIcon: Terminal,
      alertColor: latestProject?.status === 'Error' ? "bg-red-600" : "bg-blue-600"
    },
    'manager': {
      label: "Executive Overview",
      title: "Production \nReady",
      // Dynamic description based on your real data
      desc: `Codebase maintains a ${avgHealth}% health rating across ${projects.length} active microservices. Scalable architecture ready for high-traffic deployment.`,
      primaryBtn: "View Architecture", // Renamed from "View Metrics"
      primaryIcon: Share2,
      alertColor: "bg-purple-600"
    }
  };

  const currentHero = HERO_CONTENT[role as keyof typeof HERO_CONTENT];

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-red-900 selection:text-white">
      <Sidebar />
      
      <main className="pl-0 md:pl-20 lg:pl-64 transition-all duration-300">
        <header className="sticky top-0 z-40 bg-[#141414]/90 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
           <div className="md:hidden text-red-600 font-bold tracking-tighter">DEV.NET</div>
           <div className="hidden md:flex flex-1 max-w-md mx-4">
             {/* This button triggers Command Palette */}
            <button 
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))} 
              className="w-full flex items-center justify-between bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-500 text-sm px-4 py-2 rounded-full transition-colors"
            >
              <span className="flex items-center gap-2"><Search size={14} /> Search projects...</span>
              <span className="flex items-center gap-1 text-xs font-mono bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">⌘K</span>
            </button>
           </div>
           <div className="flex items-center gap-4 ml-auto">
             <Notifications />
             {/* Red Box converted to simple profile indicator */}
             <a 
                href="https://github.com/DiptarajSinha"
                target="_blank" 
                rel="noopener noreferrer"
                className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-700 cursor-pointer hover:border-red-500 transition-colors"
              >
              <img 
                src={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'DiptarajSinha'}.png`} 
                alt="Profile" 
                className="w-full h-full object-cover"
                title="Logged in as Admin"
              />
             </a>
           </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 pb-20">
          
          {/* Dynamic Hero */}
          <section className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className={`${currentHero.alertColor} text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest`}>
                  {currentHero.label}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight whitespace-pre-wrap">{currentHero.title}</h1>
              <p className="text-neutral-300 mb-8 max-w-lg text-lg">{currentHero.desc}</p>
              <div className="flex gap-4">
                <button className="bg-white text-black hover:bg-neutral-200 px-6 py-3 rounded font-bold flex items-center gap-2 transition-colors">
                  <currentHero.primaryIcon size={18} /> {currentHero.primaryBtn}
                </button>
              </div>
            </div>
          </section>

          {/* REAL Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {REAL_ANALYTICS.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Active Repositories */}
          <section>
            <SectionHeader title="Active Repositories" />
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
              {loading ? (
                [1, 2, 3].map((i) => <div key={i} className="min-w-[320px] h-[220px] bg-neutral-900/50 animate-pulse rounded-lg border border-neutral-800" />)
              ) : (
                projects.map((repo) => (
                  // ADDED: min-w-[320px] here to restore swimlane look
                  <div key={repo.id} className="snap-start min-w-[320px]">
                    <ProjectCard project={repo} />
                  </div>
                ))
              )}
            </div>
          </section>

          {/* REAL Pull Requests */}
          <section>
            <SectionHeader title="Recent Pull Requests (Global)" />
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-lg divide-y divide-neutral-800">
                {prs.length === 0 && !loading ? (
                    <div className="p-4 text-neutral-500">No recent Pull Requests found in the last 30 days.</div>
                ) : (
                    prs.map((pr) => (
                      <a href={pr.url} target="_blank" key={pr.id} className="p-4 flex items-center justify-between hover:bg-neutral-900 transition-colors cursor-pointer group block">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-neutral-800 rounded-full text-blue-500">
                            <GitPullRequest size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-white group-hover:text-blue-500 transition-colors">{pr.title}</h4>
                            <p className="text-xs text-neutral-500">#{pr.number} in {pr.repo} • {pr.state}</p>
                          </div>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                           <span className="text-xs text-neutral-500">{pr.created_at}</span>
                        </div>
                      </a>
                    ))
                )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}