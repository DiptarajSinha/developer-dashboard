"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Bell, Terminal, GitPullRequest, Search, Download, Github, Star, Users, Activity, FolderGit, Share2, X, ArrowRight
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { ProjectCard } from '@/components/ProjectCard';
import { Notifications } from '@/components/Notifications';
import { useRole } from '@/lib/role-context';
import { Project, UserStats, ActivityItem } from '@/lib/github';
import { VercelActivity } from '@/components/VercelActivity';
import { VercelDeployment } from '@/lib/vercel';

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-xl md:text-2xl font-bold text-white mb-4 mt-8 flex items-center gap-2 group cursor-pointer">
    {title}
    <span className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">Explore All &gt;</span>
  </h2>
);

export default function Dashboard() {
  const { role } = useRole(); 

  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [prs, setPrs] = useState<ActivityItem[]>([]);
  const [vercelDeployments, setVercelDeployments] = useState<VercelDeployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [reposRes, statsRes, prsRes, vercelRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/stats'),
          fetch('/api/activity'),
          fetch('/api/vercel')
        ]);

        const reposData = await reposRes.json();
        const statsData = await statsRes.json();
        const prsData = await prsRes.json();
        const vercelData = await vercelRes.json();

        setProjects(reposData);
        setStats(statsData);
        setPrs(prsData);
        setVercelDeployments(vercelData);
      } catch (e) {
        console.error("Dashboard Fetch Error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const openGlobalSearch = () => {
    window.dispatchEvent(new CustomEvent('openSearch', { 
      detail: { projects: projects } 
    }));
  };

  const topLanguage = projects.reduce((acc, repo) => {
    if (!repo.type) return acc;
    acc[repo.type] = (acc[repo.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantLang = Object.keys(topLanguage).sort((a, b) => topLanguage[b] - topLanguage[a])[0] || "N/A";

  const avgHealth = projects.length > 0 
    ? Math.round(projects.reduce((acc, repo) => acc + repo.health, 0) / projects.length) 
    : 100;

  const REAL_ANALYTICS = [
    { label: "Total Repositories", value: stats?.totalRepos.toString() || "0", trend: "Public", icon: FolderGit, href: "/repo" },
    { label: "Total Stars", value: stats?.totalStars.toString() || "0", trend: "All Time", icon: Star },
    { label: "Top Technology", value: dominantLang, trend: "Most Used", icon: Terminal },
    { label: "Code Health", value: `${avgHealth}%`, trend: "Average", icon: Activity },
  ];

  const latestProject = projects[0];

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
      label: `Latest Push: ${latestProject?.status || 'Loading'}`,
      title: latestProject ? `${latestProject.name} \nUpdate` : "System \nStandby",
      desc: latestProject ? `Latest activity detected on ${latestProject.branch} branch. Health status is currently at ${latestProject.health}%.` : "No active repositories detected.",
      primaryBtn: "View Repo",
      primaryIcon: Terminal,
      alertColor: latestProject?.status === 'Error' ? "bg-red-600" : "bg-blue-600"
    },
    'manager': {
      label: "Executive Overview",
      title: "Production \nReady",
      desc: `Codebase maintains a ${avgHealth}% health rating across ${projects.length} active microservices. Scalable architecture ready for high-traffic deployment.`,
      primaryBtn: "View Architecture",
      primaryIcon: Share2,
      alertColor: "bg-purple-600"
    }
  };

  const currentHero = HERO_CONTENT[role as keyof typeof HERO_CONTENT];

  return (
    <div className="flex min-h-screen w-full bg-[#141414] text-white font-sans selection:bg-red-900 selection:text-white">
      <Sidebar />
      
      {/* flex-1 ensures main content takes up remaining width next to sidebar */}
      <main className="flex-1 min-w-0 pt-16 md:pt-0 transition-all duration-300">
        <header className="sticky top-0 z-40 bg-[#141414]/90 backdrop-blur-md border-b border-neutral-800 px-4 md:px-6 py-4 flex justify-between items-center">
           <div className="hidden md:flex flex-1 max-w-md mx-4">
            <button 
              onClick={openGlobalSearch} 
              className="w-full flex items-center justify-between bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-500 text-sm px-4 py-2 rounded-full transition-colors group"
            >
              <span className="flex items-center gap-2 group-hover:text-neutral-300 transition-colors">
                <Search size={14} /> Search projects...
              </span>
              <span className="flex items-center gap-1 text-xs font-mono bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700 group-hover:border-neutral-500 transition-colors">⌘K</span>
            </button>
           </div>

           <div className="flex items-center gap-2 md:gap-4 ml-auto">
             <button onClick={openGlobalSearch} className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors">
                <Search size={20} />
             </button>
             <Notifications />
             <a href="https://github.com/DiptarajSinha" target="_blank" rel="noopener noreferrer" className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-700 cursor-pointer hover:border-red-500 transition-colors">
              <img src={`https://github.com/DiptarajSinha.png`} alt="Profile" className="w-full h-full object-cover" />
             </a>
           </div>
        </header>

        <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8 pb-20">
          <section className="relative h-[250px] md:h-[400px] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-12 max-w-2xl text-left">
              <div className="flex items-center gap-2 mb-2 md:mb-4">
                <span className={`${currentHero.alertColor} text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest`}>{currentHero.label}</span>
              </div>
              <h1 className="text-2xl md:text-6xl font-bold mb-2 md:mb-4 leading-tight whitespace-pre-wrap">{currentHero.title}</h1>
              <p className="text-neutral-300 mb-4 md:mb-8 max-w-lg text-sm md:text-lg line-clamp-3 md:line-clamp-none">{currentHero.desc}</p>
              <button className="bg-white text-black hover:bg-neutral-200 px-4 md:px-6 py-2 md:py-3 rounded font-bold flex items-center gap-2 transition-colors w-fit text-sm">
                <currentHero.primaryIcon size={18} /> {currentHero.primaryBtn}
              </button>
            </div>
          </section>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-left">
            {REAL_ANALYTICS.map((stat) => (
              stat.href ? (
                <Link key={stat.label} href={stat.href} className="block group">
                  <StatCard {...stat} />
                </Link>
              ) : (
                <StatCard key={stat.label} {...stat} />
              )
            ))}
          </div>

          <section className="text-left">
            <SectionHeader title="Active Repositories" />
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
              {loading ? (
                [1, 2, 3].map((i) => <div key={i} className="min-w-[280px] md:min-w-[320px] h-[220px] bg-neutral-900/50 animate-pulse rounded-lg border border-neutral-800" />)
              ) : (
                projects.map((repo) => {
                  const deployment = vercelDeployments.find(d => d.name.toLowerCase() === repo.name.toLowerCase());
                  return (
                    <div key={repo.id} className="snap-start min-w-[280px] md:min-w-[320px]">
                      <ProjectCard project={repo} vercelDeployment={deployment} />
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            <div className="lg:col-span-2">
              <SectionHeader title="Recent Pull Requests" />
              <div className="bg-neutral-900/30 border border-neutral-800 rounded-lg divide-y divide-neutral-800">
                  {prs.length === 0 && !loading ? (
                      <div className="p-4 text-neutral-500 text-sm">No recent data.</div>
                  ) : (
                      prs.slice(0, 5).map((pr) => (
                        <a href={pr.url} target="_blank" key={pr.id} className="p-4 flex items-center justify-between hover:bg-neutral-900 transition-colors cursor-pointer group block">
                          <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                            <div className="p-2 bg-neutral-800 rounded-full text-blue-500 shrink-0"><GitPullRequest size={18} /></div>
                            <div className="min-w-0">
                              <h4 className="text-xs md:text-sm font-medium text-white group-hover:text-blue-500 transition-colors truncate">{pr.title}</h4>
                              <p className="text-[10px] md:text-xs text-neutral-500 truncate">#{pr.number} • {pr.repo}</p>
                            </div>
                          </div>
                          <span className="text-[10px] md:text-xs text-neutral-500 whitespace-nowrap ml-2">{pr.created_at}</span>
                        </a>
                      ))
                  )}
              </div>
            </div>
            <div className="h-full flex flex-col">
              <div className="hidden lg:block mt-8 mb-4 h-[32px]"></div>
              <VercelActivity data={vercelDeployments} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}