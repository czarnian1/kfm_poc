/*

Active Code : 

*/

import React from 'react';
import { Component } from 'react-dom';

import { browserHistory} from 'react-router';

//This wrapper is used at present as react.js doesn't have nativerendering with accounts-ui-bootstrap

import AccountsUIWrapper from '../components/AccountsUIWrapper.jsx'

export class Logout extends Component {

	constructor(props) {
		super(props);
	}

	componentWillMount () {
        console.log("logout:componentwillmount");
        this.props.dispatch(pushPath('/'));
    }

    render () {
        return null;
    } 
}

export default Logout
