import React from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../components/AppContext';
import { useAuth } from '../components/auth';
import { Card } from '../components/Card';

// Styles
import '../styles/Products.css'

function SectionProducts({ category, onEdit, onDelete, reload }) {

    const { setIsLoading, addToastr } = useAppStates();
    const auth = useAuth();
    // const navigate = useNavigate();
    const [products, setProducts] = React.useState([]);

    const sliderSubcategoriesRef = React.useRef(null);
    const sliderProductsRef = React.useRef(null);

    React.useEffect(() => {        
        const sliderSubcategories = sliderSubcategoriesRef.current;
        const sliderProducts = sliderProductsRef.current;

        if (sliderSubcategories && sliderProducts) {
            sliderSubcategories.style.justifyContent = sliderSubcategories.scrollWidth > sliderSubcategories.clientWidth ? 'left' : 'center';
            sliderProducts.style.justifyContent = sliderProducts.scrollWidth > sliderProducts.clientWidth ? 'left' : 'center';
        }

        const btnCat = document.querySelectorAll('.subcategory_option.option_selected');
        btnCat.forEach( btn => {
            btn.click();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps     
    }, [reload]);

    const handleClickLoad = e => {
        const subcategoryId = e.target.dataset.subcategoryid;
        setIsLoading(true);
        axios.post(`${auth.path}api/Product/GetProductsBySubCategory`,
        {
            subCategory_Id: subcategoryId,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${auth.user.token}`,
            },
        }).then(({ data }) => {
            if (data.cod === '-1') {
                addToastr(data.rpta, 'warning');
                setIsLoading(false);
                return;
            }
            setProducts(data.products);

            const parent = e.target.parentElement;
            parent.querySelectorAll('.option_selected').forEach((el) => {
              el.classList.remove('option_selected');
            });
            e.target.classList.add('option_selected');

            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false);
            addToastr('Error interno del sistema', 'error');
        });
    };
    
    return (
        <div className='section_category' >
            <label className='category_name'>{category.strName}</label>
            <div className='slider_subcategories' ref={sliderSubcategoriesRef}>
                {
                    category.subCategories.map( (subcategory, index) => {
                        return(
                            <button
                                key={subcategory.id}
                                className={index === 0 ? 'subcategory_option option_selected' : 'subcategory_option'}
                                data-subcategoryid={subcategory.id}
                                onClick={handleClickLoad}
                            >
                                {subcategory.strName}
                            </button>
                        )
                    })
                }
            </div>
            <div className='slider_products' ref={sliderProductsRef}>
                {
                    products.map( product => {
                        return(
                            <Card 
                                key={product.id}
                                isProduct
                                onEdit={ () => onEdit(product.id)}
                                onDelete={ () => onDelete(product.id)}
                                name={product.strName}
                                description={product.strDescription}
                                price={product.dePrice}
                                image={product.strImageUrl}
                            />
                        )
                    })
                }
            </div>
        </div>
    );

}

export { SectionProducts };