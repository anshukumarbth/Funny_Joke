import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function JokeCardSkeleton() {
  return (
    <Card className="w-full overflow-hidden shadow-lg">
      <Skeleton className="h-60 w-full" />
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-6 w-1/4 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-4/5 mt-4" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-1/5" />
      </CardFooter>
    </Card>
  );
}
