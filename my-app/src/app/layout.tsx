import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FileSearch, ArrowLeft } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATS Resume Analyzer",
  description: "ATS Resume Analyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}
      >
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSearch className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="cursor-pointer">ATS Resume Analyzer</h1>
                  <p className="text-sm text-muted-foreground">
                    Optimize your resume for Applicant Tracking Systems
                  </p>
                </div>
              </div>
              {/** Add  Profile button here ..... Future feature */}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 flex-1">{children}</main>

        <footer className="border-t bg-card mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>
                © 2024 ATS Resume Analyzer. Help candidates optimize their
                resumes for better job matches.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
