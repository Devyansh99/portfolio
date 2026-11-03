import { projectCodes } from "@/data/codes";
import { paper } from "@/data/research";
import { profile } from "@/data/profile";
import { projects, type Project } from "@/data/projects";
import { skillGroups, skillUsage } from "@/data/skills";
import { achievements, timeline } from "@/data/timeline";

export type TabName =
  | "start"
  | "logs"
  | "skills"
  | "creations"
  | "research"
  | "about";

export type ShellLine = {
  text: string;
  tone?: "mint" | "amber" | "muted";
  href?: string;
};

export type ShellAction =
  | { type: "go"; tab: TabName }
  | { type: "open"; url: string }
  | { type: "mail"; subject?: string }
  | { type: "clear" }
  | { type: "palette" }
  | { type: "close" };

export type ShellResult = { lines: ShellLine[]; action?: ShellAction };

export const tabNames: TabName[] = [
  "start",
  "logs",
  "skills",
  "creations",
  "research",
  "about",
];

export const commandNames = [
  "help",
  "ls",
  "cd",
  "open",
  "cat",
  "git",
  "whoami",
  "neofetch",
  "contact",
  "mail",
  "sudo",
  "history",
  "clear",
  "palette",
  "exit",
];

const links: Record<string, string> = {
  github: profile.github,
  linkedin: profile.linkedin,
  email: `mailto:${profile.email}`,
  mail: `mailto:${profile.email}`,
  sadakvision: "https://sadakvision.com",
};

const aliases: Record<string, TabName> = {
  home: "start",
  "~": "start",
  beginning: "start",
  log: "logs",
  experience: "logs",
  skill: "skills",
  projects: "creations",
  project: "creations",
  paper: "research",
  bio: "about",
  contact: "about",
};

const text = (t: string, tone?: ShellLine["tone"]): ShellLine => ({
  text: t,
  tone,
});
const blank: ShellLine = { text: "" };
const err = (t: string): ShellLine => ({ text: t, tone: "amber" });

function findProject(q: string): Project | undefined {
  const key = q
    .replace(/\/$/, "")
    .replace(/\.md$/, "")
    .trim()
    .toLowerCase();
  if (!key) return undefined;
  return projects.find(
    (p) =>
      p.id === key ||
      p.title.toLowerCase() === key ||
      projectCodes[p.id].toLowerCase() === key,
  );
}

function findTab(q: string): TabName | undefined {
  const key = q.replace(/\/$/, "").trim().toLowerCase();
  return (
    tabNames.find((t) => t === key) ??
    (aliases[key] as TabName | undefined)
  );
}

function hash(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, "0").slice(0, 7);
}

const helpLines: ShellLine[] = [
  text("commands", "amber"),
  text("  ls [projects|skills]     list things"),
  text("  cd <tab>                 jump to a tab (start, logs, skills ...)"),
  text("  cat <project>            read a project, e.g. cat sadakvision"),
  text("  cat skills | about | paper"),
  text("  git log                  experience and school"),
  text("  open github|linkedin     open a profile"),
  text("  contact                  all the ways to reach me"),
  text("  sudo connect devyansh    write me an email"),
  text("  neofetch  whoami  history  clear  palette  exit"),
  blank,
  text("tab completes, arrow up repeats the last command.", "muted"),
];

function catProject(p: Project): ShellLine[] {
  const out: ShellLine[] = [
    text(`${p.title}  [${p.status}]  ${p.period}`, "mint"),
    text(p.kicker, "amber"),
    blank,
    text(p.what),
    blank,
    ...p.does.map((d) => text(`- ${d}`)),
    blank,
    text(`how: ${p.how}`),
    blank,
    text(`stack: ${p.stack.join(", ")}`, "muted"),
  ];
  if (p.metrics.length > 0) {
    out.push(
      text(`numbers: ${p.metrics.map((m) => `${m.value} ${m.label}`).join(" | ")}`, "muted"),
    );
  }
  for (const l of p.links) out.push({ text: `${l.label}`, href: l.url, tone: "mint" });
  return out;
}

export function run(raw: string, history: string[]): ShellResult {
  const input = raw.trim();
  if (!input) return { lines: [] };
  const parts = input.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const rest = parts.slice(1);
  const arg = rest.join(" ").toLowerCase();

  switch (cmd) {
    case "help":
    case "?":
      return { lines: helpLines };

    case "ls": {
      if (!arg || arg === "." || arg === "~") {
        return { lines: [text(tabNames.map((t) => `${t}/`).join("  "))] };
      }
      if (arg === "projects" || arg === "creations" || arg === "creations/") {
        return {
          lines: projects.map((p) =>
            text(
              `${projectCodes[p.id].toLowerCase()}  ${p.id.padEnd(18)} ${p.status.padEnd(12)} ${p.kicker}`,
            ),
          ),
        };
      }
      if (arg === "skills" || arg === "skills/") {
        return {
          lines: skillGroups.map((g) =>
            text(`${g.command.split(" ")[0].padEnd(11)} ${g.items.join(", ")}`),
          ),
        };
      }
      return { lines: [err(`ls: cannot access '${rest.join(" ")}': no such directory`)] };
    }

    case "cd":
    case "go":
    case "goto": {
      const tab = findTab(arg || "start");
      if (!tab) return { lines: [err(`cd: ${arg}: no such tab. try: ${tabNames.join(", ")}`)] };
      return { lines: [text(`-> ${tab}`, "muted")], action: { type: "go", tab } };
    }

    case "open": {
      if (!arg) return { lines: [err("open: what? try 'open github' or 'open sadakvision'")] };
      if (arg === "github" || arg === "linkedin") {
        return {
          lines: [text(`opening ${arg}...`, "muted")],
          action: { type: "open", url: links[arg] },
        };
      }
      if (arg === "email" || arg === "mail") {
        return { lines: [text("opening your mail app...", "muted")], action: { type: "mail" } };
      }
      const p = findProject(arg);
      if (p) {
        return {
          lines: [text(`-> creations. 'cat ${p.id}' for the full story.`, "muted")],
          action: { type: "go", tab: "creations" },
        };
      }
      const tab = findTab(arg);
      if (tab) return { lines: [text(`-> ${tab}`, "muted")], action: { type: "go", tab } };
      return { lines: [err(`open: ${arg}: not found`)] };
    }

    case "cat":
    case "less":
    case "more": {
      if (!arg) return { lines: [err("cat: missing file. try 'ls projects' first")] };
      const p = findProject(arg);
      if (p) return { lines: catProject(p) };
      if (arg === "skills" || arg === "skills.md") {
        const used = skillGroups.flatMap((g) => g.items).filter((s) => skillUsage[s]);
        return {
          lines: [
            ...skillGroups.map((g) =>
              text(`# ${g.command.split(" ")[0].padEnd(11)} ${g.items.join(", ")}`),
            ),
            blank,
            text(`${used.length} skills are backed by a project. open the skills tab for the matrix.`, "muted"),
          ],
        };
      }
      if (arg === "about" || arg === "about.md" || arg === "bio") {
        return {
          lines: [
            ...profile.bio.flatMap((b) => [text(b.label, "amber"), text(b.text), blank]),
            ...profile.facts.map(([k, v]) => text(`${k.padEnd(10)} ${v}`, "muted")),
          ],
        };
      }
      if (arg === "paper" || arg === "paper.pdf" || arg === "research") {
        return {
          lines: [
            text(paper.title, "mint"),
            text(`${paper.status}. ${paper.authors.join(", ")}`, "muted"),
            text(paper.venue, "muted"),
            blank,
            ...paper.plain.flatMap((p) => [text(p.label, "amber"), text(p.text), blank]),
            text(`keywords: ${paper.keywords.join(", ")}`, "muted"),
          ],
        };
      }
      if (arg === "email" || arg === "contact") {
        return { lines: [{ text: profile.email, href: `mailto:${profile.email}`, tone: "mint" }] };
      }
      if (arg === "resume" || arg === "resume.pdf") {
        return { lines: [err("resume.pdf: coming soon. email me and I will send it.")] };
      }
      return { lines: [err(`cat: ${rest.join(" ")}: no such file. try 'ls projects'`)] };
    }

    case "git": {
      const sub = rest[0]?.toLowerCase();
      if (sub === "log" || sub === "lg") {
        return {
          lines: timeline.flatMap((e) => [
            text(`${hash(e.org + e.title)}  ${e.period}`, "amber"),
            text(`        ${e.title} @ ${e.org}`),
          ]),
        };
      }
      if (sub === "status") {
        return { lines: [text("On branch main"), text("nothing to commit, portfolio clean.")] };
      }
      if (sub === "tag") {
        return { lines: achievements.map((a) => text(a)) };
      }
      if (sub === "commit") {
        return { lines: [text("[main] I build AI and software that people can actually use.", "mint")] };
      }
      return { lines: [err("git: only 'log', 'status', 'tag' and 'commit' work here")] };
    }

    case "npm":
      return { lines: [text("I build AI and ship software.", "mint")] };

    case "whoami":
      return { lines: [text("devyansh_agarwal, uid=2027, groups=plaksha,sadakvision")] };

    case "pwd":
      return { lines: [text("/home/devyansh/portfolio")] };

    case "date":
      return { lines: [text(new Date().toString())] };

    case "echo":
      return { lines: [text(rest.join(" "))] };

    case "neofetch":
      return {
        lines: [
          text("devyansh@plaksha", "mint"),
          text("----------------", "muted"),
          text(`role      ${profile.occupation}`),
          text(`org       ${profile.corporation}`),
          text(`status    ${profile.status}`),
          text(`school    ${profile.school}`),
          text(`location  ${profile.location}`),
          text(`projects  ${projects.length}`),
          text("paper     1, under review"),
          text(`shell     portfolio-sh (this one)`, "muted"),
        ],
      };

    case "contact":
      return {
        lines: [
          { text: `email     ${profile.email}`, href: `mailto:${profile.email}`, tone: "mint" },
          { text: "github    github.com/Devyansh99", href: profile.github, tone: "mint" },
          { text: "linkedin  linkedin.com/in/devyansh99", href: profile.linkedin, tone: "mint" },
          blank,
          text("or run: sudo connect devyansh", "muted"),
        ],
      };

    case "mail":
      return { lines: [text("opening your mail app...", "muted")], action: { type: "mail" } };

    case "sudo": {
      if (arg === "connect devyansh" || arg === "connect") {
        return {
          lines: [text("permission granted. opening your mail client...", "mint")],
          action: { type: "mail", subject: "sudo connect" },
        };
      }
      return { lines: [err("visitor is not in the sudoers file. this incident will be reported.")] };
    }

    case "rm":
      return { lines: [err("nice try. read-only filesystem.")] };

    case "history":
      return {
        lines: history.length
          ? history.map((h, i) => text(`${String(i + 1).padStart(3)}  ${h}`, "muted"))
          : [text("nothing yet")],
      };

    case "clear":
    case "cls":
      return { lines: [], action: { type: "clear" } };

    case "palette":
      return { lines: [], action: { type: "palette" } };

    case "exit":
    case "quit":
      return { lines: [], action: { type: "close" } };

    default:
      return { lines: [err(`${cmd}: command not found. type 'help'`)] };
  }
}

const argOptions: Record<string, string[]> = {
  ls: ["projects", "skills"],
  cd: tabNames,
  go: tabNames,
  open: ["github", "linkedin", "email", ...tabNames, ...projects.map((p) => p.id)],
  cat: ["skills", "about", "paper", "email", ...projects.map((p) => p.id)],
  git: ["log", "status", "tag"],
  sudo: ["connect devyansh"],
};

export function complete(value: string): string {
  const trimmed = value.replace(/^\s+/, "");
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    const hit = commandNames.filter((c) => c.startsWith(parts[0].toLowerCase()));
    return hit.length === 1 ? `${hit[0]} ` : value;
  }
  const options = argOptions[parts[0].toLowerCase()];
  if (!options) return value;
  const rest = parts.slice(1).join(" ").toLowerCase();
  const hit = options.filter((o) => o.startsWith(rest));
  return hit.length === 1 ? `${parts[0]} ${hit[0]}` : value;
}
