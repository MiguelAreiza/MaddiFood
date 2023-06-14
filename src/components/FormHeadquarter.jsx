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
import '../styles/Headquarters.css'

// Recursos
import imgConfirmSave from '../images/icons/ConfirmSave.svg'

function FormHeadquarter({ onCreate, onEdit }) {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const params = useParams();
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [dtStart, setDtStart] = React.useState('');
    const [dtEnd, setDtEnd] = React.useState('');
    const [biActive, setBiActive] = React.useState(true);
    const [biTableBooking, setBiTableBooking] = React.useState(false);
    const [biOrderFromTheTable, setBiOrderFromTheTable] = React.useState(false);
    const [biDelibery, setBiDelibery] = React.useState(false);
    const [biAccounting, setBiAccounting] = React.useState(false);
    const [biRemarks, setBiRemarks] = React.useState(false);
    const [biChatBot, setBiChatBot] = React.useState(false);
    const [biCustomThemes, setBiCustomThemes] = React.useState(false);

    React.useEffect(() => {
        if (params.id) {
            auth.validateUser().then( () => {
                axios.post(`${auth.path}api/Headquarter/GetHeadquarterById`, 
                {
                    Headquarter_Id: params.id,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${auth.user.token}`
                    }
                }).then( ({data:{headquarter}}) => {
                    setName(headquarter.strName);
                    setAddress(headquarter.strAddress);
                    setDtStart(headquarter.dtStart);
                    setDtEnd(headquarter.dtEnd);
                    setBiActive(headquarter.biActive);
                    setBiTableBooking(headquarter.biActiveTableBooking);
                    setBiOrderFromTheTable(headquarter.biActiveOrderFromTheTable);
                    setBiDelibery(headquarter.biActiveDelivery);
                    setBiAccounting(headquarter.biActiveAccounting);
                    setBiRemarks(headquarter.biActiveRemarks);
                    setBiChatBot(headquarter.biActiveChatBot);
                    setBiCustomThemes(headquarter.biActiveCustomThemes);

                    setIsLoading(false);                    
                }).catch(error => {                    
                    addToastr('Error interno del sistema', 'error');
                    setIsLoading(true);
                    navigate('/home/headquarters');
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
                <div style='color:#323232; font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#EB6837;'>${params.id? 'Editar': 'Crear'}</b> la sede?</div>`,
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
                    onEdit(params.id, name, address, dtStart, dtEnd, biActive, biTableBooking, biOrderFromTheTable, biDelibery, biAccounting, biRemarks, biChatBot, biCustomThemes)
                : 
                    onCreate(name, address, dtStart, dtEnd, biActive, biTableBooking, biOrderFromTheTable, biDelibery, biAccounting, biRemarks, biChatBot, biCustomThemes)
            }
        });

    }

    return (
        <form className='form_inputs' onSubmit={handleSubmit}>
            <Input name='Nombre' type='text' value={name} setValue={setName} />
            <Input name='Dirección' type='text' value={address} setValue={setAddress} />
            <Input name='Hora de apertura' type='time' value={dtStart} setValue={setDtStart} />
            <Input name='Hora de cierre' type='time' value={dtEnd} setValue={setDtEnd} />
            <Input name='Sede activa' type='checkbox' value={biActive} setValue={setBiActive} />            
            <Input name='Permite reservar mesas' type='checkbox' value={biTableBooking} setValue={setBiTableBooking} />
            <Input name='Permite ordenar desde la mesa' type='checkbox' value={biOrderFromTheTable} setValue={setBiOrderFromTheTable} />
            <Input name='Permite domicilios' type='checkbox' value={biDelibery} setValue={setBiDelibery} />
            <Input name='Permite contabilidad' type='checkbox' value={biAccounting} setValue={setBiAccounting} />
            <Input name='Permite reseñas' type='checkbox' value={biRemarks} setValue={setBiRemarks} />
            <Input name='Permite chatbot' type='checkbox' value={biChatBot} setValue={setBiChatBot} />
            <Input name='Permite temas personalizados' type='checkbox' value={biCustomThemes} setValue={setBiCustomThemes} />

            <Button name={params.id? 'Editar sede' : 'Crear sede'} type='submit' icon='next' />
        </form>
    );
}

export { FormHeadquarter };