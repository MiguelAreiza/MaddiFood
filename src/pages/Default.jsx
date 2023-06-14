import React from 'react';

// Components
import { useAppStates } from '../components/AppContext';
import { Menu } from '../components/Menu';

// Styles
import '../styles/PageContent.css';

// Recursos
import image from '../images/Pagina404.svg';

function Default() {
    const { setIsLoading } = useAppStates();    
    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);    
    return (
        <>
            <Menu />
            <img className='default_image' src={image} alt='Pagina no encontrada' draggable='false' width='300px' height='300px' />
        </>
    );
}

export { Default };