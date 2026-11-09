import { cn } from '@/lib/utils';
import { Icon } from './Icon';

/** Read as "Rated 5 out of 5" by assistive tech; the stars themselves are decorative. */
export function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <p className={cn('flex gap-1 text-warning', className)}>
      <span className="sr-only">Rated {rating} out of 5</span>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" size={20} fill={i < rating ? 'currentColor' : 'none'} />
      ))}
    </p>
  );
}
