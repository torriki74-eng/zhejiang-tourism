import React, { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { STORY_SENTENCES } from '../data/zhejiangData';

interface SentenceItemProps {
  sentence: { text: string; color: string };
  index: number;
  isInView: boolean;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
}

const SentenceItem: React.FC<SentenceItemProps> = ({
  sentence,
  index,
  isInView,
  hoveredIndex,
  setHoveredIndex
}) => {
  const isHovered = hoveredIndex === index;

  return (
    <motion.span
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      initial={{
        opacity: 0,
        y: 14,
        color: sentence.color
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              color: isHovered ? sentence.color : '#505960',
              transition: {
                opacity: {
                  duration: 0.6,
                  delay: 0.15 + index * 0.16,
                  ease: 'easeOut'
                },
                y: {
                  duration: 0.6,
                  delay: 0.15 + index * 0.16,
                  ease: 'easeOut'
                },
                color: isHovered
                  ? { duration: 0.2 }
                  : {
                      duration: 0.75,
                      delay: 0.45 + index * 0.16,
                      ease: 'easeInOut'
                    }
              }
            }
          : {
              opacity: 0,
              y: 14,
              color: sentence.color
            }
      }
      className="sentence cursor-default select-none inline"
    >
      {sentence.text}
    </motion.span>
  );
};

export const StorySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      ref={sectionRef}
      className="h-[1050px] max-md:h-[820px] relative grid grid-cols-[1fr_minmax(320px,460px)_1fr] max-md:grid-cols-1 items-center px-0 max-md:px-[6vw] overflow-hidden select-none"
      aria-label="Zhejiang introduction"
    >
      {/* Left Hand-drawn Grid Art */}
      <motion.img
        initial={{ opacity: 0, x: -24 }}
        animate={isInView ? { opacity: 0.85, x: 0 } : { opacity: 0, x: -24 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-[280px] max-h-[960px] h-auto object-contain self-center justify-self-start ml-0 pl-0 max-md:absolute max-md:w-[130px] max-md:max-h-[600px] max-md:left-[-15px] max-md:top-[15%] pointer-events-none"
        src="assets/elements/grid 2.svg"
        alt="Hand-drawn cultural grid guides left"
      />

      {/* Middle Story Copy with Sequential Colored Entrance and Interactive Hover */}
      <div className="text-[18px] max-md:text-[15px] leading-[1.55] text-center relative z-10 font-jura font-semibold text-[#505960]">
        <p className="mb-[23px]">
          <SentenceItem
            sentence={STORY_SENTENCES[0]}
            index={0}
            isInView={isInView}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
          <br />
          <SentenceItem
            sentence={STORY_SENTENCES[1]}
            index={1}
            isInView={isInView}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        </p>

        <p className="mb-[23px]">
          <SentenceItem
            sentence={STORY_SENTENCES[2]}
            index={2}
            isInView={isInView}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
          <br />
          <SentenceItem
            sentence={STORY_SENTENCES[3]}
            index={3}
            isInView={isInView}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
          <br />
          <SentenceItem
            sentence={STORY_SENTENCES[4]}
            index={4}
            isInView={isInView}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
          <br />
          <SentenceItem
            sentence={STORY_SENTENCES[5]}
            index={5}
            isInView={isInView}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
          <br />
          <SentenceItem
            sentence={STORY_SENTENCES[6]}
            index={6}
            isInView={isInView}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
          <br />
          <SentenceItem
            sentence={STORY_SENTENCES[7]}
            index={7}
            isInView={isInView}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        </p>
      </div>

      {/* Right Hand-drawn Grid Art */}
      <motion.img
        initial={{ opacity: 0, x: 24 }}
        animate={isInView ? { opacity: 0.85, x: 0 } : { opacity: 0, x: 24 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-[280px] max-h-[960px] h-auto object-contain self-center justify-self-end mr-0 pr-0 max-md:absolute max-md:w-[130px] max-md:max-h-[600px] max-md:left-auto max-md:right-[-15px] max-md:bottom-[13%] pointer-events-none"
        src="assets/elements/grid 3.svg"
        alt="Hand-drawn cultural grid guides right"
      />
    </section>
  );
};

