import './globals.css';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { RTLProvider } from '@/components/rtl-provider';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { ServiceWorkerRegister } from '@/components/service-worker-register';
import { PWAInstallPrompt } from '@/components/pwa-install-prompt';
import { PWAStatus } from '@/components/pwa-status';

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
  title: 'Loudim Brands - Premium Fashion Collection',
  description: 'Discover our premium collection of fashion brands including Loudim and Loud Styles. Quality clothing for the modern lifestyle.',
  keywords: 'Loudim, Loud Styles, fashion, clothing, premium brands, modern fashion',
  authors: [{ name: 'Loudim Brands' }],
  creator: 'Loudim Brands',
  publisher: 'Loudim Brands',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://loudim-brands.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Loudim Brands - Premium Fashion Collection',
    description: 'Discover our premium collection of fashion brands including Loudim and Loud Styles.',
    url: 'https://loudim-brands.com',
    siteName: 'Loudim Brands',
    images: [
      {
        url: '/logos/logo-light.png',
        width: 1200,
        height: 630,
        alt: 'Loudim Brands Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loudim Brands - Premium Fashion Collection',
    description: 'Discover our premium collection of fashion brands including Loudim and Loud Styles.',
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
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Toaster />
            <PWAInstallPrompt />
            <PWAStatus />
          </RTLProvider>
        </ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}