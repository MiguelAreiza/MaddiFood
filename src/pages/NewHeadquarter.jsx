import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

function NewHeadquarter() {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickCreate = (name, address, dtStart, dtEnd, biActive, biTableBooking, biOrderFromTheTable, biDelibery, biAccounting, biRemarks, biChatBot, biCustomThemes          ) => {
        
        setIsLoading(true);

        auth.validateUser().then( () => {

            axios.post(`${auth.path}api/Headquarter/CreateHeadquarter`, 
            {
                restaurant_Id: auth.user.restaurants[0].id,
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
            }).then( ({data}) => {
                
                if (data.cod === '0') {                    
                    addToastr(data.rpta);
                    navigate('/home/headquarters');
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
            <Menu path='/home/headquarters' />
            <Header logo={imgHeadquarters} title='Sedes' />

            <FormHeadquarter onCreate={handleClickCreate} />
        </>
    );

}

export { NewHeadquarter };
