"use client";

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { 
  ExternalLink, 
  Clock, 
  AlertCircle,
  Loader2,
  Terminal
} from 'lucide-react';
import { VercelDeployment } from '@/lib/vercel';
import { cn } from '@/lib/utils';

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<VercelDeployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeployments() {
      try {
        const res = await fetch('/api/vercel');
        if (res.ok) {
          const data = await res.json();
          setDeployments(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch deployments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDeployments();
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans">
      <Sidebar />
      <main className="pl-0 md:pl-20 lg:pl-64 pt-10 md:pt-0 transition-all duration-300">
        
        <div className="p-6 md:p-10 pb-6 border-b border-neutral-800 bg-[#161616]">
          <div className="flex flex-col gap-1 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
              Deployment Pipeline
            </h1>
            <p className="text-neutral-500 text-sm">
              Comprehensive overview of all active environments and production builds across the network.
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg overflow-hidden shadow-xl">
            
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider bg-[#111111]">
              <div className="col-span-5 text-left">Repository / Domain</div>
              <div className="col-span-3 text-left">Operational Status</div>
              <div className="col-span-3 text-left">Timestamp</div>
              <div className="col-span-1 text-right">Access</div>
            </div>

            {loading ? (
              <div className="p-32 flex flex-col items-center justify-center gap-4 text-center">
                <Loader2 className="animate-spin text-neutral-600" size={24} />
                <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest">
                  Retrieving pipeline data...
                </p>
              </div>
            ) : deployments.length === 0 ? (
              <div className="p-20 text-center border-t border-neutral-800">
                <AlertCircle className="mx-auto text-neutral-800 mb-3" size={32} />
                <p className="text-neutral-500 text-sm">No deployment records found in the current cluster.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-800/50">
                {deployments.map((d, index) => (
                  <div 
                    key={d.uid || `deployment-row-${index}`} 
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#1f1f1f] transition-colors group"
                  >
                    <div className="col-span-5 flex items-center gap-4 text-left">
                      <div className="p-2 rounded bg-neutral-900 border border-neutral-800 group-hover:border-neutral-700 transition-colors">
                        <Terminal size={16} className="text-neutral-400" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm truncate text-white uppercase tracking-tight">
                          {d.name}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-mono truncate max-w-[280px]">
                          {d.url}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-3 text-left">
                      <div className="flex items-center gap-2">
                        {d.state === 'READY' ? (
                          <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-green-500/5 border border-green-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                            <span className="text-[10px] font-bold text-green-500 uppercase">Ready</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-yellow-500/5 border border-yellow-500/20">
                            <Loader2 size={10} className="text-yellow-500 animate-spin" />
                            <span className="text-[10px] font-bold text-yellow-500 uppercase">Processing</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-3 flex items-center gap-2 text-left">
                      <Clock size={12} className="text-neutral-600" />
                      <span className="text-xs text-neutral-400 font-mono">
                        {d.created ? new Date(Number(d.created)).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '---'}
                      </span>
                    </div>

                    <div className="col-span-1 text-right">
                      <a 
                        href={`https://${d.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded border border-neutral-800 bg-neutral-900 text-neutral-500 hover:text-white hover:border-neutral-600 hover:bg-neutral-800 transition-all"
                        title="Open Live Environment"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {!loading && deployments.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-[10px] text-neutral-600 font-bold uppercase tracking-widest px-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Cluster Online
                </span>
                <span>Active Nodes: {deployments.length}</span>
              </div>
              <div className="font-mono">
                System Time: {new Date().toISOString().split('T')[0]}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}