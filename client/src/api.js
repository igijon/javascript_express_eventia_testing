const API = "http://localhost:3000/api";
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("eventia_token");
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Error ${response.status}`);
  return data;
}
