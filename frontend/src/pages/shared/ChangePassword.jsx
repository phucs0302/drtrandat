import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';

export default function ChangePassword() {

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await api.put(
        '/auth/change-password',
        formData
      );

      alert(res.data.message);

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error) {

      alert(
        error.response?.data?.message ||
        'Đổi mật khẩu thất bại'
      );

    }
  };
return (
  <div className="flex flex-1 bg-gray-50">
    <Sidebar />

    <main className="flex-1 p-8">
      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-8 text-white">
            <h1 className="text-3xl font-bold">
              Đổi mật khẩu
            </h1>

            <p className="mt-2 opacity-90">
              Cập nhật mật khẩu để bảo vệ tài khoản của bạn
            </p>
          </div>

          {/* Content */}
          <div className="p-8">

            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center text-4xl">
                🔒
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu hiện tại
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-700">
                  ⚠️ Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa,
                  chữ thường và số để tăng tính bảo mật.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-medium transition duration-200 shadow-sm"
                >
                  Đổi mật khẩu
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </main>
  </div>
);
}   
