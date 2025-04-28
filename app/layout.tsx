import { GeistSans } from "geist/font/sans";
import logo from "./assets/logo.jpeg";
import Image from "next/image";
import bgImage from "./assets/bg1.jpeg";

import "./globals.css";
import Link from "next/link";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body
        className="bg-background text-foreground"
        style={{ backgroundImage: `url(${bgImage.src})` }}
      >
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
        <main className="min-h-screen flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col gap-10 items-center">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
              <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                {/* Logo with Link to Home */}
                <Link
                  href="/"
                  className="flex gap-5 items-center font-semibold"
                >
                  <div className="flex gap-5 items-center font-semibold">
                    <Image
                      src={logo}
                      alt="MailBrain Logo"
                      width={40}
                      height={40}
                      className="rounded-full cursor-pointer"
                    />
                    <span className="text-xl font-bold">MailBrain</span>
                  </div>
                </Link>{" "}
              </div>
            </nav>

            <div className="flex flex-col gap-15 max-w-5xl p-50">
              {children}
            </div>

            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
              <p>
                Powered by{" "}
                <a
                  href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
                >
                  Supabase & Cohere AI
                </a>
              </p>
            </footer>
          </div>
        </main>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
