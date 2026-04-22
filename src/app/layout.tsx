import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gelap.my.id'),
  title: "JeanRendy | Portfolio",
  description: "Hybrid Designer",
  icons: {
    icon: [
      { url: '/assets/favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/jrslogowhite (1).ico', type: 'image/x-icon' }, // fallback for older browsers
    ],
    apple: '/assets/favicon.svg',
  },
  openGraph: {
    images: ['/assets/meta-image.jpeg'],
  },
  twitter: {
    card: "summary_large_image",
    images: ['/assets/meta-image.jpeg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark snap-y snap-mandatory scroll-smooth no-scrollbar" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollToTop />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
