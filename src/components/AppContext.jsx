import React from 'react';
import { v4 as uuidv4 } from 'uuid';

// Components
import { PageContent } from './PageContent';
import { Spinner } from '../components/Spinner';
import { Toastr } from './Toastr';

const AppContext = React.createContext();

function AppProvider({ children }) {
	const [isLoading, setIsLoading] = React.useState(true);
    const [toastrList, setToastrList] = React.useState([]);

    const addToastr = (message, type, time) => {
        const id = uuidv4();        
        const newToastrList = [...toastrList];
        newToastrList.push({ message, type, time, id });
        setToastrList(newToastrList);
    };

	const appStates = { setIsLoading, addToastr };

	return (
		<AppContext.Provider value={appStates}>

			<PageContent>
				{children}
			</PageContent>

			{ isLoading ? <Spinner /> : null}
                
			<div className='notifications'>
				{
					toastrList.map( toastr => {
						return (
							<Toastr
								key={toastr.id}
								message={toastr.message}
								type={toastr.type}
								time={toastr.time}
							/>
						);
					})
				}
			</div>

		</AppContext.Provider>		
	);

}

function useAppStates() {
	const appStates = React.useContext(AppContext);
	return appStates;
}

export {
	AppProvider,
	useAppStates,
};