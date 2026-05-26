/** Backend base URL — override in .env with VITE_API_URL */
export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const ANALYZE_URL = `${API_BASE}/api/analyze`;
