import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/Auth/AuthContext';
import { InventoryProvider } from './contexts/Inventory/InventoryContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import 'antd/dist/reset.css';

// Placeholder components for other routes
const Categories = () => <div>Categories Page - Coming Soon</div>;
const Suppliers = () => <div>Suppliers Page - Coming Soon</div>;
const PurchaseOrders = () => <div>Purchase Orders Page - Coming Soon</div>;
const SalesOrders = () => <div>Sales Orders Page - Coming Soon</div>;
const InventoryReport = () => <div>Inventory Report Page - Coming Soon</div>;
const SalesReport = () => <div>Sales Report Page - Coming Soon</div>;
const Users = () => <div>Users Page - Coming Soon</div>;
const Settings = () => <div>Settings Page - Coming Soon</div>;

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route path="/sales-orders" element={<SalesOrders />} />
              <Route path="/inventory-report" element={<InventoryReport />} />
              <Route path="/sales-report" element={<SalesReport />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </MainLayout>
        </Router>
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;
