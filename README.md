# 🖥️ DEV.NET | Mission Control

### **"Because checking GitHub and Vercel in two different tabs was costing me 4 seconds of my life."**

Welcome to **DEV.NET**, a high-performance, military-grade developer dashboard designed to give you a god-mode view of your repositories, deployments, and code health. It’s built for **Senior Frontend Engineers** who want to look like they’re hacking into the mainframe when they’re actually just checking if their latest CSS tweak broke production.

---

## 🚀 The "Why"
As a developer, my portfolio is a living organism. Standard GitHub views can feel restrictive when you're managing an ever-expanding list of projects. I built this to synchronize my entire digital footprint into one sleek interface with a **fully transparent mobile header**—ensuring that whether I have 30 repos or 300, the experience remains lightning-fast and visually consistent.

## 🛠️ Tech Stack
* **Framework:** Next.js 14+ (App Router)
* **Styling:** Tailwind CSS (The paint job)
* **Icons:** Lucide React (The shiny bits)
* **Data Sources:** GitHub API & Vercel API
* **Context:** Custom Role-Based Context (Recruiter/Tech Lead/Manager)

## ✨ Features
* **🎭 Role-Based Views:** Toggle between **Recruiter**, **Tech Lead**, and **Manager** modes. It's like a costume party for your career.
* **🔍 Dynamic Global Search (⌘K):** A custom event-driven search engine that indexes your **entire** repository catalog in real-time. No hardcoded limits, no missed projects.
* **🚀 Deployment Pipeline:** A professional, emoji-free list of your Vercel builds. It looks so serious your boss will think you're overworking.
* **📱 Responsive Architecture:**
  * Mobile-first drawer navigation.
  * `pt-24` mobile spacing logic for that perfect transparent header gap.
  * `overflow-x-hidden` safety rails for a smooth mobile experience.
* **📊 Automated Analytics:** Real-time data fetching for repository counts, star aggregates, and code health percentages.

## 📦 Installation

If you want to run this mission control locally:

```bash
# Clone the mainframe
git clone [https://github.com/DiptarajSinha/developer-dashboard.git](https://github.com/DiptarajSinha/developer-dashboard.git)

# Enter the terminal
cd dev-net

# Install the dependencies
npm install
```

# Launch the dashboard
npm run dev

## 🔐 Environment Variables

To get the data flowing, you must set these up in your `.env.local` or Vercel dashboard:

| Variable | Description |
| :--- | :--- |
| `GITHUB_TOKEN` | Your Personal Access Token (classic or fine-grained) |
| `VERCEL_TOKEN` | Your Vercel API Access Token |
| `VERCEL_TEAM_ID` | Your Vercel Team/User slug (e.g., `diptarajsinhas-projects`) |

## 🤝 Contributing

1. **Fork it.**
2. **Make it better.**
3. **Submit a PR.**

## 📜 License

MIT. Use it, build it, just don't blame me if you spend more time looking at the dashboard than actually coding.

---
**Built with ☕ and high-performance UI principles by [Diptaraj Sinha](https://github.com/DiptarajSinha)**
