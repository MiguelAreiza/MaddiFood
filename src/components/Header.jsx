import React from 'react';
import { useLocation } from 'react-router-dom';

// Components
import { useAuth } from '../components/auth';

// Styles
import '../styles/Header.css';

// Recursos
import imgNavbar from '../images/NavbarLogo.svg'; 
import imgMenu from '../images/icons/Menu.svg'; 

function Header({ landingPage, logo, title}) {

    const auth = useAuth();
    const location = useLocation();
    const subtitle = location.pathname.includes('/new') ? 'Crear ' : location.pathname.includes('/edit') ? 'Editar ' : '' 
    
    const handleClickMenu = e => {
        let menu = e.target.nextElementSibling;
        let button = e.target;
        if (menu.style.display === 'none' || menu.style.display === '') {            
            button.style.transform = 'rotate(270deg)';
            menu.style.display = 'block';
            setTimeout(() => {
                menu.style.height = 'calc(100vh - 70px)';
            }, 100);
        } else {
            button.style.transform = 'rotate(0deg)';
            menu.style.height = '0';
            setTimeout(() => {
                menu.style.display = 'none';
            }, 1100);
        }
    }

    return (
        <>
            {
                !landingPage ? 
                    <div className='header'>                
                        <img className='header_logo' src={logo} alt={'logo' + title} draggable='false' width='70px' height='70px' />
                        <label className='header_name'>{auth.user ? auth.user.restaurants[0].strName : 'MaddiFood'}</label>
                        <label className='header_title'>{subtitle + title}</label>
                    </div>                    
                :
                    <header className='navbar'>
                        <div className='navbar_left'>
                            <img src={imgNavbar} alt='Logo MaddiFood' draggable='false' />
                        </div>
                        <div className='navbar_center'>
                            <button className='optNavbar optNavbarSelected' >Inicio</button>
                            <button className='optNavbar' >Servicios</button>
                            <button className='optNavbar' >Nosotros</button>
                            <button className='optNavbar' >Precios</button>
                            <button className='optNavbar' >Contacto</button>
                        </div>
                        <div className='navbar_rigth'>
                            <img src={imgMenu} onClick={handleClickMenu} alt='Menu MaddiFood' draggable='false' />
                            <div className='navbar_menu'>
                                <button className='optMenu optMenuSelected' >Inicio</button>
                                <button className='optMenu' >Servicios</button>
                                <button className='optMenu' >Nosotros</button>
                                <button className='optMenu' >Precios</button>
                                <button className='optMenu' >Contacto</button>    
                            </div>
                        </div>
                    </header>
            }
        </>
    );

}

export { Header };