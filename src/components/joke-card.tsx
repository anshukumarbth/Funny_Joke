'use client';

import type { JokeAndImageOutput } from '@/ai/flows/generate-joke-and-image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getImage } from '@/app/actions';
import { Skeleton } from './ui/skeleton';

type JokeCardProps = {
  joke: JokeAndImageOutput;
};

export function JokeCard({ joke }: JokeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const placeholderImage = PlaceHolderImages.find(img => img.id === 'joke-card-placeholder');

  useEffect(() => {
    const fetchImage = async () => {
      setIsImageLoading(true);
      const imageResult = await getImage({ prompt: `${joke.image.image_prompt}, ${joke.image.style_hint}` });
      if (imageResult.data?.imageUrl) {
        setImageUrl(imageResult.data.imageUrl);
      } else {
        // Fallback to placeholder if generation fails
        setImageUrl(placeholderImage?.imageUrl || 'https://picsum.photos/seed/laugh/1200/600');
        console.error("Image generation failed:", imageResult.error);
      }
      setIsImageLoading(false);
    };

    if (joke.image.image_prompt) {
      fetchImage();
    }
  }, [joke.image.image_prompt, joke.image.style_hint, placeholderImage?.imageUrl]);

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
        <div className="aspect-video w-full relative overflow-hidden group">
          {isImageLoading || !imageUrl ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <Image
              src={imageUrl}
              alt={joke.image.image_prompt}
              data-ai-hint={joke.image.style_hint}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          )}
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
