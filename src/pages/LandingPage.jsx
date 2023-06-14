import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// Components
import { useAppStates } from '../components/AppContext';
// import { useAuth } from '../components/auth';
import { Menu } from '../components/Menu';
// import { Header } from '../components/Header';
// import { Button } from '../components/Button';

// Styles
import '../styles/LandingPage.css';

// Recursos
// import imgLogo from '../images/Logo.svg'; 

function LandingPage() {

    const { setIsLoading, addToastr } = useAppStates();
    // const auth = useAuth();
    // const navigate = useNavigate();

    React.useEffect( () => {
        setTimeout(() => {            
            setIsLoading(false);
            addToastr('Bienvenido');
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="landingPage">
            <Menu path='/auth' />
        </div>
    );

}

export { LandingPage };