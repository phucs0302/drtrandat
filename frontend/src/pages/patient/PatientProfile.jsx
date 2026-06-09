import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function PatientProfile() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {

      const res = await api.get('/auth/profile');

      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || ''
      });

    } catch (error) {
      console.error(error);
      alert('Không tải được thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await api.put('/auth/profile', {
        name: formData.name,
        phone: formData.phone
      });

      alert('Cập nhật thành công');

    } catch (error) {

      console.error(error);
      alert('Cập nhật thất bại');

    }
  };

  if (loading) {
    return <div className="container mt-4">Đang tải...</div>;
  }

 return (
  <div className="max-w-4xl mx-auto p-6">
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-8 text-white">
        <h1 className="text-3xl font-bold">
          Hồ sơ cá nhân
        </h1>

        <p className="opacity-90 mt-2">
          Cập nhật thông tin tài khoản của bạn
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8"
      >
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center text-3xl font-bold text-teal-700">
            {formData.name?.charAt(0)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-medium mb-2">
              Họ và tên
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full border rounded-xl px-4 py-3 bg-gray-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Số điện thoại
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="mt-8 text-right">
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-medium transition"
          >
            Cập nhật thông tin
          </button>
        </div>
      </form>
    </div>
  </div>
);  
}