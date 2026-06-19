'use client';

import { motion } from 'framer-motion';
import {
  IndianRupee,
  Calculator,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';

interface FeeDisplayProps {
  fee: number | string;
  scholarshipAvailable?: boolean;
  scholarshipDetails?: string;
  durationMonths?: number;
  showMonthlyBreakdown?: boolean;
}

export function FeeDisplay({
  fee,
  scholarshipAvailable,
  scholarshipDetails,
  durationMonths,
  showMonthlyBreakdown = true,
}: FeeDisplayProps) {
  const courseFee = Number(fee) || 0;

  // Format fee for display
  const formatFee = (fee: number) => {
    if (fee >= 100000) {
      return {
        value: (fee / 100000).toFixed(1),
        unit: 'L',
        full: fee.toLocaleString('en-IN'),
      };
    }
    if (fee >= 1000) {
      return {
        value: (fee / 1000).toFixed(0),
        unit: 'K',
        full: fee.toLocaleString('en-IN'),
      };
    }
    return {
      value: fee.toString(),
      unit: '',
      full: fee.toLocaleString('en-IN'),
    };
  };

  const feeFormatted = formatFee(courseFee);

  // Calculate monthly fee
  const monthlyFee = durationMonths && durationMonths > 0 ? courseFee / durationMonths : 0;
  const monthlyFeeFormatted = formatFee(Math.round(monthlyFee));

  return (
    <div className="bg-white rounded-2xl border border-[var(--gray-200)] overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-[var(--primary-50)] to-white border-b border-[var(--gray-100)]">
        <h3 className="text-lg font-bold text-[var(--gray-900)] flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-[var(--primary)]" />
          Course Fee
        </h3>
      </div>

      <div className="p-5 space-y-5">
        {/* Main Fee Display */}
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl sm:text-5xl font-bold text-[var(--gray-900)]">
              ₹{feeFormatted.value}
            </span>
            <span className="text-2xl font-semibold text-[var(--gray-600)]">
              {feeFormatted.unit}
            </span>
          </div>
          
          <p className="text-sm text-[var(--gray-400)] mt-1">per year</p>
        </div>

        {/* Monthly Breakdown */}
        {showMonthlyBreakdown && durationMonths && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Monthly Breakdown</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-900">₹{monthlyFeeFormatted.full}</span>
              <span className="text-sm text-blue-600">/month</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              for {durationMonths} months duration
            </p>
          </motion.div>
        )}

        {/* Scholarship Section */}
        {scholarshipAvailable && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-xl border border-amber-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-amber-800">Scholarship Available!</span>
            </div>
            
            {scholarshipDetails && (
              <p className="text-sm text-amber-700 mb-3">{scholarshipDetails}</p>
            )}

            <div className="flex items-center gap-2 text-sm text-amber-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Merit-based scholarships available</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-amber-600 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Need-based financial aid</span>
            </div>
          </motion.div>
        )}

        {/* No Scholarship */}
        {!scholarshipAvailable && (
          <div className="p-3 bg-[var(--gray-50)] rounded-xl">
            <div className="flex items-center gap-2 text-[var(--gray-500)]">
              <XCircle className="w-4 h-4" />
              <span className="text-sm">No scholarships available for this course</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact fee display for cards and lists
interface FeeBadgeProps {
  fee: number | string;
  size?: 'sm' | 'md' | 'lg';
}

export function FeeBadge({ fee, size = 'md' }: FeeBadgeProps) {
  const courseFee = Number(fee) || 0;

  const formatFee = (fee: number) => {
    if (fee >= 100000) {
      return `₹${(fee / 100000).toFixed(1)}L`;
    }
    if (fee >= 1000) {
      return `₹${(fee / 1000).toFixed(0)}K`;
    }
    return `₹${fee}`;
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-semibold bg-green-100 text-green-700 rounded-full ${sizeClasses[size]}`}>
      <IndianRupee className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      {formatFee(courseFee)}
    </span>
  );
}
