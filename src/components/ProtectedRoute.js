import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { getToken, clearSession } from "../api";
export default function ProtectedRoute({ children, admin = false }) {
  const { user, loading, error, refresh } = useUser();
  if (loading)
    return (
      <main className="empty-state" role="status">
        Conectando con tu consultorio…
      </main>
    );
  if (!getToken()) return <Navigate to="/login" replace />;
  if (!user)
    return (
      <main className="empty-state">
        <h1>No pudimos cargar tu cuenta</h1>
        <p role="alert">{error}</p>
        <button className="primary-button" onClick={refresh}>
          Reintentar
        </button>{" "}
        <button
          className="secondary-button"
          onClick={() => {
            clearSession();
            window.dispatchEvent(new Event("sismed:logout"));
          }}
        >
          Volver al ingreso
        </button>
      </main>
    );
  if (admin && Number(user.role_id) !== 1)
    return <Navigate to={`/api/user/${user.id}`} replace />;
  return children;
}
