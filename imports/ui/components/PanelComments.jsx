import React, { Component, PropTypes } from 'react';
import { prod_monitor_comment } from '../../api/prod_monitor_comment.js';
import { Link } from 'react-router';
import PanelLocationHealth from './PanelLocationHealth.jsx'

import CF from '../classes/CommonFunctions.jsx';
const cf=new CF();

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

//Production Task component - represents a single tractor item
export class PanelComments extends Component {

    render(){
        // console.log("PanelComments:render()");

        var onClickUpdate=(e)=>{
            $("#commentsTable > tr").each(function(){
                if($('.'+$(this).attr('class')+' .rowCheck').length <= 0)   return;
                if($('.'+$(this).attr('class')+' .rowCheck')[0].checked){
                    prod_monitor_comment.update(
                        {"_id":new Meteor.Collection.ObjectID($(this).attr('class'))},
                        {$set:{
                            "UPDATE_DATE":new Date(),
                            "UPDATE_BY":Meteor.user().username,
                            "USER_COMMENT":$('.'+$(this).attr('class')+" .rowText")[0].value,
                        }}
                    );
                    
                }
            });
            $(".rowCheck").prop('checked', false);
        }
        
        var onClickDelete=(e)=>{
            $("#commentsTable > tr").each(function(){
                if($('.'+$(this).attr('class')+" .rowCheck").length <= 0)   return;
                if($('.'+$(this).attr('class')+" .rowCheck")[0].checked){
                    prod_monitor_comment.remove(
                        {"_id":new Meteor.Collection.ObjectID($(this).attr('class'))}
                    );
                    
                }
            });
            $(".rowCheck").prop('checked', false);
        }

        var onClickInsert=(e)=>{
            // console.log("PanelComments:onClickInsert");
            // console.log(this.props.ID_NO);

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
            <div className="container">

                <PanelLocationHealth ID_NO={this.props.ID_NO}/>
                            
                <div className="panel panel-default table-responsive">
                    <div className="panel-heading" id="render-production-task-notes">
                        <h3 className="panel-title">
                            <T>ui.common.Comments</T>
                        </h3>
                        <br />
                        
                        <table className="table table-responsive table-condensed table-bordered" width="1px">
                            <thead>
                                <tr>
                                    {
                                        cf.Role(Meteor.user()).Comments ? (
                                            <th className="TableCell" width="20px"> </th>
                                        )
                                        :(
                                            null
                                        )
                                    }
                                    <th className="TableCell" width="30px"><center><T>ui.common.Line</T></center></th>
                                    <th className="TableCell" width="90px"><center><T>ui.common.CreateDate</T></center></th>
                                    <th className="TableCell" width="90px"><center><T>ui.common.CreateBy</T></center></th>
                                    <th className="TableCell" width="90px"><center><T>ui.common.UpdateDate</T></center></th>
                                    <th className="TableCell" width="90px"><center><T>ui.common.UpdateBy</T></center></th>
                                    <th className="TableCell"><center><T>ui.common.Comments</T></center></th>
                                </tr>
                            </thead>
                            <tbody id="commentsTable" style={{"backgroundColor":"whitesmoke"}}>
                                {this.props.comments.map(function(n,index){
                                    return(
                                        <tr key={index} className={n._id.valueOf()}>
                                            {
                                                cf.Role(Meteor.user()).Comments ? (
                                                    <td className="TableCell text-center">
                                                        {n.CREATE_BY==Meteor.user().username?<input className="rowCheck" type="checkbox" />:""}
                                                    </td>
                                                )
                                                :(
                                                    null
                                                )
                                            }
                                            <td className="TableCell text-center">{n.SEQ_NO}</td>
                                            <td className="TableCell">{cf.formatDateTime(n.CREATE_DATE)}</td>
                                            <td className="TableCell">{cf.formatString(n.CREATE_BY)}</td>
                                            <td className="TableCell">{cf.formatDateTime(n.UPDATE_DATE)}</td>
                                            <td className="TableCell">{cf.formatString(n.UPDATE_BY)}</td>
                                            <td className="TableCell">
                                                {cf.formatString(n.USER_COMMENT)}
                                                {
                                                    cf.Role(Meteor.user()).Comments ? (
                                                        <span>
                                                            <br />
                                                            {n.CREATE_BY==Meteor.user().username?<input type="text" className="rowText" style={{width:"100%"}} />:""}
                                                        </span>
                                                    )
                                                    :(
                                                        null
                                                    )
                                                }

                                                
                                                
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {
                            cf.Role(Meteor.user()).Comments ? (
                                <span>
                                    <br />
                                    <T>ui.comments.Guide001</T>
                                    <button className="btn btn-secondary" type="button" onClick={onClickUpdate}><T>ui.common.Update</T></button>
                                    <T>ui.comments.Guide002</T>
                                    <button className="btn btn-secondary" type="button" onClick={onClickDelete}><T>ui.common.Delete</T></button>
                                    <T>ui.comments.Guide003</T>
                                        
                                    <br /><br />
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <td className="col-md-11">
                                                    <T _translateProps={['placeholder']}>
                                                        <input type="text" id="addingComment" className="form-control input-lg" placeholder="ui.comments.Guide004"/>
                                                    </T>
                                                </td>
                                                <td className="col-md-1">
                                                    <button className="btn btn-secondary" type="button" onClick={onClickInsert}><T>ui.common.Insert</T></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </span>
                            )
                            :(
                                null
                            )
                        }

                            
                    </div>
                </div>
                                    
            </div>
        );
    }

    componentDidUpdate() {
        // console.log("PanelComments:componentDidUpdate()");
        // console.log(Meteor.user());
        this.props.comments.map(
            (n)=>{
                $('.'+n._id.valueOf()+' .rowText').val(n.USER_COMMENT);
            }
        );
    }

}



import { createContainer } from 'meteor/react-meteor-data';

export default PanelComments = createContainer(({params}) => {
    // console.log("PanelComments:createContainer()");
    // console.log(Meteor.user());
    Meteor.user();  // This require in the createContainer(). Unless this, this program does not react, componentDidUpdate() is not triggered.

    return {
        ID_NO: params.id,
        comments: prod_monitor_comment.find({"ID_NO": params.id }, {sort:['SEQ_NO']}).fetch(),
  };
}, PanelComments);

