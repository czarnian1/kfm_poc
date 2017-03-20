/*

local (client) side collection Productiontask_notes, which we subscribe to

*/

import { Mongo } from 'meteor/mongo';
 
export const Productiontask_notes = new Mongo.Collection('productiontask_notes');
