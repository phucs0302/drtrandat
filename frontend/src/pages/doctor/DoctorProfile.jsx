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
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header">
          <h4>Hồ sơ bác sĩ</h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <input
              className="form-control mb-3"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Họ tên"
            />

            <input
              className="form-control mb-3"
              value={formData.email}
              disabled
            />

            <input
              className="form-control mb-3"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
            />

            <input
              className="form-control mb-3"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="Chuyên khoa"
            />

            <input
              className="form-control mb-3"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              placeholder="Học vị"
            />

            <input
              className="form-control mb-3"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Số năm kinh nghiệm"
            />

            <textarea
              className="form-control mb-3"
              rows="5"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Giới thiệu"
            />

            <button
              className="btn btn-success"
              type="submit"
            >
              Cập nhật
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}