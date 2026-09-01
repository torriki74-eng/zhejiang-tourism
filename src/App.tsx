/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HeroDragStage } from './components/HeroDragStage';
import { StorySection } from './components/StorySection';
import { FindSection } from './components/FindSection';
import { SearchModal } from './components/SearchModal';
import { MyJourneyPage } from './components/MyJourneyPage';
import { ExplorePage } from './components/ExplorePage';
import { ElementKey, SavedPlan } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'explore' | 'journey'>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => {
    try {
      const saved = localStorage.getItem('curious_china_saved_plans');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  const handleSavePlan = (newPlan: SavedPlan) => {
    setSavedPlans((prev) => {
      const updated = [newPlan, ...prev.filter((p) => p.id !== newPlan.id)];
      try {
        localStorage.setItem('curious_china_saved_plans', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setActivePlanId(newPlan.id);
  };

  const handleNavigateHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateExplore = () => {
    setCurrentPage('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateJourney = () => {
    setCurrentPage('journey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="paper min-h-screen bg-transparent text-[#3c444a] selection:bg-[#d6beb4]/40">
      <main className="site relative z-10">
        {/* Navigation Bar */}
        <Navigation
          activePage={currentPage}
          onNavigateHome={handleNavigateHome}
          onNavigateExplore={handleNavigateExplore}
          onNavigateJourney={handleNavigateJourney}
          isSearchOpen={isSearchOpen}
          onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
        />

        {currentPage === 'home' && (
          <>
            {/* Hero Section: Top Typography & Draggable Canvas */}
            <section
              className="min-h-[720px] max-md:min-h-[780px] relative grid grid-cols-[44%_56%] max-md:grid-cols-1 px-[4vw] pl-[6.5vw] max-md:px-[6vw] pt-[95px] max-md:pt-[80px] overflow-visible items-center"
              id="home"
            >
              <div className="self-center pt-[70px] pb-[10px] max-md:pt-[30px] max-md:pb-0 relative z-20 pointer-events-none">
                <h1 className="font-kaisei font-normal text-[clamp(56px,5.8vw,92px)] leading-[0.98] tracking-[0.01em] m-0 mb-[44px] max-md:mb-[32px] text-[#596167]">
                  ZHEJIANG
                  <br />
                  TRAVEL.
                </h1>
                <p className="max-w-[420px] font-jura text-[16px] max-md:text-[15px] font-semibold leading-[1.5] tracking-[0.01em] m-0 text-[#505960]">
                  Explore Zhejiang, a diverse region of China where ancient traditions, distinctive
                  landscapes and local culture come together. Discover unique places, stories and
                  experiences beyond the familiar.
                </p>
              </div>

              <HeroDragStage />
            </section>

            {/* Story Section: Sentences with Interactive Color Highlights & Hand-drawn Grid Guides */}
            <StorySection />

            {/* Find Your Zhejiang Section: Interactive Elements and Dynamic Narrative */}
            <FindSection onOpenExplore={handleNavigateExplore} />
          </>
        )}

        {currentPage === 'explore' && (
          <ExplorePage
            onNavigateJourney={handleNavigateJourney}
            onSavePlanToJourney={handleSavePlan}
          />
        )}

        {currentPage === 'journey' && (
          /* My Journey Page View */
          <MyJourneyPage
            onNavigateHome={handleNavigateHome}
            onNavigateExplore={handleNavigateExplore}
            onOpenSearch={() => setIsSearchOpen(true)}
            savedPlans={savedPlans}
            activePlanId={activePlanId}
            onSelectPlan={(id) => setActivePlanId(id)}
          />
        )}

        {/* Footer info bar */}
        <footer className="py-8 px-6 text-center border-t border-[#bbb9b1]/30 font-jura text-xs text-[#9aa1a6] flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
          <span>© CURIOUS CHINA. International Tourism Experience Service Platform.</span>
          <span className="mt-2 sm:mt-0">
            Designed by Xinruo Zhang · Major Project 2026
          </span>
        </footer>
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectElement={() => {
          setIsSearchOpen(false);
          handleNavigateJourney();
        }}
        onNavigateExplore={() => {
          setIsSearchOpen(false);
          handleNavigateExplore();
        }}
      />
    </div>
  );
}
