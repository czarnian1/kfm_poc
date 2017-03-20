import React, { Component, PropTypes } from 'react';

import { Productiontasks } from '../../api/productiontasks.js';
import { Productiontask_notes } from '../../api/productiontask_notes.js';

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

//Production Task component - represents a single tractor item
export class ProductiontaskComponent extends Component {
    render(){
        var r=this.props.productiontask;

        var CurrentLocation=function(stage){
            switch(parseInt(stage)){
            case 1: return  'common.main.CHASSIS_LINE_title';
            case 2: return  'common.main.PAINT_LINE_title';
            case 3: return  'common.main.TRACTOR_LINE_title';
            case 4: return  'common.main.REWORK_BEFORE_MQ_title';
            case 5: return  'common.main.MQ_LINE_title';
            case 6: return  'common.main.REWORK_AFTER_MQ_title';
            case 7: return  'common.main.PRODUCTION_END_title';
            case 8: return  'common.main.INSPECTION_title';
            case 9: return  'common.main.REWORK_DUR_INSP_title';
            case 10: return 'common.main.SHIPPING_title';
            default: return 'data error, unknown IDNO_STATE #'+r.IDNO_STATE+"#";
            }
        }
        
        var formatDateTime=function(d){
            var r="";
            
            if(d==undefined)    return "";
            if(!(d instanceof Date))    return "";

            r+=d.getFullYear();
            r+='-'+('0'+(d.getMonth()+1)).slice( -2 );
            r+='-'+('0'+d.getDate()).slice( -2 );
            r+=' '+('0'+d.getHours()).slice( -2 );
            r+=':'+('0'+d.getMinutes()).slice( -2 );
            r+=':'+('0'+d.getSeconds()).slice( -2 );

            return r;
        }
        
        var onClickValid=function(e){
            console.log("ProductiontaskComponent:onClickValid id="+e.currentTarget.id);
        }
        
        var onClickCreate=function(e){
            console.log("ProductiontaskComponent:onClickCreate id="+e.currentTarget.id);

            var argv=[];
            
            argv["ID_NO"]=r[0].ID_NO;
            argv["created_on"]=new Date();
            argv["created_by"]=Meteor.user().username;
            argv["note_data"]=document.getElementById('productionMemoNote').value;
            argv["note_valid"]=true;
            Productiontask_notes.insert(argv);
        }
        
        return(
            <div>
                <table className="table table-bordered"> 
                    <thead>
                        <tr>
                            <td className="col-md-3 table-bordered">ID_NO</td>
                            <td className="col-md-3 table-bordered">Started</td>
                            <td className="col-md-3 table-bordered">Current Location</td>
                            <td className="col-md-3 table-bordered">Status</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="col-md-3 table-bordered">{r.map(function(d){return d.ID_NO})}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.CREATE_DATE)})}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return i18n.__(CurrentLocation(d.IDNO_STATE))})}</td>
                            <td className="col-md-3 table-bordered">Programmed soon!</td>
                        </tr>
                    </tbody>
                </table>
                        
                <table className="table"> 
                    <tbody>
                        <tr>
                            <td className="col-md-5">Time until area Threshhold</td>
                            <td className="col-md-5">Age since assembly start</td>
                            <td className="col-md-2">Health</td>
                        </tr>
                    </tbody>
                </table>

                <table className="table table-bordered"> 
                    <thead>
                        <tr>
                            <td className="col-md-3 table-bordered">Stage</td>
                            <td className="col-md-3 table-bordered">Entry</td>
                            <td className="col-md-3 table-bordered">Exit</td>
                            <td className="col-md-3 table-bordered">Health</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="col-md-3 table-bordered">{i18n.__(CurrentLocation(1))}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.CHASSIS_LINE_START_DATE)})}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.CHASSIS_LINE_END_DATE)})}</td>
                            <td className="col-md-3 table-bordered"></td>
                        </tr>
                            <tr>
                            <td className="col-md-3 table-bordered">{i18n.__(CurrentLocation(2))}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.PAINT_LINE_START_DATE)})}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.PAINT_LINE_END_DATE)})}</td>
                            <td className="col-md-3 table-bordered"></td>
                        </tr>
                            <tr>
                            <td className="col-md-3 table-bordered">{i18n.__(CurrentLocation(3))}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.TRACTOR_LINE_START_DATE)})}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.TRACTOR_LINE_END_DATE)})}</td>
                            <td className="col-md-3 table-bordered"></td>
                        </tr>
                            <tr>
                            <td className="col-md-3 table-bordered">{i18n.__(CurrentLocation(4))}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.REWORK_BEFORE_MQ_START_DATE)})}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.REWORK_BEFORE_MQ_END_DATE)})}</td>
                            <td className="col-md-3 table-bordered"></td>
                        </tr>
                            <tr>
                            <td className="col-md-3 table-bordered">{i18n.__(CurrentLocation(5))}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.MQ_LINE_START_DATE)})}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.MQ_LINE_END_DATE)})}</td>
                            <td className="col-md-3 table-bordered"></td>
                        </tr>
                            <tr>
                            <td className="col-md-3 table-bordered">{i18n.__(CurrentLocation(6))}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.REWORK_AFTER_MQ_START_DATE)})}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.REWORK_AFTER_MQ_END_DATE)})}</td>
                            <td className="col-md-3 table-bordered"></td>
                        </tr>
                            <tr>
                            <td className="col-md-3 table-bordered">{i18n.__(CurrentLocation(7))}</td>
                            <td className="col-md-3 table-bordered">-------------------</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.PRODUCTION_END_DATE)})}</td>
                            <td className="col-md-3 table-bordered"></td>
                        </tr>
                            <tr>
                            <td className="col-md-3 table-bordered">{i18n.__(CurrentLocation(8))}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.INSPECTION_START_DATE)})}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.INSPECTION_END_DATE)})}</td>
                            <td className="col-md-3 table-bordered"></td>
                        </tr>
                            <tr>
                            <td className="col-md-3 table-bordered">{i18n.__(CurrentLocation(9))}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.REWORK_DUR_INSP_START_DATE)})}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.REWORK_DUR_INSP_END_DATE)})}</td>
                            <td className="col-md-3 table-bordered"></td>
                        </tr>
                            <tr>
                            <td className="col-md-3 table-bordered">{i18n.__(CurrentLocation(10))}</td>
                            <td className="col-md-3 table-bordered">{r.map((d)=>{return formatDateTime(d.SHIPPING_DATE)})}</td>
                            <td className="col-md-3 table-bordered">-------------------</td>
                            <td className="col-md-3 table-bordered"></td>
                        </tr>
                    </tbody>
                </table>

                <div className="panel-heading" id="render-production-task-notes">
                    <h3 className="panel-title">
                        <T>Production Task Notes</T>
                    </h3>
                        
                    <table className="table table-bordered">
                        <tbody>
                            {this.props.productiontask_notes.map(function(n){
                                return(
                                    <tr>
                                        <td className="col-md-1">{n.created_by}</td>
                                        <td className="col-md-2">{formatDateTime(n.created_on)}</td>
                                        <td className="col-md-8">{n.note_data}</td>
                                        <td className="col-md-1">
                                            <input type="checkbox" onClick={onClickValid} id={n._id.valueOf()} />valid
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                            
                    <table className="table">
                        <tbody>
                            <tr>
                                <td className="col-md-1">
                                    <button class="btn btn-secondary" type="button" onClick={onClickCreate}>Create</button>
                                </td>
                                <td className="col-md-11">
                                    <input type="text" id="productionMemoNote" className="form-control input-lg" placeholder="Add a production memo note here."/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                            
                </div>
                                    
            </div>
        );
    }
}


import { createContainer } from 'meteor/react-meteor-data';

export default ProductiontaskComponent = createContainer(({params}) => {
    return {
        productiontask: Productiontasks.find({"ID_NO": params.id }).fetch(),
        productiontask_notes: Productiontask_notes.find().fetch()
  };
}, ProductiontaskComponent);

