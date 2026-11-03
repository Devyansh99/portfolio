import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
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
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="scanlines min-h-full flex flex-col bg-bg text-ink">
        {children}
      </body>
    </html>
  );
}
