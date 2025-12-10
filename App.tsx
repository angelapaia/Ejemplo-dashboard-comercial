import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FilterProvider } from './context/FilterContext';
import { ArenaView } from './components/ArenaView';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { ExecutiveSummary } from './pages/ExecutiveSummary';
import { CommercialFunnel } from './pages/CommercialFunnel';
import { CommercialPerformance } from './pages/CommercialPerformance';
import { MarketingAnalysis } from './pages/MarketingAnalysis';
import { ProductAnalysis } from './pages/ProductAnalysis';
import { ActivityAnalysis } from './pages/ActivityAnalysis';
import { TimeAnalysis } from './pages/TimeAnalysis';
import { QualityAnalysis } from './pages/QualityAnalysis';
import { GeoAnalysis } from './pages/GeoAnalysis';
import { ExperimentalAnalysis } from './pages/ExperimentalAnalysis';

function App() {
  return (
    <FilterProvider>
      <BrowserRouter>
        <Routes>
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard/summary" replace />} />

          {/* TV Mode (Standalone) */}
          <Route path="/tv" element={<ArenaView />} />

          {/* Dashboard Mode (Layout wrapped) */}
          <Route path="/dashboard" element={<DashboardLayout><Navigate to="summary" /></DashboardLayout>} />

          <Route path="/dashboard/*" element={
            <DashboardLayout>
              <Routes>
                <Route path="summary" element={<ExecutiveSummary />} />
                <Route path="funnel" element={<CommercialFunnel />} />
                <Route path="commercials" element={<CommercialPerformance />} />
                <Route path="marketing" element={<MarketingAnalysis />} />
                <Route path="products" element={<ProductAnalysis />} />
                <Route path="activity" element={<ActivityAnalysis />} />
                <Route path="time" element={<TimeAnalysis />} />
                <Route path="quality" element={<QualityAnalysis />} />
                <Route path="geo" element={<GeoAnalysis />} />
                <Route path="experimental" element={<ExperimentalAnalysis />} />
              </Routes>
            </DashboardLayout>
          } />
        </Routes>
      </BrowserRouter>
    </FilterProvider>
  );
}

export default App;