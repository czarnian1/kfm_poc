/*

inactive code - started to refactor after rough POC


*/


import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Productiontasks } from '../../api/productiontasks.js';

import { Productiontask } from '../../ui/components/Productiontask.jsx';


// Tractor in the Chassis area
export class ChassistaskComponent extends Component {
  constructor(props){
    console.log("ChassistaskComponent:constructor ");
    super(props);
  }

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

ChassistaskComponent.propTypes = {
  productiontasks: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    productiontasks: Productiontasks.find({"LOCATIONSTATUS": "1"}).fetch(),
  };
}, ChassistaskComponent);
