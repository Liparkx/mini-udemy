export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/dev';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'Erro na requisição';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch {
      // Ignora erro se não for JSON
    }
    throw new Error(errorMsg);
  }

  // Nem todas as rotas retornam JSON, então tentamos fazer o parse e, se falhar ou não tiver conteúdo, retornamos null
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
