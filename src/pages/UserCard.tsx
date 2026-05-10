import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface User { id: number; name: string; email: string; gender: string; status: string; }

export function UserCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken') || '';
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://gorest.co.in/public/v2/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setUser(res.data)).finally(() => setLoading(false));
  }, [id]);

  const initials = (name: string) => name.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase();
  const parts = user?.name.split(' ') || [];

  return (
    <div className="user-card-root">
      <div className="page-header">
        <div>
          <h1 className="page-title">Карточка пользователя</h1>
          <p className="page-subtitle">Детальная информация</p>
        </div>
        <button className="btn-back" onClick={() => navigate('/users')}>← К пользователям</button>
      </div>

      {loading ? (
        <div style={{ color: '#2a2a2a', padding: '60px 0', textAlign: 'center' }}>Загрузка...</div>
      ) : user ? (
        <>
          <div className="user-hero">
            <div className="user-hero-avatar">{initials(user.name)}</div>
            <div>
              <div className="user-hero-name">{user.name}</div>
              <div className="user-hero-email">{user.email}</div>
              <span className={`status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                {user.status === 'active' ? '● Активен' : '○ Неактивен'}
              </span>
            </div>
          </div>

          <div className="user-meta-grid">
            <div className="user-meta-item">
              <div className="user-meta-label">ID</div>
              <div className="user-meta-value" style={{ fontFamily: 'Courier New, monospace', fontSize: 14 }}>{user.id}</div>
            </div>
            <div className="user-meta-item">
              <div className="user-meta-label">Имя</div>
              <div className="user-meta-value">{parts[0] || '—'}</div>
            </div>
            <div className="user-meta-item">
              <div className="user-meta-label">Фамилия</div>
              <div className="user-meta-value">{parts.slice(1).join(' ') || '—'}</div>
            </div>
            <div className="user-meta-item">
              <div className="user-meta-label">Пол</div>
              <div className="user-meta-value">{user.gender === 'male' ? 'Мужской' : 'Женский'}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state"><p>Пользователь не найден</p></div>
      )}
    </div>
  );
}
