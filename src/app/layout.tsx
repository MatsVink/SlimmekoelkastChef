import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { FirebaseProvider } from '@/firebase';
import Navigation from '@/components/navigation';

export const metadata: Metadata = {
  title: 'Slimme Koelkast Chef',
  description: 'Genereer recepten op basis van de ingrediënten in je koelkast.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseProvider>
          <Navigation />
          {children}
        </FirebaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
