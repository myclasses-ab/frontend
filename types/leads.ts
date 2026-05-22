/**
 * Leads Entity
 * Leads & inquiries - contact/admission interest from users
 */

import { InquirySource, InquiryStatus, LeadSource, LeadStatus, LeadDistributionStatus } from './enums';

export interface Inquiry {
  identifier: string;
  instituteIdentifier: string;
  branchIdentifier: string | null;
  courseIdentifier: string | null;
  userIdentifier: string | null;
  name: string;
  email: string;
  phone: string;
  standard: string;
  targetExam: string;
  message: string;
  source: InquirySource;
  status: InquiryStatus;
  assignedTo: string;
  instituteNotes: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  identifier: string;
  userIdentifier: string | null;
  phone: string | null;
  fullName: string | null;
  cityIdentifier: string | null;
  examTypeIdentifier: string | null;
  searchedQuery: string | null;
  visitedInstituteIdentifier: string | null;
  visitedInstituteName: string | null;
  source: LeadSource;
  status: LeadStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeadDistribution {
  identifier: string;
  leadIdentifier: string;
  instituteIdentifier: string;
  instituteName: string | null;
  distributedBy: string | null;
  distributedAt: string | null;
  status: LeadDistributionStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
