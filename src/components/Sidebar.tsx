"use client";

import { Terminal, LayoutDashboard, Github, Globe, Box, Settings, Check, ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/lib/role-context';

export function Sidebar() {
  const { role, setRole } = useRole();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/" },
    { icon: Github, label: "Repositories", href: "/repo" },
    { icon: Globe, label: "Deployments", href: "/deployments" },
    { icon: Box, label: "Packages", href: "/packages" },
  ];

  const roles = [
    { id: 'recruiter', label: 'Recruiter View' },
    { id: 'tech-lead', label: 'Tech Lead View' },
    { id: 'manager', label: 'Manager View' },
  ];

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-black border-r border-neutral-800 text-left">
      <Link href="/" className="p-6 flex items-center gap-3 text-red-600 hover:opacity-80 transition-opacity">
        <Terminal size={32} />
        <span className="text-xl font-bold tracking-tighter text-white lg:block">DEV.NET</span>
      </Link>
      
      <div className="px-4 mb-4">
        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-2">
          View Mode
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="w-full flex items-center justify-between bg-neutral-900 border border-neutral-800 p-2 rounded-md text-sm text-white hover:border-neutral-600 transition-colors"
          >
            <span className="capitalize">{role.replace('-', ' ')}</span>
            <ChevronDown size={14} className={`transition-transform ${isRoleMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-[#1a1a1a] border border-neutral-800 rounded-md shadow-xl overflow-hidden z-[60]">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setRole(r.id as any);
                    setIsRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center justify-between"
                >
                  {r.label}
                  {role === r.id && <Check size={14} className="text-red-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-4 w-full p-3 rounded-md transition-all duration-200 group",
                isActive 
                  ? "bg-neutral-900 text-white border-l-4 border-red-600" 
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              )}
            >
              <item.icon size={20} />
              <span className="lg:block font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <Link href="/settings">
          <button className={cn(
            "flex items-center gap-4 w-full p-3 transition-colors",
            pathname === '/settings' ? "text-white bg-neutral-900 rounded-md" : "text-neutral-400 hover:text-white"
          )}>
            <Settings size={20} />
            <span className="lg:block">Settings</span>
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b border-neutral-800 z-[51] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-600">
          <Terminal size={24} />
          <span className="text-white font-bold tracking-tighter">DEV.NET</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-neutral-400 hover:text-white transition-colors"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={cn(
        "fixed inset-0 z-[50] md:hidden transition-transform duration-300",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="w-64 h-full pt-16">
          <SidebarContent />
        </div>
        <div 
          className="absolute inset-0 bg-black/60 -z-10" 
          onClick={() => setIsMobileOpen(false)}
        />
      </div>

      {/* Desktop sticky sidebar instead of absolute fixed positioning to reserve space */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 sticky top-0 h-screen shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}