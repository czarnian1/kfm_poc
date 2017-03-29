import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';

import { prod_monitor } from '../../api/prod_monitor.js';
import { prod_monitor_comment } from '../../api/prod_monitor_comment.js';

import CF from '../classes/CommonFunctions.jsx';
const cf=new CF();

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

export class PanelMain extends Component {
    updateDisplay(){
        if(this.props.products == undefined)    return;
        if(this.props.products <= 0)    return;
        
        this.props.products.map((p)=>{
           var r=cf.productStatus(p);
           // Tractor Status MSJ added ready for FSM even if !r.isOngoing
           if(!r.error) $("#"+p.ID_NO.trim()+" .classTractorStatus").html(r.isOnGoing ? '<i class="kubota-fs-32 '+cf.stageIcon(r.stage)+'"></i>'+i18n.__(cf.stageTitle(r.stage)):'<i class="kubota-fs-32 '+cf.stageIcon(r.stage)+'"></i>'+i18n.__(cf.stageTitle(r.stage)));
           
           // Comment
           var c=prod_monitor_comment.find({"ID_NO":p.ID_NO.trim()}).count();
           //$("#"+p.ID_NO.trim()+" .classComment").html(0 < c ? '<span class="glyphicon glyphicon-exclamation-sign" />':'<span class="glyphicon glyphicon-ok" />');
           $("#"+p.ID_NO.trim()+" .classComment").html(0 < c ? '<span class="glyphicon glyphicon-exclamation-sign" />':'');
           
           // SHIPPING_STATUS
           $("#"+p.ID_NO.trim()+" .classShippingStatus").html(r.shippingStatus);
           
           // Row's color
           //
           //if(!r.error) $("#"+p.ID_NO.trim()).css('background-color',r[r.stage].thresholdColor);
           if(r[r.stage].className) {
		$("#"+p.ID_NO.trim())[0].className = r[r.stage].className;
		} else {
		console.log("no need to toggle class");
	   }
        });
    }
        
    render() {
        var formatDateTime=function(d){
            var r="";
            
            if(d==undefined)    return "";
            if(!(d instanceof Date))    return "";

            r =       ('0'+d.getDate()).slice( -2 );
            r+= '/' + ('0'+(d.getMonth()+1)).slice( -2 );
            r+= '/' + d.getFullYear();
            r+= ' ' + ('0'+d.getHours()).slice( -2 );
            r+= ':' + ('0'+d.getMinutes()).slice( -2 );

            return r;
        }

        var formatString=function(s){
            if(s==undefined)    return "";

            return s.toString();
        }

        return (
                <div className="container-fluid">
                    <table className="table table-bordered table-responsive">
                        <thead>
                            <tr>
                                <th rowSpan={2}><T>common.main.monthlysequenceno</T></th>
                                <th rowSpan={2}><T>common.main.idno</T></th>
                                <th rowSpan={2}><T>common.main.modelcode</T></th>
                                <th rowSpan={2}><T>common.main.modeldescription</T></th>
                                <th rowSpan={2}><T>common.main.plannedfinish</T></th>
                                <th rowSpan={2}><T>common.main.comment</T></th>
                                <th rowSpan={2}><T>common.main.tractorstatus</T></th>
                                <th rowSpan={2}><T>common.main.missingpparts</T></th>
                                <th colSpan={2}><center><T>common.main.chassisline</T></center></th>
                                <th colSpan={2}><center><T>common.main.paintline</T></center></th>
                                <th colSpan={2}><center><T>common.main.tractorline</T></center></th>
                                <th colSpan={2}><center><T>common.main.mqline</T></center></th>
                                <th colSpan={2}><center><T>common.main.rework</T></center></th>
                                <th rowSpan={2}><T>common.main.productioncompletion</T></th>
                                <th colSpan={2}><center><T>common.main.inspection</T></center></th>
                                <th><T>common.main.shippingstatus</T></th>
                                <th rowSpan={2}><T>common.main.shipping</T></th>
                            </tr>
                            <tr>
                                <th><center><T>common.main.start</T></center></th>
                                <th><center><T>common.main.end</T></center></th>
                                <th><center><T>common.main.start</T></center></th>
                                <th><center><T>common.main.end</T></center></th>
                                <th><center><T>common.main.start</T></center></th>
                                <th><center><T>common.main.end</T></center></th>
                                <th><center><T>common.main.start</T></center></th>
                                <th><center><T>common.main.end</T></center></th>
                                <th><center><T>common.main.start</T></center></th>
                                <th><center><T>common.main.end</T></center></th>
                                <th><center><T>common.main.start</T></center></th>
                                <th><center><T>common.main.end</T></center></th>
                                <th><center></center></th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.props.products.map(function(p) {
                                return (
                                    <tr id={p.ID_NO.trim()}>
                                        <td>{formatString(p.TTTT)}PROD_INFO</td>
                                        <td><Link to={"/Comment/"+p.ID_NO.trim()}>{formatString(p.ID_NO.trim())}</Link></td>
                                        <td>{formatString(p.TTTT)}PROD_INFO</td>
                                        <td>{formatString(p.TTTT)}PROD_INFO</td>
                                        <td>{formatDateTime(p.TTTT)}PROD_INFO</td>
                                        <td><center className="classComment"></center></td>
                                        <td className="classTractorStatus"></td>
                                        <td>{formatString(p.PARTS_PREPARATION_STATUS)}</td>
                                        <td>{formatDateTime(p.CHASSIS_LINE_START_DATE)}</td>
                                        <td>{formatDateTime(p.CHASSIS_LINE_END_DATE)}</td>
                                        <td>{formatDateTime(p.PAINT_LINE_START_DATE)}</td>
                                        <td>{formatDateTime(p.PAINT_LINE_END_DATE)}</td>
                                        <td>{formatDateTime(p.TRACTOR_LINE_START_DATE)}</td>
                                        <td>{formatDateTime(p.TRACTOR_LINE_END_DATE)}</td>
                                        <td>{formatDateTime(p.MQ_LINE_START_DATE)}</td>
                                        <td>{formatDateTime(p.MQ_LINE_END_DATE)}</td>
                                        <td className="classReworkStart"></td>
                                        <td className="classReworkEnd"></td>
                                        <td>{formatDateTime(p.PRODUCTION_END_DATE)}</td>
                                        <td>{formatDateTime(p.INSPECTION_START_DATE)}</td>
                                        <td>{formatDateTime(p.INSPECTION_END_DATE)}</td>
                                        <td className="classShippingStatus"></td>
                                        <td>{formatDateTime(p.SHIPPING_DATE)}</td>
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
                10000
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

