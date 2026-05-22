'use client';

import { motion } from 'framer-motion';
import {
  Trophy,
  Users,
  Target,
  TrendingUp,
  Award,
  Star,
  GraduationCap,
} from 'lucide-react';
import { Result, RankOrScoreType } from '@/types';

interface ResultsStatsProps {
  results: Result[];
}

export function ResultsStats({ results }: ResultsStatsProps) {
  if (!results.length) return null;

  // Calculate statistics
  const totalStudents = results.length;
  
  const featuredResults = results.filter(r => r.isFeatured);
  const verifiedResults = results.filter(r => r.isVerified);
  
  // Count by rank type
  const airRanks = results.filter(r => r.rankOrScoreType === RankOrScoreType.AIR_RANK);
  const stateRanks = results.filter(r => r.rankOrScoreType === RankOrScoreType.STATE_RANK);
  const selections = results.filter(r => r.rankOrScoreType === RankOrScoreType.SELECTION);
  
  // Get unique exam years
  const examYears = [...new Set(results.map(r => r.examYear))].sort((a, b) => b - a);
  const latestYear = examYears[0];
  
  // Results in latest year
  const latestYearResults = results.filter(r => r.examYear === latestYear);

  // Get top rank (lowest AIR)
  const getTopAirRank = () => {
    const airRankValues = airRanks
      .map(r => parseInt(r.value))
      .filter(v => !isNaN(v));
    return airRankValues.length > 0 ? Math.min(...airRankValues) : null;
  };

  const topAirRank = getTopAirRank();

  const stats = [
    {
      label: 'Total Achievers',
      value: totalStudents.toString(),
      subtext: `Results showcased`,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Top AIR Rank',
      value: topAirRank ? `AIR ${topAirRank}` : 'N/A',
      subtext: 'Best All India Rank',
      icon: Trophy,
      color: 'amber',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'IIT/NIT Selections',
      value: selections.length.toString(),
      subtext: 'Premier institute admits',
      icon: GraduationCap,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: `Results ${latestYear}`,
      value: latestYearResults.length.toString(),
      subtext: 'Students this year',
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 border border-[var(--gray-200)] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="text-2xl font-bold text-[var(--gray-900)]">{stat.value}</div>
              <div className="text-sm font-medium text-[var(--gray-700)]">{stat.label}</div>
              <div className="text-xs text-[var(--gray-500)] mt-1">{stat.subtext}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-xl p-6 border border-[var(--gray-200)] shadow-sm"
      >
        <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-[var(--primary)]" />
          Achievement Breakdown
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* AIR Ranks */}
          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-700">{airRanks.length}</div>
              <div className="text-sm text-amber-600">All India Ranks</div>
            </div>
          </div>

          {/* State Ranks */}
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">{stateRanks.length}</div>
              <div className="text-sm text-blue-600">State Ranks</div>
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-700">{featuredResults.length}</div>
              <div className="text-sm text-purple-600">Featured Toppers</div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="mt-6 pt-6 border-t border-[var(--gray-100)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-[var(--gray-900)]">Verified Results</div>
                <div className="text-xs text-[var(--gray-500)]">Authentic & validated</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-600">{verifiedResults.length}</div>
              <div className="text-xs text-[var(--gray-500)]">
                {Math.round((verifiedResults.length / totalStudents) * 100)}% verified
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Years Available */}
      {examYears.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-sm text-[var(--gray-600)]">Results available for years:</span>
          {examYears.map(year => (
            <span
              key={year}
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                year === latestYear
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--gray-100)] text-[var(--gray-600)]'
              }`}
            >
              {year}
            </span>
          ))}
        </motion.div>
      )}
    </div>
  );
}
