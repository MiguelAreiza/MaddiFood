import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

// Components
import { useAppStates } from '../components/AppContext';
import { useAuth } from '../components/auth';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';

// Styles
import '../styles/Recovery.css';

// Recursos
import imgLogo from '../images/Logo.svg';

function Recovery() {

    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const [user, setUser] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [password1, setPassword1] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const [userId, setUserId] = React.useState('');

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeInput = (e, type) => {
        switch (type) {
            case 'user':
                setUser(e.target.value);
                break;
            case 'otp':
                setOtp(e.target.value);
                break;
            case 'pass1':
                setPassword1(e.target.value);
                break;
            case 'pass2':
                setPassword2(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleSubmitUser = e => {
        
        e.preventDefault();        
        setIsLoading(true);

        axios.post(`${auth.path}api/Account/GetOTP`,
        {
            User: user
        }, 
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(({data})=> {

            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }
            
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'block';
            
            addToastr(data.rpta);
            setIsLoading(false);
            
        }).catch(error => {
            setIsLoading(false);
            addToastr('Error interno del sistema', 'error');
        });

    }

    const handleSubmitOTP = e => {
        
        e.preventDefault();        
        setIsLoading(true);

        if (otp.length !== 6) {            
            addToastr('El codigo debe ser de 6 digitos', 'info');
            setIsLoading(false);
            return;
        }

        axios.post(`${auth.path}api/Account/ValidateOTP`,
        {
            User: user,
            Cod: otp
        }, 
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(({data})=> {
            
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }
            
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'block'
            
            setUserId(data.id);
            addToastr('Validacion exitosa');
            setIsLoading(false);
            
        }).catch(error => {
            setIsLoading(false);
            addToastr('Error interno del sistema', 'error');
        });

    }

    const handleSubmitPass = e => {
        
        e.preventDefault();        
        setIsLoading(true);
        
        if (password1 !== password2) {            
            addToastr('Las contraseñas deben coincidir', 'info');
            setIsLoading(false);
            return;
        }

        axios.post(`${auth.path}api/Account/ChangePasswordByOTP`,
        {
            User_Id: userId,
            Password: password1,
            Otp: otp
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(({data})=> {

            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }
            
            addToastr(data.rpta);
            auth.login(data.appUser);
            
        }).catch(error => {
            setIsLoading(false);
            addToastr('Error interno del sistema', 'error');
        });

    }
    
    if (auth.user) {
        return <Navigate to='/home' />
    }

    return (
        <>
            <Menu path='/auth' />
            <Header logo={imgLogo} title='Admin' />

            <div className='recovery_section_container' >
                <label className='section_container_title'>Restablecer</label>
                <form className='section_container_form form_user' onSubmit={handleSubmitUser}>
                    <input onChange={e =>{ handleChangeInput(e, 'user'); }} value={user} className='form_input type_user' type='text' placeholder='Ingresa usuario' required />
                    <Button name='Enviar código' type='submit' />
                </form>
                <form className='section_container_form form_otp' onSubmit={handleSubmitOTP}>
                    <input onChange={e =>{ handleChangeInput(e, 'otp'); }} value={otp} className='form_input type_code' type='number' placeholder='Ingresa código' required />
                    <Button name='Validar código' type='submit' />
                </form>
                <form className='section_container_form form_pass' onSubmit={handleSubmitPass}>
                    <input onChange={e =>{ handleChangeInput(e, 'pass1'); }} value={password1} className='form_input type_password' type='password' placeholder='Ingresa contraseña' required />
                    <input onChange={e =>{ handleChangeInput(e, 'pass2'); }} value={password2} className='form_input type_password' type='password' placeholder='Confirmar contraseña' required />
                    <Button name='Cambiar contraseña' type='submit' />
                </form>
            </div>
        </>        
    );
}

export { Recovery };