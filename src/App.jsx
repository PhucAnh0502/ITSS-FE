import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import TopPage from './pages/TopPage';
import DetailPage from './pages/DetailPage';
import SmartSearchPage from './pages/SmartSearchPage';
import ReviewPage from './pages/ReviewPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<TopPage />} />
          <Route path="/workspace/:id" element={<DetailPage />} />
          <Route path="/smart-search" element={<SmartSearchPage />} />
          <Route path="/reviews" element={<ReviewPage />} />
          <Route path="/reviews/:workspaceId" element={<ReviewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
