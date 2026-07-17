# Cameron Jones — Personal Research Platform

A cinematic personal brand site for **Cameron Jones**: AI researcher, robotics engineer, and Computer Science student at Tuskegee University.

**Never stopped building.**

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Framer Motion
- Static export for GitHub Pages

## Develop

```bash
npm install
npm run dev
```

## Build / Deploy

```bash
npm run build
```

Primary host: **Vercel** (root path — no `basePath`).

For GitHub Pages subdirectory deploys only, set:

```bash
NEXT_PUBLIC_BASE_PATH=/cjones-website-portfolio
```

## Media

Source library: `Resume Photos/`  
Organized assets: `public/images/` + `public/resume/`  
Regenerate:

```powershell
powershell -File scripts/organize-media.ps1
```

## Sections

Hero · About · Journey · Research Lab · Skills · Experience · Awards · Leadership · Publications · Photography · Resume · Connect
