import React from 'react';
import {Router, Route, browserHistory, IndexRoute, Redirect} from 'react-router'

//Containers
import RootContainer from '../containers/RootContainer.jsx';

//Component
import PanelLogin from '../components/PanelLogin.jsx';
import PanelLoginAccount from '../components/PanelLoginAccount.jsx';
import PanelMain from '../components/PanelMain.jsx'
import PanelComment from '../components/PanelComment.jsx'
import PanelMissingParts from '../components/PanelMissingParts.jsx'
import PanelNotFound from '../components/PanelNotFound.jsx';


//create react-router hierarchy
export const renderRoutes = () => (
	<Router history={browserHistory}>
        <Route path="/Login"  component={ PanelLogin }/>
        <Route path="/LoginAccount"  component={ PanelLoginAccount }/>
        <Redirect from="/" to="/Main" />
		<Route path="/" component={ RootContainer } >
            <Route path="/Main" component={ PanelMain }/>
            <Route path="/Comment" >
                <Route path=":id" component={ PanelComment }/>
            </Route>
            <Route path="/MissingParts" >
                <Route path=":id" component={ PanelMissingParts }/>
            </Route>
            <Route path="*" component={ PanelNotFound } />
        </Route>
    </Router>
);
