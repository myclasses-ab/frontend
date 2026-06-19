export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export function getCurrentPosition(): Promise<GeoCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        const messages: Record<number, string> = {
          1: 'Location permission denied. Please enable location access or type a city manually.',
          2: 'Unable to retrieve your location. Please try again or type a city manually.',
          3: 'Location request timed out. Please try again or type a city manually.',
        };
        reject(new Error(messages[error.code] || 'Failed to retrieve your location.'));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  });
}

export async function reverseGeocodeCityCandidates(coords: GeoCoordinates): Promise<string[]> {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse');
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('lat', coords.latitude.toString());
    url.searchParams.set('lon', coords.longitude.toString());
    url.searchParams.set('zoom', '18');
    url.searchParams.set('addressdetails', '1');

    const response = await fetch(url.toString(), {
      headers: {
        'Accept-Language': 'en-US,en',
        'User-Agent': 'MyClasses Web App/1.0',
      },
    });

    if (!response.ok) return [];

    const data = await response.json();
    const address = data?.address || {};

    // Collect candidate place names from most specific to least specific.
    const candidates = [
      address.suburb,
      address.locality,
      address.neighbourhood,
      address.village,
      address.town,
      address.city,
      address.county,
      address.state_district,
      address.region,
    ].filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

    return candidates;
  } catch {
    return [];
  }
}

export function findMatchingCity(locationName: string, cities: readonly string[]): string | null {
  if (!locationName) return null;

  const normalized = locationName.trim().toLowerCase();

  // 1. Exact match (preserves original casing from CITIES)
  const exact = cities.find((city) => city.toLowerCase() === normalized);
  if (exact) return exact;

  // 2. Match if the user location name starts with a known city
  const startsWith = cities.find((city) => normalized.startsWith(city.toLowerCase()));
  if (startsWith) return startsWith;

  // 3. Match if a known city starts with the user location name
  const cityStartsWith = cities.find((city) => city.toLowerCase().startsWith(normalized));
  if (cityStartsWith) return cityStartsWith;

  // 4. Substring containment
  const includes = cities.find((city) => city.toLowerCase().includes(normalized));
  if (includes) return includes;

  return null;
}

export function findBestMatchingCity(
  candidates: readonly string[],
  cities: readonly string[]
): string | null {
  for (const candidate of candidates) {
    const match = findMatchingCity(candidate, cities);
    if (match) return match;
  }
  return null;
}

export async function detectNearestCity(
  cities: readonly string[]
): Promise<{ city: string | null; error?: string }> {
  try {
    const coords = await getCurrentPosition();
    const candidates = await reverseGeocodeCityCandidates(coords);

    if (candidates.length === 0) {
      return { city: null, error: 'Could not determine your city from the location.' };
    }

    const matchedCity = findBestMatchingCity(candidates, cities);
    if (matchedCity) {
      return { city: matchedCity };
    }

    // Fallback to the most specific place name we received.
    return { city: candidates[0], error: 'No matching city found in our list.' };
  } catch (error) {
    return {
      city: null,
      error: error instanceof Error ? error.message : 'Failed to detect your location.',
    };
  }
}
