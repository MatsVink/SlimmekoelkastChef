import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Utensils } from 'lucide-react';

type RecipeDisplayProps = {
  recipes: string;
};

export default function RecipeDisplay({ recipes }: RecipeDisplayProps) {
  return (
    <Card className="shadow-xl border animate-in fade-in-50 duration-500">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Utensils className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-2xl">
            Recept Ideeën
          </CardTitle>
        </div>
        <CardDescription>
          Hier zijn een paar suggesties van onze chef.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-foreground">
          <p style={{ whiteSpace: 'pre-wrap' }}>{recipes}</p>
        </div>
      </CardContent>
    </Card>
  );
}
