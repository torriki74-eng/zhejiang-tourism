import React, { useState, useMemo } from 'react';
import { Search, X, MapPin, Tag } from 'lucide-react';
import { DESTINATIONS, ELEMENTS_DATA } from '../data/zhejiangData';
import { ElementKey } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectElement: (key: ElementKey) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectElement
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const elementMatches = (Object.keys(ELEMENTS_DATA) as ElementKey[])
      .filter((k) => {
        const item = ELEMENTS_DATA[k];
        return (
          item.label.toLowerCase().includes(q) ||
          item.chineseName.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.regions.some((r) => r.toLowerCase().includes(q))
        );
      })
      .map((k) => ({
        type: 'element' as const,
        key: k,
        title: ELEMENTS_DATA[k].label,
        subtitle: ELEMENTS_DATA[k].chineseName,
        desc: ELEMENTS_DATA[k].description,
        icon: ELEMENTS_DATA[k].iconSrc
      }));

    const destinationMatches = DESTINATIONS.filter((d) => {
      return (
        d.name.toLowerCase().includes(q) ||
        d.tag.toLowerCase().includes(q) ||
        d.desc.toLowerCase().includes(q) ||
        d.highlights.some((h) => h.toLowerCase().includes(q))
      );
    }).map((d) => ({
      type: 'destination' as const,
      title: d.name,
      subtitle: d.tag,
      desc: d.desc,
      highlights: d.highlights
    }));

    return [...elementMatches, ...destinationMatches];
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#faf9f6] border border-[#bbb9b1]/60 rounded-xl shadow-2xl overflow-hidden font-jura text-[#3c444a]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#bbb9b1]/40 bg-white">
          <Search className="w-5 h-5 text-[#505960] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Zhejiang culture, tea, West Lake, Moganshan, water towns, cuisine..."
            className="w-full bg-transparent border-0 outline-hidden font-jura text-sm font-semibold text-[#3c444a] placeholder-[#9aa1a6]"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-[#505960] hover:text-[#3c444a] bg-transparent border-0 cursor-pointer ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-[#f5f4ef] border-b border-[#bbb9b1]/30 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#9aa1a6] font-bold shrink-0">Try:</span>
          {['Tea Culture', 'West Lake', 'Moganshan', 'Water Town', 'Arch Bridge', 'Rice'].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 bg-white hover:bg-[#eae8e3] border border-[#bbb9b1]/40 rounded-full text-[#505960] text-xs font-semibold shrink-0 cursor-pointer transition-colors"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-[#9aa1a6]">
              Type a keyword to discover Zhejiang landmarks, traditional arts, and natural scenery.
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#9aa1a6]">
              No matches found for &quot;{query}&quot;. Try searching &quot;Tea&quot;, &quot;Hangzhou&quot;, or &quot;Bridge&quot;.
            </div>
          ) : (
            searchResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.type === 'element') {
                    onSelectElement(item.key);
                    onClose();
                  }
                }}
                className={`p-3.5 bg-white rounded-lg border border-[#bbb9b1]/40 transition-all ${
                  item.type === 'element'
                    ? 'hover:border-[#749d94] hover:shadow-xs cursor-pointer'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {item.type === 'element' ? (
                      <Tag className="w-3.5 h-3.5 text-[#749d94]" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-[#b48570]" />
                    )}
                    <span className="font-kaisei text-base font-normal text-[#3c444a]">
                      {item.title}
                    </span>
                    <span className="text-xs text-[#749d94] font-semibold">({item.subtitle})</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#9aa1a6]">
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-[#505960] m-0 leading-relaxed">{item.desc}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
