/*

local (client) side collection pm_dashboard, which we subscribe to

*/

import { Mongo } from 'meteor/mongo';
 
export const pm_dashboard = new Mongo.Collection('pm_dashboard',{"idGeneration":"MONGO"});
