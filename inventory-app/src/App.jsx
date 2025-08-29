import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import MedicalReports from './pages/MedicalReports';
import Appointments from './pages/Appointments';
import DailySchedule from './pages/DailySchedule';
import FamilyMembers from './pages/FamilyMembers';
import FinancialTracker from './pages/FinancialTracker';
import 'antd/dist/reset.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/medical-reports" element={<MedicalReports />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/daily-schedule" element={<DailySchedule />} />
            <Route path="/family-members" element={<FamilyMembers />} />
            <Route path="/financial-tracker" element={<FinancialTracker />} />
          </Routes>
        </MainLayout>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
