/**
 * Stream API
 * Master data for academic streams
 */

import axios from '../axios-helper';
import { Stream } from '@/types';

export const streamApi = {
  /**
   * Create a new stream
   */
  create: async (stream: Omit<Stream, 'identifier'>): Promise<Stream> => {
    const response = await axios.post<Stream>('/streams', stream);
    return response.data;
  },

  /**
   * Get stream by identifier
   */
  getById: async (identifier: string): Promise<Stream> => {
    const response = await axios.get<Stream>(`/streams/${identifier}`);
    return response.data;
  },

  /**
   * Get all streams
   */
  getAll: async (): Promise<Stream[]> => {
    const response = await axios.get<Stream[]>('/streams');
    return response.data;
  },

  /**
   * Delete stream by identifier
   */
  delete: async (identifier: string): Promise<string> => {
    const response = await axios.delete<string>(`/streams/${identifier}`);
    return response.data;
  },

  /**
   * Find stream by slug
   */
  findBySlug: async (slug: string): Promise<Stream | null> => {
    const response = await axios.get<Stream | null>(`/streams/slug/${slug}`);
    return response.data;
  },
};
