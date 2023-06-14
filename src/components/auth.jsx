import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = React.createContext();

function AuthProvider({ children }) {	
	const navigate = useNavigate();
	const [user, setUser] = React.useState(JSON.parse(sessionStorage.getItem('appUser')) || null);
	const path = 'https://maddifood.somee.com/';

	const login = (appUser) => {		
		setUser(appUser);
		navigate('/home');
		sessionStorage.setItem('appUser', JSON.stringify(appUser));
	};
	
	const logout = () => {
		setUser(null);
		navigate('/auth');
		sessionStorage.removeItem('appUser');
	};

	const validateUser = () => {
		return new Promise( (resolve, reject) => {
			axios.post(`${path}api/Account/ValidateUser`, {},
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `bearer ${user.token}`
				}
			}).then(({data})=> {
				if (data.cod === '-1') {
					logout();
					reject('Tu sesión ha sido cerrada por inactividad');
				}
				setUser(data.appUser);
				sessionStorage.setItem('appUser', JSON.stringify(data.appUser));
				resolve(data.appUser);				
			}).catch(error => {			
				logout();
				reject('Tu sesión ha sido cerrada por inactividad');
			}); 
		});
	}
	
	const auth = { path, user, login, logout, validateUser };

	return (
		<AuthContext.Provider value={auth}>
			{children}
		</AuthContext.Provider>		
	);
}

function useAuth() {
	const auth = React.useContext(AuthContext);
	return auth;
}

function AuthRoute(props) {
	const auth = useAuth();
	if (!auth.user) {
		return <Navigate to='/' />;
	}
	return props.children;
}

export {
	AuthProvider,
	AuthRoute,
	useAuth,
};