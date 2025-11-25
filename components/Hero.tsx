import React, { useState } from 'react';
import { Coordinates } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  onSearch: (location: string, query: string, coords?: Coordinates) => void;
  isLoading: boolean;
}

const Hero: React.FC<HeroProps> = ({ onSearch, isLoading }) => {
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && query) {
      if (location === "Current Location" && coords) {
        onSearch(location, query, coords);
      } else {
        onSearch(location, query);
      }
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    // If user starts typing, clear the stored coordinates to avoid mismatch
    if (coords && e.target.value !== "Current Location") {
      setCoords(null);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocation("Current Location");
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Could not access your location. Please ensure you have granted permission.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="absolute inset-0">
        <img 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80" 
          alt="Travel background" 
        />
        <div className="absolute inset-0 bg-primary-900/60 mix-blend-multiply"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 text-center">
          {t.hero.title}
        </h1>
        <p className="mt-6 text-xl text-primary-100 max-w-3xl mx-auto text-center mb-10">
          {t.hero.subtitle}
        </p>
        
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <label htmlFor="location" className="sr-only">Location</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
              </div>
              <input
                type="text"
                name="location"
                id="location"
                className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 sm:text-sm shadow-sm"
                placeholder={t.hero.placeholderLoc}
                value={location}
                onChange={handleLocationChange}
                required
              />
            </div>
            
            <div className="flex-1 relative">
               <label htmlFor="query" className="sr-only">What are you looking for?</label>
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
               </div>
               <input
                type="text"
                name="query"
                id="query"
                className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 sm:text-sm shadow-sm"
                placeholder={t.hero.placeholderQuery}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
               />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex-shrink-0 px-8 py-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? t.hero.btnAnalyze : t.hero.btnExplore}
            </button>
          </form>
          <div className="mt-3 flex items-center justify-center sm:justify-start">
             <button 
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-xs text-white/80 hover:text-white flex items-center gap-1 focus:outline-none"
             >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18l0-16m-7 7l14 0" transform="rotate(45 12 12)" />
                </svg>
                {t.hero.useCurrent}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;