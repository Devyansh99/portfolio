# Devyansh Agarwal, portfolio

**Live site: https://portfolio-three-alpha-covjeff2vy.vercel.app/**

My personal portfolio. I'm an AI engineer and a CS & AI student at Plaksha University in Mohali, India. The site is built like a game HUD: a fixed frame with a profile panel, a stats bar, and tabs along the bottom that swap the main screen.

## What's on it

| Tab | What you get |
|---|---|
| **Beginning** | A 3D wireframe sphere that turns to face your cursor, and a tagline written as code. Hover or tap it to read it in plain English. |
| **Logs** | My experience and school as a `git log --graph`. Each role is a commit on a branch (`work`, `lead`, `school`). Click one to open the diff. |
| **Skills** | A skills-by-project matrix. Hover a skill to light up the projects where I used it, or hover a project to see its skills. |
| **Creations** | A tilted 3D carousel of my projects. Each one opens into what it is, what it does, how it works, and the numbers. |
| **Research** | My paper on SadakVision, currently under review, explained in plain words with a pipeline from phone sensor to city dashboard. |
| **About** | A short bio and contact links. |

Things worth trying:

- Press **1 to 6** to jump between tabs.
- Press **/** (or **Ctrl+K**) to open a terminal-style command palette. It can jump to a tab, copy my email, and a few other things. Try `whoami`.
- Tabs are linkable, for example `/#creations` or `/#research`.
- On a phone you can swipe the project carousel.

## Built with

- [Next.js](https://nextjs.org/) 16 (App Router) and React 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [three.js](https://threejs.org/) through [react-three-fiber](https://r3f.docs.pmnd.rs/) for the sphere
- TypeScript throughout
- Fonts: Chakra Petch, Inter and JetBrains Mono through `next/font`
- Hosted on [Vercel](https://vercel.com/)

## Run it locally

You need Node.js 20 or newer.

```bash
git clone https://github.com/Devyansh99/portfolio.git
cd portfolio
npm install
npm run dev
```

Then open http://localhost:3000.

Other commands:

```bash
npm run lint     # check the code
npm run build    # production build
npm run start    # serve the production build
```

If you open the dev server from another device on your network, Next.js blocks it by default. Put that device's address in a git-ignored file called `dev-origins.json`, for example `["192.168.1.20"]`. The config reads it only when it exists.

## How it's organised

```
src/
  app/              layout, metadata, icon, share image, global styles
  components/
    hud/            the frame, panels, tab bar, command palette
      tabs/         one file per tab
    HeroScene.tsx   the 3D sphere
  data/             all the content: projects, paper, timeline, skills, profile
  lib/              small helpers
public/             portrait photo
```

Every piece of text on the site lives in `src/data/`. To change a project description or add a role, edit those files and the components pick it up.

## How it behaves

- **Search and sharing.** All six tabs are in the page HTML, so search engines can read them. There is a link-preview image, so sharing the link on LinkedIn or WhatsApp shows my name and role.
- **Speed.** The 3D code loads only when the first tab is showing, and the portrait is compressed.
- **Phones.** The side panel folds away, the tab bar scrolls sideways, and the sphere shrinks to fit.
- **No WebGL.** If a browser can't run WebGL2, the sphere is skipped and the rings and text still show.

## Deploying

Every push to `main` deploys to production on Vercel automatically. Pushes to any other branch get their own preview link. There are no environment variables to set.

## Credits

The HUD layout takes its inspiration from the [Web Portfolio Design (Community)](https://www.figma.com/design/38uPfa2VCtGzZS3AaZff3G/Web-Portfolio-Design--Community-) file on Figma. I rebuilt the ideas in my own colors and content, and I did not use any of its artwork or text.

## Content and reuse

The code is public so you can read how it works. The text, project write-ups, paper summary and photo are mine, so please don't reuse them. If you like something here and want to build on it, get in touch first: **devyanshag@gmail.com**.

## Contact

- Email: devyanshag@gmail.com
- GitHub: [Devyansh99](https://github.com/Devyansh99)
- LinkedIn: [devyansh99](https://www.linkedin.com/in/devyansh99/)
