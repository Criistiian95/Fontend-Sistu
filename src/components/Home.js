import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { api, saveSession } from "../api";
import { useUser } from "./UserContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, refresh } = useUser();
  useEffect(() => {
    if (user) navigate(`/api/user/${user.id}`, { replace: true });
  }, [user, navigate]);
  const schema = Yup.object({
    email: Yup.string()
      .email("Ingresá un correo válido.")
      .required("Ingresá tu correo."),
    password: Yup.string().required("Ingresá tu contraseña."),
  });
  async function submit(values) {
    setError("");
    try {
      const data = await api("/api/user/login", {
        method: "POST",
        body: JSON.stringify({ ...values, recordarme: rememberMe }),
      });
      if (!data.token || !data.id)
        throw new Error("El servidor devolvió una respuesta incompleta.");
      saveSession(data, rememberMe);
      await refresh();
      navigate(`/api/user/${data.id}`, { replace: true });
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="login-layout">
      <section className="login-story" aria-label="Sismed, gestión médica">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            +
          </span>{" "}
          sismed<span className="brand-dot">.</span>
        </Link>
        <div className="story-content">
          <span className="eyebrow">GESTIÓN MÉDICA, MÁS SIMPLE</span>
          <h1>
            Más tiempo para
            <br />
            lo que importa.
          </h1>
          <p>
            Tu agenda, tus pacientes y tu equipo.
            <br />
            Todo conectado en un mismo lugar.
          </p>
          <div className="story-illustration" aria-hidden="true">
            <div className="illustration-header">
              <span>Una agenda más organizada</span>
              <span>✦</span>
            </div>
            <div className="illustration-week">
              LUN <b>MAR</b> MIÉ JUE VIE
            </div>
            <div className="illustration-row">
              <span className="illustration-time">09:00</span>
              <div>
                <i />
                Consulta médica<span>Todo listo para atender</span>
              </div>
            </div>
            <div className="illustration-row">
              <span className="illustration-time">09:30</span>
              <div>
                <i />
                Próxima consulta<span>Cada turno, en su lugar</span>
              </div>
            </div>
            <div className="illustration-note">
              ✓ Menos tareas. Más atención.
            </div>
          </div>
        </div>
        <span className="story-bottom">
          Pensado para acompañar tu trabajo de cada día.
        </span>
      </section>
      <section className="login-panel">
        <div className="login-form">
          <span className="eyebrow">BIENVENIDO A SISMED</span>
          <h2>Tu día comienza acá.</h2>
          <p className="muted">
            Ingresá a tu cuenta para gestionar tu consultorio.
          </p>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={schema}
            onSubmit={submit}
          >
            {({ isSubmitting }) => (
              <Form noValidate>
                <label htmlFor="email">Correo electrónico</label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="nombre@consultorio.com"
                  aria-describedby="email-error"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="field-error"
                  id="email-error"
                />
                <label htmlFor="password">Contraseña</label>
                <div className="password-field">
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Ingresá tu contraseña"
                    aria-describedby="password-error"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="field-error"
                  id="password-error"
                />
                <label className="remember" htmlFor="remember">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />{" "}
                  Recordarme
                </label>
                {error && (
                  <div className="form-alert" role="alert">
                    {error}
                  </div>
                )}
                <button
                  className="primary-button login-submit"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Ingresando…" : "Iniciar sesión"}
                  <span aria-hidden="true">→</span>
                </button>
              </Form>
            )}
          </Formik>
          <p className="register-link">
            ¿Tenés un código de invitación?{" "}
            <Link to="/register">Registrate</Link>
          </p>
          <div className="login-footnote">
            Un espacio para organizar mejor tu atención.
          </div>
        </div>
      </section>
    </main>
  );
}
