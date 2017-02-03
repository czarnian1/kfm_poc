import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Productiontasks } from '../../api/productiontasks.js';

import Productiontask from '../../ui/classes/Productiontask.jsx';


// App component - represents the whole app
class Chassistask extends Component {

  renderTasks() {
    return this.props.productiontasks.map((productiontask) => (
      <Productiontask key={productiontask._id} productiontask={productiontask} />
    ));
  };

  render(){
    return (
        <ul>
          {this.renderTasks()}
        </ul>
    );
  }
}

Chassistask.propTypes = {
  productiontasks: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    productiontasks: Productiontasks.find({"LOCATIONSTATUS": "1"}).fetch(),
  };
}, Chassistask);
