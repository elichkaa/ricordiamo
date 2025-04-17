import React from 'react';
import SuccessMessage from './SuccessMessage';
import PracticeView from './PracticeView';

interface MemorizationSectionProps {
  lines: string[];
  currentLineIndex: number;
  repetitions: number;
  setRepetitions: (repetitions: number) => void;
  maxRepetitions: number;
  mode: 'single' | 'multi';
  handleReset: () => void;
  successState: {
    show: boolean;
    isComplete: boolean;
    text: string;
  };
  goToPrevious: () => void;
  goToNext: () => void;
  handleSectionComplete: (completedText: string) => void;
  speechLanguage?: string;
  autoPlayVoice?: boolean;
}

const MemorizationSection: React.FC<MemorizationSectionProps> = ({
  lines,
  currentLineIndex,
  repetitions,
  setRepetitions,
  maxRepetitions,
  mode,
  handleReset,
  successState,
  goToPrevious,
  goToNext,
  handleSectionComplete,
  speechLanguage = 'en-US',
  autoPlayVoice = false
}) => {
  const getCurrentTargetText = (): string => {
    if (mode === 'multi') {
      const startIndex = currentLineIndex;
      let endIndex = lines.slice(currentLineIndex + 1).findIndex(line => line.trim() === '');
      endIndex = (endIndex !== -1) ? currentLineIndex + endIndex + 1 : lines.length;
      return lines.slice(startIndex, endIndex).join('\n');
    } else {
      return lines[currentLineIndex];
    }
  };

  return (
    <div className="w-full space-y-6 px-4" id="memorization-section">
      <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-6">
        {successState.show ? (
          <SuccessMessage 
            text={successState.text} 
            handleReset={handleReset}
          />
        ) : (
          <PracticeView
            getCurrentTargetText={getCurrentTargetText}
            repetitions={repetitions}
            setRepetitions={setRepetitions}
            maxRepetitions={maxRepetitions}
            mode={mode}
            currentLineIndex={currentLineIndex}
            lines={lines}
            handleReset={handleReset}
            goToPrevious={goToPrevious}
            goToNext={goToNext}
            speechLanguage={speechLanguage}
            handleSectionComplete={handleSectionComplete}
            autoPlayVoice={autoPlayVoice}
          />
        )}
      </div>
    </div>
  );
};

export default MemorizationSection;