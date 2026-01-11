"use client";
import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Box, Download, Tag, User } from 'lucide-react';

interface Package {
  id: number;
  name: string;
  tag: string;
  repo: string;
  published_at: string;
  url: string;
  author: string;
  downloads: number;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/packages')
      .then(res => res.json())
      .then(data => setPackages(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans">
      <Sidebar />
      <main className="pl-0 md:pl-20 lg:pl-64 p-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Packages & Releases</h1>
            <span className="text-neutral-500 text-sm">Sourced from GitHub Releases</span>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-[180px] bg-neutral-900/50 animate-pulse rounded-lg border border-neutral-800" />)}
           </div>
        ) : packages.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 border border-dashed border-neutral-800 rounded-lg">
              <Box size={48} className="text-neutral-600 mb-4" />
              <h3 className="text-xl font-bold text-neutral-400">No Packages Found</h3>
              <p className="text-neutral-500 mt-2">Create a "Release" in your GitHub repositories to see it here.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-600 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-neutral-800 rounded-lg text-blue-400 group-hover:text-white transition-colors">
                    <Box size={24} />
                  </div>
                  <span className="text-xs font-mono text-neutral-500">{pkg.published_at}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-1">{pkg.repo}</h3>
                <p className="text-neutral-400 text-sm mb-4">{pkg.name}</p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                   <span className="flex items-center gap-1 text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded">
                     <Tag size={12} /> {pkg.tag}
                   </span>
                   <span className="flex items-center gap-1 text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded">
                     <User size={12} /> {pkg.author}
                   </span>
                </div>

                <a 
                  href={pkg.url} 
                  target="_blank" 
                  className="flex items-center justify-center gap-2 w-full bg-white text-black py-2 rounded font-bold hover:bg-neutral-200 transition-colors"
                >
                  <Download size={16} /> Download
                  {pkg.downloads > 0 && <span className="text-xs opacity-60">({pkg.downloads})</span>}
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}