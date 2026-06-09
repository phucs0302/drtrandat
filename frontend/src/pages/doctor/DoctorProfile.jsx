import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function DoctorProfile() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    degree: '',
    experience: '',
    bio: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

    const res = await api.get('/auth/profile');

    setFormData({
      name: res.data.name || '',
      email: res.data.email || '',
      phone: res.data.phone || '',
      specialty: res.data.doctorInfo?.specialty || '',
      degree: res.data.doctorInfo?.degree || '',
      experience: res.data.doctorInfo?.experience || '',
      bio: res.data.doctorInfo?.bio || ''
    });
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    await api.put('/auth/profile', formData);

    alert('Cập nhật thành công');
  };

 return (
  <div className="max-w-6xl mx-auto p-6">

    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-8 text-white">
        <h1 className="text-3xl font-bold">
          Hồ sơ bác sĩ
        </h1>

        <p className="mt-2 opacity-90">
          Quản lý thông tin chuyên môn
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8"
      >
        <div className="flex justify-center mb-8">
          <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-700">
            👨‍⚕️
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-medium mb-2">
              Họ tên
            </label>

            <input
              className="w-full border rounded-xl px-4 py-3"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              className="w-full border rounded-xl px-4 py-3 bg-gray-100"
              value={formData.email}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Số điện thoại
            </label>

            <input
              className="w-full border rounded-xl px-4 py-3"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Chuyên khoa
            </label>

            <input
              className="w-full border rounded-xl px-4 py-3"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Học vị
            </label>

            <input
              className="w-full border rounded-xl px-4 py-3"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Kinh nghiệm (năm)
            </label>

            <input
              className="w-full border rounded-xl px-4 py-3"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Giới thiệu
            </label>

            <textarea
              rows="5"
              className="w-full border rounded-xl px-4 py-3"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

        </div>

        <div className="mt-8 text-right">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>

    </div>

  </div>
);
}