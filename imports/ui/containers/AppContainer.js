import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import AccountsUIWrapper from '../AccountsUIWrapper.jsx';

const App = (props) => (
	<div className="col-md-10" id="render-main-application">
			<div className="navbar navbar-default" role="navigation">
    <div className="navbar-header">
        <a className="navbar-brand" href="#">Project name</a>
        <button type="button" clasName="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
        </button>
    </div>
    <div className="navbar-collapse collapse">
        <ul className="nav navbar-nav">
            <li className="active"><a href="#">Link</a></li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
            <AccountsUIWrapper />
        </ul>
    </div>
</div>
		</div>

);

export default AppContainer = createContainer(props => {
	//incoming props.main from router, return the currnt user back to see if logged in
	//console.log("AppContainer");
	//console.log(App);
	return {
		user: Meteor.user(),
	};

},App);