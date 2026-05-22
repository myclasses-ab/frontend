'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { isExternalUrl } from './imageHelper';

/* ------------------------------------------------------------------ */
/*  SafeImage  –  Next.js <Image> with automatic fallback + timeout   */
/* ------------------------------------------------------------------ */

const FALLBACK_TIMEOUT_MS = 5000;

type SafeImageProps = {
  src: string;
  fallbackSrc: string;
} & Omit<React.ComponentProps<typeof Image>, 'src' | 'onError'>;

export function SafeImage({ src, fallbackSrc, ...props }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  // Auto-switch to fallback after timeout if image hasn't loaded
  useEffect(() => {
    if (currentSrc === fallbackSrc) return;
    const timer = setTimeout(() => {
      setCurrentSrc(fallbackSrc);
    }, FALLBACK_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [currentSrc, fallbackSrc]);

  const handleError = useCallback(() => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  }, [currentSrc, fallbackSrc]);

  // External URLs must be unoptimized to avoid Next.js image API timeout
  const shouldUnoptimize = isExternalUrl(currentSrc) || isExternalUrl(src);

  return (
    <Image
      {...props}
      src={currentSrc}
      unoptimized={shouldUnoptimize}
      onError={handleError}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  SafeImg  –  plain <img> with automatic fallback + timeout         */
/* ------------------------------------------------------------------ */

type SafeImgProps = {
  src: string;
  fallbackSrc: string;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'>;

export function SafeImg({ src, fallbackSrc, ...props }: SafeImgProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  // Auto-switch to fallback after timeout if image hasn't loaded
  useEffect(() => {
    if (currentSrc === fallbackSrc) return;
    const timer = setTimeout(() => {
      setCurrentSrc(fallbackSrc);
    }, FALLBACK_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [currentSrc, fallbackSrc]);

  const handleError = useCallback(() => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  }, [currentSrc, fallbackSrc]);

  return (
    <img
      {...props}
      src={currentSrc}
      onError={handleError}
    />
  );
}
