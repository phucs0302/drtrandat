import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import {
  Search,
  Stethoscope,
  Award,
  CalendarDays,
  ArrowRight,
  Star,
} from 'lucide-react'

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
  <div className="max-w-7xl mx-auto px-4 py-8">

    {/* Header */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

      <div>
        <p className="text-teal-600 font-medium mb-2">
          Đội ngũ chuyên gia y tế
        </p>

        <h1 className="text-4xl font-bold text-slate-800">
          Danh sách bác sĩ
        </h1>

        <p className="text-gray-500 mt-3 max-w-2xl">
          Tìm kiếm bác sĩ phù hợp với nhu cầu khám bệnh của bạn và đặt lịch trực tuyến nhanh chóng.
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full lg:w-[340px]">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc chuyên khoa..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
        />
      </div>
    </div>

    {/* Loading */}
    {loading ? (
      <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-gray-400 shadow-sm">
        Đang tải danh sách bác sĩ...
      </div>
    ) : filtered.length === 0 ? (

      /* Empty */
      <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">

        <div className="w-20 h-20 rounded-3xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
          <Search size={34} />
        </div>

        <h3 className="text-2xl font-semibold text-slate-800 mt-5">
          Không tìm thấy bác sĩ
        </h3>

        <p className="text-gray-500 mt-2">
          Hãy thử tìm kiếm bằng tên hoặc chuyên khoa khác.
        </p>
      </div>

    ) : (

      /* Doctor Grid */
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filtered.map(doc => (
          <div
            key={doc.id}
            className="group relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500 to-teal-500 opacity-10 rounded-full blur-3xl" />

            {/* Top */}
            <div className="flex items-start justify-between">

              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white flex items-center justify-center shadow-lg">
                <Stethoscope size={30} />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">
                <Star size={14} fill="currentColor" />
                4.9
              </div>
            </div>

            {/* Content */}
            <div className="mt-6">

              <h2 className="text-2xl font-semibold text-slate-800">
                {doc.name}
              </h2>

              {/* Specialty */}
              <div className="inline-flex items-center gap-2 mt-3 bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
                <Stethoscope size={15} />
                {doc.specialty}
              </div>

              {/* Degree */}
              {doc.degree && (
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                  <Award size={16} className="text-cyan-600" />
                  <span>{doc.degree}</span>
                </div>
              )}

              {/* Experience */}
              {doc.experience > 0 && (
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <CalendarDays size={16} />
                  <span>{doc.experience} năm kinh nghiệm</span>
                </div>
              )}

              {/* Bio */}
              {doc.bio && (
                <p className="mt-4 text-sm text-gray-500 leading-relaxed line-clamp-3">
                  {doc.bio}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-7">

              <Link
                to={`/patient/book/${doc.id}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-90 text-white py-3 rounded-2xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                Đặt lịch khám
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)
}