'use client';

import Link from 'next/link';
import { ChefHat, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg font-headline">Slimme Koelkast Chef</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/favorites">
                <Heart className="mr-2 h-4 w-4" />
                Mijn Favorieten
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
