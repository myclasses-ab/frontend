/**
 * Leads Entity
 * Leads & inquiries - contact/admission interest from users
 */

import { InquirySource, InquiryStatus } from './enums';

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
  assignedTo: string | null;
  instituteNotes: string | null;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  createdAt: string;
  updatedAt: string;
}
