import React, { useState, useEffect } from "react";
import TurnsInfo from "./TurnsInfo";
import isSameDay from "date-fns/isSameDay";




function Turns() {
  const [occupiedShifts, setOccupiedShifts] = useState([]);


const handleDeleteTurn = (turnId) => {
    // Eliminar el turno del estado local
    setOccupiedShifts((prevShifts) => prevShifts.filter((shift) => shift.id !== turnId));
  };

  const handleUpdateTurnStatus = (turnId, newStatus) => {
    // Actualizar el estado local con el nuevo estado del turno
    setOccupiedShifts((prevShifts) =>
      prevShifts.map((shift) =>
        shift.id === turnId ? { ...shift, confirmado: newStatus } : shift
      )
    );
  };

  useEffect(() => {
    // Realizar una solicitud GET al servidor para obtener los horarios ocupados
    fetch("https://sistema-de-turnos-production-e4d9.up.railway.app/api/shift/estado-turnos")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status} - ${respuesta.statusText}`);
        }
        return respuesta.json();
      })
      .then((datos) => {
        const turnosHoy = datos.filter((shift) => {
          const fechaTurno = new Date(shift.fecha);
          const fechaActual = new Date();
  
          const esMismoDia = isSameDay(fechaTurno, fechaActual);

          return esMismoDia;;
        });
        setOccupiedShifts(turnosHoy);
      })
      .catch((error) => {
        console.error('Error al obtener los horarios ocupados:', error);
      });
  }, []);

  return (
    <div className="">
      <h2 className="fw-bold justify-content-center d-flex">TURNOS DEL DIA</h2>
      
      <table className="table table-striped table-dark table-bordered table-turns">
     
        <thead className="thead-dark"> 
          <tr>
            <th className="columna">Fecha</th>
            <th className="columna">Paciente</th>
            <th className="columna">Médico</th>
            <th className="columna">Especialidad</th>
            <th className="columna">Observaciones</th>
            <th className="columna opci">Opciones</th>
          </tr>
          </thead>
        <tbody>
        {occupiedShifts.map((shift, index) => (
    <TurnsInfo
    key={index}
    id={shift.id}
      fecha={shift.fecha}
      patient={shift.paciente_id}
      doctor={shift.doctor_id}
      specialty={shift.especialidad}
      observaciones={shift.observaciones}
      onUpdateTurnStatus={handleUpdateTurnStatus}
      onDeleteTurn={handleDeleteTurn} 
    />
))}
      </tbody>
     
      </table>
    </div>
    
  );
}



export default Turns;