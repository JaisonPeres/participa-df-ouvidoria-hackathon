import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Participa DF</h1>
        <p>Ouvidoria Digital</p>
      </header>

      <main className="app-main">
        <div className="card">
          <h2>Welcome to Participa DF PWA</h2>
          <p>This is a Progressive Web App built with React and Vite.</p>
          
          <div className="counter">
            <button onClick={() => setCount((count) => count + 1)}>
              Count is {count}
            </button>
          </div>

          <p className="info">
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>

        <div className="features">
          <h3>Features</h3>
          <ul>
            <li>⚡️ Vite + React</li>
            <li>📱 Progressive Web App</li>
            <li>🔄 Service Worker</li>
            <li>📴 Offline Support</li>
            <li>🎨 Modern UI</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
