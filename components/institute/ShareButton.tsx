'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Link,
  Check,
  MessageCircle,
  Mail,
  X,
} from 'lucide-react';

interface ShareButtonProps {
  title: string;
  url: string;
  description?: string;
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

interface ShareOption {
  name: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

export function ShareButton({
  title,
  url,
  description = '',
  variant = 'default',
  className = '',
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${url}`
    : url;

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [fullUrl]);

  const handleWhatsApp = useCallback(() => {
    const text = encodeURIComponent(`${title}\n${fullUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setIsOpen(false);
  }, [title, fullUrl]);

  const handleFacebook = useCallback(() => {
    const shareUrl = encodeURIComponent(fullUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      '_blank'
    );
    setIsOpen(false);
  }, [fullUrl]);

  const handleTwitter = useCallback(() => {
    const text = encodeURIComponent(title);
    const shareUrl = encodeURIComponent(fullUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
      '_blank'
    );
    setIsOpen(false);
  }, [title, fullUrl]);

  const handleEmail = useCallback(() => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${title}\n\n${fullUrl}\n\n${description}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setIsOpen(false);
  }, [title, fullUrl, description]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: fullUrl,
        });
        setIsOpen(false);
      } catch (err) {
        // User cancelled or share failed
      }
    }
  }, [title, description, fullUrl]);

  const shareOptions: ShareOption[] = [
    {
      name: copied ? 'Copied!' : 'Copy Link',
      icon: copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />,
      action: handleCopyLink,
      color: 'bg-[var(--gray-100)] text-[var(--gray-700)]',
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-4 h-4" />,
      action: handleWhatsApp,
      color: 'bg-green-100 text-green-600',
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      action: handleFacebook,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      action: handleTwitter,
      color: 'bg-sky-100 text-sky-500',
    },
    {
      name: 'Email',
      icon: <Mail className="w-4 h-4" />,
      action: handleEmail,
      color: 'bg-red-100 text-red-500',
    },
  ];

  // Add native share if available
  const [canNativeShare, setCanNativeShare] = useState(false);
  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);
  
  if (canNativeShare) {
    shareOptions.push({
      name: 'More Options',
      icon: <Share2 className="w-4 h-4" />,
      action: handleNativeShare,
      color: 'bg-[var(--primary-100)] text-[var(--primary)]',
    });
  }

  const baseClasses =
    'relative flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2';

  const variantClasses = {
    default:
      'gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-[var(--gray-200)] text-[var(--gray-600)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--primary-50)]',
    compact:
      'gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--gray-200)] text-[var(--gray-600)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--primary-50)]',
    'icon-only':
      'w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg border border-[var(--gray-100)] text-[var(--gray-600)] hover:text-[var(--primary)]',
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        aria-label="Share"
        aria-expanded={isOpen}
      >
        <Share2
          className={
            variant === 'icon-only'
              ? 'w-5 h-5'
              : variant === 'compact'
              ? 'w-3.5 h-3.5'
              : 'w-4 h-4'
          }
        />
        {variant !== 'icon-only' && <span>Share</span>}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Share Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl shadow-gray-900/10 border border-[var(--gray-200)] z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-[var(--gray-100)]">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--gray-900)]">Share</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-[var(--gray-100)] rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-[var(--gray-500)]" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--gray-50)] transition-colors group"
                  >
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${option.color}`}
                    >
                      {option.icon}
                    </span>
                    <span className="text-sm font-medium text-[var(--gray-700)] group-hover:text-[var(--gray-900)]">
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
