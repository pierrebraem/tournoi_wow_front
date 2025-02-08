import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import Header from './components/Home/Header/Header';
import Home from './components/Home/Home';
import Characters from './components/Characters/Characters';

import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

function App() {
  return (
    <>
      <PrimeReactProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/characters" element={<Characters />}></Route>
          </Routes>
        </BrowserRouter>
      </PrimeReactProvider>
    </>
  )
}

export default App
