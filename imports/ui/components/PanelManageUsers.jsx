import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory, Link } from 'react-router'

import '../../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

import CF, {LocationTitles, LocationIcons, ShippingStatuses} from '../classes/CommonFunctions.jsx';
const cf=new CF();



export class PanelManageUsers extends Component {

    render() {
        console.log('PanelManageUsers:render()');

        // In the Admin role?
        if ( ! cf.Role(Meteor.user()).AdminScreen ) {
            return (
                <span>
                    <T>ui.manageAccount.NoAdminRole</T> &nbsp;
                    <a href="/Main" ><T>ui.common.BackToMainScreen</T></a>
                </span>
            );
        }

        var onClickDelete=(_id)=>{
            console.log('PanelManageUsers:onClickDelete()');

            // Update MongoDB
            Meteor.call(
                'deleteLoginAccount', 
                _id, 
                (error, result) => {
                    err=result;
                }
            );
        }
        
        var onChangeRole=(_id,val)=>{
            console.log('PanelManageUsers:onChangeRole()');

            var argv={};
            
            // _id
            argv["_id"]=_id;

            // Role
            argv.roles={};
            argv.roles[Roles.GLOBAL_GROUP]=[];
            argv.roles[Roles.GLOBAL_GROUP][0]=val;
            
            // Update MongoDB
            Meteor.call(
                'updateLoginAccount', 
                argv, 
                (error, result) => {
                    err=result;
                }
            );
        }
        
        var trClassName=(row, rowIndex)=>{
            return row._id;
        }
        
        var formatUsername=(cell,row,formatExtraData,rowIdx)=>{
            return  '<a href="/ManageAccount/' + row._id + '">' + row.username + '</a>';
        }
        
        var formatEmailAddress=(cell,row,formatExtraData,rowIdx)=>{
            if(row==undefined || row.emails==undefined || row.emails[0]==undefined || row.emails[0].address==undefined)   return  <span></span>
            
            return  '<a href="/ManageAccount/' + row._id + '">' + row.emails[0].address + '</a>';
        }
        
        var formatAction=(cell,row,formatExtraData,rowIdx)=>{
            if(Meteor.userId()==row._id){
                return  <label className="label label-success">Yourself</label>;
            }
            else{
                return (
                    <button className="btn btn-secondary" type="button" onClick={(proxy,event)=>{ onClickDelete(row._id) }}><T>ui.common.Delete</T></button>
                );
            }
        }

        var formatRole=(cell,row,formatExtraData,rowIdx)=>{
            var r=cf.Roles()[0].role;    // Set default value;
            if(row!=undefined && row.roles!=undefined && row.roles[Roles.GLOBAL_GROUP]!=undefined && row.roles[Roles.GLOBAL_GROUP][0]!=undefined){
                r=row.roles[Roles.GLOBAL_GROUP][0];
            }
        
            if(Meteor.userId()==row._id){
                return  <label className="label label-success">Yourself</label>;
            }
            else{
                return (
                    <select value={r} onChange={(event)=>{ onChangeRole(row._id,event.target.value) }}>{
                        cf.Roles().map(
                            (currentValue,index,array)=>{
                                return (<option key={index} value={currentValue.role}><T>{currentValue.message}</T></option>);
                            }
                        )
                    }
                    </select>
                );
            }
        
        }

        const cellStyle={'wordBreak':'keep-all','whiteSpace':'normal'};

        return (
            <div className="container">

                <a href="/Main" ><T>ui.common.BackToMainScreen</T></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="/ManageAccount" ><T>ui.manageAccount.CreateAccount</T></a>
                <h1 className="text-center"><T>ui.manageAccount.ManageUsers</T></h1>
                            
                <BootstrapTable data={this.props.users} trClassName={trClassName} search scrollTop={'Top'} options={{'defaultSortName':'username','defaultSortOrder':'asc'}}>
                
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='username' dataFormat={formatUsername} dataSort isKey><T>ui.login.Username</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='200px' dataField='emails'   dataFormat={formatEmailAddress} ><T>ui.manageAccount.EmailAddress</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='_id'      dataFormat={formatAction} searchable={false}></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='roles'    dataFormat={formatRole}   searchable={false} columnClassName='Role'><T>ui.manageAccount.Role</T></TableHeaderColumn>
                    
                </BootstrapTable>
                    
            </div>
                    
        );
    }

}

export default PanelManageUsers = createContainer(() => {
    console.log("PanelManageUsers:createContainer");
    
    Meteor.subscribe( 'users' );
    
    if( cf.Role(Meteor.user()).AdminScreen ){
/*        
        users=Meteor.users.find().fetch();
        users.map(
            (currentValue,index,array)=>{
                if(currentValue.roles==undefined)   currentValue.roles={};
                if(currentValue.roles[Roles.GLOBAL_GROUP]==undefined)   currentValue.roles[Roles.GLOBAL_GROUP]=[];
                if(currentValue.roles[Roles.GLOBAL_GROUP][0]==undefined)    currentValue.roles[Roles.GLOBAL_GROUP][0]='Standard';
            }
        )
        return {users:users};
*/
        return {users:Meteor.users.find().fetch()};
    }
    else    return {users:[]};
    
}, PanelManageUsers);
