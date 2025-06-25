import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { RTLProvider } from '@/components/rtl-provider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <RTLProvider>
        <div className="min-h-screen bg-background">
          {children}
        </div>
        <Toaster />
      </RTLProvider>
    </ThemeProvider>
  );
} 