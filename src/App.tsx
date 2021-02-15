import React from 'react';
import styles from './App.module.css';
import { Orderbook } from './features/orderbook/orderbook';

function App() {
  return (
    <div className={styles.App}>
      <Orderbook />
    </div>
  );
}

export default App;
