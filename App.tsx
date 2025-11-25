import React, { useState, useMemo, useEffect, useRef } from 'react';
import Hero from './components/Hero';
import PlaceCard from './components/PlaceCard';
import PlaceDetails from './components/PlaceDetails';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import MapView from './components/MapView';
import { TouristResource, Coordinates } from './types';
import { searchPlacesWithGemini } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { useLanguage, languages, Language } from './contexts/LanguageContext';

const App: React.FC = () => {
  const [results, setResults] = useState<TouristResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<TouristResource | null>(null);
  const [searchMeta, setSearchMeta] = useState<{location: string, query: string} | null>(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedBudget, setSelectedBudget] = useState<string>('All');
  
  // View Mode
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Scroll to top state and ref
  const [showScrollTop, setShowScrollTop] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auth States
  const [session, setSession] = useState<Session | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Language Context
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    // Auth Initialization
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Scroll handler
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = async (location: string, query: string, coords?: Coordinates) => {
    setIsLoading(true);
    setError(null);
    setSearchMeta({ location, query });
    setResults([]); // Clear previous results
    
    // Reset filters
    setSelectedCategory('All');
    setMinRating(0);
    setSelectedBudget('All');
    
    // Default back to list view on new search
    setViewMode('list');

    try {
      // Pass current language to the service
      const data = await searchPlacesWithGemini(query, location, language, coords);
      setResults(data);
      if (data.length === 0) {
        setError(t.results.noResults);
      }
    } catch (err) {
      console.error(err);
      setError(t.results.error);
    } finally {
      setIsLoading(false);
    }
  };

  // Derived state for filters
  const categories = useMemo(() => {
    const categoriesSet = new Set(results.map(r => r.category).filter(Boolean));
    return ['All', ...Array.from(categoriesSet)].sort();
  }, [results]);

  const budgets = useMemo(() => {
    const budgetsSet = new Set(results.map(r => r.budget).filter(Boolean));
    return ['All', ...Array.from(budgetsSet)].sort();
  }, [results]);

  const filteredResults = useMemo(() => {
    return results.filter(place => {
      const matchCategory = selectedCategory === 'All' || place.category === selectedCategory;
      const matchRating = place.rating >= minRating;
      const matchBudget = selectedBudget === 'All' || place.budget === selectedBudget;
      return matchCategory && matchRating && matchBudget;
    });
  }, [results, selectedCategory, minRating, selectedBudget]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center mr-6">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                  TurMap
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
               {/* Language Selector */}
              <div className="relative inline-block text-left">
                 <select
                   value={language}
                   onChange={(e) => setLanguage(e.target.value as Language)}
                   className="block w-full pl-2 pr-8 py-1.5 text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md bg-gray-50 text-gray-700"
                 >
                   {Object.entries(languages).map(([code, name]) => (
                     <option key={code} value={code}>
                       {code.toUpperCase()}
                     </option>
                   ))}
                 </select>
              </div>

              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm font-medium hidden sm:block">{t.nav.about}</a>
              
              {session ? (
                <div className="flex items-center space-x-3">
                   <button 
                     onClick={() => setShowProfile(true)}
                     className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors focus:outline-none"
                   >
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                         {session.user.email ? session.user.email[0].toUpperCase() : 'U'}
                      </div>
                      <span className="hidden sm:inline-block">{t.nav.myAccount}</span>
                   </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm"
                >
                  {t.nav.signIn}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero / Search Section */}
      <Hero onSearch={handleSearch} isLoading={isLoading} />

      {/* Results Section */}
      <main className="flex-1 bg-gray-50" ref={resultsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
               {[1, 2, 3].map(i => (
                 <div key={i} className="bg-white rounded-xl h-96 shadow-sm p-4">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="h-20 bg-gray-200 rounded mb-2"></div>
                 </div>
               ))}
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                    {t.results.topRated} {searchMeta?.query}
                    <span className="text-gray-500 font-normal text-xl ml-2">{t.results.in} {searchMeta?.location}</span>
                    </h2>
                    <span className="text-sm text-gray-500">{t.results.rankedBy}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* View Toggle */}
                    <div className="bg-gray-200 p-1 rounded-lg flex">
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        {t.filters.listView}
                      </button>
                      <button 
                        onClick={() => setViewMode('map')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${viewMode === 'map' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        {t.filters.mapView}
                      </button>
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-wrap gap-2">
                        <select 
                            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="All">{t.filters.allCats}</option>
                            {categories.filter(c => c !== 'All').map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        <select 
                            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                            value={minRating}
                            onChange={(e) => setMinRating(Number(e.target.value))}
                        >
                            <option value={0}>{t.filters.anyRating}</option>
                            <option value={3}>3+ Stars</option>
                            <option value={4}>4+ Stars</option>
                            <option value={4.5}>4.5+ Stars</option>
                        </select>

                        <select 
                            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                            value={selectedBudget}
                            onChange={(e) => setSelectedBudget(e.target.value)}
                        >
                            <option value="All">{t.filters.anyBudget}</option>
                            {budgets.filter(b => b !== 'All').map(b => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>
                </div>
              </div>
              
              {filteredResults.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                      <p className="text-gray-500">{t.filters.noResultsFilter}</p>
                      <button 
                        onClick={() => {
                            setSelectedCategory('All');
                            setMinRating(0);
                            setSelectedBudget('All');
                        }}
                        className="mt-2 text-primary-600 hover:text-primary-800 font-medium text-sm"
                      >
                          {t.filters.clear}
                      </button>
                  </div>
              ) : (
                <>
                  {viewMode === 'list' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredResults.map((place) => (
                        <div key={place.id} className="h-full">
                          <PlaceCard 
                            place={place} 
                            onClick={setSelectedPlace} 
                            userId={session?.user.id}
                            onAuthRequired={() => setShowAuthModal(true)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <MapView 
                      places={filteredResults} 
                      onSelectPlace={setSelectedPlace}
                    />
                  )}
                </>
              )}
            </>
          )}

          {!isLoading && results.length === 0 && !error && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">{t.results.readyTitle}</h3>
              <p className="mt-1 text-gray-500">{t.results.readySubtitle}</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} TurMap. Powered by Gemini AI.
          </p>
        </div>
      </footer>

      {/* Place Details Modal */}
      {selectedPlace && (
        <PlaceDetails 
          place={selectedPlace} 
          onClose={() => setSelectedPlace(null)} 
          userId={session?.user.id}
          onAuthRequired={() => {
            setSelectedPlace(null);
            setShowAuthModal(true);
          }}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* User Profile Overlay */}
      {showProfile && session && (
        <UserProfile 
          user={session.user} 
          onClose={() => setShowProfile(false)} 
        />
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-all z-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;