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
import '../styles/Subcategories.css';

// Recursos
import imgSubcategories from '../images/adminOptions/Subcategories.svg';
import imgConfirmDelete from '../images/icons/ConfirmDelete.svg';

function Subcategories() {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();
    const [subcategories, setSubcategories] = React.useState([]);
    const [changeSubcategories, setChangeSubcategories] = React.useState('');
    
    React.useEffect(() => {
        loadSubcategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, [changeSubcategories]);

    const loadSubcategories = () => {
        if (!auth.user.restaurants.length) {
            addToastr('No cuentas con restaurantes registrados', 'info');
            navigate('/home');
            return;
        }
        auth.validateUser().then( () => {
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
                                
                setSubcategories(data.categories);
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
                <div style='color:#323232; font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#EB6837;'>Eliminar</b> la subcategoría?</div>`,
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
                
                axios.post(`${auth.path}api/SubCategory/DeleteSubCategory`, 
                {
                    subCategory_Id: id,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${auth.user.token}`
                    }
                }).then(({data})=> {
                    if (data.cod === '0') {
                        setChangeSubcategories(id);
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
            <Header logo={imgSubcategories} title='Subcategorías' />

            <Button name='Agregar Subcategoría' onClick={handleClickAdd} icon='add' />

            {
                subcategories.map( category => {
                    return(                         
                        <div className='container_cards' key={category.id}>
                            <label className='category_name'>{category.strName}</label>
                            {
                                category.subCategories.map( subcategory => {
                                    return( 
                                        <Card 
                                            key={subcategory.id}
                                            onEdit={ () => handleClickEdit(subcategory.id)}
                                            onDelete={ () => handleClickDelete(subcategory.id) }
                                            name={subcategory.strName}
                                            image={subcategory.strImageUrl || imgSubcategories}
                                        />
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </>
    );

}

export { Subcategories };