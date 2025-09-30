import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ControlPanelProps {
  systemState: 'idle' | 'counting' | 'paused' | 'finished';
  setSystemState: React.Dispatch<React.SetStateAction<'idle' | 'counting' | 'paused' | 'finished'>>;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  systemState, 
  setSystemState,
  setCount 
}) => {
  const [isButtonFlashing, setIsButtonFlashing] = useState(false);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  
  // Handle start button click
  const handleStartClick = useCallback(() => {
    if (systemState !== 'idle') return;
    
    // Visual feedback
    setIsButtonFlashing(true);
    setTimeout(() => setIsButtonFlashing(false), 500);
    
    // Update state
    setSystemState('counting');
    setCount(1); // Set initial count to 1 as per BR-002
  }, [systemState, setSystemState, setCount]);
  
  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only respond to Space key when start button is focused
      if (event.code === 'Space' && document.activeElement === startButtonRef.current) {
        event.preventDefault();
        handleStartClick();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleStartClick]);
  
  return (
    <div className="control-panel">
      <button 
        ref={startButtonRef}
        className={`start-button ${isButtonFlashing ? 'start-button-flash' : ''}`}
        onClick={handleStartClick}
        disabled={systemState !== 'idle'}
        aria-label="Iniciar Contagem"
      >
        Iniciar Contagem
      </button>
      
      <div className="control-buttons">
        <button 
          className="pause-button"
          disabled={systemState !== 'counting'}
        >
          Pausar
        </button>
        
        <button 
          className="reset-button"
          disabled={systemState === 'idle'}
        >
          Reiniciar
        </button>
      </div>
      
      <div className="speed-control">
        <label htmlFor="speed-slider">Velocidade:</label>
        <input 
          type="range" 
          id="speed-slider" 
          min="1" 
          max="10" 
          defaultValue="5"
          disabled={systemState === 'idle'}
        />
      </div>
    </div>
  );
};

export default ControlPanel;
