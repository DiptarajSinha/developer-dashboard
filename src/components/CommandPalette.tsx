"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Search, X, CornerDownLeft, FileCode, Layout, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Project } from '@/lib/github'; // Import shared type

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // State for real data
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Fetch real projects once when component mounts
  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const res = await fetch('/api/search');
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (e) {
        console.error("Command Palette Fetch Error", e);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  // Filter projects based on query
  const filteredProjects = useMemo(() => {
    if (!query) return [];
    return projects.filter(project => 
      project.name.toLowerCase().includes(query.toLowerCase()) ||
      project.type.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, projects]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle Keyboard Interactions (Open/Close/Navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        setIsOpen(false);
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredProjects.length);
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredProjects.length) % filteredProjects.length);
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredProjects.length > 0) {
          handleSelect(filteredProjects[selectedIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredProjects, selectedIndex]);

  const handleSelect = (id: number) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/repo/${id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-[#1a1a1a] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center px-4 py-4 border-b border-neutral-800 gap-3">
          <Search className="text-neutral-500" size={20} />
          <input 
            autoFocus
            type="text" 
            placeholder="Search your GitHub repositories..." 
            className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-neutral-600 font-sans"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <Loader2 size={18} className="animate-spin text-neutral-500" />}
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-neutral-800 rounded text-neutral-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
          {query === "" && (
            <div className="px-3 py-10 text-center text-neutral-500 text-sm">
              Type to search connected projects...
            </div>
          )}

          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <button
                key={project.id}
                onClick={() => handleSelect(project.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left",
                  index === selectedIndex ? "bg-neutral-800" : "hover:bg-neutral-800/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-md",
                    project.status === 'Error' ? "bg-red-500/10 text-red-500" : "bg-neutral-800 text-neutral-400"
                  )}>
                    <FileCode size={18} />
                  </div>
                  <div>
                    <h4 className={cn(
                      "font-medium transition-colors",
                      index === selectedIndex ? "text-red-500" : "text-white"
                    )}>
                      {project.name}
                    </h4>
                    <span className="text-xs text-neutral-500 capitalize">{project.type} • {project.stars} stars</span>
                  </div>
                </div>
                
                {index === selectedIndex && (
                   <div className="flex items-center gap-2 animate-in fade-in duration-200">
                    <span className="text-xs text-neutral-500 font-mono">Jump to</span>
                    <CornerDownLeft size={14} className="text-neutral-500" />
                  </div>
                )}
              </button>
            ))
          ) : query !== "" && !loading && (
             <div className="p-8 text-center text-neutral-500">
                <p>No results found for "{query}"</p>
             </div>
          )}
        </div>

        <div className="bg-neutral-900/50 p-2 border-t border-neutral-800 flex justify-end gap-4 px-4 text-[10px] text-neutral-500 font-mono">
          <span className="flex items-center gap-1">
             <span className="bg-neutral-800 px-1.5 py-0.5 rounded">↑↓</span> to navigate
          </span>
          <span className="flex items-center gap-1">
             <span className="bg-neutral-800 px-1.5 py-0.5 rounded">enter</span> to select
          </span>
          <span className="flex items-center gap-1">
             <span className="bg-neutral-800 px-1.5 py-0.5 rounded">esc</span> to close
          </span>
        </div>
      </div>
    </div>
  );
}