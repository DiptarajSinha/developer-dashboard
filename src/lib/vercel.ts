const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

export interface VercelDeployment {
  uid: string;
  name: string; // Project Name
  url: string;  // The .vercel.app URL
  created: number;
  state: "READY" | "BUILDING" | "ERROR" | "CANCELED" | "QUEUED";
  type: "LAMBDAS";
  creator: { username: string };
  meta?: {
    githubCommitMessage?: string;
    githubCommitRef?: string; // Branch
    githubRepo?: string;
  };
}

export async function fetchVercelDeployments(): Promise<VercelDeployment[]> {
  if (!VERCEL_TOKEN) return [];

  try {
    // Fetch latest 5 deployments across ALL projects
    const res = await fetch('https://api.vercel.com/v6/deployments?limit=5', {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
      next: { revalidate: 60 } // Cache for 60s
    });

    if (!res.ok) throw new Error('Failed to fetch Vercel data');
    
    const data = await res.json();
    return data.deployments || [];
  } catch (error) {
    console.error("Vercel API Error:", error);
    return [];
  }
}