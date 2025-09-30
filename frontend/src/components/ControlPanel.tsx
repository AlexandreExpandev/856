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
  const [speed, setSpeed] = useState(5);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const countIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
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
  
  // Handle pause button click
  const handlePauseClick = useCallback(() => {
    if (systemState !== 'counting') return;
    setSystemState('paused');
    
    // Clear the interval when paused
    if (countIntervalRef.current) {
      clearInterval(countIntervalRef.current);
      countIntervalRef.current = null;
    }
  }, [systemState, setSystemState]);
  
  // Handle resume button click
  const handleResumeClick = useCallback(() => {
    if (systemState !== 'paused') return;
    setSystemState('counting');
  }, [systemState, setSystemState]);
  
  // Handle reset button click
  const handleResetClick = useCallback(() => {
    if (systemState === 'idle') return;
    
    // Clear any existing interval
    if (countIntervalRef.current) {
      clearInterval(countIntervalRef.current);
      countIntervalRef.current = null;
    }
    
    setSystemState('idle');
    setCount(0);
  }, [systemState, setSystemState, setCount]);
  
  // Handle speed change
  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseInt(e.target.value, 10));
  }, []);
  
  // Effect to handle counting logic
  useEffect(() => {
    if (systemState === 'counting') {
      // Calculate interval based on speed (inverse relationship - higher speed = shorter interval)
      const intervalTime = 1100 - (speed * 100); // 100ms to 1000ms range
      
      countIntervalRef.current = setInterval(() => {
        setCount(prevCount => {
          const newCount = prevCount + 1;
          if (newCount > 10) {
            // Stop counting when we reach 10
            if (countIntervalRef.current) {
              clearInterval(countIntervalRef.current);
              countIntervalRef.current = null;
            }
            setSystemState('finished');
            return 10;
          }
          return newCount;
        });
      }, intervalTime);
    }
    
    // Cleanup function to clear interval when component unmounts or state changes
    return () => {
      if (countIntervalRef.current) {
        clearInterval(countIntervalRef.current);
        countIntervalRef.current = null;
      }
    };
  }, [systemState, speed, setCount, setSystemState]);
  
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
        {systemState === 'paused' ? (
          <button 
            className="pause-button"
            onClick={handleResumeClick}
            aria-label="Continuar"
          >
            Continuar
          </button>
        ) : (
          <button 
            className="pause-button"
            onClick={handlePauseClick}
            disabled={systemState !== 'counting'}
            aria-label="Pausar"
          >
            Pausar
          </button>
        )}
        
        <button 
          className="reset-button"
          onClick={handleResetClick}
          disabled={systemState === 'idle'}
          aria-label="Reiniciar"
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
          value={speed}
          onChange={handleSpeedChange}
          disabled={systemState === 'idle' || systemState === 'finished'}
        />
      </div>
    </div>
  );
};

export default ControlPanel;