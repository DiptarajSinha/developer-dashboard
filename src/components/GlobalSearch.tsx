"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Search, Terminal, ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Project } from '@/lib/github';
import { cn } from '@/lib/utils';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // FIX: Use /api/search here because it fetches the full 100 repos
    fetch('/api/search') 
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setProjects(data); });

    const handleOpen = (e: any) => {
      // Sync projects if provided, otherwise use the locally fetched 'projects'
      if (e.detail?.projects) setProjects(e.detail.projects);
      setIsOpen(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('openSearch', handleOpen);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('openSearch', handleOpen);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // --- BROAD FILTER LOGIC ---
  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return projects; 

    return projects.filter(p => {
      const searchStr = `${p.name} ${p.desc || ''} ${p.language || ''}`.toLowerCase();
      return searchStr.includes(term);
    });
  }, [query, projects]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && filtered[selectedIndex]) {
      document.getElementById(`search-item-${selectedIndex}`)?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, isOpen, filtered]);

  const handleInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      router.push(`/repo/${filtered[selectedIndex].id}`);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-2xl bg-[#141414] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center px-4 py-4 border-b border-neutral-800 gap-3">
          <Search className="text-neutral-500" size={20} />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search all repositories..." 
            className="flex-1 bg-transparent border-none outline-none text-lg text-white"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleInputKey}
          />
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-neutral-800 rounded text-neutral-500">ESC</button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-neutral-500 text-sm">No repositories found.</div>
          ) : (
            filtered.map((project, index) => (
              <button
                key={project.id}
                id={`search-item-${index}`}
                onClick={() => { router.push(`/repo/${project.id}`); setIsOpen(false); }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn("w-full flex items-center justify-between p-3 rounded-lg transition-all text-left group", index === selectedIndex ? "bg-neutral-800" : "hover:bg-neutral-800/40")}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded border", index === selectedIndex ? "bg-neutral-700 text-white" : "bg-neutral-900 text-neutral-500")}>
                    <Terminal size={16} />
                  </div>
                  <div>
                    <div className={cn("text-sm font-medium", index === selectedIndex ? "text-red-500" : "text-white")}>{project.name}</div>
                    <div className="text-xs text-neutral-500 line-clamp-1">{project.desc || "No description"}</div>
                  </div>
                </div>
                <ArrowRight size={14} className={cn("transition-all text-neutral-700", index === selectedIndex ? "opacity-100" : "opacity-0")} />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}