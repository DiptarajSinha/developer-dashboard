// Define the shape of our data
export interface Project {
  id: number;
  name: string;
  status: "Live" | "Building" | "Error";
  health: number;
  updated: string;
  type: string;
  branch: string;
}

export interface Stat {
  label: string;
  value: string;
  trend: string;
}

// Mock Data
export const REPO_DATA: Project[] = [
  { id: 1, name: "neuro-dream-viz", status: "Live", health: 98, updated: "2h ago", type: "AI", branch: "main" },
  { id: 2, name: "gravity-drift-game", status: "Building", health: 100, updated: "5m ago", type: "Game", branch: "dev" },
  { id: 3, name: "finance-saas-core", status: "Error", health: 45, updated: "1d ago", type: "Backend", branch: "fix/auth" },
  { id: 4, name: "portfolio-v4", status: "Live", health: 100, updated: "1w ago", type: "Frontend", branch: "main" },
];

export const ANALYTICS_DATA: Stat[] = [
  { label: "Total Commits", value: "1,248", trend: "+12%" },
  { label: "Uptime (30d)", value: "99.9%", trend: "+0.1%" },
  { label: "Open Issues", value: "14", trend: "-5%" },
  { label: "NPM Downloads", value: "45k", trend: "+22%" },
];