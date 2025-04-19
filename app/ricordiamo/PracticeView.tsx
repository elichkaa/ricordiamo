import React, { useState, useRef, useEffect, useCallback } from 'react';
import { renderLatexContent } from './utils/latexUtils';

interface PracticeViewProps {
  getCurrentTargetText: () => string;
  repetitions: number;
  setRepetitions: (repetitions: number) => void;
  maxRepetitions: number;
  mode: 'single' | 'multi';
  currentLineIndex: number;
  lines: string[];
  handleReset: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  handleSectionComplete: (completedText: string) => void;
  speechLanguage?: string;
  autoPlayVoice?: boolean;
  updateCurrentText?: (newText: string, index: number) => void;
}

const PracticeView: React.FC<PracticeViewProps> = ({
  getCurrentTargetText,
  repetitions,
  setRepetitions,
  maxRepetitions,
  mode,
  currentLineIndex,
  lines,
  handleReset,
  goToPrevious,
  goToNext,
  handleSectionComplete,
  speechLanguage = "en-US",
  autoPlayVoice = false,
  updateCurrentText = () => {}
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [inputColor, setInputColor] = useState<string>('white');
  const [showTargetText, setShowTargetText] = useState<boolean>(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const hasPlayedRef = useRef<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>('');
  // Cache the current text to ensure it updates properly after editing
  const [currentText, setCurrentText] = useState<string>('');
  
  const userInputRef = useRef<HTMLTextAreaElement>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  // Keep the cached text updated
  useEffect(() => {
    setCurrentText(getCurrentTargetText());
  }, [getCurrentTargetText, lines, currentLineIndex]);

  const stripLatex = (text: string): string => {
    return text
      .replace(/\$\$(.*?)\$\$/g, "")
      .replace(/\$(.*?)\$/g, ""); 
  };

  const getTextForSpeech = useCallback((text: string): string => {
    return text
      .replace(/\$\$(.*?)\$\$/g, "math expression")
      .replace(/\$(.*?)\$/g, "math expression");
  }, []);

  // Update editText when current text changes
  useEffect(() => {
    setEditText(currentText);
  }, [currentText]);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Auto-hide text after 1/3 of repetitions, but don't force it
  useEffect(() => {
    const hideTextThreshold = Math.ceil(maxRepetitions / 3);
    if (repetitions === hideTextThreshold) {
      setShowTargetText(false);
    }
  }, [repetitions, maxRepetitions]);

  useEffect(() => {
    if (userInputRef.current && !isEditing) {
      userInputRef.current.focus();
    }
  }, [isEditing]);

  // Focus on edit textarea when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (autoPlayVoice && userInput === '' && !hasPlayedRef.current && showTargetText && !isEditing) {
      hasPlayedRef.current = true;
      
      setTimeout(() => {
        speakText();
      }, 200);
    }
    
    return () => {
      hasPlayedRef.current = false;
    };
  }, [repetitions, currentLineIndex, autoPlayVoice, userInput, showTargetText, isEditing]);

  useEffect(() => {
    if (!showTargetText && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [showTargetText]);

  const speakText = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const textForSpeech = getTextForSpeech(currentText);
      const utterance = new SpeechSynthesisUtterance(textForSpeech);
      utterance.lang = speechLanguage;
      
      const matchingVoices = voices.filter(voice => voice.lang.startsWith(speechLanguage));
      if (matchingVoices.length > 0) {
        utterance.voice = matchingVoices[0];
      }
      
      console.log(`Speaking in language: ${speechLanguage}`);
      window.speechSynthesis.speak(utterance);
    }
  }, [currentText, speechLanguage, voices, getTextForSpeech]);

  const checkInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    setUserInput(newInput);
    
    const targetText = currentText;
    
    const normalizedInput = newInput.trim();
    const normalizedTarget = targetText.trim();
    
    if (normalizedInput === normalizedTarget) {
      setInputColor('green');
      const newRepetitions = repetitions + 1;
      setRepetitions(newRepetitions);
      
      if (newRepetitions >= maxRepetitions) {
        handleSectionComplete(targetText);
      }
      
      setTimeout(() => {
        setUserInput('');
        setInputColor('white');
      }, 500);
    } else {
      const isCorrectSoFar = normalizedTarget.startsWith(normalizedInput);
      setInputColor(isCorrectSoFar ? 'white' : 'red');
    }
  }, [currentText, repetitions, maxRepetitions, handleSectionComplete, setRepetitions]);

  const toggleShowText = useCallback(() => {
    setShowTargetText(prevState => !prevState);
  }, []);

  const startEditing = useCallback(() => {
    setIsEditing(true);
    setEditText(currentText);
  }, [currentText]);

  const saveEdit = useCallback(() => {
    updateCurrentText(editText, currentLineIndex);
    setCurrentText(editText); // Immediately update local state
    setIsEditing(false);
    // Reset repetitions for this modified section
    setRepetitions(0);
  }, [editText, currentLineIndex, updateCurrentText, setRepetitions]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditText(currentText);
  }, [currentText]);

  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-gray-700 dark:text-gray-200">
          Repetition: <span id="repetition-counter">{repetitions + 1}/{maxRepetitions}</span>
        </p>
        <div className="flex gap-2">
          {!isEditing && (
            <button
              onClick={startEditing}
              className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              title="Edit text"
            >
              Edit Text
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
            title="Exit memorization"
          >
            Exit
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800 mt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Edit Text:</p>
          <textarea
            ref={editInputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full h-32 p-3 border rounded-lg dark:bg-gray-800 dark:text-white mb-3"
            placeholder="Edit the text here..."
          />
          
          <div className="flex justify-end gap-2">
            <button
              onClick={cancelEdit}
              className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800 mt-4">
            {showTargetText ? (
              <>
                <pre id="target-text" className="whitespace-pre-wrap break-words text-gray-800 dark:text-gray-100">
                  {renderLatexContent(currentText)}
                </pre>
                <div className="flex justify-end mt-2">
                  <button 
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                    onClick={toggleShowText}
                    title="Hide text"
                  >
                    Hide text
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                <p>Text hidden - try to recall from memory</p>
                <button 
                  className="mt-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={toggleShowText}
                  title="Show text"
                >
                  Show text
                </button>
              </div>
            )}
          </div>
          
          <textarea
            ref={userInputRef}
            value={userInput}
            onChange={checkInput}
            className="w-full h-32 p-3 border rounded-lg dark:bg-gray-800 dark:text-white mt-4"
            style={{ color: inputColor }}
            placeholder="Type the text above here..."
          />

          <div className="flex justify-end mt-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {showPreview ? "Hide LaTeX Preview" : "Show LaTeX Preview"}
            </button>
          </div>
          
          {showPreview && userInput.trim() !== "" && (
            <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800 mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">LaTeX Preview:</p>
              <div className="whitespace-pre-wrap break-words text-gray-800 dark:text-gray-100">
                {renderLatexContent(userInput)}
              </div>
            </div>
          )}
          
          {mode === 'single' && (
            <div className="flex justify-between items-center mt-4">
              <button
                id="prev"
                onClick={goToPrevious}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentLineIndex === 0}
                title="Previous"
              >
                Previous
              </button>
              <button 
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                onClick={speakText}
                title="Listen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-1">
                  <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                  <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
                  <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
                </svg>
                Listen
              </button>
              <button
                id="next"
                onClick={goToNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentLineIndex === lines.length - 1}
                title="Next"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PracticeView;