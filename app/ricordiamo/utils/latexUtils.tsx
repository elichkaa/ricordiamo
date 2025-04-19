import React from 'react';
import { InlineMath, BlockMath } from '../Katex';

export const renderLatexContent = (content: string) => {
  const lines = content.split('\n');
  
  return (
    <>
      {lines.map((line, lineIndex) => {
        if (line.startsWith('$$') && line.endsWith('$$')) {
          try {
            const mathContent = line.slice(2, -2);
            return (
              <div key={lineIndex} className="my-2">
                <BlockMath math={mathContent} />
              </div>
            );
          } catch (error) {
            return <div key={lineIndex} className="text-red-500">Error rendering LaTeX: {line}</div>;
          }
        }
        
        const parts = [];
        let currentText = '';
        let inMath = false;
        
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '$') {
            if (inMath) {
              if (currentText) {
                parts.push({ type: 'math', content: currentText });
                currentText = '';
              }
              inMath = false;
            } else {
              if (currentText) {
                parts.push({ type: 'text', content: currentText });
                currentText = '';
              }
              inMath = true;
            }
          } else {
            currentText += line[i];
          }
        }
        
        if (currentText) {
          parts.push({ type: inMath ? 'math' : 'text', content: currentText });
        }
        
        return (
          <React.Fragment key={lineIndex}>
            <span className="inline-flex flex-wrap items-center">
              {parts.map((part, partIndex) => {
                if (part.type === 'text') {
                  return <span key={partIndex}>{part.content}</span>;
                } else {
                  try {
                    return (
                      <span key={partIndex} className="mx-1">
                        <InlineMath math={part.content} />
                      </span>
                    );
                  } catch (error) {
                    return <span key={partIndex} className="text-red-500">Error: {part.content}</span>;
                  }
                }
              })}
            </span>
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </>
  );
};