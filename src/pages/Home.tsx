import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@consta/uikit/Button';
import { TextField } from '@consta/uikit/TextField';

export function Home() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('accessToken') || '');
  const [error, setError] = useState('');

  const validate = () => {
    if (!token.trim()) {
      setError('Токен не может быть пустым');
      return false;
    }
    localStorage.setItem('accessToken', token.trim());
    setError('');
    return true;
  };

  const hasToken = token.trim().length > 0;

  return (
    <div className="home-root">
      <div className="home-card">

        <div className="home-badge">
          <div className="home-badge-dot" />
          gorest.co.in — online
        </div>

        <h1 className="home-title">
          GoREST<br />
          <span>Dashboard</span>
        </h1>
        <p className="home-subtitle">
          Введите токен доступа для работы с API.<br />
          Получить его можно на gorest.co.in
        </p>

        {/* Consta TextField */}
        <div className="home-consta-input">
          <TextField
            id="token-input"
            type="password"
            placeholder="Вставьте ваш access token..."
            value={token}
            onChange={(value) => {
              setToken(value || '');
              if (error) setError('');
            }}
            status={error ? 'alert' : undefined}
            caption={error || undefined}
            label="Access Token"
            labelPosition="top"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && hasToken) {
                validate() && navigate('/users');
              }
            }}
          />
        </div>

        <div className="home-actions">
          {/* Consta Button */}
          <Button
            label="Пользователи →"
            view="primary"
            width="full"
            size="l"
            disabled={!hasToken}
            onClick={() => validate() && navigate('/users')}
            className="home-consta-btn-primary"
          />

          <div className="home-divider">
            <div className="home-divider-line" />
            <span className="home-divider-text">или</span>
            <div className="home-divider-line" />
          </div>

          <Button
            label="Посты"
            view="ghost"
            width="full"
            size="l"
            disabled={!hasToken}
            onClick={() => validate() && navigate('/posts')}
          />
        </div>

        <div className="home-footer">
          <a href="https://gorest.co.in" target="_blank" rel="noreferrer">
            Получить токен ↗
          </a>
          <span className="home-footer-api">api/v2</span>
        </div>

      </div>
    </div>
  );
}