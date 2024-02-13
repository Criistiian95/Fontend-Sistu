import React from 'react';

function LogoutButton() {
  const handleLogout = async () => {
    try {

      localStorage.clear('token');

      // Envía una solicitud al servidor para cerrar la sesión del usuario
      const response = await fetch(`https://sistema-de-turnos-production-e4d9.up.railway.app/api/user/logout`, {
                method: 'POST',
                credentials:"include",
                headers: {
                    'Content-Type': 'application/json',
                }
      });

      if (response.ok) {
        // El usuario cierra la sesión, puedes redirigirlo a la página de inicio o a donde desees
       
        console.log("sesion cerrada")
        
        window.location.href = '/login'; // Redirige a la página de inicio de sesión
       
      } else {
        // Maneja el error de cierre de sesión
        console.error('El cierre de sesión falló');
      }
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
    }
    
  };
 
  return (
    <div className=' justify-content py-5 h-100'>
    <p>
    <button className='btn btn-success btn-lg'  onClick={handleLogout}>Cerrar Sesión</button>
    </p>
    </div>
  );
}

export default LogoutButton;