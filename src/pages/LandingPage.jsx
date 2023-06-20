import React from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// Components
import { useAppStates } from '../components/AppContext';
// import { useAuth } from '../components/auth';
import { Header } from '../components/Header';

// Styles
import '../styles/LandingPage.css';

// Recursos
// import imgLogo from '../images/Logo.svg'; 

function LandingPage() {

    const { setIsLoading, addToastr } = useAppStates();
    // const auth = useAuth();
    const navigate = useNavigate();

    React.useEffect( () => {
        document.querySelector("head > meta[name='theme-color']").content = '#ffffff';
        document.querySelector("head > meta[name='background_color']").content = '#ffffff';
        setTimeout(() => {            
            setIsLoading(false);
            addToastr('Bienvenido');
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleclick = () => {
        document.querySelector("head > meta[name='theme-color']").content = '#323232';
        document.querySelector("head > meta[name='background_color']").content = '#323232';
        navigate('/auth');
    }

    return (
        <div className="landingPage">
            <Header landingPage />
            <button onClick={handleclick}>Login</button>
        </div>
    );

}

export { LandingPage };