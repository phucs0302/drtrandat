import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'

const statusLabel = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', completed: 'Hoàn thành', cancelled: 'Đã huỷ' }
const statusClass = { pending: 'badge-pending', confirmed: 'badge-confirmed', completed: 'badge-completed', cancelled: 'badge-cancelled' }

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get('/doctors/me/appointments').then(r => setAppointments(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    const notes = status === 'completed' ? prompt('Ghi chú (tùy chọn):') ?? '' : ''
    try {
      await api.put(`/appointments/${id}/status`, { status, notes })
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Cập nhật thất bại')
    }
  }

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)

  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 px-6 py-8 max-w-5xl">
        <h1 className="text-3xl font-display font-semibold text-gray-900 mb-2">Danh sách lịch khám</h1>
        <p className="text-gray-400 text-sm mb-6">Quản lý và cập nhật trạng thái lịch khám của bệnh nhân</p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[['all','Tất cả'],['pending','Chờ xác nhận'],['confirmed','Đã xác nhận'],['completed','Hoàn thành']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                ${filter === v ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary'}`}>
              {l}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">Không có lịch khám nào</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(a => (
              <div key={a.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">{a.patient_name}</span>
                    <span className="text-xs text-gray-400">{a.patient_phone}</span>
                    <span className={statusClass[a.status]}>{statusLabel[a.status]}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(a.appt_date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                    {' · '}{a.appt_time?.slice(0,5)}
                  </p>
                  {a.reason && <p className="text-sm text-gray-400 mt-1">📝 {a.reason}</p>}
                </div>
                {a.status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => updateStatus(a.id, 'confirmed')}
                      className="btn-primary text-sm py-2">Xác nhận</button>
                    <button onClick={() => updateStatus(a.id, 'cancelled')}
                      className="btn-danger text-sm py-2">Huỷ</button>
                  </div>
                )}
                {a.status === 'confirmed' && (
                  <button onClick={() => updateStatus(a.id, 'completed')}
                    className="btn-primary text-sm py-2 shrink-0">Hoàn thành</button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}