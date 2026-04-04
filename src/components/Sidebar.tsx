"use client";



import { Terminal, LayoutDashboard, Github, Globe, Box, Settings, Check, ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/lib/role-context';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const { role, setRole } = useRole();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

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



  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Toggle Button (Floating) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-red-600 text-white rounded-full shadow-lg shadow-red-900/40"
      >
        {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
      </button>

      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[45]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={cn(
        "flex flex-col bg-black border-r border-neutral-800 h-screen fixed left-0 top-0 z-50 transition-transform duration-300",
        "w-20 lg:w-64",
        "md:translate-x-0", // Visible on desktop
        isOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0" // Drawer logic
      )}>

      <Link href="/" className="p-6 flex items-center gap-3 text-red-600 hover:opacity-80 transition-opacity">

        <Terminal size={32} />

        <span className={cn("text-xl font-bold tracking-tighter text-white", isOpen ? "block" : "hidden lg:block")}>DEV.NET</span>

      </Link>

     

      {/* ROLE SWITCHER */}

      <div className={cn("px-4 mb-4", isOpen ? "block" : "hidden lg:block")}>

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

              <span className={cn("font-medium", isOpen ? "block" : "hidden lg:block")}>{item.label}</span>

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

            <span className={cn(isOpen ? "block" : "hidden lg:block")}>Settings</span>

          </button>

        </Link>

      </div>

    </div>
    </>
  );
}