/**
 * S3 Image URL Helper
 * Constructs public S3 URLs for images stored in myclassesimages bucket
 * Handles both full URLs and relative keys
 * Filters out placeholder/fake URLs (e.g. example.com)
 */

export const S3_BUCKET_URL = "https://myclassesimages.s3.ap-south-1.amazonaws.com";

/** Local fallback images — instant load, no S3 dependency */
export const FALLBACK_BANNER_URL = '/assets/dummy-banner.svg';
export const FALLBACK_LOGO_URL    = '/assets/dummy-logo.svg';
export const FALLBACK_FACULTY_URL = '/assets/dummy-faculty.svg';
export const FALLBACK_PERSON_URL  = '/assets/dummy-person.svg';

/** Known fake / placeholder domains that should be treated as "no image" */
const FAKE_DOMAINS = [
  'example.com',
  'example.org',
  'placeholder.com',
  'via.placeholder.com',
  'dummyimage.com',
];

/**
 * Check if a URL is a known fake/placeholder domain
 */
export function isFakeImageUrl(url: string | null | undefined): boolean {
  if (!url) return true;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return FAKE_DOMAINS.some((domain) => hostname === domain || hostname.endsWith('.' + domain));
  } catch {
    return true;
  }
}

/**
 * Check if a URL is external (starts with http/https)
 */
export function isExternalUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Get initials from a name (first char of first 1-2 words)
 */
export function getInitials(name: string | null | undefined, maxChars = 2): string {
  if (!name) return '?';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) {
    return words[0].slice(0, maxChars).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Generate a deterministic background color from a string
 */
export function getColorFromString(str: string | null | undefined): string {
  if (!str) return '#6366f1';
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981',
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef',
    '#f43f5e', '#14b8a6', '#0ea5e9', '#a855f7', '#ec4899',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Get the full public URL for an S3 object
 * Handles three cases:
 * 1. Empty/null value - returns empty string
 * 2. Fake/placeholder URL (example.com etc.) - returns empty string
 * 3. Already a full URL (starts with http) - returns as-is
 * 4. Just the key or filename - prepends S3 bucket URL with appropriate folder
 *
 * @param key - The S3 object key, filename, or full URL
 * @param folder - The folder prefix (e.g., "instituteLogo", "instituteBanner")
 * @returns Full HTTPS URL or empty string
 */
export function s3ImageUrl(key: string | null | undefined, folder: string): string {
  if (!key) return "";

  // Fake/placeholder URL - treat as missing
  if (isFakeImageUrl(key)) return "";

  // Already a full URL - return as-is
  if (key.startsWith("http://") || key.startsWith("https://")) {
    return key;
  }

  // Already has folder prefix - use as-is
  if (key.includes("/")) {
    return `${S3_BUCKET_URL}/${key}`;
  }

  // Just a filename - prepend folder
  return `${S3_BUCKET_URL}/${folder}/${key}`;
}

/**
 * Get the full public URL for an institute logo
 * Expected S3 key format: instituteLogo/{instituteIdentifier}_logo.{ext}
 *
 * @param key - The S3 key, filename, or full URL
 * @returns Full HTTPS URL or empty string
 */
export function instituteLogoUrl(key: string | null | undefined): string {
  return s3ImageUrl(key, "instituteLogo");
}

/**
 * Get the full public URL for an institute banner
 * Expected S3 key format: instituteBanner/{instituteIdentifier}_banner.{ext}
 *
 * @param key - The S3 key, filename, or full URL
 * @returns Full HTTPS URL or empty string
 */
export function instituteBannerUrl(key: string | null | undefined): string {
  return s3ImageUrl(key, "instituteBanner");
}

/**
 * Get the full public URL for a faculty image
 * Expected S3 key format: facultyImage/{facultyIdentifier}_image.{ext}
 *
 * @param key - The S3 key, filename, or full URL
 * @returns Full HTTPS URL or empty string
 */
export function facultyImageUrl(key: string | null | undefined): string {
  return s3ImageUrl(key, "facultyImage");
}

/**
 * Get the full public URL for a media gallery image
 * Expected S3 key format: media/{mediaIdentifier}.{ext}
 *
 * @param key - The S3 key, filename, or full URL
 * @returns Full HTTPS URL or empty string
 */
export function mediaImageUrl(key: string | null | undefined): string {
  return s3ImageUrl(key, "media");
}

/**
 * Get the full public URL for a branch image
 * Expected S3 key format: branch/{branchIdentifier}.{ext}
 *
 * @param key - The S3 key, filename, or full URL
 * @returns Full HTTPS URL or empty string
 */
export function branchImageUrl(key: string | null | undefined): string {
  return s3ImageUrl(key, "branch");
}

/**
 * Extract just the object key from a full S3 URL
 * Useful for storing in database (store just the key, not full URL)
 *
 * @param url - Full S3 URL or key
 * @returns Just the object key (e.g., "instituteLogo/inst-123_logo.png")
 */
export function extractObjectKey(url: string | null | undefined): string | null {
  if (!url) return null;

  // If it's already just a key (no protocol), return as-is
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return url;
  }

  // Extract key from full URL
  const prefix = `${S3_BUCKET_URL}/`;
  if (url.startsWith(prefix)) {
    return url.substring(prefix.length);
  }

  // Different bucket format, try to extract after .amazonaws.com/
  const amazonawsMatch = url.match(/\.amazonaws\.com\/(.+)$/);
  if (amazonawsMatch) {
    return amazonawsMatch[1];
  }

  return url;
}

/**
 * Get a placeholder image URL based on type
 * @param type - Type of placeholder needed
 * @returns Placeholder image URL (local asset)
 */
export function getPlaceholderImage(type: 'logo' | 'banner' | 'faculty' | 'person' | 'default'): string {
  switch (type) {
    case 'logo':
      return FALLBACK_LOGO_URL;
    case 'banner':
      return FALLBACK_BANNER_URL;
    case 'faculty':
      return FALLBACK_FACULTY_URL;
    case 'person':
      return FALLBACK_PERSON_URL;
    default:
      return FALLBACK_LOGO_URL;
  }
}
