export const API_URL = (
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3003")
).replace(/\/$/, "");
export const getToken = () =>
  sessionStorage.getItem("token") || localStorage.getItem("token");
export function clearSession() {
  ["token", "userId"].forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}
export function saveSession(data, remember) {
  clearSession();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("token", data.token);
  storage.setItem("userId", String(data.id));
}
export async function api(path, options = {}) {
  if (!API_URL)
    throw new Error(
      "Falta configurar REACT_APP_API_URL para conectar el sistema.",
    );
  let response;
  try {
    const token = getToken();
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(
      "No pudimos conectar con el servidor. Revisá que el backend esté encendido.",
    );
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("El servidor devolvió una respuesta inesperada.");
  }
  if (!response.ok) {
    if (response.status === 401 && !path.endsWith("/login")) {
      clearSession();
      window.dispatchEvent(new Event("sismed:logout"));
    }
    const error = new Error(
      data.message || "No se pudo completar la operación.",
    );
    error.status = response.status;
    error.fields = data.errors;
    throw error;
  }
  return data;
}
