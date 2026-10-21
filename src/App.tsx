import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { storageService, DEFAULT_STUDENT_USER } from './services/storageService';
import { translations, Language } from './services/i18n';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { PhonicsPage } from './pages/PhonicsPage';
import { VocabularyPage } from './pages/VocabularyPage';
import { SpeakingPage } from './pages/SpeakingPage';
import { StoriesPage } from './pages/StoriesPage';
import { QuizPage } from './pages/QuizPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProgressPage } from './pages/ProgressPage';
import { TeacherStudioPage } from './pages/TeacherStudioPage';
import { TeacherClassesPage } from './pages/TeacherClassesPage';
import { TeacherReportsPage } from './pages/TeacherReportsPage';
import { AboutPage } from './pages/AboutPage';
import { EvidencePage } from './pages/EvidencePage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => storageService.getCurrentUser());
  const [language, setLanguage] = useState<Language>('vi');
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      return hash || window.location.pathname || '/';
    }
    return '/';
  });

  // Keep route synced with URL hash & popstate
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      const path = hash || window.location.pathname || '/';
      setCurrentRoute(path);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    try {
      window.location.hash = route;
      window.history.pushState(null, '', `#${route}`);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    storageService.setCurrentUser(updatedUser);
  };

  const handleStarEarned = (newStars: number) => {
    setCurrentUser((prev) => ({ ...prev, stars: newStars }));
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  // Render Page Content based on currentRoute
  const renderPage = () => {
    switch (currentRoute) {
      case '/':
        return (
          <HomePage
            navigate={navigate}
            currentUser={currentUser}
            language={language}
          />
        );

      case '/learn':
        return (
          <LearnPage
            currentUser={currentUser}
            language={language}
            navigate={navigate}
          />
        );

      case '/phonics':
        return (
          <PhonicsPage
            currentUser={currentUser}
            language={language}
            onStarEarned={handleStarEarned}
          />
        );

      case '/vocabulary':
        return (
          <VocabularyPage
            currentUser={currentUser}
            language={language}
            onStarEarned={handleStarEarned}
          />
        );

      case '/speaking':
        return (
          <SpeakingPage
            currentUser={currentUser}
            language={language}
            onStarEarned={handleStarEarned}
          />
        );

      case '/stories':
        return (
          <StoriesPage
            currentUser={currentUser}
            language={language}
            onStarEarned={handleStarEarned}
          />
        );

      case '/quiz':
        return (
          <QuizPage
            currentUser={currentUser}
            language={language}
            onStarEarned={handleStarEarned}
          />
        );

      case '/projects':
        return (
          <ProjectsPage
            currentUser={currentUser}
            language={language}
            onStarEarned={handleStarEarned}
          />
        );

      case '/my-progress':
        return (
          <ProgressPage
            currentUser={currentUser}
            language={language}
            navigate={navigate}
          />
        );

      case '/teacher':
      case '/teacher/create':
        return (
          <TeacherStudioPage
            currentUser={currentUser}
            language={language}
            navigate={navigate}
          />
        );

      case '/teacher/classes':
        return (
          <TeacherClassesPage
            currentUser={currentUser}
            language={language}
            navigate={navigate}
          />
        );

      case '/teacher/reports':
        return (
          <TeacherReportsPage
            currentUser={currentUser}
            language={language}
            navigate={navigate}
          />
        );

      case '/about':
        return <AboutPage language={language} navigate={navigate} />;

      case '/evidence':
        return <EvidencePage language={language} navigate={navigate} />;

      case '/settings':
        return (
          <SettingsPage
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
            language={language}
            onToggleLanguage={toggleLanguage}
            navigate={navigate}
          />
        );

      default:
        return (
          <HomePage
            navigate={navigate}
            currentUser={currentUser}
            language={language}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Nunito',sans-serif] selection:bg-amber-300 selection:text-slate-900">
      {/* Sticky Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      {/* Main Page Body */}
      <main className="flex-1">{renderPage()}</main>

      {/* Footer */}
      <Footer navigate={navigate} language={language} />
    </div>
  );
}
