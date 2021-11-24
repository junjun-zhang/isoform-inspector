import React from 'react';
import './App.css';
import IsoformInspectorWrapper from './IsoformInspector'
import { initializeStore, Provider } from './model'
const store = initializeStore();


function App() {
  return (
    <Provider value={store}>
      <div className="App">
        <header className="App-header">
          <IsoformInspectorWrapper />
        </header>
      </div>
    </Provider>
  );
}

export default App;
