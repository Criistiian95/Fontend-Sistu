import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { api } from "../api";
import Page from "./Page";
import RecordForm from "./RecordForm";
const schema = Yup.object({
  name: Yup.string().trim().max(100).required("Ingresá el nombre."),
  lastname: Yup.string().trim().max(100).required("Ingresá el apellido."),
  tuition: Yup.string()
    .matches(/^[a-zA-Z0-9-]{1,20}$/, "Usá letras, números o guiones.")
    .required("Ingresá la matrícula."),
  specialty: Yup.number().required("Seleccioná una especialidad."),
});
export default function RegisterDoctors() {
  const [specialties, setSpecialties] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const c = new AbortController();
    setError("");
    api("/api/doctor/specialties", { signal: c.signal })
      .then(setSpecialties)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => c.abort();
  }, [attempt]);
  const fields = [
    { name: "name", label: "Nombre" },
    { name: "lastname", label: "Apellido" },
    { name: "tuition", label: "Matrícula" },
    { name: "specialty", label: "Especialidad", options: specialties || [] },
  ];
  return (
    <Page
      title="Nuevo profesional"
      subtitle="Agregá un médico y su especialidad al equipo."
    >
      <section className="form-panel">
        {error ? (
          <div className="empty-state" role="alert">
            <p>{error}</p>
            <button
              className="primary-button"
              onClick={() => setAttempt((n) => n + 1)}
            >
              Reintentar
            </button>
          </div>
        ) : !specialties ? (
          <p className="empty-state" role="status">
            Cargando especialidades…
          </p>
        ) : (
          <RecordForm
            fields={fields}
            schema={schema}
            initialValues={{
              name: "",
              lastname: "",
              tuition: "",
              specialty: "",
            }}
            endpoint="/api/doctor/createDoctor"
            submitLabel="Guardar profesional"
          />
        )}
      </section>
    </Page>
  );
}
