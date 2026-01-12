"use client";



import { Terminal, LayoutDashboard, Github, Globe, Box, Settings, Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useState } from 'react';

import Link from 'next/link';

import { usePathname } from 'next/navigation'; // 1. Import this hook

import { useRole } from '@/lib/role-context';



export function Sidebar() {

  const { role, setRole } = useRole();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const pathname = usePathname(); // 2. Get current path



  // 3. Add 'href' to your menu items

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



  return (

    <div className="hidden md:flex flex-col w-20 lg:w-64 bg-black border-r border-neutral-800 h-screen fixed left-0 top-0 z-50">

      <Link href="/" className="p-6 flex items-center gap-3 text-red-600 hover:opacity-80 transition-opacity">

        <Terminal size={32} />

        <span className="text-xl font-bold tracking-tighter text-white hidden lg:block">DEV.NET</span>

      </Link>

     

      {/* ROLE SWITCHER */}

      <div className="px-4 mb-4 hidden lg:block">

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

            <div className="absolute top-full left-0 w-full mt-1 bg-[#1a1a1a] border border-neutral-800 rounded-md shadow-xl overflow-hidden z-50">

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

          // 4. Check if this item is active

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

              <span className="hidden lg:block font-medium">{item.label}</span>

            </Link>

          );

        })}

      </nav>



      <div className="p-4 border-t border-neutral-800">

        <Link href="/settings">

          <button className={cn(

            "flex items-center gap-4 w-full p-3 transition-colors",

            pathname === '/settings' // Highlight if on settings page

              ? "text-white bg-neutral-900 rounded-md"

              : "text-neutral-400 hover:text-white"

          )}>

            <Settings size={20} />

            <span className="hidden lg:block">Settings</span>

          </button>

        </Link>

      </div>

    </div>

  );

}