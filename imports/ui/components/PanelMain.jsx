import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';

import { prod_monitor } from '../../api/prod_monitor.js';
import { prod_monitor_comment } from '../../api/prod_monitor_comment.js';
import { prod_monitor_parts } from '../../api/prod_monitor_parts.js';

import CF from '../classes/CommonFunctions.jsx';
const cf=new CF();

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

export class PanelMain extends Component {
    
    updateDisplay(){
        if(this.props.products == undefined)    return;
        if(this.props.products <= 0)    return;
        
        this.props.products.map((p)=>{
           var r=cf.productStatus(p);

           // Comment
           var c=prod_monitor_comment.find({"ID_NO":p.ID_NO.trim()}).count();
           console.log('prod_monitor_comment rows count='+c);
           $("#"+p.ID_NO.trim()+" .classComment").html(0 < c ? '<span class="glyphicon glyphicon-exclamation-sign text-warning" />':'<span class="glyphicon glyphicon-ok text-success" />');
           
           // Tractor Status MSJ added ready for FSM even if !r.isOngoing
           if(!r.error) $("#"+p.ID_NO.trim()+" .classTractorStatus").html(r.isOnGoing ? '<i class="kubota-fs-32 '+cf.locationIcon(p.LOCATIONSTATUS)+'"></i>'+i18n.__(cf.locationTitle(p.LOCATIONSTATUS)):'<i class="kubota-fs-32 '+cf.locationIcon(p.LOCATIONSTATUS)+'"></i>'+i18n.__(cf.locationTitle(p.LOCATIONSTATUS)));
           
           // Missing parts
           var mp=prod_monitor_parts.find({"ID_NO":p.ID_NO.trim()}).count();
           console.log('prod_monitor_parts rows count='+c);
           $("#"+p.ID_NO.trim()+" .classMissingParts").html(0 < mp ? '<span class="glyphicon glyphicon-exclamation-sign text-warning" />':'<span class="glyphicon glyphicon-ok text-success" />');
           
           // SHIPPING_STATUS
           $("#"+p.ID_NO.trim()+" .classShippingStatus").html(i18n.__(r.shippingStatus));
           
           // Row's color
           //
           //if(!r.error) $("#"+p.ID_NO.trim()).css('background-color',r[p.LOCATIONSTATUS].thresholdColor);
           if(r[p.LOCATIONSTATUS].thresholdClassName) {
               $("#"+p.ID_NO.trim())[0].className = r[p.LOCATIONSTATUS].thresholdClassName;
           } else {
               console.log("no need to toggle class");
           }
        });
    }
        
    render() {
        return (
                <div className="container-fluid table-responsive">
                    <table className="table table-bordered table-responsive">
                        <thead>
                            <tr>
                                <th rowSpan={2}><center><T>ui.common.MonthlySequenceno</T></center></th>
                                <th rowSpan={2}><center><T>ui.common.IdNo</T></center></th>
                                <th rowSpan={2}><center><T>ui.common.ModelCode</T></center></th>
                                <th rowSpan={2}><center><T>ui.common.ModelDescription</T></center></th>
                                <th rowSpan={2}><center><T>ui.common.PlannedFinish</T></center></th>
                                <th rowSpan={2}><center><T>ui.common.Comment</T></center></th>
                                <th rowSpan={2}><center><T>ui.common.TractorStatus</T></center></th>
                                <th rowSpan={2}><center><T>ui.common.MissingParts</T></center></th>
                                <th colSpan={2}><center><T>ui.common.ChassisLine</T></center></th>
                                <th colSpan={2}><center><T>ui.common.PaintLine</T></center></th>
                                <th colSpan={2}><center><T>ui.common.TractorLine</T></center></th>
                                <th colSpan={2}><center><T>ui.common.ReworkBeforeMQ</T></center></th>
                                <th colSpan={2}><center><T>ui.common.MQLine</T></center></th>
                                <th colSpan={2}><center><T>ui.common.ReworkAfterMQ</T></center></th>
                                <th rowSpan={2}><center><T>ui.common.ProductionCompletion</T></center></th>
                                <th colSpan={2}><center><T>ui.common.Inspection</T></center></th>
                                <th colSpan={2}><center><T>ui.common.ReworkDuringInspection</T></center></th>
                                <th><center><T>ui.common.ShippingStatus</T></center></th>
                                <th rowSpan={2}><center><T>ui.common.Shipping</T></center></th>
                            </tr>
                            <tr>
                                <th><center><T>ui.common.Start</T></center></th>
                                <th><center><T>ui.common.End</T></center></th>
                                <th><center><T>ui.common.Start</T></center></th>
                                <th><center><T>ui.common.End</T></center></th>
                                <th><center><T>ui.common.Start</T></center></th>
                                <th><center><T>ui.common.End</T></center></th>
                                <th><center><T>ui.common.Start</T></center></th>
                                <th><center><T>ui.common.End</T></center></th>
                                <th><center><T>ui.common.Start</T></center></th>
                                <th><center><T>ui.common.End</T></center></th>
                                <th><center><T>ui.common.Start</T></center></th>
                                <th><center><T>ui.common.End</T></center></th>
                                <th><center><T>ui.common.Start</T></center></th>
                                <th><center><T>ui.common.End</T></center></th>
                                <th><center><T>ui.common.Start</T></center></th>
                                <th><center><T>ui.common.End</T></center></th>
                                <th><center></center></th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.props.products.map(function(p) {
                                return (
                                    <tr id={p.ID_NO.trim()}>
                                        <td>{cf.formatString(p.MONTHLY_SEQ)}</td>
                                        <td><Link to={"/Comment/"+p.ID_NO.trim()}>{cf.formatString(p.ID_NO.trim())}</Link></td>
                                        <td>{cf.formatString(p.MODEL_CODE)}</td>
                                        <td>{cf.formatString(p.REMARKS)}</td>
                                        <td>{cf.formatDateTime(p.PLAN_PROD_FINISH_DATE)}</td>
                                        <td><Link to={"/Comment/"+p.ID_NO.trim()}><center className="classComment"></center></Link></td>
                                        <td className="classTractorStatus"></td>
                                        <td><Link to={"/MissingParts/"+p.ID_NO.trim()}><center className="classMissingParts"></center></Link></td>
                                        <td>{cf.formatDateTime(p.CHASSIS_LINE_START_DATE)}</td>
                                        <td>{cf.formatDateTime(p.CHASSIS_LINE_END_DATE)}</td>
                                        <td>{cf.formatDateTime(p.PAINT_LINE_START_DATE)}</td>
                                        <td>{cf.formatDateTime(p.PAINT_LINE_END_DATE)}</td>
                                        <td>{cf.formatDateTime(p.TRACTOR_LINE_START_DATE)}</td>
                                        <td>{cf.formatDateTime(p.TRACTOR_LINE_END_DATE)}</td>
                                        <td>{cf.formatDateTime(p.REWORK_BEFORE_MQ_START_DATE)}</td>
                                        <td>{cf.formatDateTime(p.REWORK_BEFORE_MQ_END_DATE)}</td>
                                        <td>{cf.formatDateTime(p.MQ_LINE_START_DATE)}</td>
                                        <td>{cf.formatDateTime(p.MQ_LINE_END_DATE)}</td>
                                        <td>{cf.formatDateTime(p.REWORK_AFTER_MQ_START_DATE)}</td>
                                        <td>{cf.formatDateTime(p.REWORK_AFTER_MQ_END_DATE)}</td>
                                        <td>{cf.formatDateTime(p.PRODUCTION_END_DATE)}</td>
                                        <td>{cf.formatDateTime(p.INSPECTION_START_DATE)}</td>
                                        <td>{cf.formatDateTime(p.INSPECTION_END_DATE)}</td>
                                        <td>{cf.formatDateTime(p.REWORK_DUR_INSP_START_DATE)}</td>
                                        <td>{cf.formatDateTime(p.REWORK_DUR_INSP_END_DATE)}</td>
                                        <td className="classShippingStatus"></td>
                                        <td>{cf.formatDateTime(p.SHIPPING_DATE)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
        );
    }

    componentDidMount() {
        console.log("PanelMain:componentDidMount");
        // Set timer to update the displayed values.
        this.setState({
            'timerId': Meteor.setInterval(
                ()=>{
                    this.updateDisplay();
                }, 
                60000
            )
        });
    }
    
    componentDidUpdate() {
        console.log("PanelMain:componentDidUpdate");
        this.updateDisplay();
    }

    componentWillUnmount() {
        console.log("PanelMain:componentWillUnmount");
        if(this.state!=undefined && this.state.timerId!=undefined && this.state.timerId!=null)   Meteor.clearInterval(this.state.timerId);
    }
};



import { Session } from 'meteor/session'

export default PanelMain = createContainer(() => {
    console.log("PanelMain:createContainer");
    Session.setDefault("productionStatus", {"$gte" : new Date(1)} );
    
    return {
        products: prod_monitor.find({$or: [ {"CREATE_DATE":Session.get("productionStatus")} , {"UPDATE_DATE":Session.get("productionStatus")} ]}).fetch(),
    };
}, PanelMain);

