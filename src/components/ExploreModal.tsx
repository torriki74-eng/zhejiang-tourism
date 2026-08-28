import React, { useState } from 'react';
import { X, Compass, MapPin, Sparkles, Check, Bookmark, Share2 } from 'lucide-react';
import { ElementKey } from '../types';
import { ELEMENTS_DATA, DESTINATIONS } from '../data/zhejiangData';

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedElementKey?: ElementKey | null;
  savedJourney: string[];
  onToggleSaveJourney: (name: string) => void;
}

export const ExploreModal: React.FC<ExploreModalProps> = ({
  isOpen,
  onClose,
  selectedElementKey = 'tea',
  savedJourney,
  onToggleSaveJourney
}) => {
  const [activeTab, setActiveTab] = useState<'elements' | 'destinations' | 'journey'>('elements');
  const [selectedKey, setSelectedKey] = useState<ElementKey>(selectedElementKey || 'tea');

  if (!isOpen) return null;

  const currentElement = ELEMENTS_DATA[selectedKey];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#faf9f6] border border-[#bbb9b1]/60 rounded-xl shadow-2xl overflow-hidden flex flex-col font-jura text-[#3c444a]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#bbb9b1]/40 bg-white/70">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-[#749d94]" />
            <h3 className="font-kaisei text-xl m-0 font-normal tracking-wide text-[#3c444a]">
              Zhejiang Exploration & Journey Guide
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex bg-[#eae8e3] p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveTab('elements')}
                className={`px-3 py-1.5 rounded-md border-0 cursor-pointer transition-all ${
                  activeTab === 'elements'
                    ? 'bg-white text-[#3c444a] shadow-xs'
                    : 'bg-transparent text-[#6c757d] hover:text-[#3c444a]'
                }`}
              >
                Cultural Elements
              </button>
              <button
                onClick={() => setActiveTab('destinations')}
                className={`px-3 py-1.5 rounded-md border-0 cursor-pointer transition-all ${
                  activeTab === 'destinations'
                    ? 'bg-white text-[#3c444a] shadow-xs'
                    : 'bg-transparent text-[#6c757d] hover:text-[#3c444a]'
                }`}
              >
                Key Destinations
              </button>
              <button
                onClick={() => setActiveTab('journey')}
                className={`px-3 py-1.5 rounded-md border-0 cursor-pointer transition-all ${
                  activeTab === 'journey'
                    ? 'bg-white text-[#3c444a] shadow-xs'
                    : 'bg-transparent text-[#6c757d] hover:text-[#3c444a]'
                }`}
              >
                My Journey ({savedJourney.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#505960] hover:text-[#3c444a] hover:bg-[#eae8e3] rounded-lg transition-colors border-0 bg-transparent cursor-pointer ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'elements' && (
            <div className="space-y-6">
              {/* Element Selector Chips */}
              <div className="grid grid-cols-6 max-sm:grid-cols-3 gap-2">
                {(Object.keys(ELEMENTS_DATA) as ElementKey[]).map((key) => {
                  const item = ELEMENTS_DATA[key];
                  const isSelected = selectedKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedKey(key)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-[#3c444a] shadow-sm scale-102'
                          : 'bg-white/60 border-[#bbb9b1]/40 hover:bg-white hover:border-[#bbb9b1]'
                      }`}
                    >
                      <img src={item.iconSrc} alt={item.label} className="w-8 h-8 object-contain" />
                      <span className="text-[11px] font-bold tracking-wider" style={{ color: item.themeColor }}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Element Spotlight Card */}
              <div className="bg-white p-6 rounded-xl border border-[#bbb9b1]/40 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 items-center shadow-xs">
                <div className="flex flex-col items-center justify-center p-4 bg-[#f4f3ef] rounded-xl border border-[#bbb9b1]/30">
                  <img
                    src={currentElement.iconSrc}
                    alt={currentElement.label}
                    className="w-32 h-32 object-contain"
                  />
                  <div
                    className="mt-3 text-xs font-bold tracking-widest px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: currentElement.themeColor }}
                  >
                    {currentElement.label}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <h4 className="font-kaisei text-2xl text-[#3c444a] m-0">
                      {currentElement.chineseName}
                    </h4>
                    <span className="text-xs text-[#749d94] font-semibold">
                      {currentElement.tagline}
                    </span>
                  </div>

                  <p className="text-sm text-[#505960] leading-relaxed m-0">
                    {currentElement.description}
                  </p>

                  <div className="pt-2">
                    <div className="text-xs font-bold text-[#3c444a] mb-1.5">
                      FEATURED CULTURAL HUBS:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentElement.regions.map((reg, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-[#f0eee9] text-[#505960] px-2.5 py-1 rounded-md border border-[#bbb9b1]/30 flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3 text-[#749d94]" />
                          {reg}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs font-bold text-[#3c444a] mb-1.5">
                      HERITAGE EXPERIENCES:
                    </div>
                    <ul className="text-xs text-[#505960] space-y-1 m-0 pl-4 list-disc">
                      {currentElement.culturalHighlights.map((hl, idx) => (
                        <li key={idx}>{hl}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'destinations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DESTINATIONS.map((dest, idx) => {
                const isSaved = savedJourney.includes(dest.name);
                return (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-xl border border-[#bbb9b1]/40 flex flex-col justify-between shadow-xs hover:border-[#749d94] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-kaisei text-lg text-[#3c444a] m-0">{dest.name}</h4>
                        <span className="text-[11px] font-semibold text-[#749d94] bg-[#f0f6f4] px-2 py-0.5 rounded-full">
                          {dest.tag}
                        </span>
                      </div>
                      <p className="text-xs text-[#505960] leading-relaxed mb-3">{dest.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {dest.highlights.map((hl, hIdx) => (
                          <span
                            key={hIdx}
                            className="text-[10px] bg-[#f4f3ef] text-[#6c757d] px-2 py-0.5 rounded-sm"
                          >
                            {hl}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleSaveJourney(dest.name)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                        isSaved
                          ? 'bg-[#749d94] text-white border-[#749d94]'
                          : 'bg-[#faf9f6] text-[#3c444a] border-[#bbb9b1]/60 hover:bg-[#eae8e3]'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to My Journey</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Add to My Journey</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'journey' && (
            <div className="space-y-4">
              {savedJourney.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white rounded-xl border border-dashed border-[#bbb9b1]/60">
                  <Bookmark className="w-8 h-8 text-[#bbb9b1] mx-auto mb-2" />
                  <h4 className="font-kaisei text-lg text-[#3c444a] m-0 mb-1">
                    Your Journey Itinerary is Empty
                  </h4>
                  <p className="text-xs text-[#6c757d] max-w-sm mx-auto mb-4">
                    Explore destinations and cultural elements, then save them here to craft your personal Zhejiang route.
                  </p>
                  <button
                    onClick={() => setActiveTab('destinations')}
                    className="px-4 py-2 bg-[#d6beb4] hover:bg-[#b48570] text-[#3c444a] hover:text-white text-xs font-semibold rounded-lg transition-colors border-0 cursor-pointer"
                  >
                    Browse Destinations
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#6c757d]">
                    <span>Saved destinations for your upcoming trip:</span>
                    <span>{savedJourney.length} stops planned</span>
                  </div>

                  <div className="space-y-2">
                    {savedJourney.map((name, idx) => {
                      const dest = DESTINATIONS.find((d) => d.name === name);
                      return (
                        <div
                          key={idx}
                          className="bg-white p-4 rounded-lg border border-[#bbb9b1]/40 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#f0f6f4] text-[#749d94] text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </div>
                            <div>
                              <div className="font-kaisei text-base text-[#3c444a] font-normal">
                                {name}
                              </div>
                              <div className="text-[11px] text-[#749d94]">{dest?.tag}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => onToggleSaveJourney(name)}
                            className="text-xs text-[#b48570] hover:underline bg-transparent border-0 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
