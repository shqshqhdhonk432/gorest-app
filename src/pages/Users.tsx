import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User { id: number; name: string; email: string; gender: string; status: string; }

const COLORS = ['av-0','av-1','av-2','av-3','av-4'];
const initials = (name: string) => name.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase();

export function Users() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken') || '';

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [copiedEmail, setCopiedEmail] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('https://gorest.co.in/public/v2/users', {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, per_page: perPage },
    }).then(res => {
      setUsers(res.data);
      setTotalPages(Number(res.headers['x-pagination-pages']) || 1);
    }).finally(() => setLoading(false));
  }, [page, perPage]);

  const copyEmail = (e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setToast(`Скопировано: ${email}`);
    setTimeout(() => { setCopiedEmail(''); setToast(''); }, 2000);
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getPages = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="page-root">
      <div className="page-header">
        <div>
          <h1 className="page-title">Пользователи</h1>
          <p className="page-subtitle">Список пользователей GoREST API</p>
        </div>
        <button className="btn-back" onClick={() => navigate('/')}>← На главную</button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="toolbar-left">
            <span className="table-name">Пользователи</span>
            <span className="count-pill">{filtered.length}</span>
          </div>
          <div className="toolbar-right">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input className="search-input" placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="per-page-select" value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
              <option value={10}>10 / стр.</option>
              <option value={25}>25 / стр.</option>
              <option value={50}>50 / стр.</option>
            </select>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: perPage }).map((_, i) => (
                  <tr key={i} className="skeleton-row">
                    <td><div className="skeleton-line" style={{ width: '120px' }} /></td>
                    <td><div className="skeleton-line" style={{ width: '90px' }} /></td>
                    <td><div className="skeleton-line" style={{ width: '180px' }} /></td>
                    <td />
                  </tr>
                ))
              : filtered.length === 0
              ? (
                  <tr><td colSpan={4} style={{ padding: '60px', textAlign: 'center', color: '#2a2a2a' }}>Ничего не найдено</td></tr>
                )
              : filtered.map((user, i) => {
                  const parts = user.name.split(' ');
                  const firstName = parts[0];
                  const lastName = parts.slice(1).join(' ') || '—';
                  return (
                    <tr key={user.id} onClick={() => navigate(`/users/${user.id}`)}>
                      <td>
                        <div className="td-user">
                          <div className={`td-avatar ${COLORS[i % 5]}`}>{initials(user.name)}</div>
                          <span className="td-name">{firstName}</span>
                        </div>
                      </td>
                      <td style={{ color: '#666' }}>{lastName}</td>
                      <td
                        className={`td-email${copiedEmail === user.email ? ' copied' : ''}`}
                        onClick={(e) => copyEmail(e, user.email)}
                        title="Нажмите чтобы скопировать"
                      >
                        {copiedEmail === user.email ? '✓ скопировано' : user.email}
                      </td>
                      <td><span className="row-arrow">→</span></td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>

        <div className="pagination-bar">
          <span className="pg-info">Стр. {page} из {totalPages}</span>
          <div className="pg-controls">
            <button className="pg-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
            {getPages().map((p, i) =>
              p === '...'
                ? <span key={`d${i}`} style={{ color: '#2a2a2a', padding: '0 2px', fontSize: 13 }}>…</span>
                : <button key={p} className={`pg-btn${page === p ? ' active' : ''}`} onClick={() => setPage(p as number)}>{p}</button>
            )}
            <button className="pg-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast">
          <span className="toast-icon">✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}
