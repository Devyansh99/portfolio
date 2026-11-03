import type { Metadata } from "next";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${inter.variable} ${jetbrains.variable} ${chakra.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-ink">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
