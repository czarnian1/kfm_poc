import React from 'react';
import {Router, Route, browserHistory, IndexRoute, Redirect} from 'react-router'

//Containers
import RootContainer from '../containers/RootContainer.jsx';

//Component
import PanelLogin from '../components/PanelLogin.jsx';
import PanelManageAccount from '../components/PanelManageAccount.jsx';
import PanelMain from '../components/PanelMain.jsx'
import PanelScreen from '../components/PanelScreen.jsx'
import PanelDashboard from '../components/PanelDashboard.jsx'
import PanelComments from '../components/PanelComments.jsx'
import PanelMissingParts from '../components/PanelMissingParts.jsx'
import PanelNotFound from '../components/PanelNotFound.jsx';
import PanelManageUsers from '../components/PanelManageUsers.jsx';
import FactoryDash from '../components/FactoryDash.jsx';

//create react-router hierarchy
export const renderRoutes = () => (
	<Router history={browserHistory}>
        <Route path="/Login"  component={PanelLogin}/>
        <Redirect from="/" to="/Main" />
		<Route path="/" component={RootContainer} >
        	<Route path="/Main" component={PanelMain}/>
			/* MSJ : Samsung screen browser default */
			/* See the logic in client/client_functions.js */
            <Route path="/Screen" component={PanelScreen}/>
			<Route path="/Dashboard" component={PanelDashboard}/>
        	<Route path="/FactoryDash" component={FactoryDash}/>
        	<Route path="/ManageUsers"  component={PanelManageUsers}/>
        	<Route path="/ManageAccount" component={PanelManageAccount}/>
/*      
 			<Route path="/ManageAccount">
        		<Route path=":id" component={PanelManageAccount}/>
        	</Route>
*/        
        	<Route path="/Comments" >
        		<Route path=":id" component={PanelComments}/>
        	</Route>
            <Route path="/MissingParts" >
               	<Route path=":id" component={PanelMissingParts}/>
            </Route>
            <Route path="*" component={PanelNotFound} />
        </Route>
    </Router>
);
