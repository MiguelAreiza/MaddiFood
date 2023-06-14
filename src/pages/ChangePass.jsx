import React from 'react';
import axios from 'axios';

// Components
import { useAppStates } from '../components/AppContext';
import { useAuth } from '../components/auth';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';

// Styles
import '../styles/Profile.css'

// Recursos
import imgProfile from '../images/icons/ProfileOrange.svg';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();
    const [password1, setPassword1] = React.useState('');
    const [password2, setPassword2] = React.useState('');

    React.useEffect(() => {
        auth.validateUser().then( () => {
            setIsLoading(false);
        }).catch( error => {
            addToastr(error, 'info');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeInput = (e, type) => {
        switch (type) {
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

    const handleSubmitPass = e => {        
        e.preventDefault();        
        setIsLoading(true);
        
        if (password1 !== password2) {            
            addToastr('Las contraseñas deben coincidir', 'info');
            setIsLoading(false);
            return;
        }
        axios.post(`${auth.path}api/Account/ChangePassword`,
        {
            Password: password1
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${auth.user.token}`
            }
        }).then(({data})=> {            
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setPassword1('');
                setPassword2('');
                setIsLoading(false);
                return;
            }            
            addToastr(data.rpta);
            navigate('/home');            
        }).catch(error => {
            setIsLoading(false);
            addToastr('Error interno del sistema', 'error');
        });
    }
    
    return (
        <>
            <Menu path='/home/profile' />
            <Header logo={imgProfile} title='Contraseña' />

            <form className='section_container_form' onSubmit={handleSubmitPass}>
                <input onChange={e =>{ handleChangeInput(e, 'pass1'); }} value={password1} className='form_input type_password' type='password' placeholder='Ingresa contraseña' required />
                <input onChange={e =>{ handleChangeInput(e, 'pass2'); }} value={password2} className='form_input type_password' type='password' placeholder='Confirmar contraseña' required />
                <Button name='Cambiar contraseña' type='submit' icon='next' />
            </form>
        </>
    );
}

export { ChangePassword };