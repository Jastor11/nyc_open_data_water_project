import React from 'react';
import Population from './components/Population/Population'
import WaterConsumption from './components/WaterConsumption/WaterConsumption'
import WaterByBorough from './components/WaterByBorough/WaterByBorough'
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>💧Liquid NYC</h1>
        <h4>Everything you wanted to know about water in New York City</h4>
      </header>
      <main>
        <Population />
        <WaterConsumption />
        <h1 className="App__section-title">By Borough Breakdown</h1>
        <WaterByBorough />
      </main>
      <footer>

      </footer>
    </div>
  );
}

export default App;
