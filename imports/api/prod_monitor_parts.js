/*

local (client) side collection prod_monitor_parts, which we subscribe to

*/

import { Mongo } from 'meteor/mongo';
 
export const prod_monitor_parts = new Mongo.Collection('prod_monitor_parts',{"idGeneration":"MONGO"});
