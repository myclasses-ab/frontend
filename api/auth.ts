/**
 * Auth API
 * Mobile OTP authentication endpoints
 */

import axios from './axios-helper';
import type { User } from '@/types';

export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface PhoneAuthResponse {
  token: string;
  user: User;
  newUser: boolean;
}

export interface SendOtpResponse {
  message: string;
  phone: string;
  expiresIn: number;
  isRegistered: boolean;
}

export const authApi = {
  /**
   * Send OTP to phone number
   */
  sendOtp: async (phone: string): Promise<SendOtpResponse> => {
    const response = await axios.post('/auth/send-otp', { phone });
    return response.data;
  },

  /**
   * Verify OTP and login/register
   */
  verifyOtp: async (phone: string, otp: string, fullName?: string): Promise<PhoneAuthResponse> => {
    const response = await axios.post('/auth/verify-otp', { phone, otp, fullName });
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  me: async (): Promise<User> => {
    const response = await axios.get('/auth/me');
    return response.data;
  },

  /**
   * Refresh auth token
   */
  refresh: async (): Promise<PhoneAuthResponse> => {
    const response = await axios.post('/auth/refresh');
    return response.data;
  },
};
