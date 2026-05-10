import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Post { id: number; title: string; body: string; }

export function Posts() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken') || '';
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('https://gorest.co.in/public/v2/posts', {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, per_page: perPage },
    }).then(res => {
      setPosts(res.data);
      setTotalPages(Number(res.headers['x-pagination-pages']) || 1);
    }).finally(() => setLoading(false));
  }, [page, perPage]);

  const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
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
          <h1 className="page-title">Посты</h1>
          <p className="page-subtitle">Список публикаций GoREST API</p>
        </div>
        <button className="btn-back" onClick={() => navigate('/')}>← На главную</button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="toolbar-left">
            <span className="table-name">Публикации</span>
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
            <tr><th style={{ width: 100 }}>ID</th><th>Заголовок</th><th></th></tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: perPage }).map((_, i) => (
                  <tr key={i} className="skeleton-row">
                    <td><div className="skeleton-line" style={{ width: 60 }} /></td>
                    <td><div className="skeleton-line" style={{ width: '70%' }} /></td>
                    <td />
                  </tr>
                ))
              : filtered.length === 0
              ? <tr><td colSpan={3} style={{ padding: '60px', textAlign: 'center', color: '#2a2a2a' }}>Ничего не найдено</td></tr>
              : filtered.map(post => (
                  <tr key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
                    <td className="td-id">#{post.id}</td>
                    <td className="td-title">{post.title}</td>
                    <td><span className="row-arrow">→</span></td>
                  </tr>
                ))
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
    </div>
  );
}
