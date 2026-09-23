import React from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import RecordForm from "./RecordForm";
const fields = [
  { name: "nombre", label: "Nombre" },
  { name: "apellido", label: "Apellido" },
  {
    name: "email",
    label: "Correo electrónico",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Contraseña (mínimo 12 caracteres)",
    type: "password",
    autoComplete: "new-password",
  },
  {
    name: "registrationCode",
    label: "Código de invitación",
    type: "password",
    wide: true,
  },
];
const schema = Yup.object({
  nombre: Yup.string().trim().max(100).required("Ingresá tu nombre."),
  apellido: Yup.string().trim().max(100).required("Ingresá tu apellido."),
  email: Yup.string()
    .email("Ingresá un correo válido.")
    .required("Ingresá tu correo."),
  password: Yup.string()
    .min(12, "Usá al menos 12 caracteres.")
    .test(
      "byte-length",
      "La contraseña es demasiado larga.",
      (v) => !v || new TextEncoder().encode(v).length <= 72,
    )
    .required("Ingresá una contraseña."),
  registrationCode: Yup.string().required("Pedile el código al administrador."),
});
export default function RegisterUser() {
  return (
    <main className="registration-page">
      <Link className="brand" to="/">
        + sismed.
      </Link>
      <h1>Sumate al equipo.</h1>
      <p className="muted">
        Creá tu acceso de recepción con el código del administrador.
      </p>
      <section className="form-panel">
        <RecordForm
          fields={fields}
          schema={schema}
          initialValues={Object.fromEntries(fields.map((f) => [f.name, ""]))}
          endpoint="/api/user/Registro-usuario"
          submitLabel="Crear cuenta"
        />
      </section>
      <p className="register-link">
        ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </main>
  );
}
