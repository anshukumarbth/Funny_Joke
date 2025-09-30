'use client';

import { getJoke, type JokeResult } from '@/app/actions';
import { Icons } from '@/components/icons';
import { JokeCard } from '@/components/joke-card';
import { JokeCardSkeleton } from '@/components/joke-card-skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition } from 'react';

const JOKE_CATEGORIES = ['Any', 'Workplace', 'Tech', 'Animals', 'Dad Jokes', 'Science'];

type JokeGeneratorProps = {
  initialJoke: JokeResult;
};

export function JokeGenerator({ initialJoke }: JokeGeneratorProps) {
  const [jokeResult, setJokeResult] = useState<JokeResult>(initialJoke);
  const [selectedCategory, setSelectedCategory] = useState<string>(JOKE_CATEGORIES[0]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerateJoke = () => {
    startTransition(async () => {
      const result = await getJoke(selectedCategory);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error Generating Joke',
          description: result.error,
        });
      }
      setJokeResult(result);
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="w-full max-w-md bg-card p-4 rounded-lg border shadow-md flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full sm:w-auto flex-grow">
          <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isPending}>
            <SelectTrigger id="category-select" aria-label="Select joke category">
              <SelectValue placeholder="Select a category..." />
            </SelectTrigger>
            <SelectContent>
              {JOKE_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleGenerateJoke}
          disabled={isPending}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          size="lg"
        >
          {isPending ? (
            <>
              <Icons.Loader className="mr-2 h-4 w-4 animate-spin" />
              Conjuring...
            </>
          ) : (
            <>
              <Icons.Wand className="mr-2 h-4 w-4" />
              Generate Joke
            </>
          )}
        </Button>
      </div>

      <div className="w-full max-w-2xl">
        {isPending ? (
          <JokeCardSkeleton />
        ) : jokeResult.data ? (
          <JokeCard joke={jokeResult.data} />
        ) : (
          <div className="text-center text-destructive-foreground bg-destructive p-4 rounded-lg">
            <p className="font-bold">Something went wrong!</p>
            <p>{jokeResult.error || 'Could not load a joke. Please try again.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
