import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/admin/stats')
      .then(res => setStats(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </main>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Tổng bệnh nhân',
      value: stats.total_patients,
      icon: '👨‍👩‍👧‍👦',
      color: 'bg-blue-50 text-blue-700'
    },
    {
      title: 'Tổng bác sĩ',
      value: stats.total_doctors,
      icon: '👨‍⚕️',
      color: 'bg-green-50 text-green-700'
    },
    {
      title: 'Tổng lịch khám',
      value: stats.total_appointments,
      icon: '📅',
      color: 'bg-purple-50 text-purple-700'
    },
    {
      title: 'Đã hoàn thành',
      value:
        stats.byStatus.find(
          s => s.status === 'completed'
        )?.count || 0,
      icon: '✅',
      color: 'bg-emerald-50 text-emerald-700'
    }
  ]

  const statusLabel = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  }

  const statusColor = {
    pending: 'bg-yellow-400',
    confirmed: 'bg-blue-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500'
  }

  return (
    <div className="flex flex-1 bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Tổng quan phòng khám
          </h1>

          <p className="text-gray-500 mt-2">
            Theo dõi tổng quan hoạt động của phòng khám
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {statCards.map(card => (
            <div
              key={card.title}
              className={`${card.color} rounded-2xl p-6 shadow-sm border border-gray-100`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-80">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {card.value}
                  </h2>
                </div>

                <div className="text-4xl">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Appointment Status */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              📋 Trạng thái lịch khám
            </h2>

            <div className="space-y-5">
              {stats.byStatus.map(status => {
                const percentage =
                  stats.total_appointments > 0
                    ? Math.round(
                        (status.count /
                          stats.total_appointments) *
                          100
                      )
                    : 0

                return (
                  <div key={status.status}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {statusLabel[status.status]}
                      </span>

                      <span className="text-sm font-semibold">
                        {status.count} ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full h-3 bg-gray-100 rounded-full">
                      <div
                        className={`h-3 rounded-full ${statusColor[status.status]}`}
                        style={{
                          width: `${percentage}%`
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
              
        {/* Monthly Statistics */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            📈 Thống kê lịch khám 6 tháng gần nhất
          </h2>

          {stats.monthlyStats?.length > 0 ? (
            <div className="space-y-4">
              {stats.monthlyStats.map(month => {
                const maxValue = Math.max(
                  ...stats.monthlyStats.map(
                    item => item.count
                  )
                )

                const width =
                  maxValue > 0
                    ? (month.count / maxValue) * 100
                    : 0

                return (
                  <div
                    key={month.month}
                    className="flex items-center gap-4"
                  >
                    <div className="w-24 text-sm font-medium text-gray-600">
                      {month.month}
                    </div>

                    <div className="flex-1 bg-gray-100 h-8 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full flex items-center pl-4 text-white text-sm font-semibold"
                        style={{
                          width: `${Math.max(width, 10)}%`
                        }}
                      >
                        {month.count}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-400">
              Chưa có dữ liệu thống kê
            </p>
          )}
        </div>
      </div>
      {/* Footer */}
<footer className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
  <div className="grid md:grid-cols-3 gap-6">
    
    <div>
      <h3 className="font-semibold text-gray-800 mb-3">
        🏥 Phòng Khám Mắt Dr Trần Đạt
      </h3>

      <p className="text-sm text-gray-600">
        Hệ thống đặt lịch khám bệnh trực tuyến hỗ trợ bệnh nhân
        đăng ký khám nhanh chóng và thuận tiện.
      </p>
    </div>

    <div>
      <h3 className="font-semibold text-gray-800 mb-3">
        📍 Thông tin liên hệ
      </h3>

      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <strong>Địa chỉ:</strong> 65 Trần Phú, Hà Đông, Hà Nội
        </p>

        <p>
          <strong>Email:</strong> drtrandat@gmail.com
        </p>

        <p>
          <strong>Điện thoại:</strong> 0988 888 888
        </p>
      </div>
    </div>

    <div>
      <h3 className="font-semibold text-gray-800 mb-3">
        ⏰ Giờ làm việc
      </h3>

      <div className="space-y-2 text-sm text-gray-600">
        <p>Thứ 2 - Chủ nhật: 08:00 - 12:00, 14:00 - 21:00</p>
      </div>
    </div>

  </div>

  <div className="border-t mt-6 pt-4 text-center text-sm text-gray-500">
    © {new Date().getFullYear()} Phòng Khám Mắt Dr Trần Đạt.
    All Rights Reserved.
  </div>
</footer>
      </main>
    </div>
  )
} 
