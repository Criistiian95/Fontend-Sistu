import React, { useState } from "react";
import { api, clearSession } from "../api";
export default function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function logout() {
    setBusy(true);
    setError("");
    try {
      await api("/api/user/logout", { method: "POST" });
      clearSession();
      window.dispatchEvent(new Event("sismed:logout"));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button className="secondary-button" disabled={busy} onClick={logout}>
        {busy ? "Cerrando…" : "Cerrar sesión"}
      </button>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
