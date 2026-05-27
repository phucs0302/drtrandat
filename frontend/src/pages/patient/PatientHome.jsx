import { Link } from 'react-router-dom'
import { useAuth } from '../../utils/AuthContext'
import {
  CalendarDays,
  Stethoscope,
  ClipboardList,
  Activity,
  ArrowRight,
} from 'lucide-react'

export default function PatientHome() {
  const { user } = useAuth()

  const cards = [
  {
    to: '/patient/doctors',
    icon: Stethoscope,
    title: 'Đặt lịch khám',
    desc: 'Tìm bác sĩ phù hợp và đặt lịch nhanh chóng',
    bg: 'from-cyan-500 to-teal-500',
  },
  {
    to: '/patient/appointments',
    icon: ClipboardList,
    title: 'Lịch hẹn của tôi',
    desc: 'Quản lý các lịch khám đã đặt',
    bg: 'from-emerald-500 to-green-500',
  },
]

 return (
  <div className="min-h-screen bg-slate-50">
    
    {/* Hero */}
    <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        <div>
          <p className="text-cyan-100 text-sm mb-2">
            Hệ thống quản lý lịch khám
          </p>

          <h1 className="text-4xl font-bold leading-tight">
            Xin chào, {user?.name} 👋
          </h1>

          <p className="mt-3 text-cyan-100 max-w-xl">
            Chào mừng bạn quay trở lại. Hãy quản lý lịch khám và theo dõi sức khỏe một cách dễ dàng.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 min-w-[220px]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Activity size={24} />
            </div>

            <div>
              <p className="text-sm text-cyan-100">
                Trạng thái
              </p>

              <h3 className="font-semibold text-lg">
                Hoạt động tốt
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
      
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Lịch hẹn
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-1">
              03
            </h2>
          </div>

          <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600">
            <CalendarDays size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Bác sĩ đã khám
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-1">
              05
            </h2>
          </div>

          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Stethoscope size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Hồ sơ sức khỏe
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-1">
              100%
            </h2>
          </div>

          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Activity size={24} />
          </div>
        </div>
      </div>
    </div>

    {/* Action Cards */}
    <div className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Dịch vụ nhanh
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Truy cập nhanh các chức năng chính
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(card => {
          const Icon = card.icon

          return (
            <Link
              key={card.to}
              to={card.to}
              className="group relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${card.bg} opacity-10 rounded-full blur-3xl`} />

              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${card.bg} text-white flex items-center justify-center shadow-lg`}>
                <Icon size={30} />
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-slate-800">
                  {card.title}
                </h3>

                <p className="text-gray-500 mt-2 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center text-sm font-medium text-teal-600 group-hover:gap-3 transition-all">
                Truy cập ngay
                <ArrowRight size={18} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  </div>
)
}