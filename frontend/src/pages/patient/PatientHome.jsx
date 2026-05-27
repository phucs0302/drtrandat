import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  ClipboardList,
  ArrowRight,
  Clock3,
  Stethoscope,
  Activity,
} from 'lucide-react'

import api from '../../utils/api'
import { useAuth } from '../../utils/AuthContext'

export default function PatientHome() {
  const { user } = useAuth()

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments/mine')

      setAppointments(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const upcomingAppointment = appointments.find(
    a => a.status !== 'cancelled' && a.status !== 'completed'
  )

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
      desc: 'Theo dõi và quản lý lịch khám',
      bg: 'from-emerald-500 to-green-500',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <p className="text-cyan-100 text-sm mb-2">
              Hệ thống đặt lịch khám BCare
            </p>

            <h1 className="text-4xl font-bold">
              Xin chào, {user?.name} 👋
            </h1>

            <p className="mt-3 text-cyan-100 max-w-2xl">
              Chúc bạn có một ngày thật tốt. Hãy theo dõi lịch khám và chăm sóc sức khỏe dễ dàng hơn cùng BCare.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 min-w-[240px]">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Activity size={28} />
              </div>

              <div>
                <p className="text-cyan-100 text-sm">
                  Trạng thái tài khoản
                </p>

                <h3 className="text-xl font-semibold">
                  Đang hoạt động
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointment */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Lịch khám sắp tới
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Thông tin lịch hẹn gần nhất của bạn
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
            <p className="text-gray-400">Đang tải dữ liệu...</p>
          </div>
        ) : upcomingAppointment ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition-all">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                  <CalendarDays size={30} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-semibold text-slate-800">
                      {upcomingAppointment.doctor_name}
                    </h3>

                    <span className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full">
                      {upcomingAppointment.specialty}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-5 mt-4 text-gray-500">

                    <div className="flex items-center gap-2">
                      <CalendarDays size={18} />

                      {new Date(
                        upcomingAppointment.appt_date
                      ).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 size={18} />

                      {upcomingAppointment.appt_time?.slice(0,5)}
                    </div>
                  </div>

                  {upcomingAppointment.reason && (
                    <p className="mt-4 text-gray-600">
                      📝 {upcomingAppointment.reason}
                    </p>
                  )}
                </div>
              </div>

              <Link
                to="/patient/appointments"
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                Xem chi tiết
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <CalendarDays size={36} />
            </div>

            <h3 className="text-2xl font-semibold text-slate-800 mt-6">
              Chưa có lịch khám nào
            </h3>

            <p className="text-gray-500 mt-2">
              Hãy đặt lịch khám với bác sĩ để bắt đầu theo dõi sức khỏe.
            </p>

            <Link
              to="/patient/doctors"
              className="inline-flex items-center gap-2 mt-6 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-medium transition-colors"
            >
              Đặt lịch ngay
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-10">

        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-800">
            Dịch vụ nhanh
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Truy cập nhanh các chức năng chính
          </p>
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