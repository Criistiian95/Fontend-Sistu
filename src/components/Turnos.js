import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import Page from "./Page";
function localDate(date) {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return d.toISOString().slice(0, 16);
}
export default function Turnos() {
  const [doctors, setDoctors] = useState(null);
  const [doctorId, setDoctorId] = useState("");
  const [dni, setDni] = useState("");
  const [patient, setPatient] = useState(null);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [doctorError, setDoctorError] = useState("");
  const [busy, setBusy] = useState(false);
  const [searching, setSearching] = useState(false);
  const [success, setSuccess] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const c = new AbortController();
    setDoctorError("");
    api("/api/doctor/list", { signal: c.signal })
      .then(setDoctors)
      .catch((e) => {
        if (e.name !== "AbortError") setDoctorError(e.message);
      });
    return () => c.abort();
  }, [attempt]);
  async function search(e) {
    e.preventDefault();
    setSearching(true);
    setError("");
    setPatient(null);
    setSuccess("");
    try {
      const data = await api(
        `/api/patient/search?dni=${encodeURIComponent(dni)}`,
      );
      setPatient(data.patient);
    } catch (e) {
      setError(e.message);
    } finally {
      setSearching(false);
    }
  }
  async function save(e) {
    e.preventDefault();
    if (!patient || !doctorId || !date) {
      setError("Seleccioná paciente, médico y horario.");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await api("/api/shift/create", {
        method: "POST",
        body: JSON.stringify({
          paciente_id: patient.DNI,
          doctor_id: doctorId,
          fecha: new Date(date).toISOString(),
          observaciones: notes,
        }),
      });
      setSuccess(`Turno reservado para ${patient.name} ${patient.lastname}.`);
      setDate("");
      setNotes("");
      setPatient(null);
      setDni("");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const doctor = doctors?.find((d) => d.tuition === doctorId);
  const minimum = localDate(
    new Date(Math.ceil((Date.now() + 60000) / 1800000) * 1800000),
  );
  return (
    <Page
      title="Agendar turno"
      subtitle="Elegí el paciente, el profesional y el próximo horario."
    >
      <div className="booking-grid">
        <div>
          <section className="form-panel booking-step">
            <h2>
              <span>1</span> Paciente
            </h2>
            <form className="inline-search record-form" onSubmit={search}>
              <div>
                <label htmlFor="booking-dni">DNI</label>
                <input
                  id="booking-dni"
                  inputMode="numeric"
                  pattern="[0-9]{6,12}"
                  required
                  value={dni}
                  disabled={searching || busy}
                  onChange={(e) => {
                    setDni(e.target.value);
                    setPatient(null);
                    setSuccess("");
                  }}
                  placeholder="Ingresá el DNI sin puntos"
                />
              </div>
              <button className="secondary-button" disabled={searching || busy}>
                {searching ? "Buscando…" : "Buscar"}
              </button>
            </form>
            {patient ? (
              <div className="success-alert">
                ✓ {patient.name} {patient.lastname} · DNI {patient.DNI}
              </div>
            ) : (
              <p className="muted">
                ¿Es su primera consulta?{" "}
                <Link to="/createPatient">Agregar paciente</Link>
              </p>
            )}
          </section>
          <section className="form-panel booking-step">
            <h2>
              <span>2</span> Profesional y horario
            </h2>
            {doctorError ? (
              <div className="form-alert" role="alert">
                {doctorError}{" "}
                <button
                  className="secondary-button"
                  onClick={() => setAttempt((n) => n + 1)}
                >
                  Reintentar
                </button>
              </div>
            ) : doctors === null ? (
              <p role="status">Cargando profesionales…</p>
            ) : doctors.length === 0 ? (
              <p className="muted">
                Todavía no hay profesionales. Pedile al administrador que
                agregue uno.
              </p>
            ) : (
              <form className="record-form" onSubmit={save}>
                <div className="form-grid">
                  <div className="full-width">
                    <label htmlFor="booking-doctor">Profesional</label>
                    <select
                      id="booking-doctor"
                      required
                      value={doctorId}
                      disabled={busy}
                      onChange={(e) => setDoctorId(e.target.value)}
                    >
                      <option value="">Seleccioná un profesional</option>
                      {doctors.map((d) => (
                        <option value={d.tuition} key={d.tuition}>
                          {d.lastname}, {d.name} · {d.specialty?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="full-width">
                    <label htmlFor="booking-date">Fecha y hora</label>
                    <input
                      id="booking-date"
                      type="datetime-local"
                      step="1800"
                      min={minimum}
                      required
                      value={date}
                      disabled={busy}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    <small className="muted">
                      Turnos cada 30 minutos. Horario local de tu dispositivo.
                    </small>
                  </div>
                  <div className="full-width">
                    <label htmlFor="booking-notes">
                      Observaciones (opcional)
                    </label>
                    <textarea
                      id="booking-notes"
                      value={notes}
                      maxLength={500}
                      disabled={busy}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>
                <button className="primary-button" disabled={busy || !patient}>
                  {busy ? "Guardando turno…" : "Confirmar turno"}
                </button>
              </form>
            )}
          </section>
          {error && (
            <div className="form-alert" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="success-alert" role="status">
              {success} <Link to="/turns-patients">Consultar turnos</Link>
            </div>
          )}
        </div>
        <aside className="booking-summary">
          <span className="eyebrow">RESUMEN DEL TURNO</span>
          <h2>Todo listo para atender.</h2>
          <dl>
            <dt>Paciente</dt>
            <dd>
              {patient
                ? `${patient.name} ${patient.lastname}`
                : "Pendiente de selección"}
            </dd>
            <dt>Profesional</dt>
            <dd>
              {doctor
                ? `${doctor.name} ${doctor.lastname}`
                : "Pendiente de selección"}
            </dd>
            <dt>Fecha y hora</dt>
            <dd>
              {date
                ? new Date(date).toLocaleString("es-AR")
                : "Elegí un horario"}
            </dd>
          </dl>
          <p>La disponibilidad se verifica al confirmar la reserva.</p>
        </aside>
      </div>
    </Page>
  );
}
