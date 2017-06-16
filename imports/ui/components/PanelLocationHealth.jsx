import React, { Component, PropTypes } from 'react';
import { prod_monitor } from '../../api/prod_monitor.js';
import { Link } from 'react-router';

import CF, {LocationTitles, LocationIcons, ShippingStatuses} from '../classes/CommonFunctions.jsx';
const cf=new CF();

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

//Production Task component - represents a single tractor item
export class PanelLocationHealth extends Component {
    
    updateDisplay(){
        // console.log("PanelLocationHealth:updateDisplay");
        if(this.props.product == undefined)    return;
        var p=this.props.product;
        if(p.LOCATION_STATUS == undefined)    return;
        var r=cf.productStatus(this.props.product);
        
        var i,t,s;
        
        // Location
        // console.log("PanelLocationHealth:updateDisplay: Location");
        if(r.error) $("#state_Location").html("System error.");
        else{
            $("#state_Location").html(
                '<span style="color:'+r[p.LOCATION_STATUS].thresholdColor+'">'
                +'<i class="kubota-fs-32 '+LocationIcons[p.LOCATION_STATUS]+'"></i>'
                +i18n.__(LocationTitles[p.LOCATION_STATUS])
                +'</span>'
            );
        }
        
        // SHIPPING_STATUS
        // console.log("PanelLocationHealth:updateDisplay: SHIPPING_STATUS");
        if(r.error) $("#state_ShippingStatus").html("System error.");
        else        $("#state_ShippingStatus").html(i18n.__(ShippingStatuses[p.SHIPPING_STATUS]));
        
        // Age since assembly
        if(r.error) $("#state_Age").html("System error.");
        else{
            if(r.isOnGoing){
                t=r[p.LOCATION_STATUS].thresholdSpent;
                s = i18n.__("ui.locationHealth.AgeSinceAssemblyStarted");
                s+= (60*24<=t)? Math.floor(t/60/24)+' days ' : "";
                s+= (Math.floor(t/60))%24+' hours ';
                s+= Math.floor(t%60)+' minutes.';
                $('#state_Age').html(s);
            }
            else    $("#state_Age").html( i18n.__("ui.locationHealth.NotApplicable") );
        }
        
        // Time until area Threshhold
        // console.log("PanelLocationHealth:updateDisplay: Time until area Threshhold");
        if(r.error) $("#state_TimeThreshold").html("System error.");
        else{
            if(r.isOnGoing){
                t=r[p.LOCATION_STATUS].thresholdDuration - r[p.LOCATION_STATUS].thresholdSpent;
                if(0 < t){
                    s = i18n.__("ui.locationHealth.TimeUntilAreaThreshhold");
                    s+= (60*24<=t)? Math.floor(t/60/24)+' days ' : "";
                    s+= (Math.floor(t/60))%24+' hours ';
                    s+= t%60+' minutes.';
                    $("#state_TimeThreshold").html(s);
                }
                else{
                    t = -t;
                    s = i18n.__("ui.locationHealth.TimeOverAreaThreshhold");
                    s+= (60*24<=t)? Math.floor(t/60/24)+' days ' : "";
                    s+= (Math.floor(t/60))%24+' hours ';
                    s+= t%60+' minutes.';
                    $("#state_TimeThreshold").html(s);
                }
            }
            else    $("#state_TimeThreshold").html( i18n.__("ui.locationHealth.NotApplicable") );
        }
      
        // Health
        // console.log("PanelLocationHealth:updateDisplay: Health");
        if(r.error) $("#state_Health").html("System error.");
        else{
            if(r.isOnGoing){
                $("#state_Health").html(i18n.__("ui.locationHealth.Health") + '<span style="color:'+r[p.LOCATION_STATUS].thresholdColor+'">'+i18n.__(r[p.LOCATION_STATUS].thresholdMessage)+'.</span>');
            }
            else    $("#state_Health").html( i18n.__("ui.locationHealth.NotApplicable") );
        }
        

        /*
         * For each LOCATION_STATUS
         */
        // console.log("PanelLocationHealth:updateDisplay: For each LOCATION_STATUS");
        if(r.error) $('#LOCATION_STATUS'+i+' .health').html("System error.");
        else{
            for(i=1;i<=14;++i){
                if(r[i]!=undefined && r[i]!=null)    $('#LOCATION_STATUS'+i+' .health').html('<span style="color:'+r[i].thresholdColor+'">'+i18n.__(r[i].thresholdMessage)+'</span>');
            }
        }

    }

    render(){
        var r=this.props.product;

        return(
            <div className="panel panel-default container-fluid">
                <br />
                <table className="table table-bordered table-responsive"> 
                    <thead>
                        <tr style={{"backgroundColor":"silver"}}>
                            <td><center><T>ui.common.IdNo</T></center></td>
                            <td><center><T>ui.common.Start</T></center></td>
                            <td><center><T>ui.common.LocationStatus</T></center></td>
                            <td><center><T>ui.common.ShippingStatus</T></center></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{"backgroundColor":"whitesmoke"}}>
                            <td><Link to={"/Main"}>{r==undefined?"":r.ID_NO.trim()}</Link></td>
                            <td>{r==undefined?"":cf.formatDateTime(r.CREATE_DATE)}</td>
                            <td id="state_Location"></td>
                            <td id="state_ShippingStatus"></td>
                        </tr>
                    </tbody>
                </table>
                        
                <br />
                <div>
                    <div className="row">
                        <div className="col-md-5"><span className="glyphicon glyphicon-hourglass" /> <span id="state_Age"/></div>
                        <div className="col-md-5"><span className="glyphicon glyphicon-time" /> <span id="state_TimeThreshold"/></div>
                        <div className="col-md-2"><span className="glyphicon glyphicon-flag" /> <span id="state_Health"/></div>
                    </div>
                </div>
                <br />
                            
                <table className="table table-bordered"> 
                    <thead className="table-bordered">
                        <tr style={{"backgroundColor":"silver"}}>
                            <td className="col-md-3 table-bordered"><center><T>ui.common.LocationStatus</T></center></td>
                            <td className="col-md-3 table-bordered"><center><T>ui.common.Start</T></center></td>
                            <td className="col-md-3 table-bordered"><center><T>ui.common.End</T></center></td>
                            <td className="col-md-3 table-bordered"><center><T>ui.locationHealth.Health</T></center></td>
                        </tr>
                    </thead>
                    <tbody className="table-bordered">
                        <tr id="LOCATION_STATUS1">
                            <td><T>{LocationTitles[1]}</T></td>
                            <td>{r==undefined?"":cf.formatDateTime(r.CHASSIS_LINE_START_DATE)}</td>
                            <td>{r==undefined?"":cf.formatDateTime(r.CHASSIS_LINE_END_DATE)}</td>
                            <td className="health"></td>
                        </tr>
                        <tr id="LOCATION_STATUS2" style={{"backgroundColor":"whitesmoke"}}>
                            <td><T>{LocationTitles[2]}</T></td>
                            <td>{r==undefined?"":cf.formatDateTime(r.PAINT_LINE_START_DATE)}</td>
                            <td>{r==undefined?"":cf.formatDateTime(r.PAINT_LINE_END_DATE)}</td>
                            <td className="health"></td>
                        </tr>
                        <tr id="LOCATION_STATUS3">
                            <td><T>{LocationTitles[3]}</T></td>
                            <td>{r==undefined?"":cf.formatDateTime(r.TRACTOR_LINE_START_DATE)}</td>
                            <td>{r==undefined?"":cf.formatDateTime(r.TRACTOR_LINE_END_DATE)}</td>
                            <td className="health"></td>
                        </tr>
                        <tr id="LOCATION_STATUS5" style={{"backgroundColor":"whitesmoke"}}>
                            <td><T>{LocationTitles[5]}</T></td>
                            <td>{r==undefined?"":cf.formatDateTime(r.REWORK_BEFORE_MQ_START_DATE)}</td>
                            <td>{r==undefined?"":cf.formatDateTime(r.REWORK_BEFORE_MQ_END_DATE)}</td>
                            <td className="health"></td>
                        </tr>
                        <tr id="LOCATION_STATUS4">
                            <td><T>{LocationTitles[4]}</T></td>
                            <td>{r==undefined?"":cf.formatDateTime(r.MQ_LINE_START_DATE)}</td>
                            <td>{r==undefined?"":cf.formatDateTime(r.MQ_LINE_END_DATE)}</td>
                            <td className="health"></td>
                        </tr>
                        <tr id="LOCATION_STATUS6" style={{"backgroundColor":"whitesmoke"}}>
                            <td><T>{LocationTitles[6]}</T></td>
                            <td>{r==undefined?"":cf.formatDateTime(r.REWORK_AFTER_MQ_START_DATE)}</td>
                            <td>{r==undefined?"":cf.formatDateTime(r.REWORK_AFTER_MQ_END_DATE)}</td>
                            <td className="health"></td>
                        </tr>
                        <tr id="LOCATION_STATUS7">
                            <td><T>{LocationTitles[7]}</T></td>
                            <td style={{"backgroundColor":"grey"}}></td>
                            <td>{r==undefined?"":cf.formatDateTime(r.PRODUCTION_END_DATE)}</td>
                            <td className="health"></td>
                        </tr>
                        <tr id="LOCATION_STATUS8" style={{"backgroundColor":"whitesmoke"}}>
                            <td><T>{LocationTitles[8]}</T></td>
                            <td>{r==undefined?"":cf.formatDateTime(r.INSPECTION_START_DATE)}</td>
                            <td>{r==undefined?"":cf.formatDateTime(r.INSPECTION_END_DATE)}</td>
                            <td className="health"></td>
                        </tr>
                        <tr id="LOCATION_STATUS9">
                            <td><T>{LocationTitles[9]}</T></td>
                            <td>{r==undefined?"":cf.formatDateTime(r.REWORK_DUR_INSP_START_DATE)}</td>
                            <td>{r==undefined?"":cf.formatDateTime(r.REWORK_DUR_INSP_END_DATE)}</td>
                            <td className="health"></td>
                        </tr>
                        <tr id="LOCATION_STATUS14" style={{"backgroundColor":"whitesmoke"}}>
                            <td><T>{LocationTitles[14]}</T></td>
                            <td>{r==undefined?"":cf.formatDateTime(r.SHIPPING_DATE)}</td>
                            <td style={{"backgroundColor":"grey"}}></td>
                            <td className="health"></td>
                        </tr>
                    </tbody>
                </table>

                <br /><br />
                            
            </div>
        );
    }

    componentDidMount() {
//        console.log("PanelLocationHealth:componentDidMount");
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
//        console.log("PanelLocationHealth:componentDidUpdate");
        this.updateDisplay();
        
        i18n.onChangeLocale ((newLocale)=>{
            this.updateDisplay();
        })
    }
    
    componentWillUnmount() {
        console.log("PanelLocationHealth:componentWillUnmount");
        if(this.state!=undefined && this.state.timerId!=undefined && this.state.timerId!=null)   Meteor.clearInterval(this.state.timerId);
    }
}


import { createContainer } from 'meteor/react-meteor-data';

export default PanelLocationHealth = createContainer(({ID_NO}) => {
    return {
        product: prod_monitor.findOne({"ID_NO": ID_NO }),
  };
}, PanelLocationHealth);

