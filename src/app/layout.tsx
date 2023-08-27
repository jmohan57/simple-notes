import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simple Apps",
  description:
    "A simple apps web application, consists of three micro apps, one allows you to take notes and store them in the clouds, so that you can access them from anywhere and any device. Second one allows you to create simple kanban boards. Using the third app, you can test your knowledge on any topic, AI will generate the questions for you.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
}
