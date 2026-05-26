import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'

const today = new Date().toISOString().split('T')[0]

export default function DoctorSchedules() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState({ work_date: '', start_time: '08:00', end_time: '12:00', slot_duration: 30, max_slots: 8 })
  const [error, setError]         = useState('')
  const [saving, setSaving]       = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/doctors/me/schedules').then(r => setSchedules(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleCreate = async e => {
    e.preventDefault()
    setError('')
    if (!form.work_date) return setError('Vui lòng chọn ngày làm việc')
    setSaving(true)
    try {
      await api.post('/doctors/me/schedules', form)
      setShowForm(false)
      setForm({ work_date: '', start_time: '08:00', end_time: '12:00', slot_duration: 30, max_slots: 8 })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo lịch thất bại')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (id, current) => {
    await api.put(`/doctors/me/schedules/${id}`, { is_active: current ? 0 : 1 })
    load()
  }

  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 px-6 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-semibold text-gray-900">Lịch làm việc</h1>
            <p className="text-gray-400 text-sm mt-1">Quản lý ca làm việc của bạn</p>
          </div>
          <button onClick={() => setShowForm(p => !p)} className="btn-primary text-sm">
            {showForm ? 'Huỷ' : '+ Thêm lịch'}
          </button>
        </div>

        {showForm && (
          <div className="card border-2 border-primary/20 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">Tạo lịch làm việc mới</h2>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày làm việc</label>
                <input type="date" name="work_date" min={today} value={form.work_date}
                  onChange={handleChange} className="input" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Giờ bắt đầu</label>
                  <input type="time" name="start_time" value={form.start_time}
                    onChange={handleChange} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Giờ kết thúc</label>
                  <input type="time" name="end_time" value={form.end_time}
                    onChange={handleChange} className="input" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Thời gian mỗi slot (phút)</label>
                <select name="slot_duration" value={form.slot_duration} onChange={handleChange} className="input">
                  <option value={15}>15 phút</option>
                  <option value={30}>30 phút</option>
                  <option value={45}>45 phút</option>
                  <option value={60}>60 phút</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số bệnh nhân tối đa</label>
                <input type="number" name="max_slots" min={1} max={50} value={form.max_slots}
                  onChange={handleChange} className="input" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Đang lưu...' : 'Lưu lịch làm việc'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Đang tải...</div>
        ) : schedules.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">Chưa có lịch làm việc nào</div>
        ) : (
          <div className="flex flex-col gap-3">
            {schedules.map(s => (
              <div key={s.id} className={`card flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${!s.is_active ? 'opacity-50' : ''}`}>
                <div>
                  <p className="font-semibold text-gray-900">
                    {new Date(s.work_date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {s.start_time?.slice(0,5)} – {s.end_time?.slice(0,5)}
                    {' · '}{s.slot_duration} phút/slot
                    {' · '}{s.booked_slots}/{s.max_slots} đã đặt
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {s.is_active ? 'Đang hoạt động' : 'Đã tắt'}
                  </span>
                  <button onClick={() => toggleActive(s.id, s.is_active)}
                    className="text-sm text-gray-500 hover:text-primary transition-colors">
                    {s.is_active ? 'Tắt' : 'Bật'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}