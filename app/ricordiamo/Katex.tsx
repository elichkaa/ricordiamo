import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface KatexProps {
  math: string;
  block?: boolean;
}

export const Katex: React.FC<KatexProps> = ({ math, block = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(math, containerRef.current, {
        throwOnError: false,
        displayMode: block
      });
    }
  }, [math, block]);

  return <div ref={containerRef} />;
};

export const InlineMath: React.FC<{ math: string }> = ({ math }) => (
  <Katex math={math} block={false} />
);

export const BlockMath: React.FC<{ math: string }> = ({ math }) => (
  <Katex math={math} block={true} />
);