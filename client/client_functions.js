import {Router, Route, browserHistory, IndexRoute} from 'react-router'

console.log("client functions");

Tracker.autorun(function(c) {
	var userId = Meteor.userId();
	if (c.firstRun)
		return;
	if (userId) {
		console.log(" redirecting to dashboard");
		//redirect to dashboard
		browserHistory.push('/Main');
	} else
	{
		//redirect to login
		console.log(" redirecting to login");
		browserHistory.push('/Login');
	}
	console.log(userId ? "login" : "logout");
});
