import React from 'react';
// import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from "../components/AppContext";
// import { useAuth } from '../components/auth';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';

// Styles
// import '../styles/Restaurant.css'

// Recursos
import imgDigitalMenu from '../images/adminOptions/DigitalMenu.svg';

function DigitalMenu() {
    
    const { setIsLoading } = useAppStates();
    // const auth = useAuth();
    // const navigate = useNavigate();
    
    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps   
    }, []);

    return (
        <>
            <Menu />
            <Header logo={imgDigitalMenu} title='Piloncito' subtitle='Tu carta' />

        </>
    );

}

export { DigitalMenu };
