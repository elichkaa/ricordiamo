import React, { useState } from 'react';
import InputSection from './InputSection';
import MemorizationSection from './MemorizationSection';

export function Ricordiamo() {
  const [text, setText] = useState<string>('');
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [repetitions, setRepetitions] = useState<number>(0);
  const [maxRepetitions, setMaxRepetitions] = useState<number>(10);
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [isMemorizationStarted, setIsMemorizationStarted] = useState<boolean>(false);
  const [successState, setSuccessState] = useState<{
    show: boolean;
    isComplete: boolean;
    text: string;
  }>({ show: false, isComplete: false, text: '' });
  const [repetitionsInput, setRepetitionsInput] = useState<string>(maxRepetitions.toString());
  const [speechLanguage, setSpeechLanguage] = useState<string>('en-US');
  const [autoPlayVoice, setAutoPlayVoice] = useState<boolean>(false);

  const startMemorization = () => {
    const filteredLines = text.split('\n').filter(line => line.trim() !== '');
    
    if (filteredLines.length === 0) {
      alert('Please enter text to memorize.');
      return;
    }
    
    setLines(filteredLines);
    setCurrentLineIndex(0);
    setRepetitions(0);
    setIsMemorizationStarted(true);
    setSuccessState({ show: false, isComplete: false, text: '' });
  };

  const handleRepetitionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setRepetitionsInput(inputValue);
    
    const numValue = parseInt(inputValue);
    if (!isNaN(numValue) && numValue > 0) {
      setMaxRepetitions(numValue);
    }
  };

  const handleReset = () => {
    setIsMemorizationStarted(false);
    setSuccessState({ show: false, isComplete: false, text: '' });
  };

  const goToPrevious = () => {
    if (currentLineIndex > 0) {
      setRepetitions(0);
      setCurrentLineIndex(currentLineIndex - 1);
      setSuccessState({ show: false, isComplete: false, text: '' });
    }
  };

  const goToNext = () => {
    if (currentLineIndex < lines.length - 1) {
      setRepetitions(0);
      setCurrentLineIndex(currentLineIndex + 1);
      setSuccessState({ show: false, isComplete: false, text: '' });
    }
  };

  const handleSectionComplete = (completedText: string) => {
    setSuccessState({ show: true, isComplete: false, text: completedText });
    
    setTimeout(() => {
      setSuccessState({ show: false, isComplete: false, text: '' });
      
      if (mode === 'multi') {
        let endIndex = lines.slice(currentLineIndex + 1).findIndex(line => line.trim() === '') + 1;
        const nextIndex = (endIndex > 0) ? currentLineIndex + endIndex : lines.length;
        
        if (nextIndex >= lines.length) {
          setSuccessState({ show: true, isComplete: true, text: lines.join('\n') });
          return;
        }
        
        setRepetitions(0);
        setCurrentLineIndex(nextIndex);
      } else {
        const nextIndex = currentLineIndex + 1;
        if (nextIndex >= lines.length) {
          setSuccessState({ show: true, isComplete: true, text: lines.join('\n') });
          return;
        }
        
        setRepetitions(0);
        setCurrentLineIndex(nextIndex);
      }
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 my-6">
        Ricordiamo!
      </h1>
      
      {!isMemorizationStarted ? (
        <InputSection 
          text={text}
          setText={setText}
          mode={mode}
          setMode={setMode}
          repetitionsInput={repetitionsInput}
          handleRepetitionChange={handleRepetitionChange}
          speechLanguage={speechLanguage}
          setSpeechLanguage={setSpeechLanguage}
          startMemorization={startMemorization}
          autoPlayVoice={autoPlayVoice}
          setAutoPlayVoice={setAutoPlayVoice}
        />
      ) : (
        <MemorizationSection
          lines={lines}
          currentLineIndex={currentLineIndex}
          repetitions={repetitions}
          setRepetitions={setRepetitions}
          maxRepetitions={maxRepetitions}
          mode={mode}
          handleReset={handleReset}
          successState={successState}
          goToPrevious={goToPrevious}
          goToNext={goToNext}
          speechLanguage={speechLanguage}
          handleSectionComplete={handleSectionComplete}
          autoPlayVoice={autoPlayVoice}
        />
      )}
    </div>
  );
}

export default Ricordiamo;