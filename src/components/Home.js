import React, { useEffect, useState, } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import imgLogin from "../assets/login-image.jpg"

import { useNavigate } from 'react-router-dom';


function Login() {


    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const [rememberMe, setRememberMe] = useState(false);


    useEffect(() => {
        const isAuthenticated = localStorage.getItem('token');
        if (isAuthenticated) {
            // Si el usuario ya está autenticado, redirige a la página principal o a otra página protegida
            navigate(`/turnos`); // Ajusta la ruta según tu estructura de rutas
        }
    }, [navigate]);


    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('El correo electrónico no es válido').required('El correo electrónico es obligatorio'),
        password: Yup.string().required('La contraseña es requerida'),
    });



    const handleSubmit = async (values, id) => {

        try {
            const isValid = await validationSchema.isValid(values);

            const requestBody = {
                ...values,
                recordarme: rememberMe,
            }

            if (!isValid) {
                console.error('Datos inválidos');
                return;
            }
            const response = await fetch(`https://sistema-de-turnos-production-e4d9.up.railway.app/api/user/login`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.id);
                navigate(`/api/user/${data.id}`, { replace: true });
            } else {
                console.error('Error envio de 400');
                window.location.href = "/register"
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }

    };
  

    return (

        <header className="header">
            <section style={{ backgroundColor: "#AAF3E0" }}>

                <div className="container py-5 h-100">
              
                    <div className='row d-flex justify-content-center align-items-center h-100'>
                        <div className='col col-xl-10'>
                            <div className='card' style={{ borderRadius: "1rem" }}>
                                <div className='row g-0'>
                                    <div class="col-md-6 col-lg-5 d-none d-md-block">
                                        <img src={imgLogin}
                                            alt="login form" className="img-fluid" style={{ bordeRadius: "1rem 0 0 1rem;" }} />
                                    </div>
                                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                        <div className='card-body p-4 p-lg-5 text-black'>

                                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>

                                                <Form>
                                                    <div className="d-flex align-items-center mb-3 pb-1">
                                                        <div className='spinning'>
                                                            <div className='spinning-2'></div>
                                                        </div>
                                                        <span className="h1 fw-bold mb-0">Sistema de turnos medicos</span>
                                                    </div>
                                                    <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>Ingresa con tu cuenta</h5>
                                                    <div className='form-outline mb-4'>
                                                        <label className="form-label" for="form2Example17" style={{ fontSize: "15px" }}>Email</label>
                                                        <Field type="email" id="email form2Example17" name="email" className="form-control form-control-lg" />
                                                        <ErrorMessage name="email" component="div" />
                                                    </div>
                                                    <div className='form-outline mb-4 password-wrapper'>
                                                        <label className="form-label" for="form2Example17" style={{ fontSize: "15px" }}>Contraseña</label>
                                                        <Field type={showPassword ? 'text' : 'password'} id="password form2Example27" className="form-control form-control-lg" name="password" />
                                                        <ErrorMessage name="password" component="div" /><div class="toggle-button">
                                                            <svg onClick={() => setShowPassword(!showPassword)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="eye-icon">
                                                                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                                                <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" />
                                                                {showPassword ? 'Ocultar' : 'Mostrar'}
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="pt-1 mb-4">
                                                        <button type="submit" className="btn btn-success btn-lg btn-block">Iniciar sesión</button>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className='form-check-input'
                                                            type="checkbox"
                                                            id='inlineCheckbox1'
                                                            name="recordarme"
                                                            checked={rememberMe}
                                                            onChange={(e) => setRememberMe(e.target.checked)} // Actualizar el estado al cambiar
                                                        /><label className="form-check-label">Recordarme</label>
                                                    </div>
                                                    <div className='container'>
                                                        <a className="small text-muted" href="#!">¿Olvidaste la contraseña?</a>
                                                        <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>¿No tienes una cuenta?<a href="/register"
                                                            style={{ color: "#393f81" }}>Registrate aqui!</a></p>
                                                    </div>

                                                </Form>

                                            </Formik>
                                        </div>
                                        <div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </header>

    );
};

export default Login;