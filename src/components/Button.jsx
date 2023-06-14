import React from 'react';

// Components
// import { useAppStates } from "../components/AppContext";
// import { useAuth } from '../components/auth';

// Styles
import '../styles/Button.css'

function Button({ name, type = 'button', onClick, icon, secondIcon, disabled }) {

    // const { addToastr } = useAppStates();

    return (
        <div className='container_button'>
            <button
                className={'template_button ' + icon + ' ' + secondIcon}
                type={type}
                name={name.replaceAll(' ','-')}
                disabled={disabled}
                onClick={onClick}
            >
                {name}
            </button>
        </div>
    );

}

export { Button };