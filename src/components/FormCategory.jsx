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
import '../styles/Categories.css';

// Recursos
import imgConfirmSave from '../images/icons/ConfirmSave.svg'

function FormCategory({ onCreate, onEdit }) {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const params = useParams();
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [biActive, setBiActive] = React.useState(true);

    React.useEffect(() => {
        if (params.id) {
            auth.validateUser().then( () => {
                axios.post(`${auth.path}api/Category/GetCategoryById`, 
                {
                    category_Id: params.id,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${auth.user.token}`
                    }
                }).then( ({data, data:{category}}) => {
                    if (data.cod === '-1') {
                        addToastr(data.rpta, 'warning');
                        setIsLoading(false);
                        return;   
                    }
                    setName(category.strName);
                    setBiActive(category.biActive);
                    setIsLoading(false);
                }).catch(error => {                    
                    addToastr('Error interno del sistema', 'error');
                    setIsLoading(true);
                    navigate('/home/categories');
                });    
            }).catch( error => {
                addToastr(error, 'info');
            });
        } else {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handleSubmit = e => {
        e.preventDefault();
        Swal.fire({
            html: `
                <img style='margin: 2vh 0;' src='${imgConfirmSave}' alt='icono guardar' />
                <div style='color:#323232; font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#EB6837;'>${params.id? 'Editar': 'Crear'}</b> la categoría?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#EB6837',
            confirmButtonText: params.id? 'Editar': 'Crear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        }).then((result) => {            
            if (result.isConfirmed) {
                params.id ? onEdit(params.id, name, biActive) : onCreate(name, biActive);
            }
        });
    }

    return (
        <form className='form_inputs' onSubmit={handleSubmit}>
            <Input name='Nombre' type='text' value={name} setValue={setName} />
            <Input name='Categoría activa' type='checkbox' value={biActive} setValue={setBiActive} /> 

            <Button name={params.id? 'Editar categoría' : 'Crear categoría'} type='submit' icon='next' />
        </form>
    );
}

export { FormCategory };