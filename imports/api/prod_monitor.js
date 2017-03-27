/*

local (client) side collection prod_monitor, which we subscribe to

*/

import { Mongo } from 'meteor/mongo';
 
export const prod_monitor = new Mongo.Collection('prod_monitor',{"idGeneration":"MONGO"});
