import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../components/AppContext';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';

// Styles
import '../styles/Home.css'

// Recursos
import imgLogo from '../images/Logo.svg'

function Home() {

    const { setIsLoading } = useAppStates();
    const navigate = useNavigate();
    
    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);    

    const handleClickOption = (opt) =>{
        setIsLoading(true);
        navigate(`${opt}`);
    }
                                                          
    return (
        <>
            <Menu home />
            <Header logo={imgLogo} title='Admin' />

            <div className='contOptions'>
                <button onClick={() => {handleClickOption('restaurant')}} className='adminOption option_restaurant'>Restaurante</button>
                <button onClick={() => {handleClickOption('headquarters')}} className='adminOption option_headquarters'>Sedes</button>
                <button onClick={() => {handleClickOption('digitalmenu')}} className='adminOption option_digitalmenu'>Carta</button>
                <button onClick={() => {handleClickOption('products')}} className='adminOption option_products'>Productos</button> 
                <button onClick={() => {handleClickOption('categories')}} className='adminOption option_categories'>Categorias</button> 
                <button onClick={() => {handleClickOption('subcategories')}} className='adminOption option_subcategories'>Subcategorias</button> 
            </div>
        </>
    );
}

export { Home };