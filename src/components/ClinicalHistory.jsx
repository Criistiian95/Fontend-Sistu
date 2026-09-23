import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Page from './Page';
import { useUser } from './UserContext';
import { api } from '../api';
const fields = [['reason', 'Motivo de consulta'], ['history', 'Antecedentes y alergias relevantes'], ['assessment', 'Evaluación y evolución'], ['diagnosis', 'Diagnóstico'], ['plan', 'Tratamiento, indicaciones y seguimiento']];
const blank = () => ({ ...Object.fromEntries(fields.map(([key]) => [key, ''])), occurred_at: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16), request_id: crypto.randomUUID() });
const date = value => new Date(value).toLocaleString('es-AR');
export default function ClinicalHistory() {
  const { user } = useUser();
  const [dni, setDni] = useState('');
  const [data, setData] = useState(null);
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  if (Number(user.role_id) !== 3) return <Page title="Historia clínica"><p>Este módulo requiere una cuenta profesional habilitada. Pedile el acceso al administrador.</p></Page>;
  async function search(e) {
    e.preventDefault(); setBusy(true); setError(''); setMessage(''); setData(null);
    try { setData(await api(`/api/clinical/patients/${encodeURIComponent(dni)}`)); setForm(blank()); setConfirmed(false); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function save(e) {
    e.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const result = await api(`/api/clinical/patients/${data.patient.DNI}/entries`, { method: 'POST', body: JSON.stringify({ ...form, occurred_at: new Date(form.occurred_at).toISOString() }) });
      setData(current => ({ ...current, entries: [result.entry, ...current.entries.filter(x => x.id !== result.entry.id)] }));
      setForm(blank()); setConfirmed(false); setMessage(result.message);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function more() {
    setBusy(true); setError('');
    try { const result = await api(`/api/clinical/patients/${data.patient.DNI}?before=${data.next}`); setData(current => ({ ...result, entries: [...current.entries, ...result.entries] })); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  const dirty = fields.some(([key]) => form[key].trim());
  return <Page title="Historia clínica" subtitle="Registrá cada atención y consultá la evolución del paciente.">
    <section className="form-panel"><form className="record-form inline-search" onSubmit={search}>
      <div><label htmlFor="clinical-dni">DNI del paciente</label><input id="clinical-dni" value={dni} onChange={e => setDni(e.target.value)} required pattern="[0-9]{6,12}" inputMode="numeric" disabled={busy || !!data} placeholder="Sin puntos" /></div>
      {!data && <button className="primary-button" disabled={busy}>Abrir historia</button>}
      {data && <button type="button" className="secondary-button" disabled={busy} onClick={() => { if (!dirty || window.confirm('Hay una atención sin guardar. ¿Querés descartarla y cambiar de paciente?')) { setData(null); setForm(blank()); setError(''); setMessage(''); } }}>Cambiar paciente</button>}
    </form><p className="muted">Acceso reservado al equipo profesional del consultorio. Las consultas y las cargas quedan registradas.</p></section>
    {error && <p className="form-alert" role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    {data && <>
      <section className="patient-summary"><div><h2>{data.patient.name} {data.patient.lastname}</h2><p>DNI {data.patient.DNI}</p></div></section>
      <section className="form-panel"><h2>Nueva atención</h2><p className="muted">Revisá la información antes de guardar. Las atenciones no se sobrescriben ni se eliminan; para corregir una, agregá una nueva nota aclaratoria.</p>
        <form className="record-form clinical-form" onSubmit={save}><fieldset disabled={busy}>
          <label htmlFor="occurred-at">Fecha y hora de atención</label><input id="occurred-at" type="datetime-local" required value={form.occurred_at} onChange={e => setForm({ ...form, occurred_at: e.target.value })} />
          {fields.map(([key, label]) => <div key={key}><label htmlFor={`clinical-${key}`}>{label}{key === 'reason' ? ' *' : ''}</label><textarea id={`clinical-${key}`} rows={key === 'reason' ? 2 : 4} maxLength={3000} required={key === 'reason'} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /></div>)}
          <label className="clinical-confirm"><input type="checkbox" required checked={confirmed} onChange={e => setConfirmed(e.target.checked)} /> Revisé el paciente y la información que voy a guardar.</label>
          <button className="primary-button" disabled={busy || !confirmed}>{busy ? 'Procesando…' : 'Guardar atención'}</button>
        </fieldset></form>
      </section>
      <section className="agenda-panel"><h2>Atenciones anteriores</h2><p className="muted">Ordenadas por fecha de registro, de la más reciente a la más antigua.</p>
        {!data.entries.length && <p className="empty-state">Todavía no hay atenciones registradas.</p>}
        {data.entries.map(entry => <article className="clinical-entry" key={entry.id}><h3>Atención del {date(entry.occurred_at)}</h3><p className="muted">{entry.author_name} · Matrícula {entry.doctor_id}<br />Registro #{entry.id} · Cargado el {date(entry.created_at)}</p>{fields.map(([key, label]) => entry[key] && <div key={key}><h4>{label}</h4><p className="clinical-note">{entry[key]}</p></div>)}</article>)}
        {data.next && <button className="secondary-button" disabled={busy} onClick={more}>Ver atenciones anteriores</button>}
      </section>
    </>}
    {!data && <p>¿El paciente todavía no está registrado? <Link to="/createPatient">Agregar paciente</Link></p>}
  </Page>;
}
