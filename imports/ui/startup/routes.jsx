import React from 'react';
import {Router, Route, browserHistory, IndexRoute, Redirect} from 'react-router'

//Containers
import RootContainer from '../containers/RootContainer.jsx';

//Component
import PanelLogin from '../components/PanelLogin.jsx';
import PanelMain from '../components/PanelMain.jsx'
import PanelComment from '../components/PanelComment.jsx'
import PanelNotFound from '../components/PanelNotFound.jsx';


//create react-router hierarchy
export const renderRoutes = () => (
	<Router history={browserHistory}>
        <Route path="/login"  component={ PanelLogin }/>
        <Redirect from="/" to="/Main" />
		<Route path="/" component={ RootContainer } >
            <Route path="/Main" component={ PanelMain }/>
            <Route path="/Comment" >
                <Route path=":id" component={ PanelComment }/>
            </Route>
            <Route path="*" component={ PanelNotFound } />
        </Route>
    </Router>
);

//          <Redirect from="/" to="/Main" />
//            <IndexRoute component={ PanelMain }/>
