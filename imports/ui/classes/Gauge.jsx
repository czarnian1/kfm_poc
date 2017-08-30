import React from 'react';
import ReactDOM from 'react-dom';
import {Doughnut} from 'react-chartjs-2';
 
export default class Pie extends React.Component {
   constructor () {
        super();
	console.log("constructor");
	//console.log(this.props);
   };


  render() {
    console.log("render"); 
    var data = {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
      series: [
        [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
      ]
    };
 
    var options = {
      high: 10,
      low: -10,
      axisX: {
        labelInterpolationFnc: function(value, index) {
          return index % 2 === 0 ? value : null;
        }
      }
    };
 
    var type = 'Bar'
 
    //return (
    //  <div>
    //    <ChartistGraph data={data} options={options} type={type} />
    //  </div>
    //)
    return (
	<Doughnut data={data} />
    )
  }
}


