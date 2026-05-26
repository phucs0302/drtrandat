import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'

const emptyForm = { name: '', email: '', password: '', phone: '', specialty: '', degree: '', experience: 0, bio: '' }

export default function AdminDoctors() {
  const [doctors,   setDoctors]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [editDoc,   setEditDoc]   = useState(null)
  const [form,      setForm]      = useState(emptyForm)
  const [error,     setError]     = useState('')
  const [saving,    setSaving]    = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/admin/users?role=doctor').then(r => setDoctors(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditDoc(null); setForm(emptyForm); setError(''); setShowForm(true) }
  const openEdit   = async doc => {
    const { data } = await api.get(`/doctors/${doc.id}`)
    setEditDoc(doc)
    setForm({ name: data.name, email: data.email, password: '', phone: data.phone || '',
              specialty: data.specialty, degree: data.degree || '', experience: data.experience || 0, bio: data.bio || '' })
    setError('')
    setShowForm(true)
  }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (editDoc) {
        await api.put(`/admin/doctors/${editDoc.id}`, form)
      } else {
        await api.post('/admin/doctors', form)
      }
      setShowForm(false); load()
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu thất bại')
    } finally { setSaving(false) }
  }

  const toggleUser = async (userId) => {
    await api.put(`/admin/users/${userId}/toggle`)
    load()
  }

  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 px-6 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-semibold text-gray-900">Quản lý bác sĩ</h1>
            <p className="text-gray-400 text-sm mt-1">Thêm, chỉnh sửa thông tin bác sĩ</p>
          </div>
          <button onClick={openCreate} className="btn-primary text-sm">+ Thêm bác sĩ</button>
        </div>

        {showForm && (
          <div className="card border-2 border-primary/20 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">{editDoc ? 'Chỉnh sửa bác sĩ' : 'Thêm bác sĩ mới'}</h2>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[['name','Họ tên','text'],['email','Email','email'],
                ...(!editDoc ? [['password','Mật khẩu','password']] : []),
                ['phone','Số điện thoại','text'],['specialty','Chuyên khoa','text'],
                ['degree','Bằng cấp','text'],['experience','Kinh nghiệm (năm)','number']
              ].map(([name, label, type]) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input type={type} name={name} value={form[name]} onChange={handleChange}
                    required={['name','email','specialty'].includes(name) || (name==='password' && !editDoc)}
                    className="input" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Giới thiệu</label>
                <textarea name="bio" value={form.bio} onChange={handleChange}
                  rows={2} className="input resize-none" />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Huỷ</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Đang tải...</div>
        ) : doctors.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">Chưa có bác sĩ nào</div>
        ) : (
          <div className="flex flex-col gap-3">
            {doctors.map(d => (
              <div key={d.id} className={`card flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${!d.is_active ? 'opacity-60' : ''}`}>
                <div className="flex gap-4 items-center">
                  <div className="w-11 h-11 bg-primary-light rounded-full flex items-center justify-center text-xl shrink-0">👨‍⚕️</div>
                  <div>
                    <p className="font-semibold text-gray-900">{d.name}</p>
                    <p className="text-sm text-gray-400">{d.email} · {d.phone || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {d.is_active ? 'Hoạt động' : 'Vô hiệu'}
                  </span>
                  <button onClick={() => openEdit(d)} className="text-sm text-primary hover:underline">Sửa</button>
                  <button onClick={() => toggleUser(d.id)}
                    className={`text-sm ${d.is_active ? 'text-red-500 hover:underline' : 'text-green-600 hover:underline'}`}>
                    {d.is_active ? 'Vô hiệu hoá' : 'Kích hoạt'}
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