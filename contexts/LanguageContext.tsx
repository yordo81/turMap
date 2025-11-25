import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt';

export const languages: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
};

export const translations = {
  en: {
    nav: { about: "About", signIn: "Sign In", myAccount: "My Account" },
    hero: {
      title: "Discover Real Experiences",
      subtitle: "TurMap analyzes thousands of reviews from Google and TripAdvisor to show you the truth about tourist spots.",
      placeholderLoc: "Where to? (e.g. Rome, Paris)",
      placeholderQuery: "Attractions, Sushi, Museums...",
      btnAnalyze: "Analyzing...",
      btnExplore: "Explore",
      useCurrent: "Use my current location"
    },
    filters: {
      allCats: "All Categories",
      anyRating: "Any Rating",
      anyBudget: "Any Budget",
      clear: "Clear Filters",
      noResultsFilter: "No places match your selected filters.",
      listView: "List View",
      mapView: "Map View"
    },
    results: {
      topRated: "Top Rated",
      in: "in",
      rankedBy: "Ranked by consolidated user sentiment",
      noResults: "No results found. Try a different location or category.",
      error: "An error occurred. Please try again.",
      readyTitle: "Ready to explore?",
      readySubtitle: "Enter a destination above to see top-rated places."
    },
    card: {
      reviewSummary: "See Review Summary",
      budget: "Budget",
      checkOnline: "Check online"
    },
    details: {
      rating: "Rating",
      budget: "Budget",
      status: "Status",
      whatTravelersSay: "What Travelers Say",
      sources: "Sources: Google Reviews • TripAdvisor • Local Guides",
      about: "About",
      viewMap: "View on Maps",
      addToItinerary: "Add to Itinerary",
      inItinerary: "In Itinerary",
      moreInfo: "More Info"
    },
    auth: {
      welcome: "Welcome Back",
      create: "Create Account",
      email: "Email",
      password: "Password",
      signIn: "Sign In",
      signUp: "Sign Up",
      processing: "Processing...",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      success: "Registration successful! Please sign in."
    },
    profile: {
      title: "My Account",
      signedInAs: "Signed in as",
      favorites: "My Favorites",
      itinerary: "My Itinerary",
      settings: "Account Settings",
      signOut: "Sign Out",
      changePass: "Change Password",
      newPass: "New Password",
      updatePass: "Update Password",
      emptyList: "You haven't added any items yet.",
      sort: "Sort by:",
      sortDateNew: "Date Added (Newest)",
      sortDateOld: "Date Added (Oldest)",
      sortNameAZ: "Name (A-Z)",
      sortNameZA: "Name (Z-A)",
      sortRatingHigh: "Rating (High to Low)",
      sortRatingLow: "Rating (Low to High)",
      added: "Added"
    }
  },
  es: {
    nav: { about: "Acerca de", signIn: "Iniciar Sesión", myAccount: "Mi Cuenta" },
    hero: {
      title: "Descubre Experiencias Reales",
      subtitle: "TurMap analiza miles de reseñas de Google y TripAdvisor para mostrarte la verdad sobre los lugares turísticos.",
      placeholderLoc: "¿A dónde vas? (ej. Roma, París)",
      placeholderQuery: "Atracciones, Sushi, Museos...",
      btnAnalyze: "Analizando...",
      btnExplore: "Explorar",
      useCurrent: "Usar mi ubicación actual"
    },
    filters: {
      allCats: "Todas las categorías",
      anyRating: "Cualquier valoración",
      anyBudget: "Cualquier presupuesto",
      clear: "Limpiar filtros",
      noResultsFilter: "Ningún lugar coincide con los filtros seleccionados.",
      listView: "Vista Lista",
      mapView: "Vista Mapa"
    },
    results: {
      topRated: "Mejor valorados en",
      in: "en",
      rankedBy: "Clasificado por sentimiento consolidado de usuarios",
      noResults: "No se encontraron resultados. Intenta otra ubicación.",
      error: "Ocurrió un error. Inténtalo de nuevo.",
      readyTitle: "¿Listo para explorar?",
      readySubtitle: "Ingresa un destino arriba para ver los mejores lugares."
    },
    card: {
      reviewSummary: "Ver Resumen de Reseñas",
      budget: "Presupuesto",
      checkOnline: "Ver online"
    },
    details: {
      rating: "Valoración",
      budget: "Presupuesto",
      status: "Estado",
      whatTravelersSay: "Lo que dicen los viajeros",
      sources: "Fuentes: Google Reviews • TripAdvisor • Guías Locales",
      about: "Acerca de",
      viewMap: "Ver en Mapa",
      addToItinerary: "Añadir al Itinerario",
      inItinerary: "En Itinerario",
      moreInfo: "Más Info"
    },
    auth: {
      welcome: "Bienvenido de nuevo",
      create: "Crear Cuenta",
      email: "Correo",
      password: "Contraseña",
      signIn: "Ingresar",
      signUp: "Registrarse",
      processing: "Procesando...",
      noAccount: "¿No tienes cuenta?",
      hasAccount: "¿Ya tienes cuenta?",
      success: "¡Registro exitoso! Por favor inicia sesión."
    },
    profile: {
      title: "Mi Cuenta",
      signedInAs: "Iniciado como",
      favorites: "Mis Favoritos",
      itinerary: "Mi Itinerario",
      settings: "Configuración",
      signOut: "Cerrar Sesión",
      changePass: "Cambiar Contraseña",
      newPass: "Nueva Contraseña",
      updatePass: "Actualizar Contraseña",
      emptyList: "Aún no has añadido nada aquí.",
      sort: "Ordenar por:",
      sortDateNew: "Fecha (Reciente)",
      sortDateOld: "Fecha (Antigua)",
      sortNameAZ: "Nombre (A-Z)",
      sortNameZA: "Nombre (Z-A)",
      sortRatingHigh: "Valoración (Alta)",
      sortRatingLow: "Valoración (Baja)",
      added: "Añadido"
    }
  },
  fr: {
    nav: { about: "À propos", signIn: "Se connecter", myAccount: "Mon Compte" },
    hero: {
      title: "Découvrez de Vraies Expériences",
      subtitle: "TurMap analyse des milliers d'avis de Google et TripAdvisor pour vous montrer la vérité sur les lieux touristiques.",
      placeholderLoc: "Où allez-vous ? (ex. Rome, Paris)",
      placeholderQuery: "Attractions, Sushi, Musées...",
      btnAnalyze: "Analyse...",
      btnExplore: "Explorer",
      useCurrent: "Utiliser ma position actuelle"
    },
    filters: {
      allCats: "Toutes catégories",
      anyRating: "Toute note",
      anyBudget: "Tout budget",
      clear: "Effacer les filtres",
      noResultsFilter: "Aucun lieu ne correspond à vos filtres.",
      listView: "Liste",
      mapView: "Carte"
    },
    results: {
      topRated: "Les mieux notés",
      in: "à",
      rankedBy: "Classé par sentiment utilisateur consolidé",
      noResults: "Aucun résultat trouvé. Essayez un autre lieu.",
      error: "Une erreur est survenue. Veuillez réessayer.",
      readyTitle: "Prêt à explorer ?",
      readySubtitle: "Entrez une destination ci-dessus pour voir les meilleurs lieux."
    },
    card: {
      reviewSummary: "Voir le résumé des avis",
      budget: "Budget",
      checkOnline: "Vérifier en ligne"
    },
    details: {
      rating: "Note",
      budget: "Budget",
      status: "Statut",
      whatTravelersSay: "Ce que disent les voyageurs",
      sources: "Sources : Google Reviews • TripAdvisor • Guides Locaux",
      about: "À propos",
      viewMap: "Voir sur la carte",
      addToItinerary: "Ajouter à l'itinéraire",
      inItinerary: "Dans l'itinéraire",
      moreInfo: "Plus d'infos"
    },
    auth: {
      welcome: "Bon retour",
      create: "Créer un compte",
      email: "Email",
      password: "Mot de passe",
      signIn: "Se connecter",
      signUp: "S'inscrire",
      processing: "Traitement...",
      noAccount: "Pas de compte ?",
      hasAccount: "Déjà un compte ?",
      success: "Inscription réussie ! Veuillez vous connecter."
    },
    profile: {
      title: "Mon Compte",
      signedInAs: "Connecté en tant que",
      favorites: "Mes Favoris",
      itinerary: "Mon Itinéraire",
      settings: "Paramètres",
      signOut: "Se déconnecter",
      changePass: "Changer mot de passe",
      newPass: "Nouveau mot de passe",
      updatePass: "Mettre à jour",
      emptyList: "Vous n'avez encore rien ajouté.",
      sort: "Trier par :",
      sortDateNew: "Date (Récent)",
      sortDateOld: "Date (Ancien)",
      sortNameAZ: "Nom (A-Z)",
      sortNameZA: "Nom (Z-A)",
      sortRatingHigh: "Note (Haute)",
      sortRatingLow: "Note (Basse)",
      added: "Ajouté"
    }
  },
  de: {
    nav: { about: "Über uns", signIn: "Anmelden", myAccount: "Mein Konto" },
    hero: {
      title: "Entdecken Sie echte Erlebnisse",
      subtitle: "TurMap analysiert Tausende von Bewertungen von Google und TripAdvisor.",
      placeholderLoc: "Wohin? (z.B. Rom, Berlin)",
      placeholderQuery: "Sehenswürdigkeiten, Sushi...",
      btnAnalyze: "Analysieren...",
      btnExplore: "Erkunden",
      useCurrent: "Meinen Standort verwenden"
    },
    filters: {
      allCats: "Alle Kategorien",
      anyRating: "Jede Bewertung",
      anyBudget: "Jedes Budget",
      clear: "Filter löschen",
      noResultsFilter: "Keine Ergebnisse für diese Filter.",
      listView: "Liste",
      mapView: "Karte"
    },
    results: {
      topRated: "Bestbewertet",
      in: "in",
      rankedBy: "Sortiert nach Nutzerstimmung",
      noResults: "Keine Ergebnisse gefunden.",
      error: "Ein Fehler ist aufgetreten.",
      readyTitle: "Bereit zu erkunden?",
      readySubtitle: "Geben Sie oben ein Ziel ein."
    },
    card: {
      reviewSummary: "Bewertungszusammenfassung",
      budget: "Budget",
      checkOnline: "Online prüfen"
    },
    details: {
      rating: "Bewertung",
      budget: "Budget",
      status: "Status",
      whatTravelersSay: "Das sagen Reisende",
      sources: "Quellen: Google • TripAdvisor",
      about: "Über",
      viewMap: "Auf Karte ansehen",
      addToItinerary: "Zum Reiseplan",
      inItinerary: "Im Reiseplan",
      moreInfo: "Mehr Info"
    },
    auth: {
      welcome: "Willkommen zurück",
      create: "Konto erstellen",
      email: "E-Mail",
      password: "Passwort",
      signIn: "Anmelden",
      signUp: "Registrieren",
      processing: "Verarbeitung...",
      noAccount: "Kein Konto?",
      hasAccount: "Bereits ein Konto?",
      success: "Registrierung erfolgreich!"
    },
    profile: {
      title: "Mein Konto",
      signedInAs: "Angemeldet als",
      favorites: "Meine Favoriten",
      itinerary: "Mein Reiseplan",
      settings: "Einstellungen",
      signOut: "Abmelden",
      changePass: "Passwort ändern",
      newPass: "Neues Passwort",
      updatePass: "Aktualisieren",
      emptyList: "Noch keine Einträge.",
      sort: "Sortieren nach:",
      sortDateNew: "Datum (Neu)",
      sortDateOld: "Datum (Alt)",
      sortNameAZ: "Name (A-Z)",
      sortNameZA: "Name (Z-A)",
      sortRatingHigh: "Bewertung (Hoch)",
      sortRatingLow: "Bewertung (Niedrig)",
      added: "Hinzugefügt"
    }
  },
  it: {
    nav: { about: "Info", signIn: "Accedi", myAccount: "Il mio account" },
    hero: {
      title: "Scopri Esperienze Reali",
      subtitle: "TurMap analizza migliaia di recensioni da Google e TripAdvisor per mostrarti la verità sui luoghi turistici.",
      placeholderLoc: "Dove vai? (es. Roma, Parigi)",
      placeholderQuery: "Attrazioni, Sushi, Musei...",
      btnAnalyze: "Analisi...",
      btnExplore: "Esplora",
      useCurrent: "Usa la mia posizione"
    },
    filters: {
      allCats: "Tutte le categorie",
      anyRating: "Qualsiasi voto",
      anyBudget: "Qualsiasi budget",
      clear: "Cancella filtri",
      noResultsFilter: "Nessun luogo corrisponde ai filtri.",
      listView: "Elenco",
      mapView: "Mappa"
    },
    results: {
      topRated: "Più votati",
      in: "a",
      rankedBy: "Classificato in base al sentimento degli utenti",
      noResults: "Nessun risultato trovato.",
      error: "Si è verificato un errore.",
      readyTitle: "Pronto a esplorare?",
      readySubtitle: "Inserisci una destinazione sopra."
    },
    card: {
      reviewSummary: "Vedi riepilogo recensioni",
      budget: "Budget",
      checkOnline: "Controlla online"
    },
    details: {
      rating: "Voto",
      budget: "Budget",
      status: "Stato",
      whatTravelersSay: "Cosa dicono i viaggiatori",
      sources: "Fonti: Google • TripAdvisor",
      about: "Info",
      viewMap: "Vedi su Mappa",
      addToItinerary: "Aggiungi all'itinerario",
      inItinerary: "Nell'itinerario",
      moreInfo: "Più info"
    },
    auth: {
      welcome: "Bentornato",
      create: "Crea account",
      email: "Email",
      password: "Password",
      signIn: "Accedi",
      signUp: "Registrati",
      processing: "Elaborazione...",
      noAccount: "Non hai un account?",
      hasAccount: "Hai già un account?",
      success: "Registrazione riuscita!"
    },
    profile: {
      title: "Il mio account",
      signedInAs: "Accesso come",
      favorites: "I miei preferiti",
      itinerary: "Il mio itinerario",
      settings: "Impostazioni",
      signOut: "Esci",
      changePass: "Cambia password",
      newPass: "Nuova password",
      updatePass: "Aggiorna",
      emptyList: "Non hai aggiunto nulla.",
      sort: "Ordina per:",
      sortDateNew: "Data (Recente)",
      sortDateOld: "Data (Vecchia)",
      sortNameAZ: "Nome (A-Z)",
      sortNameZA: "Nome (Z-A)",
      sortRatingHigh: "Voto (Alto)",
      sortRatingLow: "Voto (Basso)",
      added: "Aggiunto"
    }
  },
  pt: {
    nav: { about: "Sobre", signIn: "Entrar", myAccount: "Minha Conta" },
    hero: {
      title: "Descubra Experiências Reais",
      subtitle: "O TurMap analisa milhares de avaliações do Google e TripAdvisor para mostrar a verdade sobre os pontos turísticos.",
      placeholderLoc: "Para onde? (ex. Lisboa, Rio)",
      placeholderQuery: "Atrações, Sushi, Museus...",
      btnAnalyze: "Analisando...",
      btnExplore: "Explorar",
      useCurrent: "Usar minha localização"
    },
    filters: {
      allCats: "Todas as categorias",
      anyRating: "Qualquer avaliação",
      anyBudget: "Qualquer orçamento",
      clear: "Limpar filtros",
      noResultsFilter: "Nenhum lugar corresponde aos filtros.",
      listView: "Lista",
      mapView: "Mapa"
    },
    results: {
      topRated: "Mais bem avaliados",
      in: "em",
      rankedBy: "Classificado pelo sentimento dos usuários",
      noResults: "Nenhum resultado encontrado.",
      error: "Ocorreu um erro.",
      readyTitle: "Pronto para explorar?",
      readySubtitle: "Insira um destino acima."
    },
    card: {
      reviewSummary: "Ver Resumo das Avaliações",
      budget: "Orçamento",
      checkOnline: "Ver online"
    },
    details: {
      rating: "Avaliação",
      budget: "Orçamento",
      status: "Status",
      whatTravelersSay: "O que os viajantes dizem",
      sources: "Fontes: Google • TripAdvisor",
      about: "Sobre",
      viewMap: "Ver no Mapa",
      addToItinerary: "Adicionar ao Itinerário",
      inItinerary: "No Itinerário",
      moreInfo: "Mais Info"
    },
    auth: {
      welcome: "Bem-vindo de volta",
      create: "Criar Conta",
      email: "Email",
      password: "Senha",
      signIn: "Entrar",
      signUp: "Inscrever-se",
      processing: "Processando...",
      noAccount: "Não tem conta?",
      hasAccount: "Já tem conta?",
      success: "Registro com sucesso!"
    },
    profile: {
      title: "Minha Conta",
      signedInAs: "Entrou como",
      favorites: "Meus Favoritos",
      itinerary: "Meu Itinerário",
      settings: "Configurações",
      signOut: "Sair",
      changePass: "Mudar Senha",
      newPass: "Nova Senha",
      updatePass: "Atualizar",
      emptyList: "Você ainda não adicionou nada.",
      sort: "Ordenar por:",
      sortDateNew: "Data (Recente)",
      sortDateOld: "Data (Antiga)",
      sortNameAZ: "Nome (A-Z)",
      sortNameZA: "Nome (Z-A)",
      sortRatingHigh: "Avaliação (Alta)",
      sortRatingLow: "Avaliação (Baixa)",
      added: "Adicionado"
    }
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Language;
    if (languages[browserLang]) {
      setLanguage(browserLang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};