import './globals.css';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { RTLProvider } from '@/components/rtl-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ScrollToTopButton } from '@/components/scroll-to-top-button';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const notoSansArabic = Noto_Sans_Arabic({ 
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Algerian Elegance - Traditional Modern Fashion',
  description: 'Discover our exquisite collection of traditional Algerian fashion designed for the modern woman. Free delivery across Algeria.',
  keywords: 'Algerian fashion, traditional clothing, modern fashion, women clothing, Algeria, traditional dress',
  authors: [{ name: 'Algerian Elegance' }],
  creator: 'Algerian Elegance',
  publisher: 'Algerian Elegance',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://algerian-elegance.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Algerian Elegance - Traditional Modern Fashion',
    description: 'Discover our exquisite collection of traditional Algerian fashion designed for the modern woman.',
    url: 'https://algerian-elegance.com',
    siteName: 'Algerian Elegance',
    images: [
      {
        url: '/logos/logo-light.png',
        width: 1200,
        height: 630,
        alt: 'Algerian Elegance Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Algerian Elegance - Traditional Modern Fashion',
    description: 'Discover our exquisite collection of traditional Algerian fashion designed for the modern woman.',
    images: ['/logos/logo-light.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logos/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/logos/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/logos/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body 
        className={`${inter.variable} ${notoSansArabic.variable} font-sans`} 
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <RTLProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>
                {children}
              </main>
              <Footer />
              <ScrollToTopButton />
            </div>
            <Toaster />
          </RTLProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}