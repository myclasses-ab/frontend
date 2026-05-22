'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showValue?: boolean;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRate,
  showValue = false,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const containerClasses = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1.5',
  };

  const handleClick = (index: number) => {
    if (interactive && onRate) {
      onRate(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center ${containerClasses[size]}`}>
        {[...Array(maxRating)].map((_, index) => {
          const starIndex = index + 1;
          const isFilled = starIndex <= Math.floor(displayRating);
          const isHalf = !isFilled && starIndex - 0.5 <= displayRating;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starIndex)}
              onMouseEnter={() => handleMouseEnter(starIndex)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
              aria-label={`Rate ${starIndex} stars`}
            >
              <Star
                className={`${sizeClasses[size]} transition-colors ${
                  isFilled || isHalf
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-[var(--gray-300)]'
                }`}
                style={{
                  clipPath: isHalf ? 'inset(0 50% 0 0)' : undefined,
                }}
              />
              {isHalf && (
                <Star
                  className={`${sizeClasses[size]} absolute text-[var(--gray-300)]`}
                  style={{
                    clipPath: 'inset(0 0 0 50%)',
                    marginLeft: `-${sizeClasses[size].split(' ')[0].replace('w-', '')}`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-[var(--gray-700)]">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// Rating breakdown bar component
interface RatingBarProps {
  stars: number;
  count: number;
  total: number;
  size?: 'sm' | 'md';
}

export function RatingBar({ stars, count, total, size = 'md' }: RatingBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 w-12">
        <span className="text-sm text-[var(--gray-600)]">{stars}</span>
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
      </div>
      <div className={`flex-1 ${heightClasses[size]} bg-[var(--gray-100)] rounded-full overflow-hidden`}>
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-[var(--gray-500)] w-10 text-right">{count}</span>
    </div>
  );
}

// Rating breakdown component
interface RatingBreakdownProps {
  ratings: { [key: number]: number };
  totalReviews: number;
}

export function RatingBreakdown({ ratings, totalReviews }: RatingBreakdownProps) {
  return (
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map((stars) => (
        <RatingBar
          key={stars}
          stars={stars}
          count={ratings[stars] || 0}
          total={totalReviews}
        />
      ))}
    </div>
  );
}
