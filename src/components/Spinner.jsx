import React from 'react';
import '../styles/Spinner.css';
import Vector1 from '../images/spinner/Vector1.svg';
import Vector2 from '../images/spinner/Vector2.svg';

function Spinner() {
    return (
        <React.Fragment>
            <div className='spinner'>
                <img src={Vector1} alt='MaddiFood vector 1' draggable='false' width='55.5' height='55.5' />
                <img src={Vector2} alt='MaddiFood vector 2' draggable='false' width='127.5' height='127.5' />
            </div>
        </React.Fragment>
    );
}

export { Spinner };