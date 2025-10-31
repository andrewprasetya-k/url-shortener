const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SHORT_URL_BASE = process.env.NEXT_PUBLIC_SHORT_URL_BASE || 'http://localhost:3001';

export function getApiUrl(path: string = '') {
  return `${API_BASE_URL}/${path}`;
}

export function getShortUrl(path: string = '') {
  return `${SHORT_URL_BASE}/${path}`;
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    const res = await fetch(getApiUrl('auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Refresh token error:', error);
    return false;
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let token = localStorage.getItem('access_token');

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      token = localStorage.getItem('access_token');
      const newHeaders = { ...headers, Authorization: `Bearer ${token}` };
      response = await fetch(url, { ...options, headers: newHeaders });
    } else {
      // If refresh fails, redirect to login. 
      // This is a simple approach. A more robust solution might use a shared state or callback.
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      // Return the original failed response to prevent further processing in the calling function
      return response; 
    }
  }

  return response;
}

