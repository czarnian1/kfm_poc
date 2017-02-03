/*

Active Code : 

*/

import React, {Component, PropType} from 'react';

import {createContainer} from 'meteor/react-meteor-data';

class Dashboard extends Component {

	constructor(props) {
		super(props);
		console.log("wwww");
	}

	render() {

		<h3>dashboard</h3>
	}
}

export default createContainer(() => {
	return {
    	usercount: Meteor.user.find().count(),
  };
}, Dashboard);
