import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Meteor.startup(() => {
 	// code to run on server at startup

	export const prod_monitor = new Mongo.Collection('prod_monitor',{"idGeneration":"MONGO"});
	export const Productiontask_notes = new Mongo.Collection('productiontask_notes',{"idGeneration":"MONGO"});
	export const prod_monitor_comment = new Mongo.Collection('prod_monitor_comment',{"idGeneration":"MONGO"});
	export const prod_monitor_parts = new Mongo.Collection('prod_monitor_parts',{"idGeneration":"MONGO"});

	import { EmailNotification } from './EmailNotification.jsx';

	if (Meteor.isServer) {
		console.log("serve/main.js publish the production tasks for clients");
		Meteor.publish('prod_monitor', function() {
			return prod_monitor.find();
		});
		Meteor.publish('productiontask_notes', function() {
			return Productiontask_notes.find();
		});
		Meteor.publish('prod_monitor_comment', function() {
			return prod_monitor_comment.find();
		});
		Meteor.publish('prod_monitor_parts', function() {
			return prod_monitor_parts.find();
		});

		/*
		 * Email notification
		 */
		Meteor.setInterval(function(){EmailNotification(prod_monitor)}, 60000);

		/*
		 * Prepare to manage login account
		 */
		import { updateLoginAccount } from './LoginAccount.jsx';
 
		Meteor.methods(
			{ updateLoginAccount: (argv)=>{return updateLoginAccount(argv);} }
		);
		
	} else
	{
		//techinically this willnever be called as the file location limits to server code only
		console.log("server/main.js not server");
	}
});
