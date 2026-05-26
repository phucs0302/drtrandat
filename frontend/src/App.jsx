import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './utils/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

import Login    from './pages/Login'
import Register from './pages/Register'

import PatientHome      from './pages/patient/PatientHome'
import DoctorList       from './pages/patient/DoctorList'
import BookAppointment  from './pages/patient/BookAppointment'
import MyAppointments   from './pages/patient/MyAppointments'

import DoctorDashboard  from './pages/doctor/DoctorDashboard'
import DoctorSchedules  from './pages/doctor/DoctorSchedules'

import AdminDashboard   from './pages/admin/AdminDashboard'
import AdminDoctors     from './pages/admin/AdminDoctors'
import AdminPatients    from './pages/admin/AdminPatients'
import AdminAppointments from './pages/admin/AdminAppointments'

const RootRedirect = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin')   return <Navigate to="/admin"   replace />
  if (user.role === 'doctor')  return <Navigate to="/doctor"  replace />
  return <Navigate to="/patient" replace />
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Routes>
        <Route path="/"        element={<RootRedirect />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient */}
        <Route path="/patient" element={<ProtectedRoute roles={['patient']}><PatientHome /></ProtectedRoute>} />
        <Route path="/patient/doctors" element={<ProtectedRoute roles={['patient']}><DoctorList /></ProtectedRoute>} />
        <Route path="/patient/book/:doctorId" element={<ProtectedRoute roles={['patient']}><BookAppointment /></ProtectedRoute>} />
        <Route path="/patient/appointments" element={<ProtectedRoute roles={['patient']}><MyAppointments /></ProtectedRoute>} />

        {/* Doctor */}
        <Route path="/doctor"           element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/schedules" element={<ProtectedRoute roles={['doctor']}><DoctorSchedules /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin"              element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/doctors"      element={<ProtectedRoute roles={['admin']}><AdminDoctors /></ProtectedRoute>} />
        <Route path="/admin/patients"     element={<ProtectedRoute roles={['admin']}><AdminPatients /></ProtectedRoute>} />
        <Route path="/admin/appointments" element={<ProtectedRoute roles={['admin']}><AdminAppointments /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}