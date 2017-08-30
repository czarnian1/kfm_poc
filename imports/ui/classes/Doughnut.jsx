import React from 'react';
import {Doughnut} from 'react-chartjs-2';

//180 gauge limit to half circle
const options = {
		rotation: 1 * Math.PI,
		circumference: 1 * Math.PI
};

export default class DoughnutGraph extends React.Component{
  constructor(props) {
	super(props);
  };

  render() {
    return (
      	<div>
          <Doughnut data={this.props.gauge_data} options={options}/>
        </div>
    );
  }
}
