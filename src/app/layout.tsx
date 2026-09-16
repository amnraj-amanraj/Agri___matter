import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthGate } from '@/components/AuthGate';
import { LanguageWelcomeModal } from '@/components/LanguageWelcomeModal';

export const metadata: Metadata = {
  title: 'Agrimatter - Kisan Decision Support App',
  description: 'Simple, mobile-first agricultural decision support for small and marginal farmers in India.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <LanguageWelcomeModal />
              <Navbar />
              <AuthGate />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12">
                {children}
              </main>
              <Footer />
              <BottomNav />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
