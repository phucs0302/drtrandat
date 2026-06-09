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
    <div className="flex flex-1">

      <Sidebar />

      <main className="flex-1 p-6">

        <div className="max-w-xl mx-auto">

          <div className="card">

            <h2 className="text-2xl font-bold mb-6">
              Đổi mật khẩu
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-4">
                <label>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-4">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-4">
                <label>Xác nhận mật khẩu</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
              >
                Đổi mật khẩu
              </button>

            </form>

          </div>

        </div>

      </main>

    </div>
  );
}