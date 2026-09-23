import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { api } from "../api";
export default function RecordForm({
  fields,
  schema,
  initialValues,
  endpoint,
  submitLabel,
  onSuccess,
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values, helpers) => {
        setError("");
        setSuccess("");
        try {
          const data = await api(endpoint, {
            method: "POST",
            body: JSON.stringify(values),
          });
          helpers.resetForm();
          setSuccess(data.message || "Datos guardados.");
          onSuccess?.(data);
        } catch (e) {
          setError(e.message);
          if (e.fields)
            helpers.setErrors(
              Object.fromEntries(e.fields.map((f) => [f.field, f.message])),
            );
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="record-form" noValidate>
          <div className="form-grid">
            {fields.map((f) => (
              <div className={f.wide ? "full-width" : ""} key={f.name}>
                <label htmlFor={f.name}>{f.label}</label>
                <Field
                  id={f.name}
                  name={f.name}
                  type={f.type || "text"}
                  as={f.options ? "select" : "input"}
                  autoComplete={f.autoComplete || "off"}
                  inputMode={f.inputMode}
                  aria-describedby={`${f.name}-error`}
                >
                  {f.options ? (
                    <>
                      <option value="">Seleccioná una opción</option>
                      {f.options.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </>
                  ) : undefined}
                </Field>
                <ErrorMessage
                  name={f.name}
                  id={`${f.name}-error`}
                  component="div"
                  className="field-error"
                />
              </div>
            ))}
          </div>
          {error && (
            <div className="form-alert" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="success-alert" role="status">
              {success}
            </div>
          )}
          <div className="form-actions">
            <span className="muted">Todos los campos son obligatorios.</span>
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando…" : submitLabel}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
