/**
 * File Upload API
 * Upload files to S3 via dedicated backend endpoints
 */

import axios from './axios-helper';

export const uploadApi = {
  /**
   * Upload institute logo
   * @param file - The image file
   * @param instituteIdentifier - Institute identifier for deterministic naming
   */
  uploadLogo: async (file: File, instituteIdentifier: string): Promise<{ url: string; fileName: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('instituteIdentifier', instituteIdentifier);

    const response = await axios.post('/upload/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Upload institute banner
   * @param file - The image file
   * @param instituteIdentifier - Institute identifier for deterministic naming
   */
  uploadBanner: async (file: File, instituteIdentifier: string): Promise<{ url: string; fileName: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('instituteIdentifier', instituteIdentifier);

    const response = await axios.post('/upload/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Upload faculty image
   * @param file - The image file
   * @param facultyIdentifier - Faculty identifier for deterministic naming
   */
  uploadFacultyImage: async (file: File, facultyIdentifier: string): Promise<{ url: string; fileName: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('facultyIdentifier', facultyIdentifier);

    const response = await axios.post('/upload/faculty', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Generic upload (fallback for other media types)
   * @param file - The file to upload
   * @param folder - S3 folder name
   * @param resourceId - Optional resource identifier for deterministic object naming
   */
  upload: async (file: File, folder: string, resourceId?: string): Promise<{ url: string; fileName: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (resourceId) {
      formData.append('resourceId', resourceId);
    }

    const response = await axios.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Delete a file from S3 by its URL
   */
  deleteFile: async (url: string): Promise<{ message: string }> => {
    const response = await axios.delete('/upload', {
      params: { url },
    });
    return response.data;
  },
};
