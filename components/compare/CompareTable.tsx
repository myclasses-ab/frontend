'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  CheckCircle,
  X,
  Building2,
  Check,
  Users,
  Award,
  BookOpen,
  MapPin,
  Phone,
  IndianRupee,
  TrendingUp,
} from 'lucide-react';
import { Institute, InstituteFacility } from '@/types';

interface CompareTableProps {
  institutes: Institute[];
  facilities: (InstituteFacility | null)[];
}

interface ComparisonRow {
  label: string;
  icon: React.ReactNode;
  getValue: (institute: Institute, facility: InstituteFacility | null) => React.ReactNode;
  highlight?: 'max' | 'min';
}

export function CompareTable({ institutes, facilities }: CompareTableProps) {
  const logoImage = '/assests/sample_image_for_anything.png';

  const renderCheck = (value: boolean) => (
    <div className={`flex justify-center ${value ? 'text-green-500' : 'text-[var(--gray-300)]'}`}>
      {value ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
    </div>
  );

  const rows: ComparisonRow[] = [
    {
      label: 'Rating',
      icon: <Star className="w-4 h-4 text-amber-400" />,
      getValue: (institute) => (
        <div className="flex items-center justify-center gap-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{Number(institute.averageRating).toFixed(1)}</span>
          <span className="text-[var(--gray-500)] text-sm">({institute.totalReviews})</span>
        </div>
      ),
      highlight: 'max',
    },
    {
      label: 'Experience',
      icon: <Building2 className="w-4 h-4 text-[var(--primary)]" />,
      getValue: (institute) => (
        <span>{institute.yearsOfExperience > 0 ? `${institute.yearsOfExperience}+ years` : 'N/A'}</span>
      ),
      highlight: 'max',
    },
    {
      label: 'Students Enrolled',
      icon: <Users className="w-4 h-4 text-[var(--accent-purple)]" />,
      getValue: (institute) => (
        <span>
          {institute.totalStudentsEnrolled > 0
            ? institute.totalStudentsEnrolled.toLocaleString()
            : 'N/A'}
        </span>
      ),
      highlight: 'max',
    },
    {
      label: 'Verified',
      icon: <CheckCircle className="w-4 h-4 text-green-500" />,
      getValue: (institute) => renderCheck(institute.isVerified),
    },
    {
      label: 'Featured',
      icon: <Award className="w-4 h-4 text-amber-500" />,
      getValue: (institute) => renderCheck(institute.isFeatured),
    },
    {
      label: 'Type',
      icon: <Building2 className="w-4 h-4 text-[var(--gray-500)]" />,
      getValue: (institute) => <span className="capitalize">{institute.type.toLowerCase()}</span>,
    },
  ];

  // Add facility rows if any facility data exists
  const facilityRows: ComparisonRow[] = [
    {
      label: 'Library',
      icon: <BookOpen className="w-4 h-4 text-[var(--primary)]" />,
      getValue: (_, facility) => renderCheck(facility?.hasLibrary || false),
    },
    {
      label: 'Hostel',
      icon: <Building2 className="w-4 h-4 text-[var(--accent-purple)]" />,
      getValue: (_, facility) => renderCheck(facility?.hasHostel || false),
    },
    {
      label: 'Canteen',
      icon: <Building2 className="w-4 h-4 text-[var(--accent-orange)]" />,
      getValue: (_, facility) => renderCheck(facility?.hasCanteen || false),
    },
    {
      label: 'Transport',
      icon: <MapPin className="w-4 h-4 text-[var(--gray-500)]" />,
      getValue: (_, facility) => renderCheck(facility?.hasTransport || false),
    },
    {
      label: 'AC Classrooms',
      icon: <Building2 className="w-4 h-4 text-[var(--primary)]" />,
      getValue: (_, facility) => renderCheck(facility?.hasAcClassrooms || false),
    },
    {
      label: 'WiFi',
      icon: <TrendingUp className="w-4 h-4 text-[var(--accent-purple)]" />,
      getValue: (_, facility) => renderCheck(facility?.hasWifi || false),
    },
    {
      label: 'Online Portal',
      icon: <BookOpen className="w-4 h-4 text-[var(--gray-500)]" />,
      getValue: (_, facility) => renderCheck(facility?.hasOnlinePortal || false),
    },
    {
      label: 'Study Material',
      icon: <BookOpen className="w-4 h-4 text-[var(--primary)]" />,
      getValue: (_, facility) => renderCheck(facility?.hasStudyMaterial || false),
    },
    {
      label: 'Mock Tests',
      icon: <TrendingUp className="w-4 h-4 text-[var(--accent-orange)]" />,
      getValue: (_, facility) => renderCheck(facility?.hasMockTestSeries || false),
    },
    {
      label: 'Scholarship',
      icon: <IndianRupee className="w-4 h-4 text-green-500" />,
      getValue: (_, facility) => renderCheck(facility?.hasScholarshipProgram || false),
    },
  ];

  const allRows = [...rows, ...facilityRows];

  // Calculate highlights
  const getHighlight = (row: ComparisonRow, instituteIndex: number): boolean => {
    if (!row.highlight) return false;
    
    const values = institutes.map((inst, idx) => {
      const facility = facilities[idx];
      const value = row.getValue(inst, facility);
      if (typeof value === 'string' || typeof value === 'number') {
        const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
        return isNaN(num) ? 0 : num;
      }
      return 0;
    });

    const targetValue = values[instituteIndex];
    if (targetValue === 0) return false;

    if (row.highlight === 'max') {
      return targetValue === Math.max(...values);
    } else {
      return targetValue === Math.min(...values);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[var(--gray-200)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[var(--gray-200)]">
              <th className="p-4 text-left text-sm font-semibold text-[var(--gray-900)] bg-[var(--gray-50)] sticky left-0 z-10 min-w-[150px]">
                Feature
              </th>
              {institutes.map((institute) => (
                <th
                  key={institute.identifier}
                  className="p-4 text-center min-w-[180px]"
                >
                  <Link
                    href={`/institutes/${institute.slug}`}
                    className="block group"
                  >
                    <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-[var(--gray-100)] flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-[var(--primary)] transition-all">
                      <Image
                        src={logoImage}
                        alt={institute.name}
                        width={56}
                        height={56}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-bold text-[var(--gray-900)] text-sm line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                      {institute.name}
                    </h3>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allRows.map((row, rowIndex) => (
              <tr
                key={row.label}
                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-[var(--gray-50)]'}
              >
                <td className="p-4 text-sm font-medium text-[var(--gray-700)] sticky left-0 z-10 bg-inherit border-r border-[var(--gray-100)]">
                  <div className="flex items-center gap-2">
                    {row.icon}
                    {row.label}
                  </div>
                </td>
                {institutes.map((institute, idx) => {
                  const facility = facilities[idx];
                  const isHighlighted = getHighlight(row, idx);
                  return (
                    <td
                      key={institute.identifier}
                      className={`p-4 text-center text-sm text-[var(--gray-600)] ${
                        isHighlighted
                          ? 'bg-green-50 text-green-700 font-medium'
                          : ''
                      }`}
                    >
                      {row.getValue(institute, facility)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
