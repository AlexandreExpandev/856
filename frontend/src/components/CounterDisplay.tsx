import React from 'react';

interface CounterDisplayProps {
  count: number;
}

const CounterDisplay: React.FC<CounterDisplayProps> = ({ count }) => {
  // Only display the count if it's greater than 0 (when counting has started)\n  const displayValue = count > 0 ? count : '';\n  \n  return (\n    <div className="counter-display">\n      {displayValue}\n    </div>\n  );\n};\n\nexport default CounterDisplay;