import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--f-display",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--f-mono",
  subsets: ["latin"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--f-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Devyansh Agarwal, AI engineer",
  description:
    "Devyansh Agarwal is an AI engineer and CS & AI student at Plaksha University. Projects, research and experience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="relative min-h-full bg-bg font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
