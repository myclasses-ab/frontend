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
    <div className="sticky top-16 lg:top-20 z-30 bg-white/80 backdrop-blur-md border-b border-[var(--gray-200)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-[var(--primary)]'
                    : 'text-[var(--gray-600)] hover:text-[var(--gray-900)] hover:bg-[var(--gray-100)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(0, 3)}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[var(--primary-50)] rounded-lg -z-10"
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
