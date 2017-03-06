/*

Active Code : 

*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//import { browserHistory} from 'react-router';

//This wrapper is used at present as react.js doesn't have nativerendering with accounts-ui-bootstrap

//import AccountsUIWrapper from '../components/AccountsUIWrapper.jsx'


class LogoutComponent extends Component {
    componentWillMount () {
        console.log("logout:componentwillmount");
        var ttt=Meteor.userId();
        Meteor.logout();
        this.props.dispatch(pushPath('/login'));
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname },
          });

    }

    render () {
        return null;
    } 
}

export const Logout = ( ) => (
  <div>
    <LogoutComponent />
  </div>
);
  
