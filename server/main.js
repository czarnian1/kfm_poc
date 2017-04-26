import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
 	// code to run on server at startup

	
	
	Oracle.setDefaultOracleOptions({
		connection:
			{user: "testuser1",
			password: "testuser1",
			connectString : "localhost:1521/xe"},
			sqlDebug: true,
			strict: true,
//			strictAllowOplogAndTriggers: true
	});
	
	export const PROD_MONITOR = new Oracle.Collection('PROD_MONITOR');
	export const PROD_MONITOR_COMMENT = new Oracle.Collection('PROD_MONITOR_COMMENT');

	
	//console.log(Meteor);

	if (Meteor.isServer) {


		Oracle.setDefaultOracleOptions({
			connection:
				{user: "testuser1",
				password: "testuser1",
				connectString : "localhost:1521/xe"},
				sqlDebug: true,
				strict: true,
//				strictAllowOplogAndTriggers: true
		});
		
		Meteor.publish('PROD_MONITOR', function() {
			return PROD_MONITOR.find();
		});
		Meteor.publish('PROD_MONITOR_COMMENT', function() {
			return PROD_MONITOR_COMMENT.find();
		});
	} else
	{
		//techinically this willnever be called as the file location limits to server code only
		console.log("server/main.js not server");
	}
});
