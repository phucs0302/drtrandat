import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'

const statusLabel = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', completed: 'Hoàn thành', cancelled: 'Đã huỷ' }
const statusClass = { pending: 'badge-pending', confirmed: 'badge-confirmed', completed: 'badge-completed', cancelled: 'badge-cancelled' }

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', date: '' })

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.date)   params.set('date',   filters.date)
    api.get(`/appointments?${params}`).then(r => setAppointments(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filters])

  const updateStatus = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status })
    load()
  }

  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 px-6 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-semibold text-gray-900">Quản lý lịch khám</h1>
          <p className="text-gray-400 text-sm mt-1">Tất cả lịch hẹn trong hệ thống</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
            className="input w-44">
            <option value="">Tất cả trạng thái</option>
            {Object.entries(statusLabel).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <input type="date" value={filters.date}
            onChange={e => setFilters(p => ({ ...p, date: e.target.value }))}
            className="input w-44" />
          {(filters.status || filters.date) && (
            <button onClick={() => setFilters({ status: '', date: '' })}
              className="text-sm text-gray-400 hover:text-primary">Xóa bộ lọc</button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Đang tải...</div>
        ) : appointments.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">Không có lịch khám nào</div>
        ) : (
          <div className="card p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Bệnh nhân','Bác sĩ','Ngày & Giờ','Lý do','Trạng thái','Hành động'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map((a, i) => (
                  <tr key={a.id} className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{a.patient_name}</p>
                      <p className="text-xs text-gray-400">{a.patient_phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-800">{a.doctor_name}</p>
                      <p className="text-xs text-gray-400">{a.specialty}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-gray-800">{new Date(a.appt_date).toLocaleDateString('vi-VN')}</p>
                      <p className="text-xs text-gray-400">{a.appt_time?.slice(0,5)}</p>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <p className="text-gray-500 truncate">{a.reason || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={statusClass[a.status]}>{statusLabel[a.status]}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {a.status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(a.id, 'confirmed')}
                              className="text-xs text-blue-600 hover:underline">Xác nhận</button>
                            <button onClick={() => updateStatus(a.id, 'cancelled')}
                              className="text-xs text-red-500 hover:underline">Huỷ</button>
                          </>
                        )}
                        {a.status === 'confirmed' && (
                          <button onClick={() => updateStatus(a.id, 'completed')}
                            className="text-xs text-green-600 hover:underline">Hoàn thành</button>
                        )}
                        {['completed','cancelled'].includes(a.status) && (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}