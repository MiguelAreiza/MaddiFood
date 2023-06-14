import React from 'react';

// Components

// Styles
import '../styles/Card.css'

// Recursos
import defaultImage from '../images/adminOptions/Products.svg'

function Card({ onEdit, onDelete, name, image, isProduct, description, price }) {
    return (
        <div className='card_container'>
            {!isProduct ? 
                <div className='card_header'>
                    <img src={image} alt='icono de la card' className='card_image' draggable='false' width='60px' height='60px' />
                    <h3 className='card_title' >{name}</h3>
                </div>
            :
                <>
                    <img className='product_image' src={image||defaultImage} alt='Foto del producto' draggable='false' width='250px' height='250px' />
                    <div className='product_details'>
                        <label className='product_name'>{name ? name : '--'} {!name && <br />} {!name && '--'}</label>
                        <p className='product_description'>{description||'--'}</p>
                        <label className='product_price'>$ {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '--'}</label>
                    </div>
                </>
            }
            <div className='card_options'>
                <button onClick={onEdit} className='option_edit'>Editar</button>
                <button onClick={onDelete} className='option_delete'>Eliminar</button>
            </div>
        </div>
    );
}

export { Card };