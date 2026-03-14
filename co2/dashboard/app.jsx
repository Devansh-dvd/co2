import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './index.jsx';
import Report from './report.jsx';
import Map from './map.jsx';
import Final from './final.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/report" element={<Report />} />
        <Route path="/map" element={<Map />} />
        <Route path="/final" element={<Final />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;