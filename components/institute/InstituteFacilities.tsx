'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Home,
  Utensils,
  Bus,
  Wind,
  Monitor,
  FlaskConical,
  BookMarked,
  Wifi,
  Video,
  GraduationCap,
  ClipboardCheck,
  Layers,
  Zap,
  Award,
  Users,
  Calendar,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { InstituteFacility } from '@/types';

interface InstituteFacilitiesProps {
  facility: InstituteFacility | null;
}

const facilityConfig: Record<string, { icon: React.ElementType; label: string }> = {
  hasLibrary: { icon: BookOpen, label: 'Library' },
  hasHostel: { icon: Home, label: 'Hostel' },
  hasCanteen: { icon: Utensils, label: 'Canteen' },
  hasTransport: { icon: Bus, label: 'Transport' },
  hasAcClassrooms: { icon: Wind, label: 'AC Classrooms' },
  hasDigitalBoards: { icon: Monitor, label: 'Digital Boards' },
  hasLaboratory: { icon: FlaskConical, label: 'Laboratory' },
  hasStudyRoom: { icon: BookMarked, label: 'Study Room' },
  hasWifi: { icon: Wifi, label: 'WiFi' },
  hasCctv: { icon: Video, label: 'CCTV' },
  hasOnlinePortal: { icon: GraduationCap, label: 'Online Portal' },
  hasDoubtSessions: { icon: ClipboardCheck, label: 'Doubt Sessions' },
  hasMockTestSeries: { icon: Layers, label: 'Mock Tests' },
  hasStudyMaterial: { icon: BookOpen, label: 'Study Material' },
  hasCrashCourses: { icon: Zap, label: 'Crash Courses' },
  hasScholarshipProgram: { icon: Award, label: 'Scholarships' },
  hasFreeDemoClass: { icon: Users, label: 'Free Demo' },
  hasParentTeacherMeetings: { icon: Calendar, label: 'PTM' },
  hasPerformanceTracking: { icon: TrendingUp, label: 'Performance Tracking' },
};

export function InstituteFacilities({ facility }: InstituteFacilitiesProps) {
  if (!facility) {
    return (
      <div className="bg-[var(--gray-50)] rounded-2xl p-6 text-center">
        <p className="text-[var(--gray-500)]">Facility information not available</p>
      </div>
    );
  }

  const availableFacilities = Object.entries(facilityConfig).filter(
    ([key]) => facility[key as keyof InstituteFacility] === true
  );

  return (
    <div className="space-y-6">
      {/* Student-Teacher Ratio */}
      {facility.studentToTeacherRatio && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent-purple)] rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Student to Teacher Ratio</p>
              <p className="text-2xl font-bold">{facility.studentToTeacherRatio}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Facilities Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableFacilities.map(([key, config], index) => {
          const Icon = config.icon;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[var(--gray-200)] hover:border-[var(--primary-200)] hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-[var(--primary-50)] rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <span className="text-sm font-medium text-[var(--gray-700)]">
                {config.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Notes */}
      {facility.notes && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--primary-50)] rounded-xl p-4 border border-[var(--primary-100)]"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
            <p className="text-[var(--gray-700)] text-sm leading-relaxed">
              {facility.notes}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
