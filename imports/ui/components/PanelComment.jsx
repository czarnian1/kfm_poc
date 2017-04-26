import React, { Component, PropTypes } from 'react';
import { PROD_MONITOR } from '../../api/prod_monitor.js';
import { PROD_MONITOR_COMMENT } from '../../api/prod_monitor_comment.js';
import { Link } from 'react-router';

import CF from '../classes/CommonFunctions.jsx';
const cf=new CF();

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

//Production Task component - represents a single tractor item
export class PanelComment extends Component {
    
    updateDisplay(){
        if(this.props.product == undefined)    return;
        if(this.props.product.length < 1)    return;
        if(this.props.product[0] == undefined)    return;
        var p=this.props.product[0];
        var r=cf.productStatus(p);
        
        var i,t,s;
        
        /*
         * Headers
         */
        // SHIPPING_STATUS
        if(!r.error) $("#state_ShippingStatus").html(r.shippingStatus);
        
        if(r.isOnGoing){
            // Tractor Status
            if(!r.error) $("#state_TractorStatus").html(
                '<span style="color:'+r[r.stage].thresholdColor+'">'
                +'<i class="kubota-fs-32 '+cf.stageIcon(r.stage)+'"></i>'
                +i18n.__(cf.stageTitle(r.stage))
                +'</span>'
            );
            
            // Time until area Threshhold
            t=r[r.stage].thresholdDuration;
            if(!r.error && t!=undefined){
                //use cf__i18n language !!
                s = 'Time until area threshhold: '
                s+= (60*24<=t)? Math.floor(t/60/24)+' days ' : "";
                s+= (Math.floor(t/60))%24+' hours ';
                s+= t%60+' minutes';
                $("#state_TimeThreshold").html(s);
            }
            
            // Age since assembly
            t=r[r.stage].thresholdSpent;
            s = 'Age since assembly started: ';
            s+= (60*24<=t)? Math.floor(t/60/24)+' days ' : "";
            s+= (Math.floor(t/60))%24+' hours ';
            s+= Math.floor(t%60)+' minutes';
            $('#state_Age').html(s);
            
            // Health
            if(!r.error) $("#state_Health").html('Health: <span style="color:'+r[r.stage].thresholdColor+'">'+i18n.__(r[r.stage].thresholdMessage)+'</span>');
        }

        /*
         * For each stage
         */
        for(i=1;i<=10;++i){
            if(r[i]!=undefined && r[i]!=null)    $('#stage'+i+' .health').html('<span style="color:'+r[i].thresholdColor+'">'+i18n.__(r[i].thresholdMessage)+'</span>');
        }


    }

    render(){
        var r=this.props.product[0];

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
        
        var onClickUpdate=(e)=>{
            $("#commentsTable > tr").each(function(){
                if($("#"+this.id+" .rowCheck")[0].checked){
                    PROD_MONITOR_COMMENT.update(
                        {"_id":this.id},
                        {$set:{
                            "UPDATE_DATE":new Date(),
                            "UPDATE_BY":Meteor.user().username,
                            "USER_COMMENT":$("#"+this.id+" .rowText")[0].value,
                        }},
                        {multi:false, upsert:false},
                        function(){console.log("onClickDelete():Update.")}
                    );
                    
                }
            });
            $(".rowCheck").prop('checked', false);
        }
        
        var onClickDelete=function(e){
            $("#commentsTable > tr").each(function(){
                if($("#"+this.id+" .rowCheck")[0].checked){
                    PROD_MONITOR_COMMENT.remove(
                        {"_id":this.id}, function(){console.log("onClickDelete():Remove.")}
                    );
                    
                }
            });
            $(".rowCheck").prop('checked', false);
            
        }
        
        var onClickInsert=function(e){
            console.log("PanelComment:onClickInsert");

            var argv=[];
            var maxS=PROD_MONITOR_COMMENT.find({ID_NO:r.ID_NO.trim()}, {sort:  {SEQ_NO: -1}}).fetch();
            
//            argv["_id"]='seqMeteor_id.nextval';
            argv["ID_NO"]=r.ID_NO.trim();
            argv["SEQ_NO"]= (maxS==undefined || maxS.length < 1) ? 1 : maxS[0].SEQ_NO+1;
            argv["CREATE_DATE"]=new Date();
            argv["CREATE_BY"]=Meteor.user().username;
            argv["USER_COMMENT"]=document.getElementById('addingComment').value;
            PROD_MONITOR_COMMENT.insert(argv);
            document.getElementById('addingComment').value="";
        }
        
        return(
            <div className="panel panel-default container-fluid">
                <br />
                <table className="table table-bordered table-responsive"> 
                    <thead>
                        <tr style={{"backgroundColor":"silver"}}>
                            <td><T>common.main.idno</T></td>
                            <td><T>common.main.started</T></td>
                            <td><T>common.main.tractorstatus</T></td>
                            <td><T>common.main.shippingstatus</T></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{"backgroundColor":"whitesmoke"}}>
			     <td><Link to={"/Main"}>{r==undefined?"":r.ID_NO.trim()}</Link></td>
                            <td>{r==undefined?"":formatDateTime(r.CREATE_DATE)}</td>
                            <td id="state_TractorStatus"></td>
                            <td id="state_ShippingStatus"></td>
                        </tr>
                    </tbody>
                </table>
                        
                <br />
                <div>
                    <div className="row">
                        <div className="col-md-5"><span className="glyphicon glyphicon-time" /> <span id="state_TimeThreshold"/></div>
                        <div className="col-md-5"><span className="glyphicon glyphicon-hourglass" /> <span id="state_Age"/></div>
                        <div className="col-md-2"><span className="glyphicon glyphicon-flag" /> <span id="state_Health"/></div>
                    </div>
                </div>
                <br />
                            
                <table className="table table-bordered"> 
                    <thead className="table-bordered">
                        <tr style={{"backgroundColor":"silver"}}>
                            <td className="col-md-3 table-bordered">Stage</td>
                            <td className="col-md-3 table-bordered">Entry</td>
                            <td className="col-md-3 table-bordered">Exit</td>
                            <td className="col-md-3 table-bordered">Health</td>
                        </tr>
                    </thead>
                    <tbody className="table-bordered">
                        <tr id="stage1">
                            <td className="col-md-3 table-bordered">{i18n.__(cf.stageTitle(1))}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.CHASSIS_LINE_START_DATE)}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.CHASSIS_LINE_END_DATE)}</td>
                            <td className="col-md-3 table-bordered health"></td>
                        </tr>
                        <tr id="stage2" style={{"backgroundColor":"whitesmoke"}}>
                            <td className="col-md-3 table-bordered">{i18n.__(cf.stageTitle(2))}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.PAINT_LINE_START_DATE)}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.PAINT_LINE_END_DATE)}</td>
                            <td className="col-md-3 table-bordered health"></td>
                        </tr>
                        <tr id="stage3">
                            <td className="col-md-3 table-bordered">{i18n.__(cf.stageTitle(3))}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.TRACTOR_LINE_START_DATE)}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.TRACTOR_LINE_END_DATE)}</td>
                            <td className="col-md-3 table-bordered health"></td>
                        </tr>
                        <tr id="stage4" style={{"backgroundColor":"whitesmoke"}}>
                            <td className="col-md-3 table-bordered">{i18n.__(cf.stageTitle(4))}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.REWORK_BEFORE_MQ_START_DATE)}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.REWORK_BEFORE_MQ_END_DATE)}</td>
                            <td className="col-md-3 table-bordered health"></td>
                        </tr>
                        <tr id="stage5">
                            <td className="col-md-3 table-bordered">{i18n.__(cf.stageTitle(5))}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.MQ_LINE_START_DATE)}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.MQ_LINE_END_DATE)}</td>
                            <td className="col-md-3 table-bordered health"></td>
                        </tr>
                        <tr id="stage6" style={{"backgroundColor":"whitesmoke"}}>
                            <td className="col-md-3 table-bordered">{i18n.__(cf.stageTitle(6))}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.REWORK_AFTER_MQ_START_DATE)}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.REWORK_AFTER_MQ_END_DATE)}</td>
                            <td className="col-md-3 table-bordered health"></td>
                        </tr>
                        <tr id="stage7">
                            <td className="col-md-3 table-bordered">{i18n.__(cf.stageTitle(7))}</td>
                            <td className="col-md-3 table-bordered" style={{"backgroundColor":"grey"}}></td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.PRODUCTION_END_DATE)}</td>
                            <td className="col-md-3 table-bordered health"></td>
                        </tr>
                        <tr id="stage8" style={{"backgroundColor":"whitesmoke"}}>
                            <td className="col-md-3 table-bordered">{i18n.__(cf.stageTitle(8))}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.INSPECTION_START_DATE)}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.INSPECTION_END_DATE)}</td>
                            <td className="col-md-3 table-bordered health"></td>
                        </tr>
                        <tr id="stage9">
                            <td className="col-md-3 table-bordered">{i18n.__(cf.stageTitle(9))}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.REWORK_DUR_INSP_START_DATE)}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.REWORK_DUR_INSP_END_DATE)}</td>
                            <td className="col-md-3 table-bordered health"></td>
                        </tr>
                        <tr id="stage10" style={{"backgroundColor":"whitesmoke"}}>
                            <td className="col-md-3 table-bordered">{i18n.__(cf.stageTitle(10))}</td>
                            <td className="col-md-3 table-bordered">{r==undefined?"":formatDateTime(r.SHIPPING_DATE)}</td>
                            <td className="col-md-3 table-bordered" style={{"backgroundColor":"grey"}}></td>
                            <td className="col-md-3 table-bordered health"></td>
                        </tr>
                    </tbody>
                </table>

                <br /><br />

                <div className="panel panel-default table-responsive">
                    <div className="panel-heading" id="render-production-task-notes">
                        <h3 className="panel-title">
                            <T>Comments</T>
                        </h3>
                        <br />
                        
                        <table className="table table-responsive table-condensed table-bordered" width="1px">
                            <thead>
                                <tr>
                                    <th className="TableCell" width="20px"> </th>
                                    <th className="TableCell" width="30px">Line</th>
                                    <th className="TableCell" width="90px">Create Date</th>
                                    <th className="TableCell" width="90px">Create by</th>
                                    <th className="TableCell" width="90px">Update Date</th>
                                    <th className="TableCell" width="90px">Update by</th>
                                    <th className="TableCell" >Comment</th>
                                </tr>
                            </thead>
                            <tbody id="commentsTable" style={{"backgroundColor":"whitesmoke"}}>
                                {this.props.comments.map(function(n){
                                    return(
                                        <tr id={n._id.valueOf()}>
                                            <td className="TableCell text-center">
                                                <input className="rowCheck" type="checkbox" />
                                            </td>
                                            <td className="TableCell text-center">{n.SEQ_NO}</td>
                                            <td className="TableCell">{formatDateTime(n.CREATE_DATE)}</td>
                                            <td className="TableCell">{formatString(n.CREATE_BY)}</td>
                                            <td className="TableCell">{formatDateTime(n.UPDATE_DATE)}</td>
                                            <td className="TableCell">{formatString(n.UPDATE_BY)}</td>
                                            <td className="TableCell">
                                                {formatString(n.USER_COMMENT)}<br />
                                                <input type="text" className="rowText" style={{width:"100%"}} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <br />Select the lines, then &nbsp;
                        <button className="btn btn-secondary" type="button" onClick={onClickUpdate}>Update</button>
                        &nbsp;or&nbsp;
                        <button className="btn btn-secondary" type="button" onClick={onClickDelete}>Delete</button>
                            
                        <br /><br />
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td className="col-md-11">
                                        <input type="text" id="addingComment" className="form-control input-lg" placeholder="Add a production memo note here."/>
                                    </td>
                                    <td className="col-md-1">
                                        <button className="btn btn-secondary" type="button" onClick={onClickInsert}>Insert</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                            
                    </div>
                </div>
                                                        
            </div>
        );
    }

    componentDidMount() {
        console.log("PanelComment:componentDidMount");
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
        console.log("PanelComment:componentDidUpdate");
        this.props.comments.map(
            (n)=>{
                $('#'+n._id.valueOf()+' .rowText').val(n.USER_COMMENT);
            }
        );

        this.updateDisplay();
    }

    componentWillUnmount() {
        console.log("PanelComment:componentWillUnmount");
        if(this.state!=undefined && this.state.timerId!=undefined && this.state.timerId!=null)   Meteor.clearInterval(this.state.timerId);
    }
}



import { createContainer } from 'meteor/react-meteor-data';

export default PanelComment = createContainer(({params}) => {
    return {
        product: PROD_MONITOR.find({"ID_NO": params.id }).fetch(),
        comments: PROD_MONITOR_COMMENT.find({"ID_NO": params.id }, {sort:['SEQ_NO']}).fetch(),
  };
}, PanelComment);

