/*

local (client) side collection prod_monitor_comment, which we subscribe to

*/

import { Mongo } from 'meteor/mongo';
 
export const prod_monitor_comment = new Mongo.Collection('prod_monitor_comment',{"idGeneration":"MONGO"});
