/*

Active Code : 

*/

import React from 'react';
import {Router, Route, browserHistory, IndexRoute} from 'react-router'

import { AppLayout } from '../layouts/App.jsx';

import { AppComponent } from '../components/AppComponent.jsx';
import { Index } from '../components/Index.jsx';

//do not use curly brackets on ChassisPanelComponet - relay on the default export of the container in this file or no render() called of props.children
import  ChassisPanelComponent  from '../components/Chassispanel.jsx';

import { NotFound } from '../components/not-found.jsx';
import { Login } from '../components/login.jsx';

const requireAuth = (nextState, replace) => {
	
  	if (!Meteor.loggingIn() && !Meteor.userId()) {
	console.log("requireAuth");
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

//create react-router hierarchy
export const renderRoutes = () => (
	<Router history={browserHistory}>
		<Route path="/" component={ AppComponent }>
        	<IndexRoute component={ Index } />
        	<Route path="/dashboard" component={ ChassisPanelComponent } onEnter={ requireAuth }/>
        	<Route path="/login" component={ Login} />
      	</Route>
      	<Route path="*" component={ NotFound } />
    </Router>
);
