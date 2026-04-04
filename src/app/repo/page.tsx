"use client";
import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ProjectCard } from '@/components/ProjectCard';
import { Project } from '@/lib/github';

export default function AllReposPage() {
  const [repos, setRepos] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/search') // Uses the endpoint that fetches 100 repos
      .then(res => res.json())
      .then(data => setRepos(data))
      .finally(() => setLoading(false));
  }, []);

  return (
  <div className="min-h-screen bg-[#141414] text-white font-sans">
    <Sidebar />
      <main className="pl-0 md:pl-20 lg:pl-64 pt-10 md:pt-0 transition-all duration-300">
        
        <div className="p-6 md:p-10 pb-6 border-b border-neutral-800 bg-[#161616]">
          <div className="flex flex-col gap-1 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
              All Repositories ({repos.length})
            </h1>
            <p className="text-neutral-500 text-sm">
              Comprehensive overview of all projects, microservices, and experiments across the network.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading 
              ? [1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="h-[220px] bg-neutral-900/50 animate-pulse rounded-lg border border-neutral-800" />
                ))
              : repos.map(repo => (
                  <ProjectCard key={repo.id} project={repo} />
                ))
            }
          </div>
        </div>
      </main>
  </div>
);
}