import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Meteor.startup(() => {
 	// code to run on server at startup

 
	export const Productiontasks = new Mongo.Collection('productiontasks');

	//console.log(Meteor);

	if (Meteor.isServer) {
		console.log("serve/main.js publish the production tasks for clients");
		Meteor.publish('productiontasks', function productiontasksPublication() {
			return Productiontasks.find();
		});

	} else
	{
		//techinically this willnever be called as the file location limits to server code only
		console.log("server/main.js not server");
	}
});
