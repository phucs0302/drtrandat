import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'

export default function DoctorList() {
  const [doctors, setDoctors] = useState([])
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/doctors').then(r => setDoctors(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-display font-semibold text-gray-900">Danh sách bác sĩ</h1>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc chuyên khoa..."
          className="input max-w-xs" />
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Không tìm thấy bác sĩ nào</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(doc => (
            <div key={doc.id} className="card hover:shadow-md transition-all duration-200">
              <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center text-2xl mb-4">
                👨‍⚕️
              </div>
              <h3 className="font-semibold text-gray-900">{doc.name}</h3>
              <span className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full mt-1 inline-block">
                {doc.specialty}
              </span>
              {doc.degree && <p className="text-sm text-gray-500 mt-1">{doc.degree}</p>}
              {doc.experience > 0 && (
                <p className="text-sm text-gray-400 mt-0.5">{doc.experience} năm kinh nghiệm</p>
              )}
              {doc.bio && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{doc.bio}</p>}
              <Link to={`/patient/book/${doc.id}`}
                className="btn-primary w-full text-center mt-4 block text-sm">
                Đặt lịch khám
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}