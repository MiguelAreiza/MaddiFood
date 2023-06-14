import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

// Components
import { useAppStates } from '../components/AppContext';
import { useAuth } from '../components/auth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

// Styles
import '../styles/Subcategories.css';

// Recursos
import imgConfirmSave from '../images/icons/ConfirmSave.svg'

function FormSubcategory({ onCreate, onEdit }) {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const params = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = React.useState('');
    const [image, setImage] = React.useState(null);
    const [name, setName] = React.useState('');
    const [biActive, setBiActive] = React.useState(true);
    const [optsCategory, setOptsCategory] = React.useState([]);

    React.useEffect(() => {
        if (params.id) {
            auth.validateUser().then( () => {
                axios.post(`${auth.path}api/SubCategory/GetSubCategoryById`, 
                {
                    subCategory_Id: params.id,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${auth.user.token}`
                    }
                }).then( ({data:{subCategory}}) => {
                    setCategory(subCategory.categoryId);
                    setImage(subCategory.strImageUrl);
                    setName(subCategory.strName);
                    setBiActive(subCategory.biActive);

                    setIsLoading(false);                    
                }).catch(error => {
                    addToastr('Error interno del sistema', 'error');
                    setIsLoading(true);
                    navigate('/home/subcategories');
                });    
            }).catch( error => {
                addToastr(error, 'info');
            });
        } else {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }

        axios.post(`${auth.path}api/Category/GetCategoriesByRestaurant`,
        {
            restaurant_Id: auth.user.restaurants[0].id,
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
            
            setOptsCategory(data.categories);
            setIsLoading(false);

        }).catch(error => {
            setIsLoading(false);
            addToastr('Error interno del sistema', 'error');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handleSubmit = e => {

        e.preventDefault();

        Swal.fire({
            html: `
                <img style='margin: 2vh 0;' src='${imgConfirmSave}' alt='icono guardar' />
                <div style='color:#323232; font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#EB6837;'>${params.id? 'Editar': 'Crear'}</b> la subcategoría?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#EB6837',
            confirmButtonText: params.id? 'Editar': 'Crear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        }).then((result) => {            
            if (result.isConfirmed) {
                params.id ? 
                    onEdit(params.id, category, image, name, biActive)
                : 
                    onCreate(category, image, name, biActive)
            }
        });

    }

    return (
        <form className='form_inputs' onSubmit={handleSubmit}>
            <Input name='Imagen' type='file' value={image} setValue={setImage} accept='image/*' required={false}  />
            <Input name='Categoría' type='select' value={category} setValue={setCategory} options={optsCategory} /> 
            <Input name='Nombre' type='text' value={name} setValue={setName} />
            <Input name='Subcategoría activa' type='checkbox' value={biActive} setValue={setBiActive} /> 

            <Button name={params.id? 'Editar subcategoría' : 'Crear subcategoría'} type='submit' icon='next' />

        </form>
    );

}

export { FormSubcategory };