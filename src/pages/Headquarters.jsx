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
import '../styles/Headquarters.css';

// Recursos
import imgHeadquarters from '../images/adminOptions/Headquarters.svg';
import imgConfirmDelete from '../images/icons/ConfirmDelete.svg';

function Headquarters() {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();
    const [headquarters, setHeadquarters] = React.useState([]);
    const [changeHeadquarters, setChangeHeadquarters] = React.useState('');
    
    React.useEffect(() => {
        loadHeadquarters();
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, [changeHeadquarters]);

    const loadHeadquarters = () => {
        if (!auth.user.restaurants.length) {
            addToastr('No cuentas con restaurantes registrados', 'info');
            navigate('/home');
            return;
        }
        auth.validateUser().then( () => {
            axios.post(`${auth.path}api/Headquarter/GetHeadquartersByRestaurant`,
            {
                Restaurant_Id: auth.user.restaurants[0].id
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${auth.user.token}`,
                },
            }).then(({data})=> {                
                if (!data.headquarters.length) {
                    addToastr('Registra tu primera sede', 'info');
                }                                
                setHeadquarters(data.headquarters);
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
                <div style='color:#323232; font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#EB6837;'>Eliminar</b> la sede?</div>`,
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
                axios.post(`${auth.path}api/Headquarter/DeleteHeadquarter`, 
                {
                    headquarter_Id: id,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${auth.user.token}`
                    }
                }).then(({data})=> {
                    if (data.cod === '0') {
                        setChangeHeadquarters(id);
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
            <Header logo={imgHeadquarters} title='Sedes' />
            <Button name='Agregar Sede' icon='add' onClick={handleClickAdd} />

            <div className='container_cards'>
                {
                    headquarters.map( (headquarter) => {
                        return(
                            <Card
                                key={headquarter.id}
                                onEdit={ () => {handleClickEdit(headquarter.id)}}
                                onDelete={ () => {handleClickDelete(headquarter.id)} }
                                name={headquarter.strName}
                                image={imgHeadquarters}
                            />
                        )
                    })
                }
            </div>
        </>
    );

}

export { Headquarters };
