import { AlertCircle, Activity, CheckCircle2, GitPullRequest, Star, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project } from '@/lib/github';
import Link from 'next/link';

export function ProjectCard({ project }: { project: Project }) {
  return (
    // REMOVED: min-w-[280px] md:min-w-[320px]
    // ADDED: w-full
    <div className="group relative w-full h-[220px] bg-neutral-900 border border-neutral-800 rounded-lg p-5 overflow-hidden hover:scale-[1.02] hover:z-10 hover:border-neutral-500 transition-all duration-300 shadow-lg shadow-black/50 flex flex-col justify-between">
      
      {/* The Main Link (Invisible cover) */}
      <Link 
        href={`/repo/${project.id}`}
        className="absolute inset-0 z-0"
        aria-label={`View details for ${project.name}`}
      />

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />
      
      {/* Content Layer */}
      <div className="relative z-10 pointer-events-none">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-mono text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded-full">
            {project.type}
          </span>
          {project.status === 'Error' ? (
            <AlertCircle size={18} className="text-red-600 animate-pulse" />
          ) : project.status === 'Building' ? (
            <Activity size={18} className="text-yellow-500 animate-spin-slow" />
          ) : (
            <CheckCircle2 size={18} className="text-green-500" />
          )}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-1 truncate">{project.name}</h3>
        
        <p className="text-neutral-500 text-xs flex items-center gap-1">
          <GitPullRequest size={12} /> {project.branch} 
          {project.stars > 0 && (
             <span className="flex items-center gap-1 ml-2 text-yellow-500">
               <Star size={10} fill="currentColor" /> {project.stars}
             </span>
          )}
        </p>
      </div>

      <div className="relative z-10 space-y-2 mt-auto">
        <div className="flex justify-between text-xs text-neutral-400 pointer-events-none">
          <span>Health</span>
          <span>{project.health}%</span>
        </div>
        
        <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden pointer-events-none">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", 
              project.health < 50 ? "bg-red-600" : "bg-green-500"
            )} 
            style={{ width: `${project.health}%` }} 
          />
        </div>

        <div className="flex justify-between items-center pt-2">
           <p className="text-[10px] text-neutral-600 pointer-events-none">Updated {project.updated}</p>
           
           <a 
             href={`${project.url}/actions`}
             target="_blank"
             rel="noopener noreferrer"
             className="flex items-center gap-1 text-[10px] bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1 rounded border border-neutral-700 transition-colors pointer-events-auto relative z-20"
           >
             <PlayCircle size={10} /> View CI/CD
           </a>
        </div>
      </div>
    </div>
  );
}