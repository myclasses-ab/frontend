'use client';

import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  Building2,
  CheckCircle,
} from 'lucide-react';
import { Branch } from '@/types';

interface InstituteBranchesProps {
  branches: Branch[];
}

export function InstituteBranches({ branches }: InstituteBranchesProps) {
  if (!branches || branches.length === 0) {
    return (
      <div className="bg-[var(--gray-50)] rounded-2xl p-8 text-center">
        <Building2 className="w-12 h-12 text-[var(--gray-400)] mx-auto mb-3" />
        <p className="text-[var(--gray-600)]">No branch information available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {branches.map((branch, index) => (
        <motion.div
          key={branch.identifier}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="bg-white rounded-2xl border border-[var(--gray-200)] overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--gray-100)] bg-gradient-to-r from-[var(--gray-50)] to-white">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--gray-900)]">{branch.name}</h3>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[var(--gray-500)]" />
                    <span className="text-sm text-[var(--gray-600)]">
                      {branch.cityName}, {branch.state}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {branch.isMainBranch && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--primary)] text-white text-xs font-medium rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Main Branch
                  </span>
                )}
                {branch.isOnlineOnly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                    Online Only
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Address */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[var(--gray-500)] mb-1">Address</p>
                  <p className="text-[var(--gray-800)] font-medium">
                    {branch.addressLine1}
                  </p>
                  {branch.addressLine2 && (
                    <p className="text-[var(--gray-600)]">{branch.addressLine2}</p>
                  )}
                  {branch.landmark && (
                    <p className="text-sm text-[var(--gray-500)] mt-1">
                      Landmark: {branch.landmark}
                    </p>
                  )}
                  <p className="text-[var(--gray-700)] mt-2">
                    {branch.cityName}, {branch.state} - {branch.pincode}
                  </p>
                </div>

                {/* Infrastructure */}
                {(branch.totalClassrooms || branch.seatingCapacity) && (
                  <div className="flex flex-wrap gap-3 pt-3 border-t border-[var(--gray-100)]">
                    {branch.totalClassrooms > 0 && (
                      <div className="px-3 py-1.5 bg-[var(--gray-100)] rounded-lg">
                        <span className="text-sm text-[var(--gray-600)]">
                          {branch.totalClassrooms} Classrooms
                        </span>
                      </div>
                    )}
                    {branch.seatingCapacity > 0 && (
                      <div className="px-3 py-1.5 bg-[var(--gray-100)] rounded-lg">
                        <span className="text-sm text-[var(--gray-600)]">
                          {branch.seatingCapacity} Seats
                        </span>
                      </div>
                    )}
                    {branch.totalAreaSqft > 0 && (
                      <div className="px-3 py-1.5 bg-[var(--gray-100)] rounded-lg">
                        <span className="text-sm text-[var(--gray-600)]">
                          {branch.totalAreaSqft.toLocaleString()} sq.ft
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Contact & Hours */}
              <div className="space-y-4">
                {/* Contact */}
                <div className="space-y-2">
                  {branch.phone && (
                    <a
                      href={`tel:${branch.phone}`}
                      className="flex items-center gap-3 p-2 hover:bg-[var(--gray-50)] rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-[var(--gray-700)]">{branch.phone}</span>
                    </a>
                  )}
                  {branch.email && (
                    <a
                      href={`mailto:${branch.email}`}
                      className="flex items-center gap-3 p-2 hover:bg-[var(--gray-50)] rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-[var(--primary-100)] rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-[var(--primary)]" />
                      </div>
                      <span className="text-[var(--gray-700)]">{branch.email}</span>
                    </a>
                  )}
                </div>

                {/* Operating Hours */}
                {(branch.operatingHoursStart || branch.operatingDays) && (
                  <div className="pt-3 border-t border-[var(--gray-100)]">
                    <div className="flex items-center gap-2 text-[var(--gray-600)]">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {branch.operatingHoursStart && branch.operatingHoursEnd
                          ? `${formatTime(branch.operatingHoursStart)} - ${formatTime(branch.operatingHoursEnd)}`
                          : 'Contact for timings'}
                      </span>
                    </div>
                    {branch.operatingDays && (
                      <p className="text-sm text-[var(--gray-500)] ml-6 mt-1">
                        {branch.operatingDays}
                      </p>
                    )}
                  </div>
                )}

                {/* Map Button */}
                {branch.googleMapsUrl && (
                  <a
                    href={branch.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary-700)] transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function formatTime(time: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}
