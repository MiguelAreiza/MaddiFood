import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

// Components
import { useAppStates } from "../components/AppContext";
import { useAuth } from '../components/auth';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

// Styles
import '../styles/Restaurant.css'

// Recursos
import imgRestaurant from '../images/adminOptions/Restaurant.svg';
import imgConfirmSave from '../images/icons/ConfirmSave.svg';

function Restaurant() {

    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();
    const [image, setImage] = React.useState(null);
    const [name, setName] = React.useState('');
    const [nit, setNit] = React.useState('');
    const [url, setUrl] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [active, setActive] = React.useState(false);

    React.useEffect(() => {
        auth.validateUser().then( (response) => {
            axios.post(`${auth.path}api/Restaurant/GetRestaurantById`,
            {
                restaurant_Id: auth.user.restaurants[0].id
            }
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${auth.user.token}`
                }
            }).then(({data, data:{restaurant}}) => {
                if (data.cod === '-1') {                    
                    addToastr(data.rpta, 'warning');
                    navigate('/home');
                    return;
                }
                setImage(restaurant.strImageUrl);
                setName(restaurant.strName);
                setNit(restaurant.strNit);
                setUrl(restaurant.strWebsite);
                setDescription(restaurant.strDescription);
                setActive(restaurant.biActive);

                setIsLoading(false);                
            }).catch(error => {     
                setIsLoading(false);
                addToastr('Error interno del sistema', 'error');
            }); 
            setIsLoading(false);
        }).catch( error => {
            addToastr(error, 'info');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps   
    }, []);

    const handleSubmit = e => {

        e.preventDefault();

        Swal.fire({
            html: `
                <img style='margin: 2vh 0;' src='${imgConfirmSave}' alt='icono guardar' />
                <div style='color:#323232; font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#EB6837;'>Editar</b> el restaurante?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#EB6837',
            confirmButtonText: 'Editar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        }).then((result) => {            
            if (result.isConfirmed) {
                setIsLoading(true); 
                auth.validateUser().then( () => {

                    let formData = new FormData();
                    formData.append('Restaurant_Id', auth.user.restaurants[0].id);
                    formData.append('Image', image);
                    formData.append('Name', name);
                    formData.append('Nit', nit);
                    formData.append('Description', description);
                    formData.append('BiActive', active);

                    axios.post(`${auth.path}api/Restaurant/UpdateRestaurant`,
                    formData,
                    {
                        headers: {
                            'Authorization': `bearer ${auth.user.token}`
                        }
                    }).then( ({data}) => {        
                        if (data.cod === '0') {                    
                            addToastr(data.rpta);
                            navigate('/home');
                            return;
                        }

                        setIsLoading(false);                        
                    }).catch(error => {      
                        setIsLoading(false);
                        addToastr('Error interno del sistema', 'error');
                    }); 
                    setIsLoading(false);
                }).catch( error => {
                    addToastr(error, 'info');
                });                
            }
        });
    }

    return (
        <>
            <Menu />
            <Header logo={imgRestaurant} title='Restaurante' />

            <form className='form_inputs' onSubmit={handleSubmit}>
                <Input name='Logo' type='file' value={image || imgRestaurant} setValue={setImage} accept='image/*' required={false} />
                <Input name='Nombre' type='text' value={name} setValue={setName} />
                <Input name='Nit' type='text' value={nit} setValue={setNit} />
                <Input name='Url' type='url' value={url} setValue={setUrl} />
                <Input name='Descripcion' type='text' value={description} setValue={setDescription} />
                <Input name='Activo' type='checkbox' value={active} setValue={setActive} />
                <Button name='Editar restaurante' type='submit' icon='next' />
            </form>
        </>
    );

}

export { Restaurant };