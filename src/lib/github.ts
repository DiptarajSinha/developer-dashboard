// Define the shape of the raw GitHub API response
interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  pushed_at: string;
  language: string;
  stargazers_count: number;
  open_issues_count: number;
  homepage: string;
  default_branch: string;
}

// Define the shape our UI expects
export interface Project {
  id: number;
  name: string;
  status: "Live" | "Building" | "Error";
  health: number;
  updated: string;
  type: string;
  branch: string;
  stars: number;
  issues: number;
  url: string;
  homepage: string | null; // <--- NEW FIELD
  desc: string;
}

export interface UserStats {
  totalRepos: number;
  totalStars: number;
  followers: number;
  following: number;
}

export interface ActivityItem {
  id: number;
  title: string;
  repo: string;
  number: number;
  state: string;
  created_at: string;
  url: string;
}

// NEW: Interfaces for Notifications & Deployments
export interface Notification {
  id: string;
  subject: { title: string; type: string; url: string };
  repository: { full_name: string };
  reason: string;
  updated_at: string;
  unread: boolean;
}

export interface Deployment {
  id: number;
  sha: string;
  ref: string;
  task: string;
  environment: string;
  description: string | null;
  creator: { login: string };
  created_at: string;
  updated_at: string;
  statuses_url: string;
  repository_url: string;
  repoName?: string;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = process.env.GITHUB_USERNAME;

// Helper for headers
const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
};

// 1. Get Top Projects (Dashboard Swimlane)
export async function fetchGithubData(): Promise<Project[]> {
  if (!GITHUB_TOKEN) return [];
  
  try {
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=10&direction=desc`,
      { headers, next: { revalidate: 600 } }
    );
    if (!res.ok) throw new Error('Failed to fetch repos');
    const repos = await res.json();
    return repos.map(transformRepo);
  } catch (e) {
    console.error(e);
    return [];
  }
}

// 2. Get ALL Projects (For Search & Repos Page)
export async function fetchAllRepos(): Promise<Project[]> {
  if (!GITHUB_TOKEN) return [];
  try {
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`,
      { headers, next: { revalidate: 3600 } } 
    );
    const repos = await res.json();
    return repos.map(transformRepo);
  } catch (e) {
    return [];
  }
}

// 3. Get Real User Stats
export async function fetchUserStats(): Promise<UserStats> {
  if (!GITHUB_TOKEN) return { totalRepos: 0, totalStars: 0, followers: 0, following: 0 };
  
  try {
    const profileRes = await fetch(`https://api.github.com/users/${USERNAME}`, { headers });
    const profile = await profileRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`, { headers });
    const repos = await reposRes.json();
    const stars = repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);

    return {
      totalRepos: profile.public_repos,
      totalStars: stars,
      followers: profile.followers,
      following: profile.following
    };
  } catch (e) {
    return { totalRepos: 0, totalStars: 0, followers: 0, following: 0 };
  }
}

// 4. Get Real Pull Requests
export async function fetchRecentPullRequests(): Promise<ActivityItem[]> {
  if (!GITHUB_TOKEN) return [];
  try {
    const res = await fetch(
      `https://api.github.com/search/issues?q=author:${USERNAME}+type:pr&sort=created&order=desc&per_page=5`,
      { headers, next: { revalidate: 600 } }
    );
    const data = await res.json();
    
    return data.items.map((pr: any) => ({
      id: pr.id,
      title: pr.title,
      repo: pr.repository_url.split('/').pop(),
      number: pr.number,
      state: pr.state,
      created_at: new Date(pr.created_at).toLocaleDateString(),
      url: pr.html_url
    }));
  } catch (e) {
    return [];
  }
}

// 5. Single Project
export async function fetchProjectById(id: string): Promise<Project | null> {
  if (!GITHUB_TOKEN) return null;
  try {
    const res = await fetch(`https://api.github.com/repositories/${id}`, { headers });
    if (!res.ok) return null;
    const repo = await res.json();
    return transformRepo(repo);
  } catch (e) {
    return null;
  }
}

// 6. FETCH REAL NOTIFICATIONS
export async function fetchNotifications(): Promise<Notification[]> {
  if (!GITHUB_TOKEN) return [];
  try {
    const res = await fetch('https://api.github.com/notifications?all=true&per_page=5', { 
      headers,
      next: { revalidate: 60 } 
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("Notification Fetch Error", e);
    return [];
  }
}

// 7. FETCH REAL DEPLOYMENTS
export async function fetchRecentDeployments(): Promise<any[]> {
  if (!GITHUB_TOKEN || !USERNAME) return [];
  try {
    const topRepos = await fetchGithubData();
    const recentRepos = topRepos.slice(0, 3);
    
    const deploymentPromises = recentRepos.map(async (repo) => {
      const res = await fetch(`https://api.github.com/repos/${USERNAME}/${repo.name}/deployments`, { headers });
      const deployments = await res.json();
      return Array.isArray(deployments) ? deployments.map((d: any) => ({ ...d, repoName: repo.name })) : [];
    });

    const results = await Promise.all(deploymentPromises);
    return results.flat().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (e) {
    return [];
  }
}

// 8. FETCH REAL RELEASES (Simulating "Packages")
export async function fetchPackages(): Promise<any[]> {
  if (!GITHUB_TOKEN) return [];
  try {
    // 1. Get your repositories
    const repos = await fetchAllRepos();
    
    // 2. Check each repo for the latest release (Limit to top 15 to avoid API rate limits)
    const releasePromises = repos.slice(0, 15).map(async (repo) => {
      const res = await fetch(`https://api.github.com/repos/${USERNAME}/${repo.name}/releases/latest`, { 
        headers,
        next: { revalidate: 3600 } 
      });
      
      if (!res.ok) return null; // No release found
      const data = await res.json();
      
      return {
        id: data.id,
        name: data.name || data.tag_name,
        tag: data.tag_name,
        repo: repo.name,
        published_at: new Date(data.published_at).toLocaleDateString(),
        url: data.html_url,
        author: data.author.login,
        downloads: data.assets.reduce((acc: number, asset: any) => acc + asset.download_count, 0)
      };
    });

    const results = await Promise.all(releasePromises);
    return results.filter(item => item !== null); // Remove nulls
  } catch (e) {
    return [];
  }
}

// 9. FETCH REPO DETAILS (Commits & CI/CD Runs)
export async function fetchRepoDetails(repoName: string, branch: string = 'main') {
  if (!GITHUB_TOKEN || !USERNAME) return null;
  
  try {
    const headers = { Authorization: `token ${GITHUB_TOKEN}` };

    // A. FETCH RAW COMMITS (Reduced to 5 for Terminal Fallback only)
    const commitsUrl = `https://api.github.com/repos/${USERNAME}/${repoName}/commits?sha=${branch}&per_page=5`;
    const commitsRes = await fetch(commitsUrl, { headers, cache: 'no-store' });
    
    let allCommits = [];
    if (commitsRes.ok) {
      allCommits = await commitsRes.json();
    }
    
    if (!Array.isArray(allCommits)) allCommits = [];

    // B. Recent Workflow Runs (CI/CD)
    const runsRes = await fetch(`https://api.github.com/repos/${USERNAME}/${repoName}/actions/runs?per_page=5`, { headers });
    const runsData = await runsRes.json();
    
    const workflows = runsData.workflow_runs ? runsData.workflow_runs.map((run: any) => ({
      id: run.id,
      name: run.name,
      status: run.status,
      conclusion: run.conclusion,
      time: new Date(run.updated_at).toLocaleString(),
      commit: run.head_commit?.message || "No commit message",
      actor: run.actor?.login,
      duration: Math.round((new Date(run.updated_at).getTime() - new Date(run.created_at).getTime()) / 1000) + "s",
      type: 'workflow'
    })) : [];

    // C. Recent Commits (Terminal Fallback)
    const recentCommits = allCommits.slice(0, 5).map((c: any) => ({
      id: c.sha.substring(0, 7),
      name: "Commit pushed",
      status: "completed",
      conclusion: "success",
      time: new Date(c.commit.author.date).toLocaleString(),
      commit: c.commit.message,
      actor: c.author?.login || c.commit.author.name,
      duration: "0s",
      type: 'commit'
    }));

    return { workflows, recentCommits };
  } catch (e) {
    return { workflows: [], recentCommits: [] };
  }
}

// 10. FETCH REPO LANGUAGES
export async function fetchRepoLanguages(repoName: string) {
  if (!GITHUB_TOKEN || !USERNAME) return {};
  
  try {
    const res = await fetch(`https://api.github.com/repos/${USERNAME}/${repoName}/languages`, { 
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
        next: { revalidate: 3600 } 
    });
    return await res.json();
  } catch (e) {
    return {};
  }
}

// --- Helper: Data Transformer ---
function transformRepo(repo: any): Project {
  const lastPush = new Date(repo.pushed_at);
  const now = new Date();
  const hoursSincePush = (now.getTime() - lastPush.getTime()) / (1000 * 60 * 60);

  let status: Project['status'] = "Live";
  if (hoursSincePush < 24) status = "Building";
  if (repo.open_issues_count > 5) status = "Error";

  const health = Math.max(100 - (repo.open_issues_count * 5), 50);

  // LOGIC: Check if homepage exists and starts with http/https
  const hasLiveUrl = repo.homepage && repo.homepage.startsWith('http');

  return {
    id: repo.id,
    name: repo.name,
    status: status,
    health: health,
    updated: new Date(repo.pushed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    type: repo.language || "Markdown",
    branch: repo.default_branch || "main",
    stars: repo.stargazers_count,
    issues: repo.open_issues_count,
    url: repo.html_url,
    homepage: hasLiveUrl ? repo.homepage : null, // <--- MAPPED HERE
    desc: repo.description
  };
}