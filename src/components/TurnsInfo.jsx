import { faDisplay } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";


function TurnsInfo(props) {
  const [patientData, setPatientData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [patientError, setPatientError] = useState(null);
  const [doctorError, setDoctorError] = useState(null);
  const [confirmado, setConfirmado] = useState(props.confirmado);

  // Función para formatear la fecha
  const formatearFechaYHora = (fecha) => {
    const opcionesFecha = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const opcionesHora = { hour: 'numeric', minute: 'numeric' };

    const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', opcionesFecha);
    const horaFormateada = new Date(fecha).toLocaleTimeString('es-ES', opcionesHora);

    return `${fechaFormateada} ${horaFormateada}`;
  };

  const eliminarTurno = () => {
    fetch(`https://sistema-de-turnos-production-e4d9.up.railway.app/api/shift/eliminar-turno/${props.id}`, {
      method: 'DELETE',
    })
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status} - ${respuesta.statusText}`);
        }
        return respuesta.json();
      })
      .then(() => {
        props.onDeleteTurn(props.id);
      })
      .catch((error) => {
        console.error('Error al eliminar turno:', error);
      });
  };

  const cambiarEstado = () => {
    props.onUpdateTurnStatus(props.id, !confirmado);
    console.log('ID del turno:', props.id);
    // Realizar una solicitud PUT o PATCH al servidor para actualizar el estado del turno
    fetch(`https://sistema-de-turnos-production-e4d9.up.railway.app/api/shift/cambiar-estado/${props.id}`, {
      method: 'PUT', // O 'PATCH' según la API
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        confirmado: !confirmado, 
        // Invertir el estado actual
      }),
    })
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status} - ${respuesta.statusText}`);
        }
        return respuesta.json();
      })
      .then(() => {
        // Actualizar el estado local después de la confirmación/desconfirmación exitosa
        setConfirmado(!confirmado);
     
      })
      .catch((error) => {
        console.error('Error al manejar la confirmación/desconfirmación del turno:', error);
      });
  };

  useEffect(() => {
    // Obtener datos del paciente
    fetch(`https://sistema-de-turnos-production-e4d9.up.railway.app/api/patient/search?dni=${props.patient}`)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status} - ${respuesta.statusText}`);
        }
        return respuesta.json();
      })
      .then((datos) => setPatientData(datos))
      .catch((error) => {
        console.error("Error al obtener datos del paciente:", error.message);
        setPatientError("Error al obtener datos del paciente");
      });
  
    // Obtener datos del médico
    fetch(`https://sistema-de-turnos-production-e4d9.up.railway.app/api/doctor/search?tuition=${props.doctor}`)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status} - ${respuesta.statusText}`);
        }
        return respuesta.json();
      })
      .then((datos) => setDoctorData(datos))
      .catch((error) => {
        console.error("Error al obtener datos del médico:", error.message);
        setDoctorError("Error al obtener datos del médico");
      });
  }, [props.patient, props.doctor]);

  if (patientError || doctorError) {
    console.error('Error al obtener datos:', patientError || doctorError);
    return null;
  }

  if (!patientData || !doctorData) {
    return null;
  }

  // Formatear la fecha antes de mostrarla
  const fechaFormateada = formatearFechaYHora(props.fecha);

  return (
    
      
      <tr>
    
      <td className="columna">{fechaFormateada}</td>
      <td className="columna">{`${patientData.patient.name} ${patientData.patient.lastname}`}</td>
      <td className="columna">{`${doctorData.doctor.name} ${doctorData.doctor.lastname}`}</td>
      <td className="columna">{`${doctorData.doctor.specialty.name}`}</td>
      <td className="columna">{props.observaciones ? props.observaciones : "No hay observaciones"}</td>
      <td className="columna">
        {confirmado && <span>Confirmado</span>}
        {!confirmado && <button className="btn btn-success btn-sm" onClick={cambiarEstado}>Liberar</button>}
        
        <button className="btn btn-success btn-sm" onClick={eliminarTurno}>Eliminar</button>
      </td>
        </tr>
     
        
   
  );
}

export default TurnsInfo;