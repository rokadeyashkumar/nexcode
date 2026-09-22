# NexCode

> **A real-time collaborative code editor with region-level review.**

NexCode is a browser-based code editor that lets an entire team edit the same project at the same time — with live cursors, presence, role-based access, and a region-level review workflow — so no one has to wait on a pull request to see someone else's work.

Built as a major project at **Nagpur Institute of Technology**, Department of Computer Science and Engineering.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

Software teams today still coordinate work through pull requests. A developer pushes code, waits for review, and dependents stay blocked until merge — often for hours or days. NexCode removes that wait by letting the whole team edit the same file live, while keeping a proper quality gate through **region-level review**.

Every region an editor writes is tracked as a **chunk** with an author, a colour, and a lifecycle status — `pending`, `accepted`, or `rejected`. Administrators review chunks in place, right inside the editor. Visibility is decoupled from acceptance: developers see work the moment it's typed, but it's only treated as final once it's approved.

---

## Features

### Real-Time Collaboration
- Multi-user live editing powered by **Yjs** (CRDT — conflict-free)
- No locks, no manual merges
- Live cursors, selections, and presence avatars
- Sub-100 ms sync on local network

### Region-Level Review
- Each authored region tracked as a **chunk** with author + colour
- Lifecycle: `pending` → `accepted` / `rejected`
- Pending regions shaded; accepted regions return to normal; rejected ones disappear
- Stable chunk boundaries using **relative position references**
- Auto-merge of consecutive keystrokes within a 1-second window

### Role-Based Access Control
- **Viewer** — read-only, sees presence and live cursors
- **Editor** — writes; every change goes into review
- **Administrator** — approves or rejects pending chunks

### Workspace & Tools
- **Dashboard** — Recent, Projects, Teams, Planner, Meetings, Notes, Help, Settings, Profile
- **In-editor terminal** — run and version code without leaving the editor
- **File tree sync** — shared list of files across all participants
- **Dark / Light theme** — full theme toggle across every view

### Design
- Clean black-and-white UI
- VS Code-inspired editor layout
- Responsive design for mobile and desktop
- SCSS modules with per-view styling

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend framework | **Next.js 14+** | SSR, routing, API routes |
| Editor | **Monaco** | VS Code's editor engine |
| CRDT engine | **Yjs** (YATA) | Conflict-free text and map sync |
| Relative positions | **Yjs RelativePosition API** | Stable chunk boundaries |
| Sync relay | **Node.js + y-websocket** | Document synchronization |
| Terminal | **Node.js + xterm.js** | Shell execution and streaming |
| Styling | **SCSS Modules** | Theme, layout, per-view styling |
| Database *(planned)* | **PostgreSQL + Prisma** | Users, teams, audit logs |
| Auth *(planned)* | **NextAuth.js** | Credentials + OAuth |

---

## Architecture
┌─────────────────────────────────────────────────────────────┐
│ BROWSER │
├─────────────────────────────────────────────────────────────┤
│ Dashboard │ Collab Editor │ Terminal │ Presence UI │
└─────────────────────────────────────────────────────────────┘
│
▼ WebSocket
┌─────────────────────────────────────────────────────────────┐
│ SYNC RELAY (Node.js) │
│ ├── Project Room → Y.Map of file descriptors │
│ └── File Room → Y.Text (code) + Y.Map (chunks) │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ TERMINAL SERVICE (Node.js) │
└─────────────────────────────────────────────────────────────┘
│
▼ (planned)
┌─────────────────────────────────────────────────────────────┐
│ POSTGRESQL — users, teams, audit logs │
└─────────────────────────────────────────────────────────────┘

text

### Three cooperating processes

1. **Application process** — Next.js frontend running the editor in the browser
2. **Synchronization process** — Node.js relay forwarding Yjs updates; does not parse code, interpret roles, or hold application state
3. **Terminal process** — isolated Node.js service that runs shell commands and streams output

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- Two browser tabs (or one normal + one incognito) for testing multi-user

### Installation

```bash
git clone https://github.com/your-org/nexcode.git
cd nexcode
npm install
Running Locally
You need two terminals — one for the sync server, one for the Next.js app.

Terminal 1 — Sync server:

bash
npm run sync-server
Expected output:

text
Yjs sync server listening on ws://localhost:1234
Terminal 2 — Next.js app:

bash
npm run dev
Open http://localhost:3000.

Testing Multi-User
Open the app in two tabs (or one normal + one incognito)

Sign up / log in on both

Open the same project

Type in one — the other should update within a fraction of a second

Try the role switcher (?role=view, ?role=edit, ?role=admin)

Environment Variables
Create .env.local in the project root. Not committed to Git — each machine has its own.

env
# Sync server
NEXT_PUBLIC_SYNC_SERVER_URL=ws://localhost:1234

# Database (planned)
DATABASE_URL=postgresql://user:password@host:5432/nexcode

# Auth (planned)
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000

# OAuth (planned)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
Tip: Use a cloud PostgreSQL provider like Neon or Supabase so the same database works from any machine and from Vercel. No local install needed.

Project Structure
text
nexcode/
├── app/
│   ├── layout.js                      # Root layout, fonts
│   ├── page.js                        # Main router (website ↔ dashboard ↔ editor)
│   ├── globals.scss                   # Global styles
│   │
│   ├── website/                       # Landing page + auth
│   │   ├── page.js
│   │   ├── website.module.scss
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── hero/
│   │   │   ├── features/
│   │   │   ├── how-it-works/
│   │   │   ├── cta/
│   │   │   ├── footer/
│   │   │   └── auth/
│   │   │       ├── login.js
│   │   │       ├── signup.js
│   │   │       └── auth.module.scss
│   │   └── shared/
│   │       └── icons.js
│   │
│   └── components/
│       ├── collab-editor/             # Editor shell + file sidebar
│       ├── file-editor/               # Monaco wrapper with Yjs binding
│       ├── terminal/                  # xterm.js terminal panel
│       └── dashboard/
│           ├── dashboard.js
│           ├── dashboard.module.scss
│           ├── sidebar/
│           ├── shared/
│           │   └── icons.js
│           └── views/
│               ├── recent/
│               ├── projects/
│               ├── teams/
│               ├── planner/
│               ├── meetings/
│               ├── notes/
│               ├── help/
│               ├── settings/
│               └── profile/
│
├── server/
│   └── sync-server.js                 # Yjs WebSocket relay
│
├── styles/
│   └── variables.scss                 # Global SCSS variables
│
├── next.config.js
├── package.json
└── README.md
Roadmap
✅ Completed
☑ Real-time multi-user editing (Yjs CRDT)
☑ Live cursors, presence, and avatars
☑ Role-based access (viewer / editor / administrator)
☑ Region-level review with chunk lifecycle
☑ Relative position references for stable boundaries
☑ Auto-merge of consecutive keystrokes
☑ Project room + file room model
☑ In-editor terminal (xterm.js)
☑ Full dashboard (Recent, Projects, Teams, Planner, Meetings, Notes)
☑ Help and Settings views
☑ Profile page
☑ Dark / light theme toggle
☑ Landing page with login / signup screens
☑ Continue with Google button (UI ready)
🚧 In Progress
□ PostgreSQL persistence via Prisma
□ NextAuth.js integration (email + Google OAuth)
□ Real email invites with role assignment
⏳ Planned
□ GitHub integration — auto-commit accepted chunks
□ Terminal Git operations (git push, git pull)
□ Inline comments on pending chunks
□ AI-assisted review suggestions (Ollama)
□ Notification system (mentions, review updates, invites)
□ Deployment to Vercel (frontend) + Railway (sync server)
Contributing
This is a final-year academic project. Contributions are welcome once the paper is published.

Fork the repository

Create a feature branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m 'Add some feature')

Push to the branch (git push origin feature/your-feature)

Open a Pull Request

Code style
Follow the existing file structure and naming conventions

Keep folders and files lowercase

One component per folder with its own .module.scss

Use SCSS variables from styles/variables.scss

License
This project is currently unlicensed pending publication. All rights reserved by the authors until further notice.

Acknowledgments
Project Guide

Prof. Tejas Dhule — Department of Computer Science and Engineering, Nagpur Institute of Technology

Team

Yashkumar Rokade

Sakshi Giri

Karishma Fating

Mayur Sawale

Built on the shoulders of

Yjs — CRDT framework

Monaco Editor — editor engine

Next.js — React framework

xterm.js — terminal component

Inspired by

Figma's multiplayer architecture

Google Docs and Microsoft 365 co-authoring

VS Code Live Share

<p align="center"> <strong>NexCode</strong> — <em>Code together, ship faster.</em> </p> ```
What's included and why
Section	Why it matters
Badges / tagline	Gives immediate context — one-line pitch at the top
Table of Contents	Standard for any README with 5+ sections
Overview	Explains why NexCode exists, in plain language
Features	Grouped into 5 logical categories, not a flat list
Tech Stack table	Layers → Technologies → Purpose — easy to scan
Architecture	ASCII diagram + short "three processes" explanation
Getting Started	Prerequisites → Install → Run (with two terminals) → Test
Environment Variables	Full .env.local block, ready to copy
Project Structure	Real tree of your actual folders — not a guess
Roadmap	Completed / In Progress / Planned — shows real progress
Contributing	Standard workflow + your code style rules
License	Placeholder (unlicensed pending publication)
Acknowledgments	Guide, team, libraries, and inspirations


```

```
npm run sync-server 
```