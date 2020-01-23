import React from 'react';
import { EmailTextComponent } from './components/EmailTextBox';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <div><EmailTextComponent professor="john"/></div>
    </div>
  );
}

export default App;
