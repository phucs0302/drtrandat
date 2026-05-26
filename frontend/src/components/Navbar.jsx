import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

const roleHome = { admin: '/admin', doctor: '/doctor', patient: '/patient' }

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to={user ? roleHome[user.role] : '/'} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <span className="font-display text-xl font-semibold text-primary">MediCare</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              Xin chào, <span className="font-medium text-gray-800">{user.name}</span>
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium
              ${user.role === 'admin'   ? 'bg-purple-100 text-purple-700' :
                user.role === 'doctor'  ? 'bg-blue-100 text-blue-700' :
                                          'bg-green-100 text-green-700'}`}>
              {user.role === 'admin' ? 'Admin' : user.role === 'doctor' ? 'Bác sĩ' : 'Bệnh nhân'}
            </span>
            <button onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors">
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="btn-outline text-sm py-2">Đăng nhập</Link>
            <Link to="/register" className="btn-primary text-sm py-2">Đăng ký</Link>
          </div>
        )}
      </div>
    </header>
  )
}