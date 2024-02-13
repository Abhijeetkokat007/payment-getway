import react from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Success from "./pages/Success.js";
import Failed from './pages/Failed.js';
import Product from './pages/Product.js';
import './App.css';

function App() {
  return (
 <BrowserRouter>
  <Routes>
    <Route path='/' Component={Product} />
    <Route path='/success' Component={Success} />
    <Route path='/failed' Component={Failed} />
  </Routes>
 </BrowserRouter>
  );
}

export default App;
