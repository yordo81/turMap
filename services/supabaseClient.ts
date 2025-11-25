import { createClient, User } from '@supabase/supabase-js';

const supabaseUrl = 'https://tmuhmzfchphnbptleabc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtdWhtemZjaHBobmJwdGxlYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTkxMDAsImV4cCI6MjA3OTMzNTEwMH0.hfyCGgmexpppYCIlW-UwGDY7x_tcGci1afk4YDRrWRs';

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Favorites Management ---

export const toggleFavorite = async (place: any, userId: string) => {
  if (!userId) throw new Error("User must be logged in");
  
  try {
    const { data: rows } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('place_data->>name', place.name)
      .limit(1);

    const data = rows && rows.length > 0 ? rows[0] : null;

    if (data) {
      await supabase.from('favorites').delete().eq('id', data.id);
      return false; // Removed
    } else {
      await supabase.from('favorites').insert([{ 
        user_id: userId,
        place_data: place 
      }]);
      return true; // Added
    }
  } catch (e) {
    console.warn("Supabase operation failed:", e);
    return false;
  }
};

export const getFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('place_data, created_at')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data.map((row: any) => ({
    ...row.place_data,
    addedAt: row.created_at
  }));
};

export const checkIsFavorite = async (placeName: string, userId: string) => {
  if (!userId) return false;
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('place_data->>name', placeName)
    .limit(1);
  return data && data.length > 0;
};

// --- Itinerary Management ---

export const toggleItinerary = async (place: any, userId: string) => {
  if (!userId) throw new Error("User must be logged in");

  try {
    const { data: rows } = await supabase
      .from('itinerary')
      .select('*')
      .eq('user_id', userId)
      .eq('place_data->>name', place.name)
      .limit(1);

    const data = rows && rows.length > 0 ? rows[0] : null;

    if (data) {
      await supabase.from('itinerary').delete().eq('id', data.id);
      return false; // Removed
    } else {
      await supabase.from('itinerary').insert([{ 
        user_id: userId,
        place_data: place 
      }]);
      return true; // Added
    }
  } catch (e) {
    console.warn("Supabase operation failed:", e);
    return false;
  }
};

export const getItinerary = async (userId: string) => {
  const { data, error } = await supabase
    .from('itinerary')
    .select('place_data, created_at')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data.map((row: any) => ({
    ...row.place_data,
    addedAt: row.created_at
  }));
};

export const checkIsItinerary = async (placeName: string, userId: string) => {
  if (!userId) return false;
  const { data } = await supabase
    .from('itinerary')
    .select('id')
    .eq('user_id', userId)
    .eq('place_data->>name', placeName)
    .limit(1);
  return data && data.length > 0;
};