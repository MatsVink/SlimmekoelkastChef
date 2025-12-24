import Image from 'next/image';
import { ChefHat } from 'lucide-react';
import RecipeGenerator from '@/components/recipe-generator';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'kitchen-hero');

  return (
    <main className="bg-background text-foreground">
      <div className="relative">
        {heroImage && (
          <div className="absolute inset-0 h-[50vh]">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="w-full h-full object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
          </div>
        )}
        <div className="relative min-h-[50vh] flex flex-col items-center justify-center p-4 pt-24 text-center">
          <ChefHat className="h-16 w-16 text-primary mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
            Slimme Koelkast Chef
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl">
            Geen inspiratie? Geen probleem. Vertel ons wat je in huis hebt en
            wij bedenken de lekkerste recepten.
          </p>
        </div>
        <div className="w-full max-w-2xl mx-auto px-4 pb-12 -mt-12 md:-mt-16">
          <RecipeGenerator />
        </div>
      </div>
    </main>
  );
}
