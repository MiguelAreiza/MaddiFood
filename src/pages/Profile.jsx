import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

// Components
import { useAppStates } from '../components/AppContext';
import { useAuth } from '../components/auth';
import { Menu } from '../components/Menu';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

// Styles
import '../styles/Profile.css'

// Recursos
import imgProfile from '../images/icons/ProfileOrange.svg';
import imgConfirmSave from '../images/icons/ConfirmSave.svg';

function Profile() {
    
    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [user, setUser] = React.useState('');
    const [doc, setDoc] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [remark, setRemark] = React.useState(auth.user.remark);

    React.useEffect(() => {
        auth.validateUser().then( (response) => {
            setName(response.name);
            setUser(response.user);
            setDoc(response.document);
            setEmail(response.email);
            setPhone(response.phone);
            setIsLoading(false);
        }).catch( error => {
            addToastr(error, 'info');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickChange = () =>{
        setIsLoading(true);
        navigate('changepassword');
    }

    const handleSubmit = e => {
        e.preventDefault();

        Swal.fire({
            html: `
                <img style='margin: 2vh 0;' src='${imgConfirmSave}' alt='icono guardar' />
                <div style='color:#323232; font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#EB6837;'>Editar</b> el perfil?</div>`,
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
                    axios.post(`${auth.path}api/Account/UpdateUser`,
                    {
                        name: name,
                        nameUser: user,
                        document: doc,
                        email: email,
                        phone: phone
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `bearer ${auth.user.token}`
                        }
                    }).then(({data})=> {
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
                }).catch( error => {
                    addToastr(error, 'info');
                });
            }
        });
    }
    
    return (
        <>
            <Menu />
            <Header logo={imgProfile} title='Perfil' />

            <form className='form_inputs' onSubmit={handleSubmit} >                
                <Input name='Nombre' type='text' value={name} setValue={setName} />
                <Input name='Usuario' type='text' value={user} setValue={setUser} />
                <Input name='Documento' type='number' value={doc} setValue={setDoc} />
                <Input name='Email' type='email' value={email} setValue={setEmail} />
                <Input name='Teléfono' type='tel' value={phone} setValue={setPhone} />
                <Input name='Comentario' type='text' value={remark} setValue={setRemark} disabled />
                
                <Button name='Guardar perfil' type='submit' icon='next' />
                <Button name='Cambiar contraseña' onClick={handleClickChange} icon='next' secondIcon='password' />
            </form>
        </>
    );

}

export { Profile };