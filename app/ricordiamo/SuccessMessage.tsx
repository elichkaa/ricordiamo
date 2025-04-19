import React from 'react';
import { renderLatexContent } from './utils/latexUtils';

interface SuccessMessageProps {
  text: string;
  handleReset: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  text, 
  handleReset 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
          🎉 Congratulations! 🎉
        </h2>
        <p className="text-gray-700 dark:text-gray-200">
          You have successfully memorized all the text!
        </p>
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-auto max-h-64">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
          Full Text:
        </h3>
        <pre className="whitespace-pre-wrap break-words text-gray-800 dark:text-gray-100">
          {renderLatexContent(text)}
        </pre>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;