/*

Active Code : 

*/

import React from 'react';
import {Router, Route, browserHistory, IndexRoute, Redirect} from 'react-router'
import { AppComponent } from '../components/AppComponent.jsx';

//do not use curly brackets on ChassisPanelComponet - relay on the default export of the container in this file or no render() called of props.children
import  ChassisPanelComponent  from '../components/Chassispanel.jsx';

import { NotFound } from '../components/not-found.jsx';
import { LoginComponent } from '../components/LoginComponent.jsx';

const authDashboard = (nextState, replace) => {
    var ttt;
    ttt=Meteor.loggingIn();
    ttt=Meteor.userId();

    if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

const authLogin = (nextState, replace) => {
    var ttt;
    ttt=Meteor.loggingIn();
    ttt=Meteor.userId();

    if (Meteor.loggingIn() || Meteor.userId()) {
      replace({
        pathname: '/dashboard',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  };


const logout = (nextState, replace) => {
    var ttt;
    ttt=Meteor.loggingIn();
    ttt=Meteor.userId();

    Meteor.logout(
        function(e){
            if(e) {
                console.log(e);
            }
            else {
                replace(
                    {
                      pathname: '/login',
                      state: { nextPathname: nextState.location.pathname },
                    }
                );
            } 
        }
    );

    ttt=Meteor.loggingIn();
    ttt=Meteor.userId();
/*
    replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname },
    });
*/
};

//create react-router hierarchy
export const renderRoutes = () => (
	<Router history={browserHistory}>
        <Redirect from="/" to="/dashboard" />
		<Route path="/" component={ AppComponent } >
        	<Route path="/dashboard" component={ ChassisPanelComponent } onEnter={ authDashboard }/>
        	<Route path="/login"  component={ LoginComponent } onEnter={ authLogin }/>
            <Route path="/logout" onEnter={ logout } />
      	</Route>
      	<Route path="*" component={ NotFound } />
    </Router>
);
