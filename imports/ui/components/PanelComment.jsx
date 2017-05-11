import React, { Component, PropTypes } from 'react';
import { prod_monitor_comment } from '../../api/prod_monitor_comment.js';
import { Link } from 'react-router';
import PanelLocationHealth from './PanelLocationHealth.jsx'

import CF from '../classes/CommonFunctions.jsx';
const cf=new CF();

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

//Production Task component - represents a single tractor item
export class PanelComment extends Component {

    render(){
        
        var onClickUpdate=(e)=>{
            $("#commentsTable > tr").each(function(){
                if($("#"+this.id+" .rowCheck").length <= 0)   return;
                if($("#"+this.id+" .rowCheck")[0].checked){
                    prod_monitor_comment.update(
                        {"_id":new Meteor.Collection.ObjectID(this.id)},
                        {$set:{
                            "UPDATE_DATE":new Date(),
                            "UPDATE_BY":Meteor.user().username,
                            "USER_COMMENT":$("#"+this.id+" .rowText")[0].value,
                        }}
                    );
                    
                }
            });
            $(".rowCheck").prop('checked', false);
        }
        
        var onClickDelete=(e)=>{
            $("#commentsTable > tr").each(function(){
                if($("#"+this.id+" .rowCheck").length <= 0)   return;
                if($("#"+this.id+" .rowCheck")[0].checked){
                    prod_monitor_comment.remove(
                        {"_id":new Meteor.Collection.ObjectID(this.id)}
                    );
                    
                }
            });
            $(".rowCheck").prop('checked', false);
        }

        var onClickInsert=(e)=>{
            console.log("PanelComment:onClickInsert");
            console.log(this.props.ID_NO);

            var argv=[];
            var maxS=prod_monitor_comment.findOne({"ID_NO":this.props.ID_NO}, {sort:  {SEQ_NO: -1}});
            
            argv["ID_NO"]=this.props.ID_NO;
            argv["SEQ_NO"]= maxS==undefined? 1 : maxS.SEQ_NO+1;
            argv["CREATE_DATE"]=new Date();
            argv["CREATE_BY"]=Meteor.user().username;
            argv["USER_COMMENT"]=document.getElementById('addingComment').value;
            prod_monitor_comment.insert(argv);
            document.getElementById('addingComment').value="";
        }
        
        return(
            <div className="panel panel-default container-fluid">
                <br />

                <PanelLocationHealth ID_NO={this.props.ID_NO}/>
                            
                <div className="panel panel-default table-responsive">
                    <div className="panel-heading" id="render-production-task-notes">
                        <h3 className="panel-title">
                            <T>ui.common.Comment</T>
                        </h3>
                        <br />
                        
                        <table className="table table-responsive table-condensed table-bordered" width="1px">
                            <thead>
                                <tr>
                                    <th className="TableCell" width="20px"> </th>
                                    <th className="TableCell" width="30px"><center><T>ui.common.Line</T></center></th>
                                    <th className="TableCell" width="90px"><center><T>ui.common.CreateDate</T></center></th>
                                    <th className="TableCell" width="90px"><center><T>ui.common.CreateBy</T></center></th>
                                    <th className="TableCell" width="90px"><center><T>ui.common.UpdateDate</T></center></th>
                                    <th className="TableCell" width="90px"><center><T>ui.common.UpdateBy</T></center></th>
                                    <th className="TableCell"><center><T>ui.common.Comment</T></center></th>
                                </tr>
                            </thead>
                            <tbody id="commentsTable" style={{"backgroundColor":"whitesmoke"}}>
                                {this.props.comments.map(function(n){
                                    return(
                                        <tr id={n._id.valueOf()}>
                                            <td className="TableCell text-center">
                                                {n.CREATE_BY==Meteor.user().username?<input className="rowCheck" type="checkbox" />:""}
                                            </td>
                                            <td className="TableCell text-center">{n.SEQ_NO}</td>
                                            <td className="TableCell">{cf.formatDateTime(n.CREATE_DATE)}</td>
                                            <td className="TableCell">{cf.formatString(n.CREATE_BY)}</td>
                                            <td className="TableCell">{cf.formatDateTime(n.UPDATE_DATE)}</td>
                                            <td className="TableCell">{cf.formatString(n.UPDATE_BY)}</td>
                                            <td className="TableCell">
                                                {cf.formatString(n.USER_COMMENT)}<br />
                                                {n.CREATE_BY==Meteor.user().username?<input type="text" className="rowText" style={{width:"100%"}} />:""}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <br />
                        <T>ui.comment.Guide001</T>
                        <button className="btn btn-secondary" type="button" onClick={onClickUpdate}><T>ui.common.Update</T></button>
                        <T>ui.comment.Guide002</T>
                        <button className="btn btn-secondary" type="button" onClick={onClickDelete}><T>ui.common.Delete</T></button>
                        <T>ui.comment.Guide003</T>
                            
                        <br /><br />
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td className="col-md-11">
                                        <input type="text" id="addingComment" className="form-control input-lg" placeholder={i18n.__("ui.comment.Guide004")}/>
                                    </td>
                                    <td className="col-md-1">
                                        <button className="btn btn-secondary" type="button" onClick={onClickInsert}><T>ui.common.Insert</T></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                            
                    </div>
                </div>
                                    
            </div>
        );
    }

    componentDidUpdate() {
        console.log("PanelComment:componentDidUpdate");
        this.props.comments.map(
            (n)=>{
                $('#'+n._id.valueOf()+' .rowText').val(n.USER_COMMENT);
            }
        );
    }

}



import { createContainer } from 'meteor/react-meteor-data';

export default PanelComment = createContainer(({params}) => {
    return {
        ID_NO: params.id,
        comments: prod_monitor_comment.find({"ID_NO": params.id }, {sort:['SEQ_NO']}).fetch(),
  };
}, PanelComment);

