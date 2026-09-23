import React from "react";
import * as Yup from "yup";
import Page from "./Page";
import RecordForm from "./RecordForm";
const fields = [
  { name: "name", label: "Nombre", autoComplete: "given-name" },
  { name: "lastname", label: "Apellido", autoComplete: "family-name" },
  { name: "dni", label: "DNI", inputMode: "numeric" },
  { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel" },
  { name: "street", label: "Calle y número", autoComplete: "street-address" },
  { name: "location", label: "Localidad", autoComplete: "address-level2" },
];
const initial = Object.fromEntries(fields.map((f) => [f.name, ""]));
const schema = Yup.object({
  ...Object.fromEntries(
    fields.map((f) => [
      f.name,
      Yup.string()
        .trim()
        .max(f.name === "street" ? 200 : f.name === "phone" ? 30 : 100)
        .required("Completá este campo."),
    ]),
  ),
  dni: Yup.string()
    .matches(/^\d{6,12}$/, "Ingresá el DNI sin puntos.")
    .required("Ingresá el DNI."),
});
export default function RegisterPatient() {
  return (
    <Page
      title="Nuevo paciente"
      subtitle="Completá sus datos para incorporarlo al consultorio."
    >
      <section className="form-panel">
        <RecordForm
          fields={fields}
          schema={schema}
          initialValues={initial}
          endpoint="/api/patient/createPatient"
          submitLabel="Guardar paciente"
        />
      </section>
    </Page>
  );
}
