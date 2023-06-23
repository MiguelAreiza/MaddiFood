import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../components/AppContext';
// import { useAuth } from '../components/auth';
import { Header } from '../components/Header';

// Styles
import '../styles/LandingPage.css';

// Recursos
import imgBannerMobile from '../images/landingPage/Banner_mobile.svg';
import imgServicePedidos from '../images/landingPage/PedidosService.svg';
import imgServiceMenu from '../images/landingPage/MenuService.svg';
import imgServiceContabilidad from '../images/landingPage/ContabilidadService.svg';
import imgServiceAdmin from '../images/landingPage/AdminPanelService.svg';
import imgPhones from '../images/landingPage/Phones.svg';

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
            <div className="section section_inicio">
                <img src={imgBannerMobile} alt='banner inicio maddifood' />
                <p>MaddiFood es un sistema que potencia tu negocio, agiliza tus operaciones y deleita a tus comensales, todo en un solo lugar. <br />
                   Ofrecemos menu digital, gestor de pedidos, panel administrativo y mucho más... <br />
                   Nosotros somos MaddiFood.
                </p>
                <button>Conocer más</button> 
            </div>
            <div className="section section_servicios">
                <div className="card_service">
                    <img className='image_service' src={imgServicePedidos} alt="imagen de servicio de maddifood" />
                    <h3 className='title_service'>Gestiona tus pedidos</h3>
                    <p className='content_service'>Nunca dejes a tus clientes esperando o en visto ¡Únete ahora y potencia tu servicio!</p>
                    <button className='see_service'>Como funciona</button>
                </div>
                <div className="card_service">
                    <img className='image_service' src={imgServiceMenu} alt="imagen de servicio de maddifood" />
                    <h3 className='title_service'>Crea tu menu digital</h3>
                    <p className='content_service'>Te ayudaremos a modernizarte crando un menu digital con un codigo QR personalizado</p>
                    <button className='see_service'>Como funciona</button>
                </div>
                <div className="card_service">
                    <img className='image_service' src={imgServiceContabilidad} alt="imagen de servicio de maddifood" />
                    <h3 className='title_service'>Contabilidad a tu mano</h3>
                    <p className='content_service'>Nunca vas a tener las cuentas perdidas, administra el dinero de la mejor forma</p>
                    <button className='see_service'>Como funciona</button>
                </div>
                <div className="card_service">
                    <img className='image_service' src={imgServiceAdmin} alt="imagen de servicio de maddifood" />
                    <h3 className='title_service'>Panel de admin</h3>
                    <p className='content_service'>Recuerda que todo lo encontraras en un solo lugar donde podras administrar como gustes</p>
                    <button className='see_service'>Como funciona</button>
                </div>
            </div>
            <div className="section section_nosotros">
                <h2 className='title_nosotros'>Si sueñas con un restaurante exitoso, tenemos la solución perfecta.</h2>
                <p className='content_nosotros'>Descubre la flexibilidad total en la gestion de tu menú con nuestro sistema. Agrega, elimina y personaliza productos segun tus preferencias. ¡Dale un toque único a tu oferta gastronómica y mantén tu menú siempre fresco y atractivo!</p>
                <img src={imgPhones} alt="Imagen referencia del producto MaddiFood" />
            </div>
            <div className="section section_contacto">

            </div>
        </div>
    );

}

export { LandingPage };