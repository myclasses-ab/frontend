'use client';

import { motion } from 'framer-motion';
import {
  Info,
  BookOpen,
  Users,
  Trophy,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

export type TabType = 'overview' | 'courses' | 'faculty' | 'results' | 'reviews' | 'faqs';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: Info },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'faculty', label: 'Faculty', icon: Users },
  { id: 'results', label: 'Results', icon: Trophy },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
];

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="sticky top-16 lg:top-20 z-30 bg-white/90 backdrop-blur-md border-b border-[var(--gray-200)] shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <nav
          className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2 sm:py-3 snap-x snap-mandatory scroll-pl-2"
          aria-label="Institute tabs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 min-w-[4rem] sm:min-w-0 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-sm font-medium transition-colors snap-start ${
                  isActive
                    ? 'text-[var(--primary)]'
                    : 'text-[var(--gray-600)] hover:text-[var(--gray-900)] hover:bg-[var(--gray-100)]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-5 h-5 sm:w-4 sm:h-4" aria-hidden="true" />
                <span>{tab.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[var(--primary-50)] rounded-xl -z-10 border border-[var(--primary-100)]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
