import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Move } from 'lucide-react';

interface PiecePosition {
  id: string;
  name: string;
  src: string;
  alt: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  defaultTop: number;
  defaultRightPercent: number;
}

export const HeroDragStage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const highestZIndexRef = useRef<number>(20);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const initialPieces: PiecePosition[] = [
    {
      id: 'building',
      name: 'Jiangnan Architecture',
      src: '/assets/elements/building.svg',
      alt: 'Jiangnan building',
      x: 0,
      y: 0,
      width: 350,
      height: 320,
      zIndex: 10,
      defaultTop: 75,
      defaultRightPercent: 8
    },
    {
      id: 'tea',
      name: 'Tea Culture',
      src: '/assets/elements/tea.svg',
      alt: 'Tea leaves',
      x: 0,
      y: 0,
      width: 175,
      height: 120,
      zIndex: 14,
      defaultTop: 185,
      defaultRightPercent: 49
    },
    {
      id: 'lake',
      name: 'Water & Lake',
      src: '/assets/elements/lake.svg',
      alt: 'Lake',
      x: 0,
      y: 0,
      width: 410,
      height: 225,
      zIndex: 8,
      defaultTop: 310,
      defaultRightPercent: 30
    },
    {
      id: 'mountain',
      name: 'Mountain',
      src: '/assets/elements/mountain.svg',
      alt: 'Mountain',
      x: 0,
      y: 0,
      width: 330,
      height: 340,
      zIndex: 12,
      defaultTop: 390,
      defaultRightPercent: 6
    }
  ];

  const [pieces, setPieces] = useState<PiecePosition[]>(initialPieces);
  const dragInfoRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    initialPieceX: number;
    initialPieceY: number;
  } | null>(null);

  const handlePointerDown = (id: string, e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    
    highestZIndexRef.current += 1;
    const currentZ = highestZIndexRef.current;
    
    setPieces(prev =>
      prev.map(p => (p.id === id ? { ...p, zIndex: currentZ } : p))
    );
    
    const targetPiece = pieces.find(p => p.id === id);
    if (!targetPiece) return;

    dragInfoRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      initialPieceX: targetPiece.x,
      initialPieceY: targetPiece.y
    };

    setActiveId(id);
    setHasInteracted(true);
    
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragInfoRef.current || !activeId) return;
    const info = dragInfoRef.current;
    const deltaX = e.clientX - info.startX;
    const deltaY = e.clientY - info.startY;

    setPieces(prev =>
      prev.map(p => {
        if (p.id === info.id) {
          return {
            ...p,
            x: info.initialPieceX + deltaX,
            y: info.initialPieceY + deltaY
          };
        }
        return p;
      })
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragInfoRef.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      dragInfoRef.current = null;
      setActiveId(null);
    }
  };

  const handleReset = () => {
    setPieces(initialPieces);
    setHasInteracted(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[740px] max-md:min-h-[500px] pointer-events-auto select-none"
      aria-label="Playful draggable Zhejiang visual elements"
    >
      {/* Top Helper Button: Reset Composition & Helper Cue */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-3">
        {hasInteracted && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-jura font-semibold text-[#505960] bg-white/90 backdrop-blur-sm border border-[#bbb9b1]/70 rounded-full shadow-xs hover:text-[#3c444a] hover:border-[#3c444a] transition-all cursor-pointer"
            title="Reset element positions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Composition</span>
          </button>
        )}
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-jura text-[#505960]/80 bg-white/60 backdrop-blur-xs border border-[#bbb9b1]/40 rounded-full">
          <Move className="w-3 h-3 text-[#749d94]" />
          <span>Drag elements freely</span>
        </div>
      </div>

      {pieces.map(piece => {
        const isDragging = activeId === piece.id;
        
        return (
          <button
            key={piece.id}
            data-drag
            title={piece.name}
            onPointerDown={e => handlePointerDown(piece.id, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`draggable ${piece.id} ${isDragging ? 'is-dragging' : ''}`}
            style={{
              zIndex: piece.zIndex,
              top: `${piece.defaultTop}px`,
              right: `${piece.defaultRightPercent}%`,
              width: `${piece.width}px`,
              height: `${piece.height}px`,
              transform: `translate3d(${piece.x}px, ${piece.y}px, 0px) ${
                isDragging ? 'scale(1.06) rotate(1deg)' : ''
              }`,
              touchAction: 'none'
            }}
          >
            <img src={piece.src} alt={piece.alt} draggable={false} />
          </button>
        );
      })}
    </div>
  );
};
