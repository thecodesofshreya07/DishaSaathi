import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { VoiceAssistantModal } from './VoiceAssistantModal';

interface VoiceSearchButtonProps {
  onTranscript?: (transcript: string) => void;
  autoNavigate?: boolean;
  className?: string;
}

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onTranscript,
  autoNavigate = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={`p-2 rounded-full text-[#1B4D3E] dark:text-[#6EE7B7] hover:bg-[#EAF2ED] dark:hover:bg-[#153127] transition-all cursor-pointer flex items-center justify-center shrink-0 ${className}`}
        title="Speak your goal (Hindi, Marathi, English)"
        aria-label="Voice input"
      >
        <Mic className="w-4 h-4 hover:scale-110 transition-transform" />
      </button>

      <VoiceAssistantModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onTranscriptReady={onTranscript}
        autoNavigateToCreate={autoNavigate}
      />
    </>
  );
};
