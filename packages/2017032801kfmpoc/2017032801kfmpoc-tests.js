// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by 2017032801kfmpoc.js.
import { name as packageName } from "meteor/2017032801kfmpoc";

// Write your tests here!
// Here is an example.
Tinytest.add('2017032801kfmpoc - example', function (test) {
  test.equal(packageName, "2017032801kfmpoc");
});
