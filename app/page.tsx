'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  InstituteCard,
  InstituteCardSkeleton,
} from '@/components/institute';
import { useInstitutes } from '@/hooks/useInstitutes';
import {
  Building2,
  Users,
  Award,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  MapPin,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { HeroSearch } from '@/components/search';

// Features data
const features = [
  {
    icon: Building2,
    title: 'Verified Institutes',
    description: 'All coaching institutes are thoroughly verified for authenticity and quality.',
    color: 'bg-blue-500',
  },
  {
    icon: Users,
    title: 'Student Reviews',
    description: 'Read genuine reviews from thousands of students who have experienced these institutes.',
    color: 'bg-green-500',
  },
  {
    icon: Award,
    title: 'Top Results',
    description: 'Compare institutes based on their historical results and student achievements.',
    color: 'bg-amber-500',
  },
  {
    icon: MapPin,
    title: 'Location Based',
    description: 'Find the best coaching institutes in your city with detailed branch information.',
    color: 'bg-purple-500',
  },
];

// Stats data
const stats = [
  { value: '500+', label: 'Verified Institutes' },
  { value: '50K+', label: 'Student Reviews' },
  { value: '100K+', label: 'Students Helped' },
  { value: '50+', label: 'Cities Covered' },
];

export default function Home() {
  const { filteredInstitutes, isLoading } = useInstitutes({ featured: true, limit: 4 });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white via-[var(--gray-50)] to-white">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--primary-100)] rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--accent-orange)] rounded-full blur-3xl opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--primary-50)] rounded-full blur-3xl opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-50)] border border-[var(--primary-100)] rounded-full text-[var(--primary)] text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>#1 Platform for Coaching Discovery</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[var(--gray-900)] tracking-tight"
            >
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent-purple)] bg-clip-text text-transparent">
                Coaching Institute
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-[var(--gray-600)] max-w-2xl mx-auto"
            >
              Discover top coaching institutes for JEE, NEET, MHT-CET, and more.
              Compare reviews, fees, and results to choose the best path for your success.
            </motion.p>

            {/* Search Bar */}
            <HeroSearch />

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <span className="text-sm text-[var(--gray-500)]">Popular:</span>
              {['JEE Coaching', 'NEET Preparation', 'MHT-CET', 'Foundation'].map(
                (tag) => (
                  <Link
                    key={tag}
                    href="/"
                    className="px-4 py-1.5 bg-white border border-[var(--gray-200)] rounded-full text-sm text-[var(--gray-600)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                  >
                    {tag}
                  </Link>
                )
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[var(--gray-500)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl lg:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-[var(--gray-400)] mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Institutes Section */}
      <section className="py-20 lg:py-28 bg-[var(--gray-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--primary-100)] rounded-full text-[var(--primary)] text-sm font-medium mb-3"
              >
                <Star className="w-4 h-4" />
                <span>Top Rated</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl lg:text-4xl font-bold text-[var(--gray-900)]"
              >
                Featured Institutes
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-2 text-[var(--gray-600)]"
              >
                Hand-picked top coaching institutes with excellent track records
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[var(--gray-200)] text-[var(--gray-700)] font-medium rounded-xl hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                View All Institutes
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Institutes Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <InstituteCardSkeleton key={i} index={i} />
              ))}
            </div>
          ) : filteredInstitutes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredInstitutes.map((institute, index) => (
                <InstituteCard
                  key={institute.identifier}
                  institute={institute}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[var(--gray-600)]">No featured institutes available</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent-orange)]/10 rounded-full text-[var(--accent-orange)] text-sm font-medium mb-3"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Why Choose Us</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-[var(--gray-900)]"
            >
              Everything You Need to Find the Best Coaching
            </motion.h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-5 p-6 rounded-2xl bg-[var(--gray-50)] hover:bg-[var(--primary-50)] transition-colors group"
                >
                  <div
                    className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--gray-600)]">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--primary)] via-[var(--primary-700)] to-[var(--accent-purple)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Find Your Perfect Coaching Institute?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Browse through hundreds of verified coaching institutes, compare
                ratings and reviews, and make an informed decision for your future.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--primary)] font-semibold rounded-xl hover:bg-[var(--gray-50)] transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  Browse Institutes
                </Link>
                <Link
                  href="/exam"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
                >
                  <GraduationCap className="w-5 h-5" />
                  Explore Exams
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl transform rotate-3" />
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--gray-900)]">
                        Verified Reviews
                      </p>
                      <p className="text-sm text-[var(--gray-500)]">
                        From real students
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--gray-900)]">
                        Top Rated
                      </p>
                      <p className="text-sm text-[var(--gray-500)]">
                        Only best institutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--gray-900)]">
                        Detailed Info
                      </p>
                      <p className="text-sm text-[var(--gray-500)]">
                        Fees, courses, facilities
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
