"use client";

import React, { useState, useEffect } from 'react';
import { Save, User, Bell, Shield, Trash2, Check, ArrowLeft } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import Link from 'next/link';

export default function SettingsPage() {
  // Mock Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [name, setName] = useState("");

  // Load from local storage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("dev_dashboard_name");
    if (savedName) setName(savedName);
  }, []);

  const handleSave = () => {
    setIsLoading(true);
    // Actually save to browser storage
    localStorage.setItem("dev_dashboard_name", name || "Alex Dev"); 
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
      // Reset success message after 2 seconds
      setTimeout(() => setIsSaved(false), 2000);
    }, 500); // Faster feedback
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-red-900 selection:text-white">
      <Sidebar />
      
      <main className="pl-0 md:pl-20 lg:pl-64 transition-all duration-300">
        
        {/* Header with Back Button for Mobile */}
        <div className="p-6 md:p-10 pb-0 flex items-center gap-4">
           <Link href="/" className="md:hidden text-neutral-400 hover:text-white">
             <ArrowLeft />
           </Link>
           <div>
             <h1 className="text-3xl font-bold mb-2">Settings</h1>
             <p className="text-neutral-400">Manage your profile and dashboard preferences.</p>
           </div>
        </div>

        <div className="p-6 md:p-10 max-w-4xl space-y-8 pb-20">
          
          {/* Section 1: Public Profile */}
          <section className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/30">
            <div className="p-6 border-b border-neutral-800">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <User size={18} className="text-neutral-400" /> Public Profile
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-neutral-400">Display Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#0a0a0a] border border-neutral-800 rounded p-2 text-white focus:border-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-neutral-400">Job Title</label>
                  <input 
                    type="text" 
                    defaultValue="Senior Frontend Engineer" 
                    className="w-full bg-[#0a0a0a] border border-neutral-800 rounded p-2 text-white focus:border-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Bio</label>
                <textarea 
                  rows={3}
                  defaultValue="Building high-performance web applications with Next.js and Tailwind." 
                  className="w-full bg-[#0a0a0a] border border-neutral-800 rounded p-2 text-white focus:border-neutral-500 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="p-4 bg-neutral-900/50 border-t border-neutral-800 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isLoading}
                className={`
                  px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-all
                  ${isSaved ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-neutral-200'}
                `}
              >
                {isLoading ? (
                  "Saving..."
                ) : isSaved ? (
                  <><Check size={16} /> Saved</>
                ) : (
                  <><Save size={16} /> Save Changes</>
                )}
              </button>
            </div>
          </section>

          {/* Section 2: Notifications (With Toggles) */}
          <section className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/30">
            <div className="p-6 border-b border-neutral-800">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bell size={18} className="text-neutral-400" /> Notifications
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Deployment Succeeded", desc: "Get notified when a build completes successfully." },
                { label: "Deployment Failed", desc: "Get notified immediately if a build fails.", checked: true },
                { label: "New Pull Request", desc: "Get notified when a new PR is created." }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-sm font-medium">{item.label}</h3>
                    <p className="text-xs text-neutral-500">{item.desc}</p>
                  </div>
                  {/* Tailwind Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                    <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer 
                      peer-checked:after:translate-x-full peer-checked:after:border-white 
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-white after:border-gray-300 after:border after:rounded-full 
                      after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Danger Zone */}
          <section className="border border-red-900/30 rounded-lg overflow-hidden bg-red-950/10">
            <div className="p-6 border-b border-red-900/30">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-red-500">
                <Shield size={18} /> Danger Zone
              </h2>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-white">Delete Portfolio Project</h3>
                <p className="text-xs text-neutral-400">Once you delete a project, there is no going back. Please be certain.</p>
              </div>
              <button className="border border-red-900 text-red-500 hover:bg-red-950 px-4 py-2 rounded text-sm font-bold transition-colors flex items-center gap-2">
                <Trash2 size={16} /> Delete Project
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}