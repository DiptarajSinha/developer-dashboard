"use client";
import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Rocket, CheckCircle, XCircle } from 'lucide-react';

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/deployments').then(res => res.json()).then(setDeployments);
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans">
      <Sidebar />
      <main className="pl-0 md:pl-20 lg:pl-64 p-10">
        <h1 className="text-3xl font-bold mb-8">Recent Deployments</h1>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
          {deployments.length === 0 ? (
            <div className="p-10 text-center text-neutral-500">
              No active deployments found via GitHub API.<br/>
              <span className="text-xs">Note: Vercel deployments require Vercel API integration.</span>
            </div>
          ) : (
            deployments.map((d) => (
              <div key={d.id} className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Rocket className="text-blue-500" size={20} />
                  <div>
                    <h3 className="font-bold">{d.repoName}</h3>
                    <p className="text-xs text-neutral-500">{d.environment} • {new Date(d.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-900/30 text-green-500 text-xs rounded-full border border-green-900">
                  Active
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}