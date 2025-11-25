import React, { useState, useEffect } from 'react';
import { TouristResource } from '../types';
import { toggleItinerary, checkIsItinerary } from '../services/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

interface PlaceDetailsProps {
  place: TouristResource;
  onClose: () => void;
  userId?: string;
  onAuthRequired: () => void;
}

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ place, onClose, userId, onAuthRequired }) => {
  const [isInItinerary, setIsInItinerary] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (userId) {
      checkIsItinerary(place.name, userId).then(setIsInItinerary);
    } else {
      setIsInItinerary(false);
    }
  }, [userId, place.name]);

  const handleItineraryToggle = async () => {
    if (!userId) {
      onAuthRequired();
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const isNowInItinerary = await toggleItinerary(place, userId);
      setIsInItinerary(isNowInItinerary);
    } catch (error) {
      console.error("Failed to toggle itinerary", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background backdrop */}
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="relative h-64">
             <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h2 className="text-3xl font-bold text-white mb-1">{place.name}</h2>
                <div className="flex items-center text-white/90 text-sm">
                   <span className="bg-primary-600 px-2 py-0.5 rounded mr-3">{place.category}</span>
                   <span>{place.address}</span>
                </div>
             </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
             
             {/* Key Stats Grid */}
             <div className="grid grid-cols-3 gap-4 mb-8 border-b border-gray-100 pb-8">
               <div className="text-center p-3 bg-gray-50 rounded-xl">
                 <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">{t.details.rating}</p>
                 <p className="text-xl font-bold text-gray-900 flex justify-center items-center">
                   {place.rating} <span className="text-yellow-500 text-sm ml-1">★</span>
                 </p>
               </div>
               <div className="text-center p-3 bg-gray-50 rounded-xl">
                 <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">{t.details.budget}</p>
                 <p className="text-xl font-bold text-gray-900">{place.budget}</p>
               </div>
               <div className="text-center p-3 bg-gray-50 rounded-xl">
                 <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">{t.details.status}</p>
                 <p className="text-sm font-semibold text-gray-900 mt-1">{place.openingHours}</p>
               </div>
             </div>

             {/* Review Summary Section */}
             <div className="mb-8">
               <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                 <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                 </svg>
                 {t.details.whatTravelersSay}
               </h3>
               <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                 <p className="text-gray-700 leading-relaxed italic">
                   "{place.reviewSummary}"
                 </p>
                 <div className="mt-3 flex gap-2">
                    <span className="text-xs font-semibold text-blue-400">{t.details.sources}</span>
                 </div>
               </div>
             </div>

             {/* Description */}
             <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t.details.about}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {place.description}
                </p>
             </div>

             {/* Action Buttons */}
             <div className="flex flex-col sm:flex-row gap-4">
               <a 
                 href={place.mapLink} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex-1 bg-primary-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex justify-center items-center"
               >
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
                 {t.details.viewMap}
               </a>
               
               <button
                 onClick={handleItineraryToggle}
                 disabled={loading}
                 className={`flex-1 flex justify-center items-center py-3 rounded-xl font-semibold transition-colors border ${isInItinerary ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
               >
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                 </svg>
                 {isInItinerary ? t.details.inItinerary : t.details.addToItinerary}
               </button>

               {place.sourceLinks && place.sourceLinks.length > 0 && (
                   <a
                     href={place.sourceLinks[0].url}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex-1 border border-gray-300 text-gray-700 text-center py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                   >
                     {t.details.moreInfo}
                   </a>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;