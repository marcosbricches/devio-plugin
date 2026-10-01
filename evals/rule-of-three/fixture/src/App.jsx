import { useState } from 'react';
import Orders from './screens/Orders.jsx';
import Customers from './screens/Customers.jsx';
import './styles.css';

const screens = { Orders, Customers };

export default function App() {
  const [current, setCurrent] = useState('Orders');
  const Screen = screens[current];

  return (
    <div className="app">
      <nav className="nav">
        {Object.keys(screens).map((name) => (
          <button key={name} aria-current={name === current} onClick={() => setCurrent(name)}>{name}</button>
        ))}
      </nav>
      <Screen />
    </div>
  );
}
