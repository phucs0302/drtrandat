import { NavLink } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

const adminLinks = [
  { to: '/admin',           label: 'Tổng quan',        icon: '▦' },
  { to: '/admin/doctors',   label: 'Quản lý bác sĩ',   icon: '👨‍⚕️' },
  { to: '/admin/patients',  label: 'Quản lý bệnh nhân', icon: '🧑' },
  { to: '/admin/appointments', label: 'Quản lý lịch khám', icon: '📋' },
]

const doctorLinks = [
  { to: '/doctor',           label: 'Lịch khám của tôi', icon: '📋' },
  { to: '/doctor/schedules', label: 'Lịch làm việc',     icon: '📅' },
]

export default function Sidebar() {
  const { user } = useAuth()
  const links = user?.role === 'admin' ? adminLinks : doctorLinks

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-100 min-h-[calc(100vh-4rem)]">
      <nav className="p-4 flex flex-col gap-1 pt-6">
        {links.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} end={to === '/admin' || to === '/doctor'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
               ${isActive
                 ? 'bg-primary text-white'
                 : 'text-gray-600 hover:bg-primary-light hover:text-primary'}`
            }>
            <span>{icon}</span> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}