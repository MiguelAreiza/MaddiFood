import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../components/AppContext';
import { useAuth } from '../components/auth';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { FormCategory } from '../components/FormCategory'

// Styles
import '../styles/Categories.css';

// Recursos
import imgCategories from '../images/adminOptions/Categories.svg';

function NewCategory() {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickCreate = (name, biActive) => {
        
        setIsLoading(true);

        auth.validateUser().then( () => {

            axios.post(`${auth.path}api/Category/CreateCategory`,
            {
                restaurant_Id: auth.user.restaurants[0].id,
                name: name,
                biActive: biActive       
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${auth.user.token}`
                }
            }).then( ({data}) => {
                
                if (data.cod === '0') {                    
                    addToastr(data.rpta);
                    navigate('/home/categories');
                    return;                    
                }

                setIsLoading(false);
                
            }).catch(error => {
                setIsLoading(false);
                addToastr('Error interno del sistema', 'error');
            }); 

        }).catch( error => {
            addToastr(error, 'info');
        });

    }

    return (
        <>
            <Menu path='/home/categories' />
            <Header logo={imgCategories} title='Categorías' />

            <FormCategory onCreate={handleClickCreate} />
        </>
    );

}

export { NewCategory };
