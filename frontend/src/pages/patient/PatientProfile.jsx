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
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header">
          <h4>Thông tin cá nhân</h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>Họ tên</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                disabled
              />
            </div>

            <div className="mb-3">
              <label>Số điện thoại</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <button
              className="btn btn-primary"
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