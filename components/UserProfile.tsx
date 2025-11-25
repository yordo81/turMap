import React, { useState, useEffect, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getFavorites, getItinerary } from '../services/supabaseClient';
import { TouristResource } from '../types';
import PlaceCard from './PlaceCard';
import { useLanguage } from '../contexts/LanguageContext';

interface UserProfileProps {
  user: User;
  onClose: () => void;
}

// Extended type to include locally managed timestamp
type ExtendedTouristResource = TouristResource & { addedAt?: string };

type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'rating-desc' | 'rating-asc';

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'itinerary' | 'settings'>('favorites');
  const [favorites, setFavorites] = useState<ExtendedTouristResource[]>([]);
  const [itinerary, setItinerary] = useState<ExtendedTouristResource[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const { t } = useLanguage();
  
  // Sorting state
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');

  // Settings state
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchUserData();
  }, [activeTab, user.id]);

  const fetchUserData = async () => {
    setLoadingData(true);
    try {
      if (activeTab === 'favorites') {
        const data = await getFavorites(user.id);
        setFavorites(data);
      } else if (activeTab === 'itinerary') {
        const data = await getItinerary(user.id);
        setItinerary(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setMessage({ type: 'error', text: "Password must be at least 6 characters" });
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      setMessage({ type: 'success', text: "Password updated successfully" });
      setPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  // Sorting Logic
  const getSortedPlaces = (places: ExtendedTouristResource[]) => {
    return [...places].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'rating-desc':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        case 'date-asc':
          return (new Date(a.addedAt || 0).getTime()) - (new Date(b.addedAt || 0).getTime());
        case 'date-desc':
        default:
          return (new Date(b.addedAt || 0).getTime()) - (new Date(a.addedAt || 0).getTime());
      }
    });
  };

  const sortedFavorites = useMemo(() => getSortedPlaces(favorites), [favorites, sortOption]);
  const sortedItinerary = useMemo(() => getSortedPlaces(itinerary), [itinerary, sortOption]);

  const currentList = activeTab === 'favorites' ? sortedFavorites : sortedItinerary;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-100">
      <div className="flex flex-col h-full max-w-7xl mx-auto bg-white shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">{t.profile.title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4 space-y-2">
            <div className="px-4 py-3 mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.profile.signedInAs}</p>
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
            </div>
            
            <button
              onClick={() => setActiveTab('favorites')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'favorites' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <svg className={`w-5 h-5 mr-3 ${activeTab === 'favorites' ? 'text-primary-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {t.profile.favorites}
            </button>
            
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'itinerary' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <svg className={`w-5 h-5 mr-3 ${activeTab === 'itinerary' ? 'text-primary-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t.profile.itinerary}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
               <svg className={`w-5 h-5 mr-3 ${activeTab === 'settings' ? 'text-primary-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t.profile.settings}
            </button>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t.profile.signOut}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
            {activeTab === 'settings' ? (
              <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t.profile.changePass}</h3>
                {message && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                  </div>
                )}
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t.profile.newPass}</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full rounded-lg border-gray-300 border p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder={t.profile.newPass}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {t.profile.updatePass}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {activeTab === 'favorites' ? t.profile.favorites : t.profile.itinerary}
                  </h3>

                  {/* Sort Controls */}
                  {!loadingData && currentList.length > 0 && (
                    <div className="flex items-center gap-2">
                      <label htmlFor="sort" className="text-sm text-gray-500 font-medium">{t.profile.sort}</label>
                      <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as SortOption)}
                        className="block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg border"
                      >
                        <option value="date-desc">{t.profile.sortDateNew}</option>
                        <option value="date-asc">{t.profile.sortDateOld}</option>
                        <option value="name-asc">{t.profile.sortNameAZ}</option>
                        <option value="name-desc">{t.profile.sortNameZA}</option>
                        <option value="rating-desc">{t.profile.sortRatingHigh}</option>
                        <option value="rating-asc">{t.profile.sortRatingLow}</option>
                      </select>
                    </div>
                  )}
                </div>
                
                {loadingData ? (
                   <div className="flex justify-center py-12">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                   </div>
                ) : (
                  <>
                    {currentList.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">
                          {t.profile.emptyList}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentList.map((place, idx) => (
                          <div key={idx} className="transform scale-95 origin-top-left w-full h-full transition-all hover:scale-100">
                             {/* Reusing PlaceCard */}
                             <PlaceCard 
                               place={place} 
                               onClick={() => {}} 
                               userId={user.id}
                               onAuthRequired={() => {}}
                             />
                             {place.addedAt && (
                               <p className="text-xs text-gray-400 mt-1 text-right px-1">
                                 {t.profile.added}: {new Date(place.addedAt).toLocaleDateString()}
                               </p>
                             )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;