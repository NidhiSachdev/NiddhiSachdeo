import type { Metadata } from "next";
import "./globals.css";
import ClientShell from "@/components/layout/ClientShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "Niddhi Sachdeo | Software Developer",
  description:
    "Software Developer specializing in Agentic AI, scalable app development, and AWS cloud deployment. Building intelligent systems that automate workflows.",
  keywords: [
    "Niddhi Sachdeo",
    "Software Developer",
    "Agentic AI",
    "AWS",
    "Java",
    "Python",
    "Cloud Computing",
    "Pune",
  ],
  authors: [{ name: "Niddhi Sachdeo" }],
  openGraph: {
    title: "Niddhi Sachdeo | Software Developer",
    description:
      "Software Developer specializing in Agentic AI and intelligent automation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var origError = console.error;
                console.error = function(){
                  if(arguments[0] && typeof arguments[0]==='string' && arguments[0].indexOf('hydrat')!==-1) return;
                  if(arguments[0] && typeof arguments[0]==='object' && arguments[0].message && arguments[0].message.indexOf && arguments[0].message.indexOf('hydrat')!==-1) return;
                  origError.apply(console, arguments);
                };
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <ClientShell>{children}</ClientShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
