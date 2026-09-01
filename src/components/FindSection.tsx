import React, { useState } from 'react';
import { ElementKey } from '../types';
import { ELEMENTS_DATA } from '../data/zhejiangData';

interface FindSectionProps {
  onOpenExplore?: () => void;
}

export const FindSection: React.FC<FindSectionProps> = ({ onOpenExplore }) => {
  const [activeElement, setActiveElement] = useState<ElementKey | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const defaultDescription =
    'There is no single route through Zhejiang.\nBegin with an element that feels like you, combine it with another, and uncover experiences and places shaped by that connection.';

  const handleMouseEnter = (key: ElementKey) => {
    setIsSwitching(true);
    setTimeout(() => {
      setActiveElement(key);
      setIsSwitching(false);
    }, 150);
  };

  const handleMouseLeave = () => {
    setIsSwitching(true);
    setTimeout(() => {
      setActiveElement(null);
      setIsSwitching(false);
    }, 150);
  };

  const currentLabel = activeElement
    ? ELEMENTS_DATA[activeElement].label
    : 'HOVER AN ELEMENT TO BEGIN';

  const currentColor = activeElement
    ? ELEMENTS_DATA[activeElement].themeColor
    : '#9aa1a6';

  const currentDescription = activeElement
    ? ELEMENTS_DATA[activeElement].description
    : defaultDescription;

  return (
    <section
      className="min-h-[880px] max-md:min-h-[760px] relative grid grid-cols-[1fr_minmax(320px,460px)_1fr] max-md:grid-cols-1 items-center py-[40px] pb-[70px] max-md:py-[35px] max-md:px-[6vw] overflow-hidden select-none"
      id="find"
      aria-label="Explore Zhejiang elements"
    >
      {/* 6 Ambient Cultural Elements with hover highlight (matching screenshot layout) */}

      {/* 1. Building - Top Left */}
      <div
        onMouseEnter={() => handleMouseEnter('building')}
        onMouseLeave={handleMouseLeave}
        className="lower-piece building w-[280px] h-[260px] max-md:w-[150px] max-md:h-[140px] left-[30px] max-md:left-[10px] top-[4%] max-md:top-[3%] z-10"
        data-element="building"
        title="Jiangnan Architecture"
      >
        <img src="./assets/elements/building-1.svg" alt="Jiangnan architecture" />
      </div>

      {/* 2. Food / Rice - Center Left (overlapping below building) */}
      <div
        onMouseEnter={() => handleMouseEnter('food')}
        onMouseLeave={handleMouseLeave}
        className="lower-piece food w-[190px] h-[198px] max-md:w-[110px] max-md:h-[115px] left-[175px] max-md:left-[48%] top-[41%] max-md:top-[18%] z-30"
        data-element="food"
        title="Rice Food Culture"
      >
        <img src="./assets/elements/rice.svg" alt="Rice food culture" />
      </div>

      {/* 3. Bridge - Bottom Left */}
      <div
        onMouseEnter={() => handleMouseEnter('bridge')}
        onMouseLeave={handleMouseLeave}
        className="lower-piece bridge w-[330px] h-[180px] max-md:w-[170px] max-md:h-[95px] left-[25px] max-md:left-[10px] bottom-[4%] max-md:bottom-[4%] z-20"
        data-element="bridge"
        title="Arch Bridge"
      >
        <img src="./assets/elements/bridge-1.svg" alt="Arch bridge" />
      </div>

      {/* 4. Mountain - Top Right */}
      <div
        onMouseEnter={() => handleMouseEnter('mountain')}
        onMouseLeave={handleMouseLeave}
        className="lower-piece mountain w-[330px] h-[410px] max-md:w-[175px] max-md:h-[220px] right-[35px] max-md:right-[10px] top-[3%] max-md:top-[3%] z-10"
        data-element="mountain"
        title="Mountain"
      >
        <img src=".../assets/elements/mountain-1.svg" alt="Mountain" />
      </div>

      {/* 5. Lake - Center Right (overlapping below mountain) */}
      <div
        onMouseEnter={() => handleMouseEnter('lake')}
        onMouseLeave={handleMouseLeave}
        className="lower-piece lake w-[390px] h-[210px] max-md:w-[200px] max-md:h-[110px] right-[65px] max-md:right-[30px] top-[43%] max-md:top-[66%] z-20"
        data-element="lake"
        title="Water"
      >
        <img src="./assets/elements/lake-1.svg" alt="Water" />
      </div>

      {/* 6. Tea - Bottom Right */}
      <div
        onMouseEnter={() => handleMouseEnter('tea')}
        onMouseLeave={handleMouseLeave}
        className="lower-piece tea w-[170px] h-[125px] max-md:w-[100px] max-md:h-[75px] right-[115px] max-md:right-[14%] bottom-[8%] max-md:bottom-[5%] z-30"
        data-element="tea"
        title="Tea Culture"
      >
        <img src="./assets/elements/tea-1.svg" alt="Tea culture" />
      </div>

      {/* Center Narrative Core */}
      <div className="col-start-2 max-md:col-start-1 text-center z-40 flex flex-col items-center justify-center px-4">
        <h2 className="font-kaisei font-normal text-[54px] max-md:text-[40px] leading-[1.04] tracking-[-0.03em] m-0 mb-[22px] text-[#3c444a]">
          Find your
          <br />
          Zhejiang.
        </h2>

        <div className="max-w-[430px] min-h-[90px] text-[14.5px] max-md:text-[13.5px] leading-[1.55] grid place-items-center font-jura font-semibold text-[#505960]">
          <p
            className={`m-0 whitespace-pre-line transition-all duration-300 ${
              isSwitching ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            {currentDescription}
          </p>
        </div>

        <div
          className="font-jura text-[13px] max-md:text-[12px] font-bold tracking-[0.14em] uppercase mt-[18px] min-h-[22px] transition-all duration-300"
          style={{
            color: activeElement ? currentColor : '#b48570',
            transform: activeElement ? 'scale(1.03)' : 'scale(1)'
          }}
        >
          {currentLabel}
        </div>

        {/* EXPLORE Button */}
        <button
          onClick={onOpenExplore}
          className="mt-[22px] border-0 bg-[#c5b4a9] hover:bg-[#b48570] text-white font-jura font-semibold tracking-[0.06em] text-[13.5px] px-[32px] py-[8px] rounded-[2px] cursor-pointer transition-colors duration-200 shadow-xs"
        >
          EXPLORE
        </button>
      </div>
    </section>
  );
};
