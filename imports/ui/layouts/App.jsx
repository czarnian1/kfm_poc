import React from 'react';
import { NavbarComponent } from '../../ui/components/NavbarComponent.jsx';
import { createContainer } from 'meteor/react-meteor-data';

//import AccountsUIWrapper from '../components/AccountsUIWrapper.jsx';

export const AppLayout = ( {children } ) => (
	<div className="col-md-10" id="app-render">
        <NavbarComponent />
		{ children }
	</div>

)
