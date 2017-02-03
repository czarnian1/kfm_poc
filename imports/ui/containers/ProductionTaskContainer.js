import { Meteor } from 'meteor/meteor';
import { Productiontasks } from '../../api/lists/lists.js';
import { createContainer } from 'meteor/react-meteor-data';
import ProductionTask from '../pages/ListPage.js';

//ongoing broken....#

export default ProductionTaskContainer = createContainer(({ params }) => {
  const { id } = params;
  const productionTasksHandle = Meteor.subscribe('productiontasks', id);
  const loading = !productionTasksHandle.ready();
  const productiontask = Productiontasks.findOne(id);
  const productionTasksExists = !loading && !!list;
  return {
    loading,
    productiontask,
    productionTasksExists,
    todos: listExists ? productiontask.fetch() : [],
  };
}, ListPage);