import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

// Components
import { useAppStates } from '../components/AppContext';
import { useAuth } from '../components/auth';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { SectionProducts } from '../components/SectionProducts';

// Styles
import '../styles/Products.css'

// Recursos
import imgProducts from '../images/adminOptions/Products.svg';
import imgConfirmDelete from '../images/icons/ConfirmDelete.svg';

function Products() {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();
    const [catAndSubcat, setCatAndSubcat] = React.useState([]);
    const [changeProducts, setChangeProducts] = React.useState('');
    
    React.useEffect(() => {
        auth.validateUser().then( () => {
            if (!auth.user.restaurants.length) {
                addToastr('No cuentas con restaurantes registrados', 'info');
                setIsLoading(false);
                navigate('/home');
                return;
            }
            axios.post(`${auth.path}api/Category/GetCategoriesAndSubCategoriesByRestaurant`,
            {
                Restaurant_Id: auth.user.restaurants[0].id,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${auth.user.token}`,
                },
            }).then(({data})=> {                
                if (!data.categories.length) {
                    addToastr('Registra tu primera categoría', 'info');
                }                                
                setCatAndSubcat(data.categories);
                setIsLoading(false);
            }).catch(error => {
                setIsLoading(false);
                addToastr('Error interno del sistema', 'error');
            });
        }).catch( error => {
            addToastr(error, 'info');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);

       
    const handleClickAdd = () => {   
        setIsLoading(true);
        navigate('new');
    }

    const handleClickEdit = (id) => {
        setIsLoading(true);
        navigate('edit/' + id);
    }

    const handleClickDelete = (id) => {
        Swal.fire({
            html: `
                <img style='margin: 2vh 0;' src='${imgConfirmDelete}' alt='icono eliminar' />
                <div style='color:#323232; font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#EB6837;'>Eliminar</b> el producto?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#EB6837',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                axios.post(`${auth.path}api/Product/DeleteProduct`, 
                {
                    product_Id: id,
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${auth.user.token}`
                }
                }).then(({data})=> {
                    if (data.cod === '0') {
                        setChangeProducts(id);
                        addToastr(data.rpta);
                        return;
                    }                    
                    addToastr(data.rpta, 'warning');
                    setIsLoading(false);
                }).catch(error => {
                    setIsLoading(false);
                    addToastr('Error interno del sistema.', 'error');
                });     
            }
        });
    }
    
    return (
        <>
            <Menu />
            <Header logo={imgProducts} title='Productos' />
            
            <Button name='Agregar Producto' icon='add' onClick={handleClickAdd} />
            {
                catAndSubcat.map( category => {
                    return (
                        <SectionProducts
                            key={category.id}
                            category={category}
                            onEdit={handleClickEdit}
                            onDelete={handleClickDelete}
                            reload={changeProducts}
                        />
                    );
                })
            }
        </>
    );

}

export { Products };