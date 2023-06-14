import React from 'react';
import { useLocation } from 'react-router-dom';

// Components
import { useAuth } from '../components/auth';

// Styles
import '../styles/Header.css';

function Header({ logo, title}) {

    const auth = useAuth();
    const location = useLocation();
    const currentPath = location.pathname;
    const subtitle = currentPath.includes('/new') ? 'Crear ' : currentPath.includes('/edit') ? 'Editar ' : '' 

    return (
        <div className='header'>                
            <img className='header_logo' src={logo} alt={'logo' + title} draggable='false' width='70px' height='70px' />
            <label className='header_name'>{auth.user ? auth.user.restaurants[0].strName : 'MaddiFood'}</label>
            <label className='header_title'>{subtitle + title}</label>
        </div>
    );

}

export { Header };