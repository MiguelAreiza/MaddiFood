import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

function NewProduct() {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickCreate = (subcategory, image, name, description, price, biOutstanding, active) => {        
        setIsLoading(true);
        auth.validateUser().then( () => {
            const formData = new FormData();
            formData.append('SubCategory_Id', subcategory);
            formData.append('Image', image);
            formData.append('Name', name);
            formData.append('Description', description);
            formData.append('Price', price.replace(/[$,]/g, ''));
            formData.append('BiOutstanding', biOutstanding);
            formData.append('BiActive', active);

            axios.post(`${auth.path}api/Product/CreateProduct`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `bearer ${auth.user.token}`
                }
            }).then( ({data}) => {
                addToastr(data.rpta);
                if (data.cod === '0') {                    
                    navigate('/home/products');
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
            <Menu path='/home/products' />
            <Header logo={imgProduct} title='Productos' />

            <FormProduct onCreate={handleClickCreate} />
        </>
    );
}

export { NewProduct };