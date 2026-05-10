import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface Post { id: number; title: string; body: string; }
interface Comment { id: number; name: string; email: string; body: string; }

export function PostCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken') || '';
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`https://gorest.co.in/public/v2/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`https://gorest.co.in/public/v2/posts/${id}/comments`, { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([postRes, commentsRes]) => {
      setPost(postRes.data);
      setComments(commentsRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="post-card-root">
      <div className="page-header">
        <div>
          <h1 className="page-title">Публикация</h1>
          <p className="page-subtitle">Детальный просмотр поста</p>
        </div>
        <button className="btn-back" onClick={() => navigate('/posts')}>← К постам</button>
      </div>

      {loading ? (
        <div style={{ color: '#2a2a2a', padding: '60px 0', textAlign: 'center' }}>Загрузка...</div>
      ) : post ? (
        <>
          <div className="post-hero">
            <div className="post-hero-id">POST #{post.id}</div>
            <div className="post-hero-title">{post.title}</div>
            <div className="post-hero-body">{post.body}</div>
          </div>

          <div className="comments-header">
            <span className="comments-title">Комментарии</span>
            <span className="comments-count">{comments.length}</span>
          </div>

          {comments.length === 0 ? (
            <div className="empty-state"><p>Комментариев нет</p></div>
          ) : comments.map(c => (
            <div className="comment-item" key={c.id}>
              <div className="comment-meta">
                <span className="comment-name">{c.name}</span>
                <span className="comment-email">{c.email}</span>
              </div>
              <div className="comment-body">{c.body}</div>
            </div>
          ))}
        </>
      ) : (
        <div className="empty-state"><p>Пост не найден</p></div>
      )}
    </div>
  );
}