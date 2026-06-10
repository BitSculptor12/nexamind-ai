const BACKEND_URL = "https://nexamind-ai-a29k.onrender.com";

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_URL}${normalizedPath}`;
}
