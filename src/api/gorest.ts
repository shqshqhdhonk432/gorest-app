const BASE_URL = 'https://gorest.co.in/public/v2';

export async function apiRequest<T>(endpoint: string): Promise<T> {
  const token = localStorage.getItem('accessToken');

  if (!token?.trim()) {
    throw new Error('Access token не найден');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки данных: ${response.status}`);
  }

  return response.json();
}
