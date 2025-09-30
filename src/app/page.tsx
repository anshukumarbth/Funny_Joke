import { JokeGenerator } from '@/components/joke-generator';
import { getJoke } from '@/app/actions';
import { motion } from 'framer-motion';

export default async function Home() {
  // Fetch an initial joke for the first load.
  const initialJoke = await getJoke('Any');

  return (
    <main className="flex min-h-screen flex-col items-center bg-background dark:bg-black">
      <div className="w-full max-w-4xl p-4 md:p-8">
        <header className="text-center my-8 md:my-12">
          <h1 className="font-headline text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
            LaughTrack API
          </h1>
          <p className="mt-4 text-lg md:text-xl text-foreground/80">
            Your on-demand comedy engine. Select a category and let the AI do the rest!
          </p>
        </header>
        <JokeGenerator initialJoke={initialJoke} />
      </div>
    </main>
  );
}
