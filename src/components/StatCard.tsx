import { cn } from '@/lib/utils';
import { Stat } from '@/lib/data';

export function StatCard({ label, value, trend }: Stat) {
  return (
    <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-6 rounded-lg hover:border-neutral-600 transition-all duration-300 group">
      <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">{label}</h3>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{value}</span>
        <span className={cn(
          "text-sm font-medium px-2 py-1 rounded bg-opacity-10",
          trend.startsWith('+') ? "text-green-500 bg-green-500" : "text-red-500 bg-red-500"
        )}>
          {trend}
        </span>
      </div>
    </div>
  );
}