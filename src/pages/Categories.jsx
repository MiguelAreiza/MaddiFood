import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

// Components
import { useAppStates } from '../components/AppContext';
import { useAuth } from '../components/auth';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

// Styles
import '../styles/Categories.css';

// Recursos
import imgCategories from '../images/adminOptions/Categories.svg';
import imgConfirmDelete from '../images/icons/ConfirmDelete.svg';

function Categories() {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = React.useState([]);
    const [changeCategories, setChangeCategories] = React.useState('');
    
    React.useEffect(() => {
        loadCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, [changeCategories]);

    const loadCategories = () => {
        if (!auth.user.restaurants.length) {
            addToastr('No cuentas con restaurantes registrados', 'info');
            navigate('/home');
            return;
        }
        auth.validateUser().then( () => {
            axios.post(`${auth.path}api/Category/GetCategoriesByRestaurant`,
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
                                
                setCategories(data.categories);
                setIsLoading(false);

            }).catch(error => {
                setIsLoading(false);
                addToastr('Error interno del sistema', 'error');
            });

        }).catch( error => {
            addToastr(error, 'info');
        });

    }
       
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
                <div style='color:#323232; font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#EB6837;'>Eliminar</b> la categoría?</div>`,
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
                
                axios.post(`${auth.path}api/Category/DeleteCategory`, 
                {
                    category_Id: id,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${auth.user.token}`
                    }
                }).then(({data})=> {
                    if (data.cod === '0') {
                        setChangeCategories(id);
                    }                    
                    addToastr(data.rpta);
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
            <Header logo={imgCategories} title='Categorías' />

            <Button name='Agregar Categoría' onClick={handleClickAdd} icon='add' />

            <div className='container_cards'>
                {
                    categories.map( (category) => {
                        return( 
                            <Card 
                                key={category.id}
                                onEdit={ () => {handleClickEdit(category.id)}}
                                onDelete={ () => {handleClickDelete(category.id)} }
                                name={category.strName}
                                image={imgCategories}
                            />
                        )
                    })
                }
            </div>
        </>
    );

}

export { Categories };