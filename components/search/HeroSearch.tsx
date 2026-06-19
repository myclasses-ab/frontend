'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MapPin, Crosshair, Loader2 } from 'lucide-react';
import { CITIES } from '@/components/helper/cities';
import { detectNearestCity } from '@/lib/location';

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const suggestions =
    cityQuery.length > 0
      ? CITIES.filter((c) =>
          c.toLowerCase().includes(cityQuery.toLowerCase())
        ).slice(0, 8)
      : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (cityQuery.trim()) params.set('cityName', cityQuery.trim());
    router.push(`/search?${params.toString()}`);
  };

  const handleNearMe = async () => {
    setIsLocating(true);
    setShowDropdown(false);

    const result = await detectNearestCity(CITIES);

    if (result.city) {
      setCityQuery(result.city);
    }

    setIsLocating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-10 max-w-4xl mx-auto"
    >
      <form onSubmit={handleSearch} className="relative">
        <div className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-xl shadow-black/10">
          {/* Course Input */}
          <div className="flex-1 flex items-center gap-3 px-5 py-4 border-b sm:border-b-0 sm:border-r border-[var(--gray-200)]">
            <Search className="w-5 h-5 text-[var(--gray-400)] flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search coaching classes, courses..."
              className="w-full bg-transparent text-[var(--gray-900)] placeholder:text-[var(--gray-400)] outline-none text-base"
              style={{ outline: 'none' }}
            />
          </div>

          {/* City Input */}
          <div className="relative flex-1 flex items-center gap-3 px-5 py-4" ref={dropdownRef}>
            <MapPin className="w-5 h-5 text-[var(--gray-400)] flex-shrink-0" />
            <input
              type="text"
              value={cityQuery}
              onChange={(e) => {
                setCityQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Enter city name"
              className="w-full bg-transparent text-[var(--gray-900)] placeholder:text-[var(--gray-400)] outline-none text-base"
              style={{ outline: 'none' }}
            />
            <button
              type="button"
              onClick={handleNearMe}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--gray-100)] hover:bg-[var(--gray-200)] disabled:opacity-60 disabled:cursor-not-allowed rounded-full text-xs font-medium text-[var(--gray-600)] transition-colors flex-shrink-0"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Crosshair className="w-3.5 h-3.5" />
              )}
              {isLocating ? 'Locating...' : 'Near me'}
            </button>

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-[var(--gray-200)] z-[9999] max-h-45 overflow-y-auto">
                {suggestions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setCityQuery(city);
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--gray-50)] transition-colors text-left"
                  >
                    <MapPin className="w-4 h-4 text-[var(--gray-400)]" />
                    <span className="text-sm font-medium text-[var(--gray-900)]">{city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="px-8 py-4 cursor-pointer bg-[var(--accent-green)] hover:bg-[#059669] rounded-r-2xl text-white font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </form>
    </motion.div>
  );
}
