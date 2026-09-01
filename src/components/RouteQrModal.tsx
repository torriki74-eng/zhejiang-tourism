import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Check, Copy, Download, Smartphone, MapPin, Sparkles } from 'lucide-react';
import { SavedPlace } from '../types';

interface RouteQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeName: string;
  themeColor: string;
  themeSvg?: string;
  places: SavedPlace[];
}

export const RouteQrModal: React.FC<RouteQrModalProps> = ({
  isOpen,
  onClose,
  themeName,
  themeColor,
  themeSvg = '/assets/water village.svg',
  places
}) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Prepare a rich payload string for the QR code
  // This can be a web preview URL or structured itinerary payload
 // 加上 window.location.pathname，确保 GitHub Pages 子路径（如 /my-repo/）不会被丢掉
const currentBaseUrl = typeof window !== 'undefined'
  ? `${window.location.origin}${window.location.pathname}`
  : 'https://curiouschina.travel/';

const qrDataUrl = `${currentBaseUrl}?theme=${encodeURIComponent(themeName)}&places=${places.map(p => encodeURIComponent(p.name)).join(',')}`;

  const itineraryText = `[CURIOUS CHINA] Zhejiang Travel Route: ${themeName}\n\n` +
    places.map((p, i) => `${i + 1}. ${p.name} (${p.city})\n   - ${p.text}`).join('\n\n') +
    `\n\nGenerated on Curious China · Travel beyond the familiar`;

  const handleCopy = () => {
    navigator.clipboard.writeText(itineraryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    // Locate the SVG QR code and trigger a download
    const svgElement = cardRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `Zhejiang_Route_${themeName.replace(/\s+/g, '_')}_QRCode.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#23292e]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-[460px] bg-[#fbf9f5] rounded-[14px] border border-[#e4ded5] shadow-[0_16px_40px_rgba(30,35,40,0.14)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-6 pt-5 pb-4 border-b border-[#eee8df] flex items-center justify-between bg-white/70">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full bg-[#b48570]"
              />
              <span className="font-jura text-xs font-semibold tracking-wider text-[#7e878e] uppercase">
                Mobile Route Sync
              </span>
            </div>
            <h2 className="font-kaisei text-[22px] font-normal text-[#3c444a] m-0 mt-0.5">
              Scan to Save Itinerary
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-[6px] flex items-center justify-center text-[#8a9299] hover:text-[#3c444a] hover:bg-[#ede7dd]/60 transition-colors border-0 bg-transparent cursor-pointer p-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col items-center text-center">
          {/* QR Code Container */}
          <div
            ref={cardRef}
            className="p-5 bg-white rounded-[10px] border border-[#e8e2d8] shadow-[0_4px_16px_rgba(0,0,0,0.03)] mb-4 flex flex-col items-center"
          >
            <QRCodeSVG
              value={qrDataUrl}
              size={180}
              level="H"
              fgColor="#3c444a"
              bgColor="#ffffff"
              includeMargin={true}
              imageSettings={{
                src: themeSvg,
                x: undefined,
                y: undefined,
                height: 38,
                width: 38,
                opacity: 1,
                excavate: true,
              }}
            />
            <div className="mt-3 flex items-center gap-1.5 text-[#8a9299] font-jura text-[12px]">
              <Smartphone className="w-3.5 h-3.5 text-[#b48570]" />
              <span>Scan with phone camera</span>
            </div>
          </div>

          {/* Cultural Title and Saved Destinations Note (no extra container box) */}
          <div className="w-full text-center mb-5">
            <h3 className="font-kaisei text-[19px] font-normal text-[#3c444a] m-0">
              {themeName}
            </h3>
            <p className="font-jura text-[12.5px] text-[#8e959b] mt-1 m-0">
              {places.length} destinations saved
            </p>
          </div>

          {/* Modal Action Buttons */}
          <div className="w-full flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 px-4 rounded-[8px] border border-[#d8d2c7] bg-white hover:bg-[#faf7f2] text-[#3c444a] font-jura text-[13px] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#729267]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#8a9299]" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-[8px] text-white bg-[#b48570] hover:bg-[#9e6f5c] font-jura text-[13px] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors border-0 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
