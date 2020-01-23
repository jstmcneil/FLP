import React from 'react';
import './App.css';
import Quiz from './components/MC/Quiz';

const App: React.FC = () => {
  return (
    <div className="App">
      <div>
        <Quiz />
      </div>
    </div>
  );
}

export default App;
