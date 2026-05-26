import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../utils/api'

// Format Date object về 'YYYY-MM-DD' theo local time (tránh lệch timezone UTC)
const toLocalDateStr = (val) => {
  const d = val instanceof Date ? val : new Date(val)
  const yyyy = d.getFullYear()
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const dd   = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// Sinh các slot giờ trong khoảng thời gian theo bước slot_duration
const generateSlots = (start, end, duration) => {
  const slots = []
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let cur = sh * 60 + sm
  const endMin = eh * 60 + em
  while (cur + duration <= endMin) {
    const h = String(Math.floor(cur / 60)).padStart(2, '0')
    const m = String(cur % 60).padStart(2, '0')
    slots.push(`${h}:${m}:00`)
    cur += duration
  }
  return slots
}

export default function BookAppointment() {
  const { doctorId } = useParams()
  const navigate = useNavigate()

  const [doctor,    setDoctor]    = useState(null)
  const [schedules, setSchedules] = useState([])
  const [selected,  setSelected]  = useState(null)  // schedule object
  const [slots,     setSlots]     = useState([])
  const [form,      setForm]      = useState({ appt_time: '', reason: '' })
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  useEffect(() => {
    api.get(`/doctors/${doctorId}`).then(r => setDoctor(r.data))
    api.get(`/doctors/${doctorId}/schedules`).then(r => setSchedules(r.data))
  }, [doctorId])

  const selectSchedule = sched => {
    setSelected(sched)
    setSlots(generateSlots(sched.start_time, sched.end_time, Number(sched.slot_duration)))
    setForm(p => ({ ...p, appt_time: '' }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!selected)       return setError('Vui lòng chọn ngày làm việc')
    if (!form.appt_time) return setError('Vui lòng chọn giờ khám')
    setError('')
    setLoading(true)
    try {
      // Dùng toLocalDateStr để tránh lệch ngày do timezone UTC
      await api.post('/appointments', {
        doctor_id:   Number(doctorId),
        schedule_id: selected.id,
        appt_date:   toLocalDateStr(selected.work_date),
        appt_time:   form.appt_time,
        reason:      form.reason,
      })
      navigate('/patient/appointments', { state: { success: 'Đặt lịch khám thành công!' } })
    } catch (err) {
      setError(err.response?.data?.message || 'Đặt lịch thất bại')
    } finally {
      setLoading(false)
    }
  }

  if (!doctor) return <div className="text-center py-20 text-gray-400">Đang tải...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-primary mb-6 flex items-center gap-1">
        ← Quay lại
      </button>

      <h1 className="text-3xl font-display font-semibold text-gray-900 mb-1">Đặt lịch khám</h1>
      <p className="text-gray-500 mb-8">BS. {doctor.name} – {doctor.specialty}</p>

      {schedules.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">
          Bác sĩ này hiện chưa có lịch làm việc khả dụng
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Chọn ngày */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4">1. Chọn ngày khám</h2>
            <div className="flex flex-wrap gap-2">
              {schedules.map(s => (
                <button key={s.id} type="button" onClick={() => selectSchedule(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all
                    ${selected?.id === s.id
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-primary'}`}>
                  {new Date(toLocalDateStr(s.work_date) + 'T00:00:00').toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                  <span className="block text-xs opacity-75">
                    {s.start_time.slice(0,5)}–{s.end_time.slice(0,5)} · còn {s.available_slots} slot
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Chọn giờ */}
          {selected && (
            <div className="card">
              <h2 className="font-semibold text-gray-800 mb-4">2. Chọn giờ khám</h2>
              <div className="flex flex-wrap gap-2">
                {slots.map(slot => (
                  <button key={slot} type="button" onClick={() => setForm(p => ({ ...p, appt_time: slot }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all
                      ${form.appt_time === slot
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary'}`}>
                    {slot.slice(0,5)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lý do */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4">3. Lý do khám (tùy chọn)</h2>
            <textarea value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
              rows={3} placeholder="Mô tả triệu chứng hoặc lý do đến khám..."
              className="input resize-none" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Đang đặt lịch...' : 'Xác nhận đặt lịch'}
          </button>
        </form>
      )}
    </div>
  )
}