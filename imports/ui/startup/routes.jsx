/*

Active Code : 

*/

import React from 'react';
import {Router, Route, browserHistory, IndexRoute, Redirect} from 'react-router'


//Containers
import RootContainer from '../containers/RootContainer.jsx';

//Component
import LoginComponent from '../components/LoginComponent.jsx';
import NotFoundComponent from '../components/NotFoundComponent.jsx';
import DashboardComponent from '../components/DashboardComponent.jsx'

//do not use curly brackets on ChassisPanelComponet - relay on the default export of the container in this file or no render() called of props.children



//create react-router hierarchy
export const renderRoutes = () => (
	<Router history={browserHistory}>
        <Route path="login"  component={ LoginComponent }/>
        <Redirect from="/" to="/dashboard" />
		<Route path="/" component={ RootContainer } >
        	<Route path="dashboard" component={ DashboardComponent }/>
      	</Route>
      	<Route path="*" component={ NotFoundComponent } />
    </Router>
);
