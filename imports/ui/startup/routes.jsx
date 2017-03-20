import React from 'react';
import {Router, Route, browserHistory, IndexRoute, Redirect} from 'react-router'

//Containers
import RootContainer from '../containers/RootContainer.jsx';

//Component
import LoginComponent from '../components/LoginComponent.jsx';
import DashboardComponent from '../components/DashboardComponent.jsx'
import ProductiontaskComponent from '../components/ProductiontaskComponent.jsx'
import NotFoundComponent from '../components/NotFoundComponent.jsx';


//create react-router hierarchy
export const renderRoutes = () => (
	<Router history={browserHistory}>
        <Route path="login"  component={ LoginComponent }/>
        <Redirect from="/" to="/dashboard" />
		<Route path="/" component={ RootContainer } >
            <Route path="dashboard" component={ DashboardComponent }/>
            <Route path="productiontask" >
                <Route path=":id" component={ ProductiontaskComponent }/>
            </Route>
        </Route>
      	<Route path="*" component={ NotFoundComponent } />
    </Router>
);
