import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../utils/AuthContext'

const roleHome = { admin: '/admin', doctor: '/doctor', patient: '/patient' }

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.token, data.user)
      navigate(roleHome[data.user.role] || '/patient')
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-light via-white to-accent/10 px-4">
      <div className="w-full max-w-md">
        <div className="card shadow-xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold font-display">M</span>
            </div>
            <h1 className="text-3xl font-display font-semibold text-gray-900">Đăng nhập</h1>
            <p className="text-gray-400 text-sm mt-1">Hệ thống quản lý lịch khám MediCare</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input name="email" type="email" value={form.email}
                onChange={handleChange} required placeholder="your@email.com"
                className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
              <input name="password" type="password" value={form.password}
                onChange={handleChange} required placeholder="••••••••"
                className="input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Đăng ký ngay</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Admin: admin@hospital.com · Bác sĩ: bsnguyenan@hospital.com · Mật khẩu: <code>Admin@123</code>
        </p>
      </div>
    </div>
  )
}