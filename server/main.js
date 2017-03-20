import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Meteor.startup(() => {
 	// code to run on server at startup

	export const Productiontasks = new Mongo.Collection('productiontasks');
	export const Productiontask_notes = new Mongo.Collection('productiontask_notes');

	//console.log(Meteor);

	if (Meteor.isServer) {
		console.log("serve/main.js publish the production tasks for clients");
		Meteor.publish('productiontasks', function() {
			return Productiontasks.find();
		});
		Meteor.publish('productiontask_notes', function() {
			return Productiontask_notes.find();
		});

	} else
	{
		//techinically this willnever be called as the file location limits to server code only
		console.log("server/main.js not server");
	}
});
