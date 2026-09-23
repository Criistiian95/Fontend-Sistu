import React, { useEffect, useState } from 'react';
import Page from './Page';
import { api } from '../api';
export default function ClinicalAccounts() {
  const [data, setData] = useState(null), [doctors, setDoctors] = useState([]);
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [newDoctor, setNewDoctor] = useState('');
  const [userId, setUserId] = useState(''), [doctorId, setDoctorId] = useState('');
  const [error, setError] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  async function load() { const [d, med] = await Promise.all([api('/api/clinical/accounts'), api('/api/doctor/list')]); setData(d); setDoctors(med); }
  useEffect(() => { load().catch(e => setError(e.message)); }, []);
  async function update(id, doctor, enabled) {
    setBusy(true); setError(''); setMessage('');
    try { const result = await api(`/api/clinical/accounts/${id}`, { method: 'PUT', body: JSON.stringify({ doctor_id: doctor, enabled }) }); setMessage(result.message); await load(); setUserId(''); setDoctorId(''); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function create(e) {
    e.preventDefault(); setBusy(true); setError(''); setMessage('');
    try { const result = await api('/api/clinical/accounts', { method: 'POST', body: JSON.stringify({ email, password, doctor_id: newDoctor }) }); setPassword(''); setEmail(''); setNewDoctor(''); setMessage(result.message); await load(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <Page title="Accesos profesionales" subtitle="Vinculá cada cuenta individual con la matrícula de su profesional.">
    <section className="form-panel"><p>Podés crear una cuenta profesional o habilitar una cuenta existente. Primero registrá su matrícula en Agregar médico. Usá cuentas individuales: una cuenta administradora no puede cargar ni leer historias clínicas.</p><p>Los profesionales habilitados podrán consultar las historias de los pacientes de este consultorio. Habilitá solamente a quienes integren su equipo de atención.</p>
      {error && <p className="form-alert" role="alert">{error}</p>}{message && <p role="status">{message}</p>}
      {data && <><h2>Crear cuenta profesional</h2><form className="record-form" onSubmit={create}>
        <div><label htmlFor="new-doctor">Profesional</label><select id="new-doctor" value={newDoctor} required disabled={busy} onChange={e => setNewDoctor(e.target.value)}><option value="">Elegí un profesional</option>{doctors.filter(d => !data.accounts.some(a => a.doctor_id === d.tuition)).map(d => <option key={d.tuition} value={d.tuition}>{d.name} {d.lastname} · {d.tuition}</option>)}</select></div>
        <div><label htmlFor="clinical-email">Correo del profesional</label><input id="clinical-email" type="email" required disabled={busy} value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" /></div>
        <div><label htmlFor="clinical-password">Contraseña individual (mínimo 12 caracteres)</label><input id="clinical-password" type="password" required minLength={12} disabled={busy} value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" /></div>
        <button className="primary-button" disabled={busy}>Crear cuenta profesional</button>
      </form><h2>Habilitar cuenta existente</h2></>}
      {data && <form className="record-form" onSubmit={e => { e.preventDefault(); update(userId, doctorId, true); }}><div><label htmlFor="account-user">Cuenta del profesional</label><select id="account-user" required disabled={busy} value={userId} onChange={e => setUserId(e.target.value)}><option value="">Elegí una cuenta</option>{data.users.filter(u => u.role_id !== 1 && !data.accounts.some(a => a.user_id === u.id)).map(u => <option key={u.id} value={u.id}>{u.name} {u.lastname} — {u.email}</option>)}</select></div><div><label htmlFor="account-doctor">Profesional y matrícula</label><select id="account-doctor" required disabled={busy} value={doctorId} onChange={e => setDoctorId(e.target.value)}><option value="">Elegí un profesional</option>{doctors.filter(d => !data.accounts.some(a => a.doctor_id === d.tuition)).map(d => <option key={d.tuition} value={d.tuition}>{d.name} {d.lastname} · {d.tuition}</option>)}</select></div><button className="primary-button" disabled={busy}>Habilitar acceso clínico</button></form>}
    </section>
    {data && <section className="agenda-panel"><h2>Cuentas vinculadas</h2>{!data.accounts.length && <p>Todavía no hay accesos profesionales.</p>}{data.accounts.map(a => { const u = data.users.find(u => u.id === a.user_id); return <article className="clinical-entry" key={a.user_id}><h3>{u?.name} {u?.lastname}</h3><p>{u?.email} · Matrícula {a.doctor_id} · {a.enabled ? 'Habilitado' : 'Deshabilitado'}</p><button className="secondary-button" disabled={busy} onClick={() => update(a.user_id, a.doctor_id, !a.enabled)}>{a.enabled ? 'Deshabilitar acceso clínico' : 'Habilitar acceso clínico'}</button></article>; })}</section>}
  </Page>;
}
