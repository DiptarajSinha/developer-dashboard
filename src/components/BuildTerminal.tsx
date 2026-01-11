"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Terminal, CheckCircle2, XCircle, Clock, PlayCircle, GitCommit } from 'lucide-react';

interface TerminalItem {
  id: string | number;
  name: string;
  status: string;
  conclusion: string;
  time: string;
  commit: string;
  duration: string;
  type: 'workflow' | 'commit';
  actor: string;
}

export function BuildTerminal({ data = [] }: { data?: TerminalItem[] }) {
  const [logs, setLogs] = useState<TerminalItem[]>([]);
  const [hasStarted, setHasStarted] = useState(false); // <--- Controls when animation starts
  
  const containerRef = useRef<HTMLDivElement>(null); // To detect visibility
  const scrollRef = useRef<HTMLDivElement>(null);    // To auto-scroll logs

  // 1. VISIBILITY OBSERVER: Only start when user scrolls to this component
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
          observer.disconnect(); // Run only once
        }
      },
      { threshold: 0.3 } // Trigger when 30% of the terminal is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 2. TYPEWRITER LOGIC
  useEffect(() => {
    // Wait for scroll trigger AND valid data
    if (!hasStarted || !data || data.length === 0) return;

    setLogs([]); // Clear previous state
    let currentIndex = 0;
    
    // Slower Speed: 800ms per line (was 300ms)
    const interval = setInterval(() => {
      if (currentIndex >= data.length) {
        clearInterval(interval);
        return;
      }

      const nextItem = data[currentIndex];

      if (nextItem) {
        setLogs(prev => [...prev, nextItem]);
        currentIndex++;
        
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
      }

    }, 800); 

    return () => clearInterval(interval);
  }, [data, hasStarted]); // Dependencies include hasStarted

  return (
    // Attach the containerRef here to detect scroll
    <div ref={containerRef} className="bg-black border border-neutral-800 rounded-lg overflow-hidden font-mono text-sm shadow-2xl flex flex-col h-full min-h-[300px]">
      
      {/* Terminal Header */}
      <div className="bg-neutral-900 px-4 py-2 flex items-center gap-2 border-b border-neutral-800 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
        </div>
        <div className="ml-2 text-neutral-500 text-xs flex items-center gap-2">
          <Terminal size={12} /> system --log --stream
        </div>
      </div>

      {/* Log Stream Area */}
      <div 
        ref={scrollRef}
        className="p-4 space-y-4 overflow-y-auto flex-1 scroll-smooth"
      >
        <div className="text-neutral-500 mb-4 opacity-50 text-xs">
           &gt; Establishing secure connection to GitHub... <br/>
           &gt; Waiting for user session... {hasStarted ? 'CONNECTED' : '...'}
        </div>

        {/* Show nothing until started, or if empty */}
        {!hasStarted ? null : data.length === 0 ? (
           <div className="text-neutral-600 italic">
             &gt; No active logs found for this cycle...
           </div>
        ) : (
          logs.map((item, index) => {
            if (!item) return null;

            return (
              <div key={item.id} className="flex items-start gap-3 animate-in slide-in-from-left-2 fade-in duration-500">
                <span className="mt-0.5 shrink-0">
                  {item.type === 'commit' ? (
                    <GitCommit size={14} className="text-blue-500" />
                  ) : item.status === 'in_progress' ? (
                    <PlayCircle size={14} className="text-yellow-500 animate-spin" />
                  ) : item.conclusion === 'success' ? (
                    <CheckCircle2 size={14} className="text-green-500" />
                  ) : (
                    <XCircle size={14} className="text-red-500" />
                  )}
                </span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap justify-between items-center text-xs mb-1 gap-2">
                    <span className={`font-bold ${
                      item.type === 'commit' ? 'text-blue-400' :
                      item.conclusion === 'success' ? 'text-green-400' : 
                      item.conclusion === 'failure' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      &gt; {item.type === 'commit' ? `HEAD@{${index}}` : item.name}
                    </span>
                    <span className="text-neutral-600 flex items-center gap-1 shrink-0 whitespace-nowrap">
                      <Clock size={10} /> {item.time?.split(',')[0]}
                    </span>
                  </div>
                  <p className="text-neutral-300 truncate font-sans text-xs md:text-sm">
                    {item.commit}
                  </p>
                  <p className="text-neutral-600 text-[10px] mt-0.5 font-mono">
                    ACTION: {item.type?.toUpperCase()} | USER: {item.actor}
                  </p>
                </div>
              </div>
            );
          })
        )}
        
        {/* Blinking Cursor */}
        <div className="mt-4 pt-2 border-t border-neutral-800/30 flex items-center gap-2">
           <span className="text-green-500 font-bold">➜</span> 
           <span className="w-2.5 h-4 bg-white animate-pulse inline-block align-middle"></span>
        </div>
      </div>
    </div>
  );
}