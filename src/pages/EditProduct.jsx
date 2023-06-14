import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Components
import { useAppStates } from '../components/AppContext';
import { useAuth } from '../components/auth';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { FormProduct } from '../components/FormProduct'

// Styles
import '../styles/Products.css';

// Recursos
import imgProduct from '../images/adminOptions/Products.svg';

function EditProduct() {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();

    const handleClicEdit = (id, subcategory, image, name, description, price, biOutstanding, active) => {
        
        setIsLoading(true);

        auth.validateUser().then( () => {
            const formData = new FormData();
            formData.append('Product_Id', id);
            formData.append('SubCategory_Id', subcategory);
            formData.append('Image', image);
            formData.append('Name', name);
            formData.append('Description', description);
            formData.append('Price', price.replace(/[$,]/g, ''));
            formData.append('BiOutstanding', biOutstanding);
            formData.append('BiActive', active);

            axios.post(`${auth.path}api/Product/UpdateProduct`,
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
                navigate('/home/products');
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
            <Menu path='/home/products' />
            <Header logo={imgProduct} title='Productos' />

            <FormProduct onEdit={handleClicEdit} />
        </>
    );

}

export { EditProduct };
