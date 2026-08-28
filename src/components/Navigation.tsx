import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface NavigationProps {
  activePage: 'home' | 'explore' | 'journey';
  onNavigateHome: () => void;
  onNavigateExplore: () => void;
  onNavigateJourney: () => void;
  onOpenSearch: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activePage,
  onNavigateHome,
  onNavigateExplore,
  onNavigateJourney,
  onOpenSearch
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show when near the very top of the page
      if (currentScrollY <= 25) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 70) {
        // Scrolling downwards -> hide navigation
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling upwards -> show navigation
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out select-none ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Top #FAF9F7 Gradient Banner - solid #FAF9F7 at top, smoothly fades to transparent below */}
      <div className="absolute top-0 left-0 right-0 h-[120px] pointer-events-none -z-10 overflow-hidden">
        <div
          className="w-full h-full"
          style={{
            background:
              'linear-gradient(to bottom, #FAF9F7 0%, rgba(250, 249, 247, 0.92) 50%, rgba(250, 249, 247, 0) 100%)'
          }}
        />
      </div>

      <nav className="h-[84px] px-[4.5vw] grid grid-cols-[1fr_2fr_1fr] max-md:grid-cols-[1fr_auto] items-center relative z-10">
        <button
          onClick={onNavigateHome}
          className="font-kaisei text-[17px] font-normal tracking-[0.04em] leading-[1.08] text-[#3c444a] text-left hover:opacity-80 transition-opacity bg-transparent border-0 cursor-pointer p-0"
        >
          CURIOUS
          <br />
          CHINA.
        </button>

        <div className="flex justify-center max-md:justify-end gap-14 max-md:gap-5">
          <button
            onClick={onNavigateHome}
            className={`font-jura text-[15px] font-semibold tracking-[0.02em] transition-all bg-transparent border-0 cursor-pointer p-0 ${
              activePage === 'home'
                ? 'text-[#3c444a] opacity-100 font-bold'
                : 'text-[#505960] opacity-75 hover:opacity-100'
            }`}
          >
            Home
          </button>
          <button
            onClick={onNavigateExplore}
            className={`font-jura text-[15px] font-semibold tracking-[0.02em] transition-all bg-transparent border-0 cursor-pointer p-0 ${
              activePage === 'explore'
                ? 'text-[#3c444a] opacity-100 font-bold'
                : 'text-[#505960] opacity-75 hover:opacity-100'
            }`}
          >
            Explore
          </button>
          <button
            onClick={onNavigateJourney}
            className={`font-jura text-[15px] font-semibold tracking-[0.02em] transition-all bg-transparent border-0 cursor-pointer p-0 ${
              activePage === 'journey'
                ? 'text-[#3c444a] opacity-100 font-bold'
                : 'text-[#505960] opacity-75 hover:opacity-100'
            }`}
          >
            My Journey
          </button>
        </div>

        <div
          onClick={onOpenSearch}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onOpenSearch()}
          className="text-right flex items-center justify-end gap-1.5 cursor-pointer max-md:hidden text-[#3c444a] font-jura text-[15px] font-semibold tracking-[0.02em] hover:opacity-70 transition-opacity"
        >
          <Search className="w-4 h-4 text-[#3c444a] stroke-[2.2]" />
          <span>Search</span>
        </div>
      </nav>
    </header>
  );
};

