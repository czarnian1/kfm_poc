import {Router, Route, browserHistory, IndexRoute} from 'react-router'
//
//meteor add faisalman:ua-parser-js or
//meteor npm install --save user-agent-parser
var parse = require('user-agent-parser');
console.log(parse(navigator.userAgent).os.name);

Tracker.autorun(function(c) {
	var userId = Meteor.userId();
	console.log(parse(navigator.userAgent).browser);
	 if((parse(navigator.userAgent).os.name == "Linux"))
        {
           console.log("detect Samsung");
           let username = "samsung";
		let password = "s1ms5ng";
        	Meteor.loginWithPassword(username, password, (err) => {
            		if(err){
                		this.setState({
                	 		error: err.reason
                		});
            		} else
			{
                		browserHistory.push('/Screen');
            		}
			});
        }

	if (c.firstRun) {
          console.log("first run");
          return
        }
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
