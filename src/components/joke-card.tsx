'use client';

import type { JokeAndImageOutput } from '@/ai/flows/generate-joke-and-image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type JokeCardProps = {
  joke: JokeAndImageOutput;
};

export function JokeCard({ joke }: JokeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const placeholderImage = PlaceHolderImages.find(img => img.id === 'joke-card-placeholder');

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
        <div className="aspect-video w-full relative overflow-hidden">
          <Image
            src={placeholderImage?.imageUrl || 'https://picsum.photos/seed/laugh/1200/600'}
            alt={joke.image.image_prompt}
            data-ai-hint={joke.image.style_hint}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 right-4">
            <Badge variant="secondary" className="text-xs">
              Art Style: {joke.image.style_hint}
            </Badge>
          </div>
        </div>

        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold text-primary">{joke.category}</CardTitle>
            <Badge className="capitalize">{joke.joke_type}</Badge>
          </div>
        </CardHeader>
        <CardContent className="min-h-[100px] text-lg">
          {joke.joke.setup && <p className="text-foreground/80">{joke.joke.setup}</p>}
          <AnimatePresence mode="wait">
            {showPunchline ? (
              <motion.p
                key="punchline"
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
                key="reveal"
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
        </CardContent>
        <CardFooter>
          <CardDescription className="text-xs font-mono">{joke.joke_id}</CardDescription>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
