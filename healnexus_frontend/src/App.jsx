import { Routes, Route } from 'react-router-dom';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DoctorDirectory from './pages/DoctorDirectory';
import VideoConsult from './pages/Tools/VideoConsult';

// Import Self-Service Tools
import SelfDiagnosis from './pages/Tools/SelfDiagnosis';
import CommonPrescriptions from './pages/Tools/CommonPrescriptions';
import PillDirectory from './pages/Tools/PillDirectory';

// Import Dashboards
import PatientDashboard from './pages/Patient/Dashboard';
import DoctorDashboard from './pages/Doctor/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';

// Import our Security Guard
import ProtectedRoute from './components/common/ProtectedRoute';
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctors" element={<DoctorDirectory />} />

      {/* Public Self-Service Tool Routes (NEW!) */}
      <Route path="/self-diagnosis" element={<SelfDiagnosis />} />
      <Route path="/common-prescriptions" element={<CommonPrescriptions />} />
      <Route path="/pill-directory" element={<PillDirectory />} />
      <Route path="/video-consult" element={<VideoConsult />} />

      {/* Protected Patient Routes */}
      <Route path="/patient" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />

      {/* Protected Doctor Routes */}
      <Route path="/doctor" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorDashboard />
        </ProtectedRoute>
      } />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;