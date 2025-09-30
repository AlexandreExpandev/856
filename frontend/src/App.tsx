import React, { useState } from 'react';
import './App.css';
import CounterDisplay from './components/CounterDisplay';
import ControlPanel from './components/ControlPanel';

function App() {
  const [count, setCount] = useState<number>(0);
  const [systemState, setSystemState] = useState<'idle' | 'counting' | 'paused' | 'finished'>('idle');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Contador de 1 a 10</h1>
        <CounterDisplay count={count} />
        <ControlPanel 
          systemState={systemState} 
          setSystemState={setSystemState}
          setCount={setCount}
        />
      </header>
    </div>
  );
}

export default App;
