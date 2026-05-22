'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Target,
  FileText,
} from 'lucide-react';

interface CourseCurriculumProps {
  features?: {
    studyMaterialIncluded?: boolean;
    testSeriesIncluded?: boolean;
    onlineClassesAvailable?: boolean;
    recordedLecturesAvailable?: boolean;
  };
}


export function CourseCurriculum({ features }: CourseCurriculumProps) {
  if (!features) return null;
  
  const featureList = [
    { key: 'studyMaterialIncluded', label: 'Study Material', sublabel: 'Included', icon: BookOpen, color: 'green' },
    { key: 'testSeriesIncluded', label: 'Test Series', sublabel: 'Included', icon: FileText, color: 'blue' },
    { key: 'onlineClassesAvailable', label: 'Live Classes', sublabel: 'Online', icon: Target, color: 'purple' },
    { key: 'recordedLecturesAvailable', label: 'Recorded', sublabel: '24/7', icon: Clock, color: 'amber' },
  ] as const;

  const activeFeatures = featureList.filter(f => features[f.key as keyof typeof features]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2"
    >
      {activeFeatures.map((feature) => {
        const Icon = feature.icon;
        const colorClasses: Record<string, string> = {
          green: 'bg-green-50 text-green-700 border-green-100',
          blue: 'bg-blue-50 text-blue-700 border-blue-100',
          purple: 'bg-purple-50 text-purple-700 border-purple-100',
          amber: 'bg-amber-50 text-amber-700 border-amber-100',
        };
        
        return (
          <div
            key={feature.key}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs ${colorClasses[feature.color]}`}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-medium truncate">{feature.label}</span>
          </div>
        );
      })}
    </motion.div>
  );
}
