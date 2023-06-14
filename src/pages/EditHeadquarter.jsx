import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Components
import { useAppStates } from '../components/AppContext';
import { useAuth } from '../components/auth';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { FormHeadquarter } from '../components/FormHeadquarter'

// Styles
import '../styles/Headquarters.css'

// Recursos
import imgHeadquarters from '../images/adminOptions/Headquarters.svg';

function EditHeadquarter() {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();

    const handleClicEdit = (id, name, address, dtStart, dtEnd, biActive, biTableBooking, biOrderFromTheTable, biDelibery, biAccounting, biRemarks, biChatBot, biCustomThemes) => {
        
        setIsLoading(true);

        auth.validateUser().then( () => {

            axios.post(`${auth.path}api/Headquarter/UpdateHeadquarter`,
            {
                headquarter_Id: id,
                name: name,
                address: address,
                dtStart: dtStart,
                dtEnd: dtEnd,
                biActive: biActive,
                biActiveTableBooking: biTableBooking,
                biActiveOrderFromTheTable: biOrderFromTheTable,        
                biActiveDelivery: biDelibery,
                biActiveAccounting: biAccounting,
                biActiveRemarks: biRemarks,
                biActiveChatBot: biChatBot,
                biActiveCustomThemes: biCustomThemes
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${auth.user.token}`
                }
            }).then(({data})=> {
                
                if (data.cod === '0') {                    
                    addToastr(data.rpta);
                    navigate('/home/headquarters');
                    return                    
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
            <Menu path='/home/headquarters' />
            <Header logo={imgHeadquarters} title='Sedes' />

            <FormHeadquarter onEdit={handleClicEdit} />
        </>
    );

}

export { EditHeadquarter };
