import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import 'antd/dist/reset.css';

function App() {
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
}

export default App;
