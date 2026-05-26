import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { label: 'Tổng bệnh nhân',  value: stats.total_patients,     icon: '🧑',   color: 'bg-blue-50   border-blue-100   text-blue-700' },
    { label: 'Tổng bác sĩ',     value: stats.total_doctors,      icon: '👨‍⚕️',  color: 'bg-green-50  border-green-100  text-green-700' },
    { label: 'Tổng lịch khám',  value: stats.total_appointments, icon: '📋',   color: 'bg-purple-50 border-purple-100 text-purple-700' },
    { label: 'Hoàn thành',
      value: stats.byStatus.find(s => s.status === 'completed')?.count ?? 0,
      icon: '✅', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
  ] : []

  const statusLabel = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', completed: 'Hoàn thành', cancelled: 'Đã huỷ' }

  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 px-6 py-8 max-w-5xl">
        <h1 className="text-3xl font-display font-semibold text-gray-900 mb-2">Tổng quan hệ thống</h1>
        <p className="text-gray-400 text-sm mb-8">Thống kê và theo dõi hoạt động</p>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Đang tải...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map(c => (
                <div key={c.label} className={`card border-2 ${c.color}`}>
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <div className={`text-3xl font-display font-semibold`}>{c.value}</div>
                  <div className="text-sm mt-1 opacity-80">{c.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trạng thái lịch khám */}
              <div className="card">
                <h2 className="font-semibold text-gray-800 mb-4">Trạng thái lịch khám</h2>
                <div className="flex flex-col gap-3">
                  {stats.byStatus.map(s => {
                    const pct = stats.total_appointments > 0
                      ? Math.round(s.count / stats.total_appointments * 100) : 0
                    const colors = { pending: 'bg-yellow-400', confirmed: 'bg-blue-400', completed: 'bg-green-400', cancelled: 'bg-red-400' }
                    return (
                      <div key={s.status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{statusLabel[s.status]}</span>
                          <span className="font-medium text-gray-800">{s.count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className={`h-2 rounded-full ${colors[s.status]}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Lịch khám theo tháng */}
              <div className="card">
                <h2 className="font-semibold text-gray-800 mb-4">Lịch khám 6 tháng gần nhất</h2>
                {stats.monthlyStats.length === 0 ? (
                  <p className="text-gray-400 text-sm">Chưa có dữ liệu</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {stats.monthlyStats.map(m => {
                      const maxVal = Math.max(...stats.monthlyStats.map(x => x.count))
                      const pct = maxVal > 0 ? Math.round(m.count / maxVal * 100) : 0
                      return (
                        <div key={m.month} className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 w-16 shrink-0">{m.month}</span>
                          <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-5 bg-primary/70 rounded-full flex items-center pl-2 transition-all"
                              style={{ width: `${Math.max(pct, 8)}%` }}>
                              <span className="text-white text-xs font-medium">{m.count}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}