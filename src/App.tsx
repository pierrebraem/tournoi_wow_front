import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Parties from './components/Parties/Parties';
import Characters from './components/Characters/Characters';
import Tournaments from './components/Tournaments/Tournaments';

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
            <Route path="/parties" element={<Parties />}></Route>
            <Route path="/tournaments" element={<Tournaments />}></Route>
          </Routes>
        </BrowserRouter>
      </PrimeReactProvider>
    </>
  )
}

export default App
