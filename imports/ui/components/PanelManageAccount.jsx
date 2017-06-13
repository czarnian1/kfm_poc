import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom';
import { Accounts } from 'meteor/accounts-base'
import { browserHistory, Link } from 'react-router'

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

import CF, {LocationTitles, LocationIcons, ShippingStatuses} from '../classes/CommonFunctions.jsx';
const cf=new CF()

export class PanelManageAccount extends Component {
    constructor(props){
        super(props);
        this.state = {
                error: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e){
        e.preventDefault();
        this.updateAccount();
    }
    
    
    updateAccount(){
        var err=false;
        var argv={};
        
        // _id
        if(this.props.params.id!=undefined) argv["_id"]=this.props.params.id;
        
        // username
        let Username=$('#Username').val();
        Username=Username.replace(/\s+/g, "");
        if(Username!="") argv["username"]=Username;
        
        // Role
        argv.roles={};
        argv.roles[Roles.GLOBAL_GROUP]=[];
        argv.roles[Roles.GLOBAL_GROUP][0]=$('#Role select').val();

        // password
        let Password=$('#Password').val();
        Password=Password.replace(/\s+/g, "");
        let ConfirmPassword=$('#ConfirmPassword').val();
        ConfirmPassword=ConfirmPassword.replace(/\s+/g, "");
        if(Password!="" && ConfirmPassword!="" && Password==ConfirmPassword) argv["password"]=Password;
        
        // emails address
        let EmailAddress=$('#EmailAddress').val();
        EmailAddress=EmailAddress.replace(/\s+/g, "");
        argv["emails"]=[];
        argv["emails"][0]={"address":EmailAddress};

       
        /*
         * Profile
         */      
        argv["profile"]={};

        // ID_NO Filter
        var f={},v;
        
        v=$('#FilterStartId').val().trim();
        if(v!='')   f['Start']=v;

        v=$('#FilterEndId').val().trim();
        if(v!='')   f['End']=v;
        
        argv["profile"]['IdNoFilter']=f;
       
        // EmailThresholdNotification
        var e={},v;
        
        v=parseInt( $('.EmailThresholdNotification .LocationStatus1 select').val() );
        if(0 < v)   e["ChassisLine"]=v;
        
        v=parseInt( $('.EmailThresholdNotification .LocationStatus2 select').val() );
        if(0 < v)   e["PaintLine"]=v;
        
        v=parseInt( $('.EmailThresholdNotification .LocationStatus3 select').val() );
        if(0 < v)   e["TractorLine"]=v;
        
        v=parseInt( $('.EmailThresholdNotification .LocationStatus4 select').val() );
        if(0 < v)   e["MQLine"]=v;
        
        v=parseInt( $('.EmailThresholdNotification .LocationStatus5 select').val() );
        if(0 < v)   e["ReworkBeforeMQ"]=v;
        
        v=parseInt( $('.EmailThresholdNotification .LocationStatus6 select').val() );
        if(0 < v)   e["ReworkAfterMQ"]=v;
        
        v=parseInt( $('.EmailThresholdNotification .LocationStatus7 select').val() );
        if(0 < v)   e["ProductionCompletion"]=v;
        
        v=parseInt( $('.EmailThresholdNotification .LocationStatus8 select').val() );
        if(0 < v)   e["Inspection"]=v;
        
        v=parseInt( $('.EmailThresholdNotification .LocationStatus9 select').val() );
        if(0 < v)   e["ReworkDuringInspection"]
        
        v=parseInt( $('.EmailThresholdNotification .LocationStatus14 select').val());
        if(0 < v)   e["Shipped"]=v;
        
        argv["profile"]['EmailThresholdNotification']=e;
        
        // EmailLineEventNotification
        var e={};
        e["PreProductionStart"]        =$('.EmailLineEventNotification .LocationStatus0 .eventStart').prop('checked');
        e["ChassisLineStart"]          =$('.EmailLineEventNotification .LocationStatus1 .eventStart').prop('checked');
        e["ChassisLineEnd"]            =$('.EmailLineEventNotification .LocationStatus1 .eventEnd').prop('checked');
        e["PaintLineStart"]            =$('.EmailLineEventNotification .LocationStatus2 .eventStart').prop('checked');
        e["PaintLineEnd"]              =$('.EmailLineEventNotification .LocationStatus2 .eventEnd').prop('checked');
        e["TractorLineStart"]          =$('.EmailLineEventNotification .LocationStatus3 .eventStart').prop('checked');
        e["TractorLineEnd"]            =$('.EmailLineEventNotification .LocationStatus3 .eventEnd').prop('checked');
        e["MQLineStart"]               =$('.EmailLineEventNotification .LocationStatus4 .eventStart').prop('checked');
        e["MQLineEnd"]                 =$('.EmailLineEventNotification .LocationStatus4 .eventEnd').prop('checked');
        e["ReworkBeforeMQStart"]       =$('.EmailLineEventNotification .LocationStatus5 .eventStart').prop('checked');
        e["ReworkBeforeMQEnd"]         =$('.EmailLineEventNotification .LocationStatus5 .eventEnd').prop('checked');
        e["ReworkAfterMQStart"]        =$('.EmailLineEventNotification .LocationStatus6 .eventStart').prop('checked');
        e["ReworkAfterMQEnd"]          =$('.EmailLineEventNotification .LocationStatus6 .eventEnd').prop('checked');
        e["ProductionCompletionEnd"]   =$('.EmailLineEventNotification .LocationStatus7 .eventEnd').prop('checked');
        e["InspectionStart"]           =$('.EmailLineEventNotification .LocationStatus8 .eventStart').prop('checked');
        e["InspectionEnd"]             =$('.EmailLineEventNotification .LocationStatus8 .eventEnd').prop('checked');
        e["ReworkDuringInspectionStart"]=$('.EmailLineEventNotification .LocationStatus9 .eventStart').prop('checked');
        e["ReworkDuringInspectionEnd"] =$('.EmailLineEventNotification .LocationStatus9 .eventEnd').prop('checked');
        e["ShippedEnd"]                =$('.EmailLineEventNotification .LocationStatus14 .eventEnd').prop('checked');
        argv["profile"]['EmailLineEventNotification']=e;
        
        // ShownColumns
        var h={};
        h["MonthlySequenceNo"]       =$('.ShownColumns .MonthlySequenceNo').prop('checked');
        h["ChassisLine"]             =$('.ShownColumns .ChassisLine').prop('checked');
        h["PaintLine"]               =$('.ShownColumns .PaintLine').prop('checked');
        h["TractorLine"]             =$('.ShownColumns .TractorLine').prop('checked');
        h["MQLine"]                  =$('.ShownColumns .MQLine').prop('checked');
        h["ReworkBeforeMQ"]          =$('.ShownColumns .ReworkBeforeMQ').prop('checked');
        h["ReworkAfterMQ"]           =$('.ShownColumns .ReworkAfterMQ').prop('checked');
        h["ProductionCompletion"]    =$('.ShownColumns .ProductionCompletion').prop('checked');
        h["Inspection"]              =$('.ShownColumns .Inspection').prop('checked');
        h["ReworkDuringInspection"]  =$('.ShownColumns .ReworkDuringInspection').prop('checked');
        argv["profile"]['ShownColumns']=h;
        
        // Locale
        argv["profile"]["defaultLocale"]=i18n.getLocale(),

       
        /*
         * Update MongoDB
         */      
        Meteor.call(
            'updateLoginAccount', 
            argv, 
            (error, result) => {
                err=result;
            }
        );
        
        if(err) return;
        if ( cf.Role(Meteor.user()).AdminScreen ) browserHistory.push('/ManageUsers');
        else    browserHistory.push('/Main');
    }

/*    
    componentWillMount(){
        console.log("panelManageAccount:componentWillMount");
    }
*/
    
    
    render(){
        if (this.props.params.id!=Meteor.userId() && (! cf.Role(Meteor.user()).AdminScreen) ) {
            return (
                <span>
                    <T>ui.manageAccount.NoAdminRole</T> &nbsp;
                    <a href="/Main" ><T>ui.common.BackToMainScreen</T></a>
                </span>
            );
        }
        
        const error = this.state.error;
        
        var u=this.props.user
        
        var showRole=(user)=>{
//            console.log('showRole');
            if(user==undefined) return;
            
            var r=cf.Roles()[0].role;

            if(user.roles!=undefined && user.roles[Roles.GLOBAL_GROUP]!=undefined && user.roles[Roles.GLOBAL_GROUP][0]!=undefined) r=user.roles[Roles.GLOBAL_GROUP][0];

            if (cf.Role(Meteor.user()).AdminScreen && user._id!=Meteor.userId() ) {
                return (
                        <span id="Role">
                            User role:&nbsp;
                            <select defaultValue={r}>{
                                cf.Roles().map(
                                    (currentValue,index,array)=>{
                                        return (<option key={index} value={currentValue.role}><T>{currentValue.message}</T></option>);
                                    }
                                )
                            }
                            </select>
                        </span>
                    );
            }
            else    return  <span>User role: {r}</span>;
        }

        var showSelect=(LOCATION_STATUS)=>{
            var ary=cf.ProductionThresholds(LOCATION_STATUS);

            return  (
                <div className={'LocationStatus'+LOCATION_STATUS}><select>{
                    
                    
                    
                    ary.map(
                        (currentValue,index,array)=>{
                            if(index==0)return (<option key={index} value={index}><T>ui.locationHealth.none</T></option>);
                            else        return (<option key={index} value={index}><T>{array[index].message}</T></option>);
                        }
                    )
                }
                </select><T>{LocationTitles[LOCATION_STATUS]}</T><br /> &nbsp; </div>
            );
        };

        
        return (
            <div className="container">
                <a href="/Main" ><T>ui.common.BackToMainScreen</T></a>
                <h1 className="text-center"><T>{this.props.params.id==Meteor.userId() ? 'ui.manageAccount.ManageAccount' : 'ui.manageAccount.ManageOtherUser'}</T></h1>
            
                { error.length > 0 ? <div className="alert alert-danger fade in">{error}</div> :''}
                            
                <div className="row">
                    <div className="col-md-12">
                        <T _translateProps={['placeholder']}>
                            <input type="text" id="Username" className="col-md-8" placeholder="ui.login.Username"/>
                        </T>
                        <div className="col-md-4">
                            {showRole(this.props.user)}
                        </div>
                    </div>
                </div>
                
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <T _translateProps={['placeholder']}>
                            <input type="password" id="Password" className="col-md-12" placeholder="ui.login.Password"/>
                        </T>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <T _translateProps={['placeholder']}>
                            <input type="password" id="ConfirmPassword" className="col-md-12" placeholder="ui.manageAccount.ConfirmPassword"/>
                        </T>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <T _translateProps={['placeholder']}>
                            <input type="text" id="EmailAddress" className="col-md-12" placeholder="ui.manageAccount.EmailAddress"/>
                        </T>
                    </div>
                </div>
                <br />

                <div className="panel panel-default col-md-12">
                    <div className="panel-body">
                        <div className="panel panel-default col-md-6">
                            <div className="panel-body EmailThresholdNotification">
                                <div className="row">
                                    <T>ui.manageAccount.EmailThresholdNotification</T>
                                    <br />&nbsp;
                                </div>
                                <div className="row">
                                    <div className="col-md-4">{showSelect(1)}</div>
                                    <div className="col-md-4">{showSelect(2)}</div>
                                    <div className="col-md-4">{showSelect(3)}</div>
                                    <div className="col-md-4">{showSelect(5)}</div>
                                    <div className="col-md-4">{showSelect(4)}</div>
                                    <div className="col-md-4">{showSelect(6)}</div>
                                    <div className="col-md-4">{showSelect(7)}</div>
                                    <div className="col-md-4">{showSelect(8)}</div>
                                    <div className="col-md-4">{showSelect(9)}</div>
                                    <div className="col-md-4">{showSelect(14)}</div>
                                </div>

                            </div>
                        </div>
                            
                                            
                                            
                                            
                        <div className="panel panel-default col-md-6">
                            <div className="panel-body EmailLineEventNotification">
                                <div className="row">
                                    <T>ui.manageAccount.EmailLineEventNotification</T>
                                    <br />&nbsp;
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="LocationStatus0 panel panel-default">
                                            <T>ui.common.PreProduction</T><br />&nbsp;
                                            <input type="checkbox" className="eventStart" defaultChecked="true" /><T>ui.common.Start</T>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="LocationStatus1 panel panel-default">
                                            <T>ui.common.ChassisLine</T><br />&nbsp;
                                            <input type="checkbox" className="eventStart" defaultChecked="true" /><T>ui.common.Start</T>&nbsp; &nbsp;
                                            <input type="checkbox" className="eventEnd"   defaultChecked="true" /><T>ui.common.End</T>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="LocationStatus2 panel panel-default">
                                            <T>ui.common.PaintLine</T><br />&nbsp;
                                            <input type="checkbox" className="eventStart" defaultChecked="true" /><T>ui.common.Start</T>&nbsp; &nbsp;
                                            <input type="checkbox" className="eventEnd"   defaultChecked="true" /><T>ui.common.End</T>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <div className="LocationStatus3 panel panel-default">
                                            <T>ui.common.TractorLine</T><br />&nbsp;
                                            <input type="checkbox" className="eventStart" defaultChecked="true" /><T>ui.common.Start</T>&nbsp; &nbsp;
                                            <input type="checkbox" className="eventEnd"   defaultChecked="true" /><T>ui.common.End</T>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <div className="LocationStatus5 panel panel-default">
                                            <T>ui.common.ReworkBeforeMQ</T><br />&nbsp;
                                            <input type="checkbox" className="eventStart" defaultChecked="true" /><T>ui.common.Start</T>&nbsp; &nbsp;
                                            <input type="checkbox" className="eventEnd"   defaultChecked="true" /><T>ui.common.End</T>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <div className="LocationStatus4 panel panel-default">
                                            <T>ui.common.MQLine</T><br />&nbsp;
                                            <input type="checkbox" className="eventStart" defaultChecked="true" /><T>ui.common.Start</T>&nbsp; &nbsp;
                                            <input type="checkbox" className="eventEnd"   defaultChecked="true" /><T>ui.common.End</T>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <div className="LocationStatus6 panel panel-default">
                                            <T>ui.common.ReworkAfterMQ</T><br />&nbsp;
                                            <input type="checkbox" className="eventStart" defaultChecked="true" /><T>ui.common.Start</T>&nbsp; &nbsp;
                                            <input type="checkbox" className="eventEnd"   defaultChecked="true" /><T>ui.common.End</T>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <div className="LocationStatus7 panel panel-default">
                                            <T>ui.common.ProductionCompletion</T><br />&nbsp;
                                            <input type="checkbox" className="eventEnd"   defaultChecked="true" /><T>ui.common.End</T>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <div className="LocationStatus8 panel panel-default">
                                            <T>ui.common.Inspection</T><br />&nbsp;
                                            <input type="checkbox" className="eventStart" defaultChecked="true" /><T>ui.common.Start</T>&nbsp; &nbsp;
                                            <input type="checkbox" className="eventEnd"   defaultChecked="true" /><T>ui.common.End</T>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <div className="LocationStatus9 panel panel-default">
                                            <T>ui.common.ReworkDuringInspection</T><br />&nbsp;
                                            <input type="checkbox" className="eventStart" defaultChecked="true" /><T>ui.common.Start</T>&nbsp; &nbsp;
                                            <input type="checkbox" className="eventEnd"   defaultChecked="true" /><T>ui.common.End</T>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <div className="LocationStatus14 panel panel-default">
                                            <T>ui.common.Shipping</T><br />&nbsp;
                                            <input type="checkbox" className="eventEnd"   defaultChecked="true" /><T>ui.common.End</T>
                                        </div>
                                    </div>
                                        
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <T _translateProps={['placeholder']}>
                                    <input type="text" id="FilterStartId" className="col-md-12" placeholder="ui.manageAccount.FilterStartId"/>
                                </T>
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-md-12">
                                <T _translateProps={['placeholder']}>
                                    <input type="text" id="FilterEndId" className="col-md-12" placeholder="ui.manageAccount.FilterEndId"/>
                                </T>
                            </div>
                        </div>
                        <br />
                    </div>
                </div>
                            
                <div className="panel panel-default col-md-12">
                    <div className="panel-body ShownColumns">
                        <div className="row">
                            <T>ui.manageAccount.ShownColumns</T>
                            <br />&nbsp;
                        </div>
                        <div className="row">
                            <div className="col-md-1">
                                <input type="checkbox" className="MonthlySequenceNo" defaultChecked="true" />
                                <T>ui.common.MonthlySequenceNo</T>
                            </div>
                            <div className="col-md-1">
                                <input type="checkbox" className="ChassisLine" defaultChecked="true" />
                                <T>ui.common.ChassisLine</T>
                            </div>
                            <div className="col-md-1">
                                <input type="checkbox" className="PaintLine" defaultChecked="true" />
                                <T>ui.common.PaintLine</T>
                            </div>
                            <div className="col-md-1">
                                <input type="checkbox" className="TractorLine" defaultChecked="true" />
                                <T>ui.common.TractorLine</T>
                            </div>
                            <div className="col-md-1">
                                <input type="checkbox" className="ReworkBeforeMQ" defaultChecked="true" />
                                <T>ui.common.ReworkBeforeMQ</T>
                            </div>
                            <div className="col-md-1">
                                <input type="checkbox" className="MQLine" defaultChecked="true" />
                                <T>ui.common.MQLine</T>
                            </div>
                            <div className="col-md-1">
                                <input type="checkbox" className="ReworkAfterMQ" defaultChecked="true" />
                                <T>ui.common.ReworkAfterMQ</T>
                            </div>
                            <div className="col-md-1">
                                <input type="checkbox" className="ProductionCompletion" defaultChecked="true" />
                                <T>ui.common.ProductionCompletion</T>
                            </div>
                            <div className="col-md-1">
                                <input type="checkbox" className="Inspection" defaultChecked="true" />
                                <T>ui.common.Inspection</T>
                            </div>
                            <div className="col-md-1">
                                <input type="checkbox" className="ReworkDuringInspection" defaultChecked="true" />
                                <T>ui.common.ReworkDuringInspection</T>
                            </div>
                        </div>
                    </div>
                </div>
                            
                <div className="row">
                    <div className="col-md-12">
                        <T _translateProps={['value']}>
                            <input type="submit" id="login-button" className="btn btn-primary btn-lg btn-block col-md-12" value="ui.login.Submit" onClick={this.handleSubmit} />
                        </T>
                    </div>
                </div>
                <br />
            </div>
        );
    }
    
/*    
    componentDidMount() {
        console.log("panelManageAccount:componentDidMount");
    }
*/
    
    componentDidUpdate() {
//        console.log("panelManageAccount:componentDidUpdate");
        if (this.props.user==undefined )     return;

        var u=this.props.user;

        // Display values from profile.
        $('#Username').val(u.username);
        if(u.emails!=undefined && u.emails[0]!=undefined){
            if(u.emails[0].address!=undefined) $('#EmailAddress').val(u.emails[0].address);
        }

        if(u.profile!=undefined){
            // Filter ID_NO
            if(u.profile.IdNoFilter!=undefined){
                if(u.profile.IdNoFilter.Start!=undefined)      $('#FilterStartId').val(u.profile.IdNoFilter.Start);
                if(u.profile.IdNoFilter.End!=undefined)        $('#FilterEndId').val(u.profile.IdNoFilter.End);
            }
            
            // EmailThresholdNotification
            if(u.profile.EmailThresholdNotification!=undefined){
                var e=u.profile.EmailThresholdNotification;
                if(e.ChassisLine!=undefined)           $('.EmailThresholdNotification .LocationStatus1 select').val(e.ChassisLine);
                if(e.PaintLine!=undefined)             $('.EmailThresholdNotification .LocationStatus2 select').val(e.PaintLine);
                if(e.TractorLine!=undefined)           $('.EmailThresholdNotification .LocationStatus3 select').val(e.TractorLine);
                if(e.ReworkBeforeMQ!=undefined)        $('.EmailThresholdNotification .LocationStatus5 select').val(e.ReworkBeforeMQ);
                if(e.MQLine!=undefined)                $('.EmailThresholdNotification .LocationStatus4 select').val(e.MQLine);
                if(e.ReworkAfterMQ!=undefined)         $('.EmailThresholdNotification .LocationStatus6 select').val(e.ReworkAfterMQ);
                if(e.ProductionCompletion!=undefined)  $('.EmailThresholdNotification .LocationStatus7 select').val(e.ProductionCompletion);
                if(e.Inspection!=undefined)            $('.EmailThresholdNotification .LocationStatus8 select').val(e.Inspection);
                if(e.ReworkDuringInspection!=undefined)$('.EmailThresholdNotification .LocationStatus9 select').val(e.ReworkDuringInspection);
                if(e.Shipped!=undefined)               $('.EmailThresholdNotification .LocationStatus14 select').val(e.Shipped);
            }                    

            // EmailLineEventNotification
            if(u.profile.EmailLineEventNotification!=undefined){
                var e=u.profile.EmailLineEventNotification;
                if(e.PreProductionStart!=undefined)         $('.EmailLineEventNotification .LocationStatus0 .eventStart').prop('checked',e.PreProductionStart);
                if(e.ChassisLineStart!=undefined)           $('.EmailLineEventNotification .LocationStatus1 .eventStart').prop('checked',e.ChassisLineStart);
                if(e.ChassisLineEnd!=undefined)             $('.EmailLineEventNotification .LocationStatus1 .eventEnd').prop('checked',e.ChassisLineEnd);
                if(e.PaintLineStart!=undefined)             $('.EmailLineEventNotification .LocationStatus2 .eventStart').prop('checked',e.PaintLineStart);
                if(e.PaintLineEnd!=undefined)               $('.EmailLineEventNotification .LocationStatus2 .eventEnd').prop('checked',e.PaintLineEnd);
                if(e.TractorLineStart!=undefined)           $('.EmailLineEventNotification .LocationStatus3 .eventStart').prop('checked',e.TractorLineStart);
                if(e.TractorLineEnd!=undefined)             $('.EmailLineEventNotification .LocationStatus3 .eventEnd').prop('checked',e.TractorLineEnd);
                if(e.ReworkBeforeMQStart!=undefined)        $('.EmailLineEventNotification .LocationStatus5 .eventStart').prop('checked',e.ReworkBeforeMQStart);
                if(e.ReworkBeforeMQEnd!=undefined)          $('.EmailLineEventNotification .LocationStatus5 .eventEnd').prop('checked',e.ReworkBeforeMQEnd);
                if(e.MQLineStart!=undefined)                $('.EmailLineEventNotification .LocationStatus4 .eventStart').prop('checked',e.MQLineStart);
                if(e.MQLineEnd!=undefined)                  $('.EmailLineEventNotification .LocationStatus4 .eventEnd').prop('checked',e.MQLineEnd);
                if(e.ReworkAfterMQStart!=undefined)         $('.EmailLineEventNotification .LocationStatus6 .eventStart').prop('checked',e.ReworkAfterMQStart);
                if(e.ReworkAfterMQEnd!=undefined)           $('.EmailLineEventNotification .LocationStatus6 .eventEnd').prop('checked',e.ReworkAfterMQEnd);
                if(e.ProductionCompletionEnd!=undefined)    $('.EmailLineEventNotification .LocationStatus7 .eventEnd').prop('checked',e.ProductionCompletionEnd);
                if(e.InspectionStart!=undefined)            $('.EmailLineEventNotification .LocationStatus8 .eventStart').prop('checked',e.InspectionStart);
                if(e.InspectionEnd!=undefined)              $('.EmailLineEventNotification .LocationStatus8 .eventEnd').prop('checked',e.InspectionEnd);
                if(e.ReworkDuringInspectionStart!=undefined)$('.EmailLineEventNotification .LocationStatus9 .eventStart').prop('checked',e.ReworkDuringInspectionStart);
                if(e.ReworkDuringInspectionEnd!=undefined)  $('.EmailLineEventNotification .LocationStatus9 .eventEnd').prop('checked',e.ReworkDuringInspectionEnd);
                if(e.ShippedEnd!=undefined)                 $('.EmailLineEventNotification .LocationStatus14 .eventEnd').prop('checked',e.ShippedEnd);
            }                    
            
            // Shown columns
            if(u.profile.ShownColumns!=undefined){
                var h=u.profile.ShownColumns;
                if(h.MonthlySequenceNo!=undefined)      $('.ShownColumns .MonthlySequenceNo').prop('checked',h.MonthlySequenceNo);
                if(h.ChassisLine!=undefined)            $('.ShownColumns .ChassisLine').prop('checked',h.ChassisLine);
                if(h.PaintLine!=undefined)              $('.ShownColumns .PaintLine').prop('checked',h.PaintLine);
                if(h.TractorLine!=undefined)            $('.ShownColumns .TractorLine').prop('checked',h.TractorLine);
                if(h.ReworkBeforeMQ!=undefined)         $('.ShownColumns .ReworkBeforeMQ').prop('checked',h.ReworkBeforeMQ);
                if(h.MQLine!=undefined)                 $('.ShownColumns .MQLine').prop('checked',h.MQLine);
                if(h.ReworkAfterMQ!=undefined)          $('.ShownColumns .ReworkAfterMQ').prop('checked',h.ReworkAfterMQ);
                if(h.ProductionCompletion!=undefined)   $('.ShownColumns .ProductionCompletion').prop('checked',h.ProductionCompletion);
                if(h.Inspection!=undefined)             $('.ShownColumns .Inspection').prop('checked',h.Inspection);
                if(h.ReworkDuringInspection!=undefined) $('.ShownColumns .ReworkDuringInspection').prop('checked',h.ReworkDuringInspection);
            }
            
        }   // if(u.profile!=undefined)
    }

}


import { createContainer } from 'meteor/react-meteor-data';

export default PanelManageAccount = createContainer(({params}) => {
//    console.log("PanelManageAccount:createContainer");
    
    Meteor.subscribe( 'users' );
    
    // Not yourself and not Admin?
    if (params.id==Meteor.userId() || cf.Role(Meteor.user()).AdminScreen ) {
        return {user:Meteor.users.findOne({_id:params.id})};
    }
    else{
        return {user:[]};
    }
    
}, PanelManageAccount);
