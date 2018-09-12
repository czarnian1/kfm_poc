import React, { Component, PropTypes } from 'react';
import { prod_monitor_parts } from '../../api/prod_monitor_parts.js';
import { Link } from 'react-router';

import '../../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import PanelLocationHealth from './PanelLocationHealth.jsx'

import CF from '../classes/CommonFunctions.jsx';
const cf=new CF();

import CheckboxFilter, {TrueFalseFilter} from './CheckboxFilter.jsx';

const T = i18n.createComponent(); // translater component for json lookup universe:i18n


export class PanelMissingParts extends Component {
    
    render(){
        var onClickUpdate=()=>{
//            console.log(this.refs.MissingPartsTable.state.selectedRowKeys)
            
            for(var currentValue in this.refs.MissingPartsTable.state.selectedRowKeys){
                var p=prod_monitor_parts.findOne({'ID_NO':this.props.ID_NO,'ITEM_NUMBER':this.refs.MissingPartsTable.state.selectedRowKeys[currentValue]});
                if(p.Ack===true){
                    prod_monitor_parts.update(
                        {"_id":p._id},
                        {$set:{
                            "Ack":false,
                            "AckBy":'',
                            "AckOn":'',
                        }}
                    );
                }
                else{
                    prod_monitor_parts.update(
                        {"_id":p._id},
                        {$set:{
                            "Ack":true,
                            "AckBy":Meteor.user().username,
                            "AckOn":new Date(),
                        }}
                    );
                }

            }   // for
        }
        
        var formatAck=(cell,row,formatExtraData,rowIdx)=>{
            return  (row.Ack===true ? '<span class="glyphicon glyphicon-ok text-success" />' : '<span class="glyphicon glyphicon-exclamation-sign text-warning" />');
//            return  (row.Ack===false ? '<span class="glyphicon glyphicon-exclamation-sign text-warning" />' : '<span class="glyphicon glyphicon-ok text-success" />');
        }

        var selectRowProp=()=>{
            if(cf.Role(Meteor.user()).GoodsReceipt) return {mode:'checkbox'}

            return  {};
        };

        
        const cellStyle={'wordBreak':'keep-all','whiteSpace':'normal'};
        const filterAck={type:'CustomFilter',getElement:TrueFalseFilter,customFilterParameters:{textTrue:'ui.missingParts.Received',textFalse:'ui.missingParts.Missing'}};

        return(
            <div className="container">

                <PanelLocationHealth ID_NO={this.props.ID_NO}/>
                <div className="panel panel-default">
                    <div className="panel-heading" id="render-production-task-notes">
                        <h3 className="panel-title">
                            <T>ui.common.MissingParts</T>
                        </h3>
                        {
                            cf.Role(Meteor.user()).GoodsReceipt ? (
                                <div className="text-right">
                                    <T>ui.comments.Guide001</T>
                                    <button className="btn btn-secondary" type="button" onClick={onClickUpdate.bind(this)}><T>ui.missingParts.ToggleGR</T></button>
                                    <T>ui.comments.Guide003</T><br /><br />
                                </div>
                            )
                            :(
                                null
                            )
                        }

                        <BootstrapTable data={this.props.parts} ref="MissingPartsTable" search scrollTop={'Top'} options={{'defaultSortName':'SEQ_NO','defaultSortOrder':'asc'}} selectRow={selectRowProp()}>
                            <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width= '40px' dataField='SEQ_NO'           dataFormat={cf.formatString}   dataSort searchable={false}><T>ui.common.Line</T></TableHeaderColumn>
                            <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='ITEM_NUMBER'      dataFormat={cf.formatString}   dataSort isKey><T>ui.missingParts.ItemNumber</T></TableHeaderColumn>
                            <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='150px' dataField='ITEM_DESCRIPTION' dataFormat={cf.formatString}   searchable={false}><T>ui.missingParts.ItemDescription</T></TableHeaderColumn>
                            <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width= '60px' dataField='REQUIREMENT_QTY'  dataFormat={cf.formatString}   searchable={false}><T>ui.missingParts.RequiredQuantity</T></TableHeaderColumn>
                            <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width= '60px' dataField='MISSING_QTY'      dataFormat={cf.formatString}   searchable={false}><T>ui.missingParts.MissingQuantity</T></TableHeaderColumn>
                            <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='CALCULATED_DATE'  dataFormat={cf.formatDateTime} searchable={false}><T>ui.missingParts.CalculatedDate</T></TableHeaderColumn>
                            <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width= '80px' dataField='Ack'              dataFormat={formatAck}         searchable={false} filter={filterAck}><T>ui.missingParts.Ack</T></TableHeaderColumn>
                            <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='AckBy'            dataFormat={cf.formatString}   dataSort><T>ui.missingParts.AckBy</T></TableHeaderColumn>
                            <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='AckOn'            dataFormat={cf.formatDateTime} dataSort searchable={false}><T>ui.missingParts.AckOn</T></TableHeaderColumn>
                        </BootstrapTable>

                    </div>
                </div>
            </div>
        );
    }

}

 
 import { createContainer } from 'meteor/react-meteor-data';

export default PanelMissingParts = createContainer(({params}) => {

    Meteor.user();  // This require in the createContainer(). Unless this, this program does not react, componentDidUpdate() is not triggered.

    return {
        ID_NO: params.id,
        parts: prod_monitor_parts.find({"ID_NO":params.id}).fetch(),
//        parts: prod_monitor_parts.find({"ID_NO": params.id }, {sort:['SEQ_NO']}).fetch(),
  };
}, PanelMissingParts);

