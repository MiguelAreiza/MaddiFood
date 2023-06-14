import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

// Components
import { useAppStates } from './AppContext';
import { useAuth } from './auth';
import { Input } from './Input';
import { Button } from './Button';

// Styles
import '../styles/Products.css';

// Recursos
import imgConfirmSave from '../images/icons/ConfirmSave.svg'

function FormProduct({ onCreate, onEdit }) {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const params = useParams();
    const navigate = useNavigate();
    const [subcategory, setSubcategory] = React.useState('');
    const [image, setImage] = React.useState(null);
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [biOutstanding, setBiOutstanding] = React.useState(false);
    const [biActive, setBiActive] = React.useState(true);
    const [optsSubCategory, setOptsSubCategory] = React.useState([]);

    React.useEffect(() => {
        if (params.id) {
            auth.validateUser().then( () => {
                axios.post(`${auth.path}api/Product/GetProductById`, 
                {
                    product_Id: params.id,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${auth.user.token}`
                    }
                }).then( ({data:{product}}) => {
                    setSubcategory(product.subCategoryId);
                    setImage(product.strImageUrl);
                    setName(product.strName);
                    setDescription(product.strDescription);
                    setPrice(product.dePrice);
                    setBiOutstanding(product.biOutstanding);
                    setBiActive(product.biActive);

                    setIsLoading(false);                    
                }).catch(error => {
                    addToastr('Error interno del sistema', 'error');
                    setIsLoading(true);
                    navigate('/home/products');
                });    
            }).catch( error => {
                addToastr(error, 'info');
            });
        } else {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }

        axios.post(`${auth.path}api/SubCategory/GetSubCategoriesByRestaurant`,
        {
            restaurant_Id: auth.user.restaurants[0].id,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${auth.user.token}`,
            },
        }).then(({data, data:{subCategories}})=> {
            
            if (!data.subCategories.length) {
                addToastr('Registra tu primera categoría', 'info');
            }
            
            setOptsSubCategory(subCategories);
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
                <div style='color:#323232; font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#EB6837;'>${params.id? 'Editar': 'Crear'}</b> el producto?</div>`,
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
                    onEdit(params.id, subcategory, image, name, description, price, biOutstanding, biActive)
                : 
                    onCreate(subcategory, image, name, description, price, biOutstanding, biActive)
            }
        });
    }

    return (
        <form className='form_inputs' onSubmit={handleSubmit}>
            <Input name='Imagen' type='file' value={image} setValue={setImage} accept='image/*' required={false}  />
            <Input name='Subcategoría' type='select' value={subcategory} setValue={setSubcategory} options={optsSubCategory} /> 
            <Input name='Nombre' type='text' value={name} setValue={setName} />
            <Input name='Descripción' type='text' value={description} setValue={setDescription} />
            <Input name='Precio' type='money' value={price} setValue={setPrice} />
            <Input name='Producto destacado' type='checkbox' value={biOutstanding} setValue={setBiOutstanding} /> 
            <Input name='Producto activo' type='checkbox' value={biActive} setValue={setBiActive} /> 

            <Button name={params.id? 'Editar producto' : 'Crear producto'} type='submit' icon='next' />
        </form>
    );
}

export { FormProduct };