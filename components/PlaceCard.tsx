import React, { useState, useEffect } from 'react';
import { TouristResource } from '../types';
import { toggleFavorite, toggleItinerary, checkIsFavorite, checkIsItinerary } from '../services/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

interface PlaceCardProps {
  place: TouristResource;
  onClick: (place: TouristResource) => void;
  userId?: string;
  onAuthRequired: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick, userId, onAuthRequired }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInItinerary, setIsInItinerary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t } = useLanguage();

  // Check status on mount if user exists
  useEffect(() => {
    if (userId) {
      checkIsFavorite(place.name, userId).then(setIsFavorite);
      checkIsItinerary(place.name, userId).then(setIsInItinerary);
    } else {
      setIsFavorite(false);
      setIsInItinerary(false);
    }
  }, [userId, place.name]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      onAuthRequired();
      return;
    }

    if (loading) return;
    
    setLoading(true);
    try {
      const isNowFavorite = await toggleFavorite(place, userId);
      setIsFavorite(isNowFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItineraryClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      onAuthRequired();
      return;
    }

    if (itineraryLoading) return;
    
    setItineraryLoading(true);
    try {
      const isNowInItinerary = await toggleItinerary(place, userId);
      setIsInItinerary(isNowInItinerary);
    } catch (error) {
      console.error("Failed to toggle itinerary", error);
    } finally {
      setItineraryLoading(false);
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group flex flex-col h-full border border-gray-100 relative"
      onClick={() => onClick(place)}
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        disabled={loading}
        className="absolute top-3 left-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all transform hover:scale-105 focus:outline-none"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg 
          className={`w-5 h-5 transition-colors duration-300 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={isFavorite ? "0" : "2"}
          fill={isFavorite ? "currentColor" : "none"}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Itinerary Button */}
      <button
        onClick={handleItineraryClick}
        disabled={itineraryLoading}
        className="absolute top-3 left-14 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all transform hover:scale-105 focus:outline-none"
        aria-label={isInItinerary ? "Remove from itinerary" : "Add to itinerary"}
        title={isInItinerary ? t.details.inItinerary : t.details.addToItinerary}
      >
        <svg 
          className={`w-5 h-5 transition-colors duration-300 ${isInItinerary ? 'text-primary-600 fill-current' : 'text-gray-400'}`} 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="2"
          fill={isInItinerary ? "currentColor" : "none"}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      <div className="relative h-48 overflow-hidden bg-gray-200">
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-0">
             <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
          </div>
        )}
        
        <img 
          src={place.imageUrl} 
          alt={place.name} 
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-primary-700 shadow-sm uppercase tracking-wider z-10">
          {place.category}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{place.name}</h3>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
            <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm font-semibold text-gray-700">{place.rating}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
          {place.description}
        </p>

        <div className="border-t border-gray-100 pt-3 mt-auto">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
             <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {place.budget}
             </span>
             <span className="text-primary-600">{t.card.reviewSummary} →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;