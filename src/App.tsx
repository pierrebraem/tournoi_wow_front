import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import Home from './components/Home/Home';

import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

function App() {
  return (
    <>
      <PrimeReactProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
          </Routes>
        </BrowserRouter>
      </PrimeReactProvider>
    </>
  )
}

export default App
