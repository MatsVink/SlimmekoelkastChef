import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
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
      <head>
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseClientProvider>
          <Navigation />
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
