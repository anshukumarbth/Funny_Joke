'use client';

import type { JokeAndImageOutput } from '@/ai/flows/generate-joke-and-image';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type JokeCardProps = {
  joke: JokeAndImageOutput;
};

export function JokeCard({ joke }: JokeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isOneLiner = joke.joke_type === 'OneLiner';
  const showPunchline = isOneLiner || isHovered;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const punchlineVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={cardVariants}>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full overflow-hidden shadow-2xl shadow-primary/10 transition-shadow duration-300 hover:shadow-primary/20"
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold text-primary">{joke.category}</CardTitle>
            <Badge className="capitalize">{joke.joke_type}</Badge>
          </div>
        </CardHeader>
        <CardContent className="min-h-[120px] text-lg space-y-4">
          <div>
            {joke.joke.setup && <p className="text-foreground/80">{joke.joke.setup}</p>}
            <AnimatePresence mode="wait">
              {showPunchline ? (
                <motion.p
                  key="punchline-en"
                  className="font-semibold text-foreground mt-2"
                  variants={punchlineVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {joke.joke.punchline}
                </motion.p>
              ) : (
                <motion.div
                  key="reveal-en"
                  variants={punchlineVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="mt-4"
                >
                  <p className="text-center text-muted-foreground italic text-sm">Hover to reveal punchline</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className='pt-2'>
            {joke.hindi_joke.setup && <p className="text-foreground/80">{joke.hindi_joke.setup}</p>}
             <AnimatePresence mode="wait">
              {showPunchline ? (
                <motion.p
                  key="punchline-hi"
                  className="font-semibold text-foreground mt-2"
                  variants={punchlineVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {joke.hindi_joke.punchline}
                </motion.p>
              ) : (
                ''
              )}
            </AnimatePresence>
          </div>
        </CardContent>
        <CardFooter>
          <CardDescription className="text-xs font-mono">{joke.joke_id}</CardDescription>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
