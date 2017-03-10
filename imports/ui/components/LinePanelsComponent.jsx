/*

This class is huge - todo componentise it further and use imports

*/


import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Productiontasks } from '../../api/productiontasks.js';

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

export class LinePanelsComponent extends Component {

	constructor(props) {
		super(props);
		console.log("LinePanelsComponent:constructor");
		console.log(props);
	};

     componentWillMount() {
        console.log("LinePanelsComponent:componentWillMount enter");
    };

  componentDidMount() {
    console.log("LinePanelsComponent:componentDidMount enter");
    console.log(Productiontasks);

  };

  ComponentDidUpdate(prevProps, prevState) {
    console.log("ChassisPanel:componentDidUpdate enter");
    
  };

  componentWillReceiveProps() {
    console.log("LinePanelsComponent:componetWillReceiveProps ");
  };

  	render() {
        return (
        	<span>
            <div className="row">
    			<div className="col-md-6">
            		<div className="panel panel-default" id="child-component-render-chassis-panel">
                		<div className="panel-heading"><i className="kubota-KFM_Icons_chassis-icon kubota-fs-48"></i><span className="kubota-fs-32"><T>common.main.chassis_panel</T></span>
                    		<div className="list-group-item">
                        		<span className="badge" id="render-target-badge-count-chassis">{this.props.chassiscount}</span><T>common.panel_table.panel_total</T>
                    		</div>
                		</div>
	            		<div className="panel-body table-responsive">
		                	<table className="table table-striped">
				                <thead>
				                    <tr>
				                        <th><T>common.panel_table.panel_IDNO</T></th>
				                        <th><T>common.panel_table.panel_location</T></th>
				                        <th><T>common.panel_table.panel_description</T></th>
				                        <th><T>common.panel_table.panel_date</T></th>
				                        <th><T>common.panel_table.panel_age</T></th>
				                    </tr>
				                </thead>
				                <tbody>
					              {this.props.chassistasks.map(function(productiontask,i) {
					                //using map on productiontasks prop array returns an object first with values of arrays inside
					                //Object.values not supported in IE or Safari use object.keys

					                return (
					                    <tr key={i}>
					                    {Object.keys(productiontask).map(function(taskrowcol,j) {
					                    //{Object.values(productiontask).map(function(taskrowcol,j) { //not supported yet experimental in browsers
					                      return <td key={j}>{productiontask[taskrowcol]}</td>;
					                    })}
					                    </tr>
					                  );
					              })}
				                </tbody>
		            		</table>
	            		</div>
        			</div>
    			</div>
    			<div className="col-md-6">
        			<div className="panel panel-default" id="child-component-render-chassis-panel">
                		<div className="panel-heading"><i className="kubota-KFM_Icons_paint-icon kubota-fs-48"></i><span className="kubota-fs-32"><T>common.main.paint_panel</T></span>
                			<div className="list-group-item">
                  				<span className="badge" id="render-target-badge-count-paint">{this.props.paintcount}</span><T>common.panel_table.panel_total</T>
                    		</div>
                		</div>
	            		<div className="panel-body table-responsive">
		                	<table className="table table-striped">
				                <thead>
				                    <tr>
				                        <th><T>common.panel_table.panel_IDNO</T></th>
				                        <th><T>common.panel_table.panel_location</T></th>
				                        <th><T>common.panel_table.panel_description</T></th>
				                        <th><T>common.panel_table.panel_date</T></th>
				                        <th><T>common.panel_table.panel_age</T></th>
				                    </tr>
				                </thead>
				                <tbody>
					              {this.props.painttasks.map(function(productiontask,i) {
					                //using map on productiontasks prop array returns an object first with values of arrays inside
					                //Object.values not supported in IE or Safari use object.keys
					               	//TODO - REFACTOR TO USE SELECTIVE FILEDS TO PUSH TO REACT DOM not just use a map cursor to render all			
					                return (
					                    <tr key={i}>
					                    {Object.keys(productiontask).map(function(taskrowcol,j) {
					                    //{Object.values(productiontask).map(function(taskrowcol,j) { //not supported yet experimental in browsers
					                      return <td key={j}>{productiontask[taskrowcol]}</td>;
					                    })}
					                    </tr>
					                  );
					              })}
				                </tbody>
		            		</table>
	            		</div>
        			</div>
    			</div>
			</div>
            <div className="row">
    			<div className="col-md-6">
    				<div className="panel panel-default" id="child-component-render-tractor-panel">
                		<div className="panel-heading"><i className="kubota-KFM_Icons_tractor-icon kubota-fs-48"></i><span className="kubota-fs-32"><T>common.main.tractor_panel</T></span>
                			<div className="list-group-item">
                  				<span className="badge" id="render-target-badge-count-tractor">{this.props.tractorcount}</span><T>common.panel_table.panel_total</T>
                    		</div>
                		</div>
	            		<div className="panel-body table-responsive">
		                	<table className="table table-striped">
				                <thead>
				                    <tr>
				                        <th><T>common.panel_table.panel_IDNO</T></th>
				                        <th><T>common.panel_table.panel_location</T></th>
				                        <th><T>common.panel_table.panel_description</T></th>
				                        <th><T>common.panel_table.panel_date</T></th>
				                        <th><T>common.panel_table.panel_age</T></th>
				                    </tr>
				                </thead>
				                <tbody>
					              {this.props.tractortasks.map(function(productiontask,i) {
					                //using map on productiontasks prop array returns an object first with values of arrays inside
					                //Object.values not supported in IE or Safari use object.keys

					                return (
					                    <tr key={i}>
					                    {Object.keys(productiontask).map(function(taskrowcol,j) {
					                    //{Object.values(productiontask).map(function(taskrowcol,j) { //not supported yet experimental in browsers
					                      return <td key={j}>{productiontask[taskrowcol]}</td>;
					                    })}
					                    </tr>
					                  );
					              })}
				                </tbody>
		            		</table>
	            		</div>
        			</div>
    			</div>
    			<div className="col-md-6">
        			<div className="panel panel-default" id="child-component-render-mqline-panel">
                		<div className="panel-heading"><i className="kubota-KFM_Icons_mqline-icon kubota-fs-48"></i><span className="kubota-fs-32"><T>common.main.mqline_panel</T></span>
                			<div className="list-group-item">
                  				<span className="badge" id="render-target-badge-count-mqline">{this.props.mqlinecount}</span><T>common.panel_table.panel_total</T>
                    		</div>
                		</div>
	            		<div className="panel-body table-responsive">
		                	<table className="table table-striped">
				                <thead>
				                    <tr>
				                        <th><T>common.panel_table.panel_IDNO</T></th>
				                        <th><T>common.panel_table.panel_location</T></th>
				                        <th><T>common.panel_table.panel_description</T></th>
				                        <th><T>common.panel_table.panel_date</T></th>
				                        <th><T>common.panel_table.panel_age</T></th>
				                    </tr>
				                </thead>
				                <tbody>
					              {this.props.mqlinetasks.map(function(productiontask,i) {
					                //using map on productiontasks prop array returns an object first with values of arrays inside
					                //Object.values not supported in IE or Safari use object.keys

					                return (
					                    <tr key={i}>
					                    {Object.keys(productiontask).map(function(taskrowcol,j) {
					                    //{Object.values(productiontask).map(function(taskrowcol,j) { //not supported yet experimental in browsers
					                      return <td key={j}>{productiontask[taskrowcol]}</td>;
					                    })}
					                    </tr>
					                  );
					              })}
				                </tbody>
		            		</table>
	            		</div>
        			</div>
    			</div>
			</div>
            <div className="row">
    			<div className="col-md-6">
    				<div className="panel panel-default" id="child-component-render-tractor-panel">
                		<div className="panel-heading"><i className="kubota-KFM_Icons_rework-icon kubota-fs-48"></i><span className="kubota-fs-32"><T>common.main.rework_panel</T></span>
                			<div className="list-group-item">
                  				<span className="badge" id="render-target-badge-count-rework">{this.props.reworkcount}</span><T>common.panel_table.panel_total</T>
                    		</div>
                		</div>
	            		<div className="panel-body table-responsive">
		                	<table className="table table-striped">
				                <thead>
				                    <tr>
				                        <th><T>common.panel_table.panel_IDNO</T></th>
				                        <th><T>common.panel_table.panel_location</T></th>
				                        <th><T>common.panel_table.panel_description</T></th>
				                        <th><T>common.panel_table.panel_date</T></th>
				                        <th><T>common.panel_table.panel_age</T></th>
				                    </tr>
				                </thead>
				                <tbody>
					              {this.props.reworktasks.map(function(productiontask,i) {
					                //using map on productiontasks prop array returns an object first with values of arrays inside
					                //Object.values not supported in IE or Safari use object.keys

					                return (
					                    <tr key={i}>
					                    {Object.keys(productiontask).map(function(taskrowcol,j) {
					                    //{Object.values(productiontask).map(function(taskrowcol,j) { //not supported yet experimental in browsers
					                      return <td key={j}>{productiontask[taskrowcol]}</td>;
					                    })}
					                    </tr>
					                  );
					              })}
				                </tbody>
		            		</table>
	            		</div>
        			</div>
    			</div>
    			<div className="col-md-6">
        			<div className="panel panel-default" id="child-component-render-shipped-panel">
                		<div className="panel-heading"><i className="kubota-KFM_Icons_shipped-icon kubota-fs-48"></i><span className="kubota-fs-32"><T>common.main.shipped_panel</T></span>
                			<div className="list-group-item">
                  				<span className="badge" id="render-target-badge-count-shipped">{this.props.shippedcount}</span><T>common.panel_table.panel_total</T>
                    		</div>
                		</div>
	            		<div className="panel-body table-responsive">
		                	<table className="table table-striped">
				                <thead>
				                    <tr>
				                        <th><T>common.panel_table.panel_IDNO</T></th>
				                        <th><T>common.panel_table.panel_location</T></th>
				                        <th><T>common.panel_table.panel_description</T></th>
				                        <th><T>common.panel_table.panel_date</T></th>
				                        <th><T>common.panel_table.panel_age</T></th>
				                    </tr>
				                </thead>
				                <tbody>
					              {this.props.shippedtasks.map(function(productiontask,i) {
					                //using map on productiontasks prop array returns an object first with values of arrays inside
					                //Object.values not supported in IE or Safari use object.keys

					                return (
					                    <tr key={i}>
					                    {Object.keys(productiontask).map(function(taskrowcol,j) {
					                    //{Object.values(productiontask).map(function(taskrowcol,j) { //not supported yet experimental in browsers
					                      return <td key={j}>{productiontask[taskrowcol]}</td>;
					                    })}
					                    </tr>
					                  );
					              })}
				                </tbody>
		            		</table>
	            		</div>
        			</div>
    			</div>
			</div>
			</span>
        );
    }
};

LinePanelsComponent.propTypes = {
  chassistasks: PropTypes.array.isRequired,
  chassiscount: PropTypes.number,
  painttasks: PropTypes.array.isRequired,
  paintcount: PropTypes.number,
  mqlinetasks: PropTypes.array.isRequired,
  mqlinecount: PropTypes.number,
  tractortasks: PropTypes.array.isRequired,
  tractorcount: PropTypes.number,
  shippedtasks: PropTypes.array.isRequired,
  shippedcount: PropTypes.number,
};


import { Session } from 'meteor/session'

export default LinePanelsComponent = createContainer(() => {
  Session.setDefault("filterENDREGION", {$in:[]})
  
  return {

  	//to do componentise all these - refactor to make the app more modular
  	//seprate out this huge component into smaller sub components and containser for react-meteor-data
  	//Also this is crude - based on JSON textstrings coming from sync and simply filtering by LOCATIONSTATUS
  	//refactor in future
      
    chassistasks: Productiontasks.find({"LOCATIONSTATUS": "1", "ENDREGION":Session.get("filterENDREGION") }).fetch(),
    painttasks: Productiontasks.find({"LOCATIONSTATUS": "2", "ENDREGION":Session.get("filterENDREGION") }).fetch(),
    tractortasks: Productiontasks.find({"LOCATIONSTATUS": "3", "ENDREGION":Session.get("filterENDREGION") }).fetch(),
    mqlinetasks: Productiontasks.find({"LOCATIONSTATUS": "4", "ENDREGION":Session.get("filterENDREGION") }).fetch(),
    reworktasks: Productiontasks.find({"LOCATIONSTATUS": "5", "ENDREGION":Session.get("filterENDREGION") }).fetch(),
    shippedtasks: Productiontasks.find({"LOCATIONSTATUS": "6", "ENDREGION":Session.get("filterENDREGION") }).fetch(),
    chassiscount: Productiontasks.find({"LOCATIONSTATUS": "1", "ENDREGION":Session.get("filterENDREGION") }).count(),
    paintcount: Productiontasks.find({"LOCATIONSTATUS": "2", "ENDREGION":Session.get("filterENDREGION") }).count(),
    tractorcount: Productiontasks.find({"LOCATIONSTATUS": "3", "ENDREGION":Session.get("filterENDREGION") }).count(),
    mqlinecount: Productiontasks.find({"LOCATIONSTATUS": "4", "ENDREGION":Session.get("filterENDREGION") }).count(),
    reworkcount: Productiontasks.find({"LOCATIONSTATUS": "5", "ENDREGION":Session.get("filterENDREGION") }).count(),
    shippedcount: Productiontasks.find({"LOCATIONSTATUS": "6", "ENDREGION":Session.get("filterENDREGION") }).count(),
  };
}, LinePanelsComponent);
