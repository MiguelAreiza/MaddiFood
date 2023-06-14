import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../components/AppContext';
import { useAuth } from '../components/auth';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { FormSubcategory } from '../components/FormSubcategory'

// Styles
import '../styles/Subcategories.css';

// Recursos
import imgSubcategories from '../images/adminOptions/Subcategories.svg';

function NewSubcategory() {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickCreate = (category, image, name, active) => {        
        setIsLoading(true);
        auth.validateUser().then( () => {
            const formData = new FormData();
            formData.append('Category_Id', category);
            formData.append('Image', image);
            formData.append('Name', name);
            formData.append('BiActive', active);

            axios.post(`${auth.path}api/SubCategory/CreateSubCategory`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `bearer ${auth.user.token}`
                }
            }).then( ({data}) => {
                addToastr(data.rpta);
                if (data.cod === '0') {                    
                    navigate('/home/subcategories');
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
            <Menu path='/home/subcategories' />
            <Header logo={imgSubcategories} title='Subcategorías' />

            <FormSubcategory onCreate={handleClickCreate} />
        </>
    );
}

export { NewSubcategory };