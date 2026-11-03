import { projectCodes } from "@/data/codes";
import { privateNote } from "@/data/copy";
import { paper } from "@/data/research";
import { profile } from "@/data/profile";
import { projects, type Project } from "@/data/projects";
import { skillGroups, skillUsage } from "@/data/skills";
import { achievements, timeline, type TimelineEntry } from "@/data/timeline";

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
  | { type: "go"; tab: TabName; sub?: string }
  | { type: "open"; url: string }
  | { type: "mail"; subject?: string }
  | { type: "clear" }
  | { type: "palette" }
  | { type: "close" }
  | { type: "matrix" }
  | { type: "theme"; name: string };

export type ShellResult = { lines: ShellLine[]; action?: ShellAction };

export type ShellContext = { history: string[]; cwd: string[] };

export const tabNames: TabName[] = [
  "start",
  "logs",
  "skills",
  "creations",
  "research",
  "about",
];

export const themeNames = ["mint", "amber", "ice", "rose"];

const text = (t: string, tone?: ShellLine["tone"]): ShellLine => ({ text: t, tone });
const blank: ShellLine = { text: "" };
const err = (t: string): ShellLine => ({ text: t, tone: "amber" });

/* ---------- virtual filesystem ---------- */

type FsFile = { kind: "file"; lines: ShellLine[]; meta?: string };
type FsDir = { kind: "dir"; children: Record<string, FsNode>; meta?: string };
type FsNode = FsFile | FsDir;

const file = (lines: ShellLine[], meta?: string): FsFile => ({ kind: "file", lines, meta });
const dir = (children: Record<string, FsNode>, meta?: string): FsDir => ({
  kind: "dir",
  children,
  meta,
});

function projectReadme(p: Project): ShellLine[] {
  return [
    text(`${p.title}  [${p.status}]  ${p.period}`, "mint"),
    text(p.kicker, "amber"),
    blank,
    text(p.what),
    blank,
    ...p.does.map((d) => text(`- ${d}`)),
    blank,
    text(`how: ${p.how}`),
  ];
}

const projectDirs: Record<string, FsNode> = Object.fromEntries(
  projects.map((p) => [
    p.id,
    dir(
      {
        "README.md": file(projectReadme(p), "what it is and how it works"),
        "stack.txt": file([text(p.stack.join(", "))], "tech used"),
        ...(p.metrics.length > 0
          ? {
              "numbers.txt": file(
                p.metrics.map((m) => text(`${m.value.padEnd(8)} ${m.label}`)),
                "the numbers",
              ),
            }
          : {}),
        "links.txt": file(
          p.links.length > 0
            ? p.links.map((l) => ({ text: `${l.label}  ${l.url}`, href: l.url, tone: "mint" as const }))
            : [text(privateNote, "muted")],
          "where to see it",
        ),
      },
      `[${projectCodes[p.id].toLowerCase()}] ${p.status.padEnd(11)} ${p.kicker}`,
    ),
  ]),
);

const slugOf = (e: TimelineEntry) =>
  `${e.org} ${e.kind === "education" ? e.period : ""}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function logLines(e: TimelineEntry): ShellLine[] {
  const out: ShellLine[] = [
    text(`${e.title} @ ${e.org}`, "mint"),
    text(e.period, "muted"),
    blank,
  ];
  if (e.summary) out.push(text(e.summary), blank);
  if (e.parts) {
    for (const p of e.parts) out.push(text(`+ ${p.label}`, "amber"), text(`  ${p.text}`), blank);
  }
  if (e.points) for (const p of e.points) out.push(text(`+ ${p}`));
  if (e.detail) out.push(text(e.detail));
  return out;
}

const logDir = dir(
  Object.fromEntries(
    timeline.map((e) => [
      `${slugOf(e)}.md`,
      file(logLines(e), `${e.period}  ${e.title}`),
    ]),
  ),
  `${timeline.length} entries`,
);

const skillDir = dir(
  Object.fromEntries(
    skillGroups.map((g) => [
      `${g.command.split(" ")[0]}.txt`,
      file(
        g.items.map((s) => {
          const used = skillUsage[s];
          return text(
            used
              ? `${s.padEnd(24)} used in ${used.length}: ${used.join(", ")}`
              : s,
          );
        }),
        `${g.items.length} skills`,
      ),
    ]),
  ),
  `${skillGroups.length} groups`,
);

const researchDir = dir(
  {
    "paper.pdf": file(
      [
        text(paper.title, "mint"),
        text(`${paper.status}. ${paper.authors.join(", ")}`, "muted"),
        text(paper.venue, "muted"),
        blank,
        ...paper.plain.flatMap((p) => [text(p.label, "amber"), text(p.text), blank]),
      ],
      "the paper in plain words",
    ),
    "abstract.txt": file([text(paper.abstract)], "the full abstract"),
    "keywords.txt": file([text(paper.keywords.join(", "))], "keywords"),
  },
  "1 paper, under review",
);

const aboutDir = dir(
  {
    "bio.md": file(
      profile.bio.flatMap((b) => [text(b.label, "amber"), text(b.text), blank]),
      "who I am",
    ),
    "facts.txt": file(
      profile.facts.map(([k, v]) => text(`${k.padEnd(10)} ${v}`)),
      "quick facts",
    ),
    "contact.txt": file(
      [
        { text: `email     ${profile.email}`, href: `mailto:${profile.email}`, tone: "mint" },
        { text: "github    github.com/Devyansh99", href: profile.github, tone: "mint" },
        { text: "linkedin  linkedin.com/in/devyansh99", href: profile.linkedin, tone: "mint" },
      ],
      "how to reach me",
    ),
  },
  "bio and contact",
);

const root = dir(
  {
    "README.md": file(
      [
        text(`${profile.name}. ${profile.occupation}, ${profile.corporation}.`, "mint"),
        text(profile.tagline),
        blank,
        text("this site is a shell. start with: tree, ls, cd creations, help"),
      ],
      "start here",
    ),
    creations: dir(projectDirs, `${projects.length} projects`),
    logs: logDir,
    skills: skillDir,
    research: researchDir,
    about: aboutDir,
  },
  "home",
);

const aliases: Record<string, string> = {
  home: "",
  projects: "creations",
  project: "creations",
  beginning: "",
  start: "",
  log: "logs",
  experience: "logs",
  skill: "skills",
  paper: "research",
  bio: "about",
};

function lookup(d: FsDir, seg: string, inCreations: boolean): string | undefined {
  const lower = seg.toLowerCase();
  const keys = Object.keys(d.children);
  const exact = keys.find((k) => k.toLowerCase() === lower);
  if (exact) return exact;
  const noExt = keys.find((k) => k.toLowerCase().replace(/\.[a-z]+$/, "") === lower);
  if (noExt) return noExt;
  if (inCreations) {
    const p = projects.find(
      (x) => x.title.toLowerCase() === lower || projectCodes[x.id].toLowerCase() === lower,
    );
    if (p) return p.id;
  }
  return undefined;
}

export function nodeAt(path: string[]): FsNode | undefined {
  let n: FsNode = root;
  for (const seg of path) {
    if (n.kind !== "dir") return undefined;
    const next: FsNode | undefined = n.children[seg];
    if (!next) return undefined;
    n = next;
  }
  return n;
}

function resolve(cwd: string[], target: string): string[] | null {
  const t = target.trim();
  const absolute = t.startsWith("/") || t.startsWith("~");
  const out = absolute ? [] : [...cwd];
  const segs = t.replace(/^(~|\/)/, "").split("/").filter(Boolean);
  for (const seg of segs) {
    if (seg === ".") continue;
    if (seg === "..") {
      out.pop();
      continue;
    }
    const n = nodeAt(out);
    if (!n || n.kind !== "dir") return null;
    const key = lookup(n, seg, out.join("/") === "creations");
    if (!key) {
      if (out.length === 0 && seg.toLowerCase() in aliases) {
        const a = aliases[seg.toLowerCase()];
        if (a) out.push(a);
        continue;
      }
      return null;
    }
    out.push(key);
  }
  return out;
}

export const pathLabel = (cwd: string[]) => `~${cwd.length ? "/" + cwd.join("/") : ""}`;

function tabFor(path: string[]): { tab: TabName; sub?: string } {
  const first = path[0];
  if (!first) return { tab: "start" };
  const tab = (tabNames as string[]).includes(first) ? (first as TabName) : "start";
  const sub = tab === "creations" && path[1] ? path[1] : undefined;
  return { tab, sub };
}

function walk(
  node: FsNode,
  path: string[],
  visit: (p: string[], n: FsNode) => void,
) {
  visit(path, node);
  if (node.kind === "dir") {
    for (const [k, c] of Object.entries(node.children)) walk(c, [...path, k], visit);
  }
}

function treeLines(node: FsDir, prefix = "", depth = 0): string[] {
  const entries = Object.entries(node.children);
  const out: string[] = [];
  entries.forEach(([name, child], i) => {
    const last = i === entries.length - 1;
    out.push(`${prefix}${last ? "└── " : "├── "}${name}${child.kind === "dir" ? "/" : ""}`);
    if (child.kind === "dir" && depth < 2) {
      out.push(...treeLines(child, prefix + (last ? "    " : "│   "), depth + 1));
    }
  });
  return out;
}

/* ---------- command reference ---------- */

export type CommandDoc = {
  cmd: string;
  run: string;
  desc: string;
};

export const commandGroups: { title: string; items: CommandDoc[] }[] = [
  {
    title: "move around",
    items: [
      { cmd: "ls", run: "ls", desc: "list what is in this folder" },
      { cmd: "cd <folder>", run: "cd creations", desc: "go into a folder (also switches the tab)" },
      { cmd: "cd ..", run: "cd ..", desc: "go up one folder" },
      { cmd: "pwd", run: "pwd", desc: "show where you are" },
      { cmd: "tree", run: "tree", desc: "draw the whole site as a tree" },
      { cmd: "cat <file>", run: "cat README.md", desc: "read a file" },
    ],
  },
  {
    title: "find things",
    items: [
      { cmd: "grep <word>", run: "grep pytorch", desc: "search every file for a word" },
      { cmd: "find <word>", run: "find vision", desc: "search file and folder names" },
      { cmd: "which <name>", run: "which higan", desc: "show where something lives" },
      { cmd: "skills", run: "skills", desc: "list skill groups" },
      { cmd: "skills --used-in <project>", run: "skills --used-in higan", desc: "skills behind one project" },
      { cmd: "skills <skill>", run: "skills python", desc: "projects that use a skill" },
    ],
  },
  {
    title: "about me",
    items: [
      { cmd: "git log", run: "git log", desc: "experience and school, newest first" },
      { cmd: "git tag", run: "git tag", desc: "awards and courses" },
      { cmd: "neofetch", run: "neofetch", desc: "a quick summary card" },
      { cmd: "whoami", run: "whoami", desc: "who is this" },
      { cmd: "contact", run: "contact", desc: "all the ways to reach me" },
      { cmd: "sudo connect devyansh", run: "sudo connect devyansh", desc: "write me an email" },
      { cmd: "open github", run: "open github", desc: "open github or linkedin" },
      { cmd: "link [project]", run: "link sadakvision", desc: "a shareable link to this page or project" },
    ],
  },
  {
    title: "just for fun",
    items: [
      { cmd: "fortune", run: "fortune", desc: "a random line" },
      { cmd: "cowsay <text>", run: "cowsay hire devyansh", desc: "a cow says it" },
      { cmd: "ping devyansh", run: "ping devyansh", desc: "check if I am reachable" },
      { cmd: "ssh devyansh@plaksha", run: "ssh devyansh@plaksha", desc: "log in (kind of)" },
      { cmd: "matrix", run: "matrix", desc: "green rain over the page" },
      { cmd: "theme <name>", run: "theme amber", desc: "change colour: mint, amber, ice, rose" },
      { cmd: "konami", run: "konami", desc: "a hint about a hidden thing" },
    ],
  },
  {
    title: "the shell",
    items: [
      { cmd: "help [command]", run: "help", desc: "short help, or help for one command" },
      { cmd: "history", run: "history", desc: "commands you ran before" },
      { cmd: "clear", run: "clear", desc: "empty the output" },
      { cmd: "palette", run: "palette", desc: "open the old command palette (Ctrl+K)" },
      { cmd: "exit", run: "exit", desc: "close the output panel" },
    ],
  },
];

export const commandNames = [
  "help",
  "ls",
  "cd",
  "pwd",
  "tree",
  "cat",
  "grep",
  "find",
  "which",
  "skills",
  "git",
  "open",
  "link",
  "whoami",
  "neofetch",
  "contact",
  "sudo",
  "fortune",
  "cowsay",
  "ping",
  "ssh",
  "matrix",
  "theme",
  "konami",
  "history",
  "clear",
  "palette",
  "exit",
];

const flat = commandGroups.flatMap((g) => g.items);

function helpFor(name: string): ShellLine[] {
  const hits = flat.filter((c) => c.cmd.split(" ")[0] === name);
  if (hits.length === 0) return [err(`help: no help for '${name}'`)];
  return hits.flatMap((c) => [
    text(c.cmd, "mint"),
    text(`  ${c.desc}`),
    text(`  try: ${c.run}`, "muted"),
  ]);
}

const helpLines: ShellLine[] = [
  ...commandGroups.flatMap((g) => [
    text(g.title, "amber"),
    ...g.items.map((c) => text(`  ${c.cmd.padEnd(28)} ${c.desc}`)),
    blank,
  ]),
  text("tab completes, arrow up repeats, / focuses the prompt. press [commands] for a clickable list.", "muted"),
];

/* ---------- commands ---------- */

const fortunes = [
  "A pothole you can see is a pothole you can fix.",
  "The model is one part. The data and the people are the rest.",
  "Phones that stay cool write better data.",
  "Don't watch the road all the time. Watch when it matters.",
  "It works on my machine, and also on yours.",
  "Ship it, then make it better.",
  "There are 10 kinds of people. Those who read binary and those who don't.",
];

const themes: Record<string, string> = {
  mint: "mint (default)",
  amber: "amber",
  ice: "ice",
  rose: "rose",
};

function cow(msg: string): ShellLine[] {
  const m = msg.slice(0, 44) || "moo";
  const bar = "-".repeat(m.length + 2);
  return [
    text(` ${"_".repeat(m.length + 2)}`),
    text(`< ${m} >`),
    text(` ${bar}`),
    text("        \\   ^__^"),
    text("         \\  (oo)\\_______"),
    text("            (__)\\       )\\/\\"),
    text("                ||----w |"),
    text("                ||     ||"),
  ];
}

function searchHits(q: string): { path: string; line: string }[] {
  const needle = q.toLowerCase();
  const hits: { path: string; line: string }[] = [];
  walk(root, [], (p, n) => {
    if (n.kind !== "file") return;
    for (const l of n.lines) {
      if (l.text && l.text.toLowerCase().includes(needle)) {
        hits.push({ path: `~/${p.join("/")}`, line: l.text.trim().replace(/\s+/g, " ") });
      }
    }
  });
  return hits;
}

function skillQuery(arg: string): ShellLine[] {
  if (!arg) {
    return skillGroups.map((g) =>
      text(`${g.command.split(" ")[0].padEnd(11)} ${g.items.join(", ")}`),
    );
  }
  if (arg.startsWith("--used-in")) {
    const q = arg.replace("--used-in", "").trim();
    const p = projects.find(
      (x) =>
        x.id === q ||
        x.title.toLowerCase() === q ||
        projectCodes[x.id].toLowerCase() === q,
    );
    if (!p) return [err(`skills: unknown project '${q}'. try 'ls creations'`)];
    const used = skillGroups
      .flatMap((g) => g.items)
      .filter((s) => skillUsage[s]?.includes(p.id));
    return [
      text(`${p.title} uses ${used.length} skills`, "mint"),
      text(used.join(", ")),
    ];
  }
  const skill = skillGroups
    .flatMap((g) => g.items)
    .find((s) => s.toLowerCase() === arg || s.toLowerCase().startsWith(arg));
  if (!skill) return [err(`skills: '${arg}' not found. try 'skills' for the list`)];
  const used = skillUsage[skill];
  if (!used) {
    return [text(`${skill}: comfortable with it, not tied to a project here yet.`)];
  }
  return [
    text(`${skill} is used in ${used.length}`, "mint"),
    ...used.map((id) => text(`  ${projects.find((p) => p.id === id)?.title ?? id}`)),
  ];
}

export function run(raw: string, ctx: ShellContext): ShellResult {
  const input = raw.trim();
  if (!input) return { lines: [] };
  const parts = input.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const rest = parts.slice(1);
  const arg = rest.join(" ").toLowerCase();
  const args = rest.filter((a) => !a.startsWith("-") || a === "--used-in");
  const target = args.join(" ");
  const { cwd, history } = ctx;

  switch (cmd) {
    case "help":
    case "?":
      return { lines: arg ? helpFor(arg) : helpLines };

    case "pwd":
      return { lines: [text(pathLabel(cwd))] };

    case "ls":
    case "dir": {
      const path = target ? resolve(cwd, target) : cwd;
      const n = path ? nodeAt(path) : undefined;
      if (!path || !n) return { lines: [err(`ls: cannot access '${target}': no such file or folder`)] };
      if (n.kind === "file") return { lines: [text(path[path.length - 1])] };
      return {
        lines: Object.entries(n.children).map(([name, c]) => ({
          text: `${(name + (c.kind === "dir" ? "/" : "")).padEnd(22)} ${c.meta ?? ""}`.trimEnd(),
          tone: c.kind === "dir" ? ("mint" as const) : undefined,
        })),
      };
    }

    case "cd":
    case "go":
    case "goto": {
      const path = resolve(cwd, target || "~");
      const n = path ? nodeAt(path) : undefined;
      if (!path || !n) return { lines: [err(`cd: ${target}: no such folder. try 'ls'`)] };
      if (n.kind !== "dir") return { lines: [err(`cd: ${target}: not a folder. try 'cat ${target}'`)] };
      const dest = tabFor(path);
      return {
        lines: [text(`-> ${pathLabel(path)}`, "muted")],
        action: { type: "go", ...dest },
      };
    }

    case "tree": {
      const path = target ? resolve(cwd, target) : cwd;
      const n = path ? nodeAt(path) : undefined;
      if (!path || !n || n.kind !== "dir") return { lines: [err(`tree: ${target || "."}: not a folder`)] };
      return {
        lines: [text(pathLabel(path), "mint"), ...treeLines(n).map((l) => text(l))],
      };
    }

    case "cat":
    case "less":
    case "more": {
      if (!target) return { lines: [err("cat: which file? try 'ls' first")] };
      const path = resolve(cwd, target);
      const n = path ? nodeAt(path) : undefined;
      if (path && n) {
        if (n.kind === "dir") return { lines: [err(`cat: ${target}: is a folder. try 'cd ${target}' or 'ls ${target}'`)] };
        return { lines: n.lines };
      }
      const p = projects.find(
        (x) =>
          x.id === arg ||
          x.title.toLowerCase() === arg ||
          projectCodes[x.id].toLowerCase() === arg,
      );
      if (p) return { lines: projectReadme(p) };
      if (arg === "skills") return { lines: skillQuery("") };
      if (arg === "about" || arg === "bio") {
        return { lines: (aboutDir.children["bio.md"] as FsFile).lines };
      }
      if (arg === "paper" || arg === "research") {
        return { lines: (researchDir.children["paper.pdf"] as FsFile).lines };
      }
      if (arg === "email") {
        return { lines: [{ text: profile.email, href: `mailto:${profile.email}`, tone: "mint" }] };
      }
      return { lines: [err(`cat: ${target}: no such file. try 'ls'`)] };
    }

    case "grep": {
      if (!target) return { lines: [err("grep: search for what? try 'grep pytorch'")] };
      const hits = searchHits(target);
      if (hits.length === 0) return { lines: [text(`no matches for '${target}'`, "muted")] };
      const shown = hits.slice(0, 12);
      return {
        lines: [
          text(`${hits.length} matches for '${target}'`, "mint"),
          ...shown.map((h) => text(`${h.path}: ${h.line.slice(0, 100)}${h.line.length > 100 ? "..." : ""}`)),
          ...(hits.length > shown.length
            ? [text(`... and ${hits.length - shown.length} more. try a longer word.`, "muted")]
            : []),
        ],
      };
    }

    case "find": {
      if (!target) return { lines: [err("find: find what? try 'find vision'")] };
      const needle = target.toLowerCase();
      const out: ShellLine[] = [];
      walk(root, [], (p, n) => {
        const name = p[p.length - 1];
        if (name && name.toLowerCase().includes(needle)) {
          out.push({ text: `~/${p.join("/")}${n.kind === "dir" ? "/" : ""}`, tone: n.kind === "dir" ? "mint" : undefined });
        }
      });
      return { lines: out.length ? out : [text(`nothing named '${target}'`, "muted")] };
    }

    case "which": {
      if (!target) return { lines: [err("which: which what?")] };
      if (commandNames.includes(arg)) return { lines: [text(`${arg}: shell builtin`)] };
      const path = resolve([], target) ?? resolve(["creations"], target);
      const n = path ? nodeAt(path) : undefined;
      if (path && n) return { lines: [text(pathLabel(path))] };
      return { lines: [err(`which: ${target} not found`)] };
    }

    case "skills":
      return { lines: skillQuery(arg) };

    case "git": {
      const sub = rest[0]?.toLowerCase();
      if (sub === "log" || sub === "lg") {
        return {
          lines: timeline.flatMap((e) => [
            text(`${e.period}`, "amber"),
            text(`   ${e.title} @ ${e.org}`),
          ]),
        };
      }
      if (sub === "status") {
        return { lines: [text("On branch main"), text("nothing to commit, portfolio clean.")] };
      }
      if (sub === "tag") return { lines: achievements.map((a) => text(a)) };
      if (sub === "commit") {
        return { lines: [text("[main] I build AI and software that people can actually use.", "mint")] };
      }
      return { lines: [err("git: only 'log', 'status', 'tag' and 'commit' work here")] };
    }

    case "open": {
      if (!target) return { lines: [err("open: open what? try 'open github'")] };
      if (arg === "github") return { lines: [text("opening github...", "muted")], action: { type: "open", url: profile.github } };
      if (arg === "linkedin") return { lines: [text("opening linkedin...", "muted")], action: { type: "open", url: profile.linkedin } };
      if (arg === "email" || arg === "mail") return { lines: [text("opening your mail app...", "muted")], action: { type: "mail" } };
      const path = resolve(cwd, target);
      const n = path ? nodeAt(path) : undefined;
      if (path && n) {
        const dest = tabFor(n.kind === "dir" ? path : path.slice(0, -1));
        return { lines: [text(`-> ${pathLabel(path)}`, "muted")], action: { type: "go", ...dest } };
      }
      return { lines: [err(`open: ${target}: not found`)] };
    }

    case "link": {
      const base = `${window.location.origin}/#`;
      let hash = "";
      if (target) {
        const path = resolve(cwd, target);
        const n = path ? nodeAt(path) : undefined;
        if (!path || !n) return { lines: [err(`link: ${target}: not found`)] };
        const d = tabFor(n.kind === "dir" ? path : path.slice(0, -1));
        hash = d.tab === "start" ? "" : d.sub ? `${d.tab}/${d.sub}` : d.tab;
      } else {
        const d = tabFor(cwd);
        hash = d.tab === "start" ? "" : d.sub ? `${d.tab}/${d.sub}` : d.tab;
      }
      const url = `${base}${hash}`;
      return { lines: [{ text: url, href: url, tone: "mint" }, text("copy it and share.", "muted")] };
    }

    case "whoami":
      return { lines: [text("devyansh_agarwal, uid=2027, groups=plaksha,sadakvision")] };

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
          text("shell     portfolio-sh (this one)", "muted"),
        ],
      };

    case "contact":
      return {
        lines: [
          ...(aboutDir.children["contact.txt"] as FsFile).lines,
          blank,
          text("or run: sudo connect devyansh", "muted"),
        ],
      };

    case "sudo": {
      if (arg === "connect devyansh" || arg === "connect") {
        return {
          lines: [text("permission granted. opening your mail client...", "mint")],
          action: { type: "mail", subject: "sudo connect" },
        };
      }
      return { lines: [err("visitor is not in the sudoers file. this incident will be reported.")] };
    }

    case "fortune":
      return { lines: [text(fortunes[Math.floor(Math.random() * fortunes.length)], "amber")] };

    case "cowsay":
      return { lines: cow(rest.join(" ")) };

    case "ping": {
      if (!arg.startsWith("devyansh")) return { lines: [err(`ping: ${arg || "?"}: unknown host. try 'ping devyansh'`)] };
      return {
        lines: [
          text("PING devyansh.plaksha (127.0.0.1): 56 data bytes"),
          text("64 bytes from devyansh: icmp_seq=0 ttl=64 time=0.4 ms"),
          text("64 bytes from devyansh: icmp_seq=1 ttl=64 time=0.3 ms"),
          text("64 bytes from devyansh: icmp_seq=2 ttl=64 time=0.4 ms"),
          blank,
          text("3 packets sent, 3 received, 0% packet loss", "mint"),
          text(`best way to get a reply: ${profile.email}`, "muted"),
        ],
      };
    }

    case "ssh":
      return {
        lines: [
          text("Connecting to plaksha.devyansh ..."),
          text("Authenticating with public key ... ok"),
          text("Welcome, visitor. Last login: just now", "mint"),
          blank,
          text("this server only speaks email. try: sudo connect devyansh", "amber"),
        ],
      };

    case "matrix":
      return { lines: [text("wake up, visitor...", "mint")], action: { type: "matrix" } };

    case "theme": {
      if (!arg) {
        return {
          lines: [
            text("themes:", "amber"),
            ...Object.values(themes).map((t) => text(`  ${t}`)),
            text("use: theme <name>", "muted"),
          ],
        };
      }
      if (!(arg in themes)) return { lines: [err(`theme: unknown '${arg}'. try: ${themeNames.join(", ")}`)] };
      return { lines: [text(`theme set to ${arg}`, "mint")], action: { type: "theme", name: arg } };
    }

    case "konami":
      return { lines: [text("up up down down left right left right b a", "amber"), text("press them on the page, not here.", "muted")] };

    case "rm":
      return { lines: [err("nice try. read-only filesystem.")] };

    case "history":
      return {
        lines: history.length
          ? history.slice(-30).map((h, i) => text(`${String(i + 1).padStart(3)}  ${h}`, "muted"))
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

    case "npm":
      return { lines: [text("I build AI and ship software.", "mint")] };

    default:
      return { lines: [err(`${cmd}: command not found. type 'help'`)] };
  }
}

/* ---------- completion and suggestions ---------- */

const pathCommands = ["cd", "ls", "cat", "open", "tree", "link", "less", "more"];

const argOptions: Record<string, string[]> = {
  git: ["log", "status", "tag"],
  theme: themeNames,
  skills: ["--used-in"],
  sudo: ["connect devyansh"],
  help: commandNames,
  ping: ["devyansh"],
  ssh: ["devyansh@plaksha"],
};

function commonPrefix(a: string[]) {
  let p = a[0];
  for (const s of a) while (!s.toLowerCase().startsWith(p.toLowerCase())) p = p.slice(0, -1);
  return p;
}

export function complete(value: string, cwd: string[]): string {
  const lead = value.match(/^\s*/)?.[0] ?? "";
  const body = value.slice(lead.length);
  const parts = body.split(/\s+/);
  if (parts.length === 1) {
    const hit = commandNames.filter((c) => c.startsWith(parts[0].toLowerCase()));
    if (hit.length === 1) return `${lead}${hit[0]} `;
    if (hit.length > 1) return `${lead}${commonPrefix(hit)}`;
    return value;
  }
  const c = parts[0].toLowerCase();
  const last = parts[parts.length - 1];
  const head = `${lead}${parts.slice(0, -1).join(" ")} `;

  if (pathCommands.includes(c)) {
    const cut = last.lastIndexOf("/");
    const parentTxt = cut >= 0 ? last.slice(0, cut + 1) : "";
    const prefix = cut >= 0 ? last.slice(cut + 1) : last;
    const parent = parentTxt ? resolve(cwd, parentTxt) : cwd;
    const n = parent ? nodeAt(parent) : undefined;
    if (!n || n.kind !== "dir") return value;
    const names = Object.entries(n.children).map(([k, v]) => k + (v.kind === "dir" ? "/" : ""));
    const hit = names.filter((k) => k.toLowerCase().startsWith(prefix.toLowerCase()));
    if (hit.length === 0) return value;
    const done = hit.length === 1 ? hit[0] : commonPrefix(hit);
    return `${head}${parentTxt}${done}`;
  }
  const options = argOptions[c];
  if (!options) return value;
  const typed = parts.slice(1).join(" ").toLowerCase();
  const hit = options.filter((o) => o.startsWith(typed));
  if (hit.length === 0) return value;
  return `${lead}${parts[0]} ${hit.length === 1 ? hit[0] : commonPrefix(hit)}`;
}

export function suggestions(cwd: string[]): string[] {
  if (cwd.length === 0) return ["help", "tree", "ls", "cd creations", "cat sadakvision", "git log", "contact"];
  if (cwd[0] === "creations" && cwd.length === 1) return ["ls", "cd sadakvision", "cat higan", "cd ..", "help"];
  if (cwd[0] === "creations") return ["ls", "cat README.md", "cat stack.txt", "cat links.txt", "cd .."];
  if (cwd[0] === "logs") return ["ls", "cat sadakvision", "git log", "cd .."];
  if (cwd[0] === "skills") return ["ls", "cat languages", "skills python", "cd .."];
  if (cwd[0] === "research") return ["ls", "cat paper.pdf", "cat keywords", "cd .."];
  return ["ls", "cat bio.md", "contact", "sudo connect devyansh", "cd .."];
}

export function validSub(sub: string | undefined): string | undefined {
  if (!sub) return undefined;
  const key = sub.toLowerCase();
  return projects.find((p) => p.id === key)?.id;
}
