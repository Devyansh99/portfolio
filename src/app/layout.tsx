import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devyansh Agarwal, AI engineer",
  description:
    "Devyansh Agarwal is an AI engineer and CS & AI student at Plaksha University. Projects, research and experience.",
  openGraph: {
    title: "Devyansh Agarwal, AI engineer",
    description:
      "AI engineer and CS & AI student at Plaksha University. Projects, research and experience.",
    type: "website",
    siteName: "Devyansh Agarwal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devyansh Agarwal, AI engineer",
    description:
      "AI engineer and CS & AI student at Plaksha University. Projects, research and experience.",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Devyansh Agarwal",
  jobTitle: "AI Engineer",
  email: "mailto:devyanshag@gmail.com",
  affiliation: { "@type": "CollegeOrUniversity", name: "Plaksha University" },
  sameAs: [
    "https://github.com/Devyansh99",
    "https://www.linkedin.com/in/devyansh99/",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-ink">
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=location.hash.slice(1);document.documentElement.setAttribute("data-tab",["start","logs","skills","creations","research","about"].indexOf(t)>-1?t:"start")}catch(e){}',
          }}
        />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
