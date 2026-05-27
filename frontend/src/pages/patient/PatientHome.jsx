import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  ClipboardList,
  Stethoscope,
  ArrowRight,
  Clock3,
  CircleAlert,
} from 'lucide-react'

import api from '../../utils/api'
import { useAuth } from '../../utils/AuthContext'

export default function PatientHome() {
  const { user } = useAuth()

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const quickActions = [
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

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* HERO */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>
            <p className="text-cyan-100 text-sm mb-2">
              Hệ thống đặt lịch khám trực tuyến
            </p>

            <h1 className="text-4xl font-bold">
              Xin chào, {user?.name} 👋
            </h1>

            <p className="mt-3 text-cyan-100 max-w-2xl leading-relaxed">
              Quản lý lịch khám, theo dõi các cuộc hẹn và chăm sóc sức khỏe dễ dàng hơn cùng BCare.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 min-w-[280px]">

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <CalendarDays size={24} />
              </div>

              <div>
                <p className="text-cyan-100 text-sm">
                  Lịch khám sắp tới
                </p>

                <h3 className="font-semibold text-lg">
                  {upcomingAppointment ? 'Đã có lịch hẹn' : 'Chưa có lịch'}
                </h3>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-cyan-100">
                Đang tải dữ liệu...
              </p>
            ) : upcomingAppointment ? (
              <div className="space-y-2 text-sm">

                <p className="font-medium text-white">
                  {upcomingAppointment.doctor_name}
                </p>

                <p className="text-cyan-100">
                  {upcomingAppointment.specialty}
                </p>

                <div className="flex items-center gap-2 text-cyan-100">
                  <Clock3 size={16} />
                  {new Date(upcomingAppointment.appt_date).toLocaleDateString('vi-VN')}
                  {' · '}
                  {upcomingAppointment.appt_time?.slice(0,5)}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-sm text-cyan-100">
                <CircleAlert size={18} className="mt-0.5 shrink-0" />
                <p>Bạn chưa có lịch khám nào được đặt.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-10">

        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-800">
            Dịch vụ nhanh
          </h2>

          <p className="text-gray-500 mt-1">
            Truy cập nhanh các chức năng chính
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map(action => {
            const Icon = action.icon

            return (
              <Link
                key={action.to}
                to={action.to}
                className="group relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >

                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${action.bg} opacity-10 rounded-full blur-3xl`} />

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${action.bg} text-white flex items-center justify-center shadow-lg`}>
                  <Icon size={30} />
                </div>

                <div className="mt-6">
                  <h3 className="text-2xl font-semibold text-slate-800">
                    {action.title}
                  </h3>

                  <p className="text-gray-500 mt-2 leading-relaxed">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-teal-600">
                  Truy cập ngay
                  <ArrowRight size={18} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* RECENT APPOINTMENTS */}
      <div className="mt-12">

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Lịch khám gần đây
            </h2>

            <p className="text-gray-500 mt-1">
              Theo dõi các lịch hẹn mới nhất của bạn
            </p>
          </div>

          <Link
            to="/patient/appointments"
            className="text-teal-600 hover:text-teal-700 text-sm font-medium"
          >
            Xem tất cả
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center text-gray-400">
            Đang tải dữ liệu...
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center">

            <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center text-slate-400">
              <ClipboardList size={30} />
            </div>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Chưa có lịch khám
            </h3>

            <p className="text-gray-500 mt-2">
              Bạn chưa đặt lịch khám nào trong hệ thống.
            </p>

            <Link
              to="/patient/doctors"
              className="inline-flex items-center gap-2 mt-6 bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-2xl transition-colors"
            >
              <Stethoscope size={18} />
              Đặt lịch ngay
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {appointments.slice(0, 3).map(a => (
              <div
                key={a.id}
                className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                  <div className="flex gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                      <CalendarDays size={24} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {a.doctor_name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {a.specialty}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">

                        <div className="flex items-center gap-2">
                          <CalendarDays size={16} />
                          {new Date(a.appt_date).toLocaleDateString('vi-VN')}
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock3 size={16} />
                          {a.appt_time?.slice(0,5)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium">
                      {a.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}