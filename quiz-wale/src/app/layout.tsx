
import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

// Import Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"], 
  display: "swap",
});

export const metadata: Metadata = {
  title: "QuizWale",
  description: "An interactive quiz platform to test your knowledge",
  creator: "SAMAR HIRAU",
  keywords: ["quiz", "knowledge", "test", "interactive", "learning"],
  openGraph: {
    title: "QuizWale",
    description: "An interactive quiz platform to test your knowledge",
    url: "https://quizwale.com",
    siteName: "QuizWale",
  
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
