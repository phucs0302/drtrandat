import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import api from '../../utils/api'

const statusLabel = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', completed: 'Hoàn thành', cancelled: 'Đã huỷ' }
const statusClass = { pending: 'badge-pending', confirmed: 'badge-confirmed', completed: 'badge-completed', cancelled: 'badge-cancelled' }

export default function MyAppointments() {
  const location = useLocation()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg]         = useState(location.state?.success || '')

  const load = () => {
    setLoading(true)
    api.get('/appointments/mine').then(r => setAppointments(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCancel = async id => {
    if (!confirm('Bạn có chắc muốn huỷ lịch khám này?')) return
    try {
      await api.put(`/appointments/${id}/cancel`)
      setMsg('Huỷ lịch khám thành công')
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Huỷ lịch thất bại')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-semibold text-gray-900">Lịch khám của tôi</h1>
        <Link to="/patient/doctors" className="btn-primary text-sm">+ Đặt lịch mới</Link>
      </div>

      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6">
          {msg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Đang tải...</div>
      ) : appointments.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400 mb-4">Bạn chưa có lịch khám nào</p>
          <Link to="/patient/doctors" className="btn-primary">Đặt lịch ngay</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {appointments.map(a => (
            <div key={a.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-xl shrink-0">
                  📅
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{a.doctor_name}</p>
                    <span className="text-xs text-gray-400">{a.specialty}</span>
                    <span className={statusClass[a.status]}>{statusLabel[a.status]}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {new Date(a.appt_date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    {' · '}{a.appt_time?.slice(0,5)}
                  </p>
                  {a.reason && <p className="text-sm text-gray-400 mt-1">📝 {a.reason}</p>}
                  {a.notes  && <p className="text-sm text-gray-400">💬 {a.notes}</p>}
                </div>
              </div>
              {!['completed','cancelled'].includes(a.status) && (
                <button onClick={() => handleCancel(a.id)}
                  className="btn-danger text-sm shrink-0 py-2">
                  Huỷ lịch
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}