import React, {useState} from 'react';
import { renderLatexContent } from './utils/latexUtils'

interface InputSectionProps {
  text: string;
  setText: (text: string) => void;
  mode: 'single' | 'multi';
  setMode: (mode: 'single' | 'multi') => void;
  repetitionsInput: string;
  handleRepetitionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startMemorization: () => void;
  speechLanguage?: string;
  setSpeechLanguage?: (speechLanguage: string) => void;
  autoPlayVoice: boolean;
  setAutoPlayVoice: (autoPlay: boolean) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  text,
  setText,
  mode,
  setMode,
  repetitionsInput,
  handleRepetitionChange,
  startMemorization,
  speechLanguage = 'en-US',
  setSpeechLanguage = () => {},
  autoPlayVoice = false,
  setAutoPlayVoice = () => {}
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (fileEvent) => {
        if (fileEvent.target?.result) {
          setText(fileEvent.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="w-full space-y-6 px-4" id="input-section">
      <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-200">
            Enter text to memorize or upload a file:
          </p>
          <textarea
            className="w-full h-64 p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-100"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text here... Use $...$ for inline LaTeX and $$...$$ for block LaTeX."
          />
        </div>
         <div className="flex items-center">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800"
            >
              {showPreview ? 'Hide LaTeX Preview' : 'Show LaTeX Preview'}
            </button>
        </div>
        {showPreview && (
          <div className="latex-preview p-4 bg-gray-50 dark:bg-gray-800 rounded border">
            <h3 className="font-semibold mb-2">LaTeX Preview</h3>
            {renderLatexContent(text)}
          </div>
        )}
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-gray-700 dark:text-gray-200">
              <input
                type="radio"
                name="mode"
                value="single"
                checked={mode === 'single'}
                onChange={() => setMode('single')}
                className="mr-2"
              />
              Single Line Mode
            </label>
            <label className="text-gray-700 dark:text-gray-200">
              <input
                type="radio"
                name="mode"
                value="multi"
                checked={mode === 'multi'}
                onChange={() => setMode('multi')}
                className="mr-2"
              />
              Multi-Line Mode (separated by blank lines)
            </label>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label className="text-gray-700 dark:text-gray-200 mr-2">
                Repetitions:
              </label>
              <input
                type="number"
                min="1"
                value={repetitionsInput}
                onChange={handleRepetitionChange}
                className="w-16 p-1 border rounded dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">
                Text language:
                <select 
                value={speechLanguage}
                onChange={(e) => setSpeechLanguage(e.target.value)}
                className="ml-2 p-1 border rounded"
                >
                <option value="en-US">English (US)</option>
                <option value="de-DE">German</option>
                <option value="fr-FR">French</option>
                <option value="es-ES">Spanish</option>
                <option value="it-IT">Italian</option>
                <option value="ja-JP">Japanese</option>
                <option value="zh-CN">Chinese (Simplified)</option>
                <option value="ru-RU">Russian</option>
                <option value="pt-BR">Portuguese (Brazil)</option>
                <option value="nl-NL">Dutch</option>
                <option value="pl-PL">Polish</option>
                <option value="sv-SE">Swedish</option>
                </select>
            </label>
            </div>

            <div className="flex items-center">
                <input
                type="checkbox"
                id="autoPlayVoice"
                checked={autoPlayVoice}
                onChange={(e) => setAutoPlayVoice(e.target.checked)}
                className="mr-2"
                />
                <label htmlFor="autoPlayVoice" className="text-gray-700 dark:text-gray-200">
                Automatically play voice on each repetition
                </label>
            </div>
            
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center gap-3 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </svg>
              Upload File
              <input
                type="file"
                id="fileInput"
                onChange={handleFileUpload}
                className="hidden"
                accept=".txt"
              />
            </label>
            
            <button
              onClick={startMemorization}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              id="start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;