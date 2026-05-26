import { Link } from 'react-router-dom'
import { useAuth } from '../../utils/AuthContext'

export default function PatientHome() {
  const { user } = useAuth()

  const cards = [
    { to: '/patient/doctors',      icon: '👨‍⚕️', title: 'Xem danh sách bác sĩ',   desc: 'Tìm bác sĩ phù hợp và đặt lịch khám',     color: 'bg-blue-50 border-blue-100' },
    { to: '/patient/appointments', icon: '📋', title: 'Lịch khám của tôi',         desc: 'Xem và quản lý các lịch hẹn đã đặt',       color: 'bg-green-50 border-green-100' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-semibold text-gray-900">
          Xin chào, {user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-2">Bạn muốn làm gì hôm nay?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {cards.map(c => (
          <Link key={c.to} to={c.to}
            className={`card border-2 ${c.color} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
            <div className="text-4xl mb-4">{c.icon}</div>
            <h2 className="text-xl font-display font-semibold text-gray-800">{c.title}</h2>
            <p className="text-gray-500 text-sm mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}