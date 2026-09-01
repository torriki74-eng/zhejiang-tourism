import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { ElementKey } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectElement: (key: ElementKey) => void;
  onNavigateExplore?: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'none' | 'city' | 'experience'>('none');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-[1.5px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Top Search Panel Header dropdown - Narrow and Compact */}
      <div 
        className="fixed top-[84px] left-0 right-0 z-50 bg-[#FAF9F7] border-b border-[#bbb9b1]/35 shadow-md transition-all duration-300 animate-in slide-in-from-top-3"
        style={{
          backgroundImage: "url('/assets/elements/background%20ass.svg')",
          backgroundSize: '100% auto'
        }}
      >
        <div className="max-w-[1240px] mx-auto px-6 sm:px-12 pt-6 pb-8">
          {/* Main Display Title */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-kaisei text-[28px] sm:text-[32px] font-normal tracking-[-0.02em] text-[#596167] m-0">
              what you are looking?
            </h2>
            <button
              onClick={onClose}
              className="text-[#596167]/70 hover:text-[#596167] p-1.5 rounded-full hover:bg-[#eae8e1] transition-colors border-0 bg-transparent cursor-pointer"
              title="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar Input Row */}
          <div className="flex items-center gap-3.5 mb-4">
            <div className="flex-1 h-[46px] sm:h-[48px] bg-[#dfdfdc] flex items-center px-5 transition-all focus-within:bg-[#d8d7d3] focus-within:ring-1.5 focus-within:ring-[#596167]/20">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder=""
                className="w-full bg-transparent border-0 outline-hidden font-jura text-[15px] font-medium text-[#596167] placeholder-[#7d8389]"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-[#596167]/70 hover:text-[#596167] bg-transparent border-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Button Square */}
            <button
              onClick={() => {
                // Keep minimal search button click behavior
              }}
              className="w-[46px] sm:w-[48px] h-[46px] sm:h-[48px] bg-[#dfdfdc] hover:bg-[#d4d3ce] active:bg-[#cbcac5] flex items-center justify-center border-0 cursor-pointer text-[#596167] transition-colors shrink-0"
              title="Search"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          {/* Sub Filters: city & experience in Jura font with toggle state */}
          <div className="flex items-center gap-7">
            <button
              onClick={() => setActiveFilter(activeFilter === 'city' ? 'none' : 'city')}
              className={`bg-transparent border-0 cursor-pointer p-0 font-jura text-[15px] font-semibold tracking-[0.02em] transition-all ${
                activeFilter === 'city'
                  ? 'text-[#596167] underline underline-offset-4 decoration-[#596167] font-bold'
                  : 'text-[#596167]/75 hover:text-[#596167]'
              }`}
            >
              city
            </button>
            <button
              onClick={() => setActiveFilter(activeFilter === 'experience' ? 'none' : 'experience')}
              className={`bg-transparent border-0 cursor-pointer p-0 font-jura text-[15px] font-semibold tracking-[0.02em] transition-all ${
                activeFilter === 'experience'
                  ? 'text-[#596167] underline underline-offset-4 decoration-[#596167] font-bold'
                  : 'text-[#596167]/75 hover:text-[#596167]'
              }`}
            >
              experience
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
