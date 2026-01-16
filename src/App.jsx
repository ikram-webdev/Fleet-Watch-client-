import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDashboard from "./components/DriverDashboard";
import UsageReports from "./components/UsageReports";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/driver"
          element={
            <div className="main-bg text-white">
              <h1>Driver Dashboard</h1>
            </div>
          }
        />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/admin/reports" element={<UsageReports />} />
      </Routes>
    </Router>
  );
}

export default App;
