import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'

export default function AdminPatients() {
  const [patients, setPatients] = useState([])
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(true)

  const load = () => {
    setLoading(true)
    api.get('/admin/users?role=patient').then(r => setPatients(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const toggleUser = async id => {
    await api.put(`/admin/users/${id}/toggle`)
    load()
  }

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    (p.phone || '').includes(search)
  )

  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 px-6 py-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-display font-semibold text-gray-900">Quản lý bệnh nhân</h1>
            <p className="text-gray-400 text-sm mt-1">Danh sách tài khoản bệnh nhân trong hệ thống</p>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT..."
            className="input max-w-xs" />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">Không tìm thấy bệnh nhân nào</div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Họ tên','Email','Số điện thoại','Ngày đăng ký','Trạng thái',''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                    <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-5 py-3 text-gray-500">{p.email}</td>
                    <td className="px-5 py-3 text-gray-500">{p.phone || '—'}</td>
                    <td className="px-5 py-3 text-gray-400">
                      {new Date(p.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.is_active ? 'Hoạt động' : 'Vô hiệu'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggleUser(p.id)}
                        className={`text-xs font-medium ${p.is_active ? 'text-red-500 hover:underline' : 'text-green-600 hover:underline'}`}>
                        {p.is_active ? 'Vô hiệu hoá' : 'Kích hoạt'}
                      </button>
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