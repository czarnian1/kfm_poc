/*

local (client) side collection Productiontasks, which we subscribe to

*/

import { Mongo } from 'meteor/mongo';
 
export const Productiontasks = new Mongo.Collection('productiontasks');
