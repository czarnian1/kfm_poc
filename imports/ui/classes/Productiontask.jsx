import React, { Component, PropTypes } from 'react';
     
    // Production Task component - represents a single tractor item
    export default class Productiontask extends Component {
      render() {
        return (
	  <tr>
		<td>{this.props.productiontask._id}</td>
		<td>{this.props.productiontask.LOCATIONSTATUS}</td>
		<td>{this.props.productiontask.DESCRIPTION}</td>
    <td>{this.props.productiontask.PRODDEFAULTS}</td>
    <td>{this.props.productiontask.CHASSIS}</td>
    <td>{this.props.productiontask.CHASSISDATETIME}</td>
    <td>{this.props.productiontask.PAINTDATETIME}</td>
    <td>{this.props.productiontask.MQLINEDATETIME}</td>
    <td>{this.props.productiontask.REWORKDATETIME}</td>
    <td>{this.props.productiontask.CHASSISNO}</td>
    <td>{this.props.productiontask.SHIPPEDDATETIME}</td>
	  </tr>
        );
      }
    }
     
    Productiontask.propTypes = {
      // This component gets the task to display through a React prop.
      // We can use propTypes to indicate it is required
      productiontask: PropTypes.object.isRequired,
    };

