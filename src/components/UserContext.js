import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const getUserIdFromLocalStorage = () => {
  const userId = localStorage.getItem('userId');
 
  return userId ? parseInt(userId, 10) : null;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);
  

  const fetchUserProfile = (token) => {
    // Realizar la solicitud para obtener los datos del usuario utilizando el token
    fetch(`https://sistema-de-turnos-production-e4d9.up.railway.app/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
      } else {
        console.error('Error al obtener el perfil del usuario:', data.message);
      }
    })
    .catch(error => {
      console.error('Error al obtener el perfil del usuario:', error);
    });
  };
 

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {

  return useContext(UserContext);
};