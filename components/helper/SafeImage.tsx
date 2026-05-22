'use client';

import { useState } from 'react';
import Image from 'next/image';

/* ------------------------------------------------------------------ */
/*  SafeImage  –  Next.js <Image> with automatic S3-fallback          */
/* ------------------------------------------------------------------ */

type SafeImageProps = {
  src: string;
  fallbackSrc: string;
} & Omit<React.ComponentProps<typeof Image>, 'src' | 'onError'>;

export function SafeImage({ src, fallbackSrc, ...props }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <Image
      {...props}
      src={currentSrc}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  SafeImg  –  plain <img> with automatic S3-fallback                */
/* ------------------------------------------------------------------ */

type SafeImgProps = {
  src: string;
  fallbackSrc: string;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'>;

export function SafeImg({ src, fallbackSrc, ...props }: SafeImgProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <img
      {...props}
      src={currentSrc}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
