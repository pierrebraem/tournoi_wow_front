import { PrimeReactProvider } from 'primereact/api';
import { Button } from 'primereact/button';

import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

function App() {
  return (
    <>
      <PrimeReactProvider>
        <Button label="Submit" icon="pi pi-check" />
      </PrimeReactProvider>
    </>
  )
}

export default App
