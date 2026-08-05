import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WeddingStory } from '../types';

export const StoryReels: React.FC = () => {
  const { stories, setActiveStory, setActiveModal, user } = useApp();

  return (
    <div className="w-full py-4 border-b border-white/10 overflow-hidden">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-xs sm:text-sm font-serif font-bold text-white tracking-wider uppercase">
            Wedding Looks & Runway Stories
          </h3>
        </div>
        <span className="text-[11px] text-[#D4AF37] font-medium cursor-pointer hover:underline">
          Trending Reels
        </span>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1 px-1">
        
        {/* User's Add Story / Look button */}
        <div 
          onClick={() => setActiveModal('upload')}
          className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group"
          id="add-story-btn"
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-dashed border-[#D4AF37]/50 bg-[#111] flex items-center justify-center p-1 group-hover:border-[#D4AF37] transition-all">
            <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#D4AF37]">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-white/70 max-w-[68px] truncate text-center">
            Your Look
          </span>
        </div>

        {/* Stories list */}
        {stories.map((story: WeddingStory) => (
          <div
            key={story.id}
            onClick={() => {
              setActiveStory(story);
              setActiveModal('story_viewer');
            }}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group"
            id={`story-reel-${story.id}`}
          >
            {/* Story Ring (Sleek gold ring) */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2px] bg-gradient-to-tr from-[#D4AF37] via-amber-200 to-[#D4AF37] group-hover:scale-105 transition-transform shadow-md">
              <div className="w-full h-full rounded-full p-[2px] bg-[#050505]">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-white/70 max-w-[72px] truncate text-center group-hover:text-[#D4AF37]">
              {story.title}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
};
