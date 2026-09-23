import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useUser } from "./UserContext";
import LogoutButton from "./LogoutButton";
export default function Navbar() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const links = [
    [`/api/user/${user.id}`, "Resumen", "◫"],
    ["/turnos", "Agendar turno", "+"],
    ["/turns-patients", "Buscar pacientes", "⌕"],
    ["/createPatient", "Agregar paciente", "+"],
  ];
  if (Number(user.role_id) === 1)
    links.push(["/createDoctor", "Agregar médico", "+"]);
  return (
    <>
      <header className="workspace-topbar">
        <Link to={`/api/user/${user.id}`} className="brand">
          <span className="brand-mark" aria-hidden="true">
            +
          </span>
          sismed<span className="brand-dot">.</span>
        </Link>
        <span className="workspace-caption">Tu consultorio, conectado.</span>
        <div className="workspace-user">
          <span className="user-avatar" aria-hidden="true">
            {user.name.slice(0, 1)}
          </span>
          <span>
            {user.name} {user.lastname}
            <small>{user.role?.name || "Gestión médica"}</small>
          </span>
        </div>
        <button
          className="menu-toggle"
          aria-controls="workspace-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </header>
      <aside
        id="workspace-navigation"
        className={`workspace-sidebar ${open ? "is-open" : ""}`}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <span className="nav-label">CONSULTORIO</span>
        <nav aria-label="Navegación principal">
          {links.map(([to, label, icon]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              <span aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <p>
            Todo en su lugar.
            <br />
            <small>Más simple, cada día.</small>
          </p>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
