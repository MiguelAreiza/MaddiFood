import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

function EmailConfirm() {

    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();
    const params = useParams();

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClick = e => {
        setIsLoading(true);
        axios.post(`${auth.path}api/Account/EmailConfirm`, 
        {
            token: params.token
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then( ({data}) => {
            console.log(data);
            // auth.login();
        }).catch(error => {                    
            addToastr('Error interno del sistema', 'error');
            navigate('/');
        });
    }

    return (
        <>
            <Menu />
            <Header logo={imgLogo} title='Confirmar' />
            <Button name='Confirma Email' icon='next' onClick={handleClick} />
        </>        
    );
}

export { EmailConfirm };