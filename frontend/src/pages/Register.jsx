import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Mật khẩu xác nhận không khớp')
    if (form.password.length < 6)       return setError('Mật khẩu phải có ít nhất 6 ký tự')
    setLoading(true)
    try {
      await api.post('/auth/register', { name: form.name, email: form.email, phone: form.phone, password: form.password })
      navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } })
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-light via-white to-accent/10 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-semibold text-gray-900">Đăng ký tài khoản</h1>
            <p className="text-gray-400 text-sm mt-1">Dành cho bệnh nhân</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
              <input name="name" value={form.name} onChange={handleChange}
                required placeholder="Nguyễn Văn A" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                required placeholder="your@email.com" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="0901234567" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
              <input name="password" type="password" value={form.password}
                onChange={handleChange} required placeholder="Tối thiểu 6 ký tự" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
              <input name="confirm" type="password" value={form.confirm}
                onChange={handleChange} required placeholder="Nhập lại mật khẩu" className="input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  )
}