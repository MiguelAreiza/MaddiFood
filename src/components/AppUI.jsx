import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

// Components
import { AuthProvider, AuthRoute } from './auth';
import { AppProvider } from './AppContext';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration'

// Routes
import { LandingPage } from '../pages/LandingPage';
import { Login } from '../pages/Login';
import { Recovery } from '../pages/Recovery';
import { Home } from '../pages/Home';
import { Restaurant } from '../pages/Restaurant';
import { Headquarters } from '../pages/Headquarters';
import { NewHeadquarter } from '../pages/NewHeadquarter';
import { EditHeadquarter } from '../pages/EditHeadquarter';
import { DigitalMenu } from '../pages/DigitalMenu';
import { Categories } from '../pages/Categories';
import { NewCategory } from '../pages/NewCategory';
import { EditCategory } from '../pages/EditCategory';
import { Subcategories } from '../pages/Subcategories';
import { NewSubcategory } from '../pages/NewSubcategory';
import { EditSubcategory } from '../pages/EditSubcategory';
import { Products } from '../pages/Products';
import { NewProduct } from '../pages/NewProduct';
import { EditProduct } from '../pages/EditProduct';
import { Profile } from '../pages/Profile';
import { ChangePassword } from '../pages/ChangePass';
import { Default } from '../pages/Default';

function AppUi() {
    
    return (
        <HashRouter>
            <AuthProvider>  
                <AppProvider>
                    <Routes>

                        <Route path='/' element={<LandingPage />} />

                        <Route path='/auth' element={<Login />} />

                        <Route path='/auth/recovery' element={<Recovery />} />

                        <Route path='/home/' element={<AuthRoute> <Home /> </AuthRoute>} />

                        <Route path='/home/restaurant' element={<AuthRoute> <Restaurant /> </AuthRoute>} />
                        
                        <Route path='/home/headquarters' element={<AuthRoute> <Headquarters /> </AuthRoute>} />
                        <Route path='/home/headquarters/new' element={<AuthRoute> <NewHeadquarter /> </AuthRoute>} />
                        <Route path='/home/headquarters/edit/:id' element={<AuthRoute> <EditHeadquarter /> </AuthRoute>} />
                        
                        <Route path='/home/digitalmenu' element={<AuthRoute> <DigitalMenu /> </AuthRoute>} />
                        
                        <Route path='/home/categories' element={<AuthRoute> <Categories /> </AuthRoute>} />
                        <Route path='/home/categories/new' element={<AuthRoute> <NewCategory /> </AuthRoute>} />
                        <Route path='/home/categories/edit/:id' element={<AuthRoute> <EditCategory /> </AuthRoute>} />

                        <Route path='/home/subcategories' element={<AuthRoute> <Subcategories /> </AuthRoute>} />
                        <Route path='/home/subcategories/new' element={<AuthRoute> <NewSubcategory /> </AuthRoute>} />
                        <Route path='/home/subcategories/edit/:id' element={<AuthRoute> <EditSubcategory /> </AuthRoute>} />

                        <Route path='/home/products' element={<AuthRoute> <Products /> </AuthRoute>} />
                        <Route path='/home/products/new' element={<AuthRoute> <NewProduct /> </AuthRoute>} />
                        <Route path='/home/products/edit/:id' element={<AuthRoute> <EditProduct /> </AuthRoute>} />

                        <Route path='/home/profile' element={<AuthRoute> <Profile /> </AuthRoute>} />
                        <Route path='/home/profile/changepassword' element={<AuthRoute> <ChangePassword /> </AuthRoute>} />

                        <Route path='*' element={<Default />} />

                    </Routes>
                </AppProvider>   
            </AuthProvider>
        </HashRouter>
    );

}

serviceWorkerRegistration.register({
    onUpdate: async (registration) => {
        // Corremos este código si hay una nueva versión de nuestra app
        // Detalles en: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
        if (registration && registration.waiting) {
            await registration.unregister();
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
            // Des-registramos el SW para recargar la página y obtener la nueva versión. Lo cual permite que el navegador descargue lo nuevo y que invalida la cache que tenía previamente.
            window.location.reload();
        }
    },
});

export { AppUi };
