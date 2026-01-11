"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, X, AlertCircle, CheckCircle2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch Real Notifications
  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        // Map GitHub notification format to our UI format
        const mapped = Array.isArray(data) ? data.map((n: any) => ({
          id: n.id,
          title: n.subject.title,
          desc: n.repository.full_name,
          time: new Date(n.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: n.subject.type === 'PullRequest' ? 'success' : 'info',
          read: !n.unread
        })) : [];
        setNotifications(mapped);
      })
      .catch(err => console.error(err));
  }, []);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-full transition-colors",
          isOpen ? "bg-neutral-800 text-white" : "text-neutral-400 hover:bg-neutral-800"
        )}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border border-[#141414] animate-pulse"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-[#1a1a1a] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
            <h3 className="font-semibold text-sm text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-xs">
                All caught up! No new notifications.
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={cn(
                    "p-4 border-b border-neutral-800/50 flex gap-3 hover:bg-neutral-800/50 transition-colors group relative",
                    !n.read ? "bg-white/5" : ""
                  )}
                >
                  {/* Icon */}
                  <div className="mt-1">
                    {n.type === 'error' && <AlertCircle size={16} className="text-red-500" />}
                    {n.type === 'success' && <CheckCircle2 size={16} className="text-green-500" />}
                    {n.type === 'info' && <Star size={16} className="text-yellow-500" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className={cn("text-sm font-medium", !n.read ? "text-white" : "text-neutral-400")}>
                      {n.title}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{n.desc}</p>
                    <p className="text-[10px] text-neutral-600 mt-2">{n.time}</p>
                  </div>

                  {/* Unread Dot or Delete */}
                  <div className="flex flex-col items-end gap-2">
                    {!n.read && (
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    )}
                    <button 
                      onClick={(e) => deleteNotification(n.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-500 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Footer */}
          <div className="p-2 bg-neutral-900 border-t border-neutral-800 text-center">
            <button className="text-xs text-neutral-500 hover:text-white transition-colors w-full py-1">
              View Archive
            </button>
          </div>
        </div>
      )}
    </div>
  );
}