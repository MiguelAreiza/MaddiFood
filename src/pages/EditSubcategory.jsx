import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

function EditSubcategory() {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();

    const handleClicEdit = (id, category, image, name, active) => {
        
        setIsLoading(true);

        auth.validateUser().then( () => {
            const formData = new FormData();
            formData.append('SubCategory_Id', id);
            formData.append('Category_Id', category);
            formData.append('Image', image);
            formData.append('Name', name);
            formData.append('BiActive', active);

            axios.post(`${auth.path}api/SubCategory/UpdateSubCategory`,
            formData, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `bearer ${auth.user.token}`
                }
            }).then(({data})=> {
                if (data.cod === '-1') {                    
                    addToastr(data.rpta, 'warning');
                    setIsLoading(false);
                    return
                }
                addToastr(data.rpta);
                navigate('/home/subcategories');
            }).catch(error => {
                addToastr('Error interno del sistema', 'error');
                setIsLoading(false);
            }); 
        }).catch( error => {
            addToastr(error, 'info');
        });
    }

    return (
        <>
            <Menu path='/home/subcategories' />
            <Header logo={imgSubcategories} title='Subcategorías' />

            <FormSubcategory onEdit={handleClicEdit} />
        </>
    );

}

export { EditSubcategory };
