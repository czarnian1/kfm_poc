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
           
           // Tractor Status
           if(!r.error) $("#"+p.ID_NO.trim()+" .classTractorStatus").html(r.isOnGoing ? '<i class="'+cf.stageIcon(r.stage)+'"></i>'+i18n.__(cf.stageTitle(r.stage)):"");
           
           // Comment
           var c=prod_monitor_comment.find({"ID_NO":p.ID_NO.trim()}).count();
           $("#"+p.ID_NO.trim()+" .classComment").html(0 < c ? '<span class="glyphicon glyphicon-exclamation-sign" />':'<span class="glyphicon glyphicon-ok" />');
           
           // SHIPPING_STATUS
           $("#"+p.ID_NO.trim()+" .classShippingStatus").html(r.shippingStatus);
           
           // Row's color
           if(!r.error) $("#"+p.ID_NO.trim()).css('background-color',r[r.stage].thresholdColor);
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
                <div>
                    <table className="PanelMainCell" width="1px">
                        <thead>
                            <tr>
                                <th className="PanelMainCell" width="90px" rowSpan={2}>Monthly Sequence No</th>
                                <th className="PanelMainCell" width="90px" rowSpan={2}>IDNO (Kubota Production ID)</th>
                                <th className="PanelMainCell" width="90px" rowSpan={2}>Model Code</th>
                                <th className="PanelMainCell" width="90px" rowSpan={2}>Model Description</th>
                                <th className="PanelMainCell" width="90px" rowSpan={2}>Planned Finished Date</th>
                                <th className="PanelMainCell" width="80px" rowSpan={2}>Comment</th>
                                <th className="PanelMainCell" width="100px" rowSpan={2}>Tractor Status</th>
                                <th className="PanelMainCell" width="80px" rowSpan={2}>Missing Parts</th>
                                <th className="PanelMainCell" width="160px" colSpan={2}><center>Chasis Line</center></th>
                                <th className="PanelMainCell" width="160px" colSpan={2}><center>Paint Line</center></th>
                                <th className="PanelMainCell" width="160px" colSpan={2}><center>Tractor Line</center></th>
                                <th className="PanelMainCell" width="160px" colSpan={2}><center>MQ Line</center></th>
                                <th className="PanelMainCell" width="160px" colSpan={2}><center>Rework</center></th>
                                <th className="PanelMainCell" width="80px" rowSpan={2}>Production Completion</th>
                                <th className="PanelMainCell" width="160px" colSpan={2}><center>Inspection</center></th>
                                <th className="PanelMainCell" width="100px">Shipping Status</th>
                                <th className="PanelMainCell" width="80px" rowSpan={2}>Shipping</th>
                            </tr>
                            <tr>
                                <th className="PanelMainCell"><center>Start</center></th>
                                <th className="PanelMainCell"><center>End</center></th>
                                <th className="PanelMainCell"><center>Start</center></th>
                                <th className="PanelMainCell"><center>End</center></th>
                                <th className="PanelMainCell"><center>Start</center></th>
                                <th className="PanelMainCell"><center>End</center></th>
                                <th className="PanelMainCell"><center>Start</center></th>
                                <th className="PanelMainCell"><center>End</center></th>
                                <th className="PanelMainCell"><center>Start</center></th>
                                <th className="PanelMainCell"><center>End</center></th>
                                <th className="PanelMainCell"><center>Start</center></th>
                                <th className="PanelMainCell"><center>End</center></th>
                                <th className="PanelMainCell"><center>Blank</center></th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.props.products.map(function(p) {
                                return (
                                    <tr id={p.ID_NO.trim()}>
                                        <td className="PanelMainCell">{formatString(p.TTTT)}(? No corresponding field)</td>
                                        <td className="PanelMainCell"><Link to={"/Comment/"+p.ID_NO.trim()}>{formatString(p.ID_NO.trim())}</Link></td>
                                        <td className="PanelMainCell">{formatString(p.TTTT)}(? No corresponding field)</td>
                                        <td className="PanelMainCell">{formatString(p.TTTT)}(? No corresponding field)</td>
                                        <td className="PanelMainCell">{formatDateTime(p.TTTT)}(? No corresponding field)</td>
                                        <td className="PanelMainCell"><center className="classComment"></center></td>
                                        <td className="PanelMainCell classTractorStatus"></td>
                                        <td className="PanelMainCell">{formatString(p.PARTS_PREPARATION_STATUS)}</td>
                                        <td className="PanelMainCell">{formatDateTime(p.CHASSIS_LINE_START_DATE)}</td>
                                        <td className="PanelMainCell">{formatDateTime(p.CHASSIS_LINE_END_DATE)}</td>
                                        <td className="PanelMainCell">{formatDateTime(p.PAINT_LINE_START_DATE)}</td>
                                        <td className="PanelMainCell">{formatDateTime(p.PAINT_LINE_END_DATE)}</td>
                                        <td className="PanelMainCell">{formatDateTime(p.TRACTOR_LINE_START_DATE)}</td>
                                        <td className="PanelMainCell">{formatDateTime(p.TRACTOR_LINE_END_DATE)}</td>
                                        <td className="PanelMainCell">{formatDateTime(p.MQ_LINE_START_DATE)}</td>
                                        <td className="PanelMainCell">{formatDateTime(p.MQ_LINE_END_DATE)}</td>
                                        <td className="PanelMainCell classReworkStart"></td>
                                        <td className="PanelMainCell classReworkEnd"></td>
                                        <td className="PanelMainCell">{formatDateTime(p.PRODUCTION_END_DATE)}</td>
                                        <td className="PanelMainCell">{formatDateTime(p.INSPECTION_START_DATE)}</td>
                                        <td className="PanelMainCell">{formatDateTime(p.INSPECTION_END_DATE)}</td>
                                        <td className="PanelMainCell classShippingStatus"></td>
                                        <td className="PanelMainCell">{formatDateTime(p.SHIPPING_DATE)}</td>
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

