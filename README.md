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

## Build (GitHub Pages)

```bash
npm run build
```

Static output lands in `out/`. Production builds use `basePath` `/cjones-website-portfolio`.

## Media

Source library: `Resume Photos/`  
Organized assets: `public/images/` + `public/resume/`  
Regenerate:

```powershell
powershell -File scripts/organize-media.ps1
```

## Sections

Hero · About · Journey · Research Lab · Skills · Experience · Awards · Leadership · Publications · Photography · Resume · Connect
