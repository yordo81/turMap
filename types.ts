export interface TouristResource {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number; // 1-5 scale
  reviewSummary: string; // Aggregated sentiment from Google/TripAdvisor
  budget: string; // e.g., "$$", "Approx $20/person"
  openingHours: string;
  address?: string;
  imageUrl?: string;
  mapLink?: string;
  sourceLinks?: { title: string; url: string }[];
  latitude?: number;
  longitude?: number;
}

export interface SearchState {
  location: string;
  query: string;
  isLoading: boolean;
  error: string | null;
  results: TouristResource[];
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}