import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppStateProvider } from './context/AppStateContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ArchivePage from './pages/ArchivePage';
import Footer from './components/Footer';

function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <div className="min-h-screen font-sans flex flex-col items-center p-4">
          <div className="w-full max-w-7xl flex flex-col min-h-screen bg-[var(--content-bg)] rounded-2xl shadow-2xl overflow-hidden">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/archive" element={<ArchivePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </HashRouter>
    </AppStateProvider>
  );
}

export default App;