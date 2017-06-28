import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';

import '../../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { prod_monitor } from '../../api/prod_monitor.js';
import { prod_monitor_comment } from '../../api/prod_monitor_comment.js';
import { prod_monitor_parts } from '../../api/prod_monitor_parts.js';

import CF, {LocationTitles, LocationIcons, ShippingStatuses} from '../classes/CommonFunctions.jsx';
const cf=new CF();

import CheckboxFilter, {TrueFalseFilter} from './CheckboxFilter.jsx';


const T = i18n.createComponent(); // translater component for json lookup universe:i18n

export class PanelMain extends Component {
    
    updateDisplay(){
//        console.log("PanelMain:updateDisplay()");
        if(this.props.products == undefined)    return;
        if(this.props.products <= 0)    return;
        
        this.props.products.map((p)=>{
//            console.log("PanelMain:updateDisplay():products.map()");
            var r=cf.productStatus(p);

            // Comments
            var c=prod_monitor_comment.find({"ID_NO":p.ID_NO.trim()}).count();
            prod_monitor.update(
                {"_id":p._id},
                {$set:{"Comments":c}}
            );

            // Missing parts
            var mp=prod_monitor_parts.find({"ID_NO":p.ID_NO.trim(),'Ack':{'$ne':true}}).count();
            prod_monitor.update(
                {"_id":p._id},
                {$set:{"MissingParts":mp}}
            );
           
            // Row's color
            if(r.error || r[p.LOCATION_STATUS]==undefined || r[p.LOCATION_STATUS].thresholdClassName==undefined)  return;

            $("."+p.ID_NO.trim()).removeClass(  $("."+p.ID_NO.trim()).attr('class')  ).addClass( p.ID_NO.trim()+' '+r[p.LOCATION_STATUS].thresholdClassName );
        });
    }
    
/*
    componentWillMount(){
        console.log('PaneMain:componentWillMount');
    }
*/
    
    render() {
//        console.log('PaneMain:render()');
        
        var trClassName=(row, rowIndex)=>{
            var r=cf.productStatus(row);

            // Row's color
            if(r.error || r[row.LOCATION_STATUS]==undefined || r[row.LOCATION_STATUS].thresholdClassName==undefined)  return row.ID_NO.trim();
            return row.ID_NO.trim() +' '+ r[row.LOCATION_STATUS].thresholdClassName;
        }
     // UKUS 28June2017.
        var formatIdNo=(cell,row,formatExtraData,rowIdx)=>{
            return  '<a href="/Comments/' + row.ID_NO.trim() + '">' + row.ID_NO.trim() + '</a>';
            
        }
        
        var formatComment=(cell,row,formatExtraData,rowIdx)=>{
            if(row.Comments==undefined || row.Comments==0)  return  '<a href="/Comments/' + row.ID_NO.trim() + '"><span class="glyphicon glyphicon-ok text-success" /></a>';
            return  '<a href="/Comments/' + row.ID_NO.trim() + '"><span class="glyphicon glyphicon-exclamation-sign text-warning" /></a>';
        }
        
        var formatLocationStatus=(cell,row,formatExtraData,rowIdx)=>{
//            if(row.LOCATION_STATUS==undefined)  return <span>Incorrect LOCATION_STATUS</span>;        // UKUS 28June2017.
            if(row.LOCATION_STATUS==undefined)  row.LOCATION_STATUS=0;      // UKUS 28June2017. "null" means Pre-production.

            return  '<i class="kubota-fs-32 '+LocationIcons[row.LOCATION_STATUS]+'"></i><span class ="kubota-pad-icon-text">'+i18n.__(LocationTitles[row.LOCATION_STATUS])+"</span>";
//            return  '<span><i class="kubota-fs-32 '+LocationIcons[cell]+'"></i><T>'+LocationTitles[cell]+'</T></span>';
//            return  (<i class="kubota-fs-32 {LocationIcons[cell]}"></i><T>{LocationTitles[cell]}</T>);
//            return  (<i class="kubota-fs-32 {LocationIcons[cell]}"></i>);
//            return  <span><i class="kubota-fs-32 {LocationIcons[cell]}" ></i><T>{LocationTitles[cell]}</T></span>;
//            return  <T><i class="kubota-fs-32 {LocationIcons[cell]}" ></i></T>;

        }
        
        var formatMissingParts=(cell,row,formatExtraData,rowIdx)=>{
            if(row.MissingParts==undefined || row.MissingParts==0)  return  '<a href="/MissingParts/' + row.ID_NO.trim() + '"><span class="glyphicon glyphicon-ok text-success" /></a>';
            return  '<a href="/MissingParts/' + row.ID_NO.trim() + '"><span class="glyphicon glyphicon-exclamation-sign text-warning" /></a>';
        }
        
        var formatShippingStatus=(cell,row,formatExtraData,rowIdx)=>{
            if(row.SHIPPING_STATUS==undefined)  return  <T>{ShippingStatuses[0]}</T>;
            return  <T>{ShippingStatuses[row.SHIPPING_STATUS]}</T>;
        }
        
        var hide=(column)=>{
            var u=Meteor.user();
            if(u==undefined || u.profile==undefined || u.profile.ShownColumns==undefined)    return  false;

            if(u['profile']['ShownColumns'][column]==undefined)    return  false;
            else    return  ! u['profile']['ShownColumns'][column];
        }
        
        const cellStyle={'wordBreak':'keep-all','whiteSpace':'normal'};
        const filterLocationStatus={type:'SelectFilter',placeholder:' ',options:cf.i18nLocationTitles()};
        const filterMissingParts={type:'CustomFilter',getElement:TrueFalseFilter,customFilterParameters:{textTrue:'ui.missingParts.Missing',textFalse:'ui.missingParts.Received'}};
        const filterShippingStatus={type:'SelectFilter',placeholder:' ',options:cf.i18nShippingStatuses()};
        
//        console.log('PaneMain:render:return()');
        return (
            <div className="container">

                <BootstrapTable data={this.props.products} trClassName={trClassName} search scrollTop={'Top'} options={{'defaultSortName':'MONTHLY_SEQ','defaultSortOrder':'asc'}}>
                
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='MONTHLY_SEQ'                 dataFormat={cf.formatString} dataSort filter={{type:'TextFilter',placeholder:' '}} hidden={hide('MonthlySequenceNo')}><T>ui.common.MonthlySequenceNo</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='ID_NO'                       dataFormat={formatIdNo} dataSort filter={{type:'TextFilter',placeholder:' '}} isKey><T>ui.common.IdNo</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='90px'  dataField='MODEL_CODE'                  dataFormat={cf.formatString} searchable={false} hidden><T>ui.common.ModelCode</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='120px' dataField='REMARKS'                     dataFormat={cf.formatString} searchable={false} hidden><T>ui.common.ModelDescription</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='250px' dataField='PLAN_PROD_FINISH_DATE'       dataFormat={cf.formatDateTime} dataSort filter={{type:'DateFilter'}}><T>ui.common.PlannedFinish</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='Comments'                    dataFormat={formatComment} searchable={false}><T>ui.common.Comments</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='120px' dataField='LOCATION_STATUS'             dataFormat={formatLocationStatus} dataSort searchable={false} filter={filterLocationStatus}><T>ui.common.LocationStatus</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='MissingParts'                dataFormat={formatMissingParts} searchable={false} filter={filterMissingParts}><T>ui.common.MissingParts</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='CHASSIS_LINE_START_DATE'     dataFormat={cf.formatDateTime} dataSort hidden={hide('ChassisLine')}><T>ui.common.ChassisLine</T><br /><T>ui.common.Start</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='CHASSIS_LINE_END_DATE'       dataFormat={cf.formatDateTime} dataSort hidden={hide('ChassisLine')}><T>ui.common.ChassisLine</T><br /><T>ui.common.End</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='PAINT_LINE_START_DATE'       dataFormat={cf.formatDateTime} dataSort hidden={hide('PaintLine')}><T>ui.common.PaintLine</T><br /><T>ui.common.Start</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='PAINT_LINE_END_DATE'         dataFormat={cf.formatDateTime} dataSort hidden={hide('PaintLine')}><T>ui.common.PaintLine</T><br /><T>ui.common.End</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='TRACTOR_LINE_START_DATE'     dataFormat={cf.formatDateTime} dataSort hidden={hide('TractorLine')}><T>ui.common.TractorLine</T><br /><T>ui.common.Start</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='TRACTOR_LINE_END_DATE'       dataFormat={cf.formatDateTime} dataSort hidden={hide('TractorLine')}><T>ui.common.TractorLine</T><br /><T>ui.common.End</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='REWORK_BEFORE_MQ_START_DATE' dataFormat={cf.formatDateTime} dataSort hidden={hide('ReworkBeforeMQ')}><T>ui.common.ReworkBeforeMQ</T><br /><T>ui.common.Start</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='REWORK_BEFORE_MQ_END_DATE'   dataFormat={cf.formatDateTime} dataSort hidden={hide('ReworkBeforeMQ')}><T>ui.common.ReworkBeforeMQ</T><br /><T>ui.common.End</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='MQ_LINE_START_DATE'          dataFormat={cf.formatDateTime} dataSort hidden={hide('MQLine')}><T>ui.common.MQLine</T><br /><T>ui.common.Start</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='MQ_LINE_END_DATE'            dataFormat={cf.formatDateTime} dataSort hidden={hide('MQLine')}><T>ui.common.MQLine</T><br /><T>ui.common.End</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='REWORK_AFTER_MQ_START_DATE'  dataFormat={cf.formatDateTime} dataSort hidden={hide('ReworkAfterMQ')}><T>ui.common.ReworkAfterMQ</T><br /><T>ui.common.Start</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='REWORK_AFTER_MQ_END_DATE'    dataFormat={cf.formatDateTime} dataSort hidden={hide('ReworkAfterMQ')}><T>ui.common.ReworkAfterMQ</T><br /><T>ui.common.End</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='PRODUCTION_END_DATE'         dataFormat={cf.formatDateTime} dataSort hidden={hide('ProductionCompletion')}><T>ui.common.ProductionCompletion</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='INSPECTION_START_DATE'       dataFormat={cf.formatDateTime} dataSort hidden={hide('Inspection')}><T>ui.common.Inspection</T><br /><T>ui.common.Start</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='INSPECTION_END_DATE'         dataFormat={cf.formatDateTime} dataSort hidden={hide('Inspection')}><T>ui.common.Inspection</T><br /><T>ui.common.End</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='REWORK_DUR_INSP_START_DATE'  dataFormat={cf.formatDateTime} dataSort hidden={hide('ReworkDuringInspection')}><T>ui.common.ReworkDuringInspection</T><br /><T>ui.common.Start</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='REWORK_DUR_INSP_END_DATE'    dataFormat={cf.formatDateTime} dataSort hidden={hide('ReworkDuringInspection')}><T>ui.common.ReworkDuringInspection</T><br /><T>ui.common.End</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='120px' dataField='SHIPPING_STATUS'             dataFormat={formatShippingStatus} dataSort searchable={false} filter={filterShippingStatus}><T>ui.common.ShippingStatus</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='SHIPPING_DATE'               dataFormat={cf.formatDateTime} searchable={false}  ><T>ui.common.Shipping</T></TableHeaderColumn>
                    
                </BootstrapTable>

            </div>
        );
    }

   /*
    * 
    */
    
    componentDidMount() {
//        console.log("PanelMain:componentDidMount");

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
//        console.log("PanelMain:componentDidUpdate");
        this.updateDisplay();

        i18n.onChangeLocale ((newLocale)=>{
            this.updateDisplay();
        })
    }

    componentWillUnmount() {
//        console.log("PanelMain:componentWillUnmount");
        if(this.state!=undefined && this.state.timerId!=undefined && this.state.timerId!=null)   Meteor.clearInterval(this.state.timerId);
    }
};



import { Session } from 'meteor/session'

export default PanelMain = createContainer(() => {
//    console.log("PanelMain:createContainer");
    
    Meteor.user();  // This require in the createContainer(). Unless this, this program does not react, componentDidUpdate() is not triggered.

    var f={};
    // Production status (means 1 hour limit)
    Session.setDefault("productionStatus", {"$gte" : new Date(1)} );
    f['$or']=[
        {"CREATE_DATE":Session.get("productionStatus")},
        {"UPDATE_DATE":Session.get("productionStatus")}
    ];
    
    // Filter ID_NO
    var u=Meteor.user();
    if(u!=undefined && u.profile!=undefined && u.profile.IdNoFilter!=undefined){
        if(u.profile.IdNoFilter.Start!=undefined && u.profile.IdNoFilter.End!=undefined){
            f['ID_NO']={"$gte":u.profile.IdNoFilter.Start,"$lte":u.profile.IdNoFilter.End};
        }
        if(u.profile.IdNoFilter.Start!=undefined && u.profile.IdNoFilter.End==undefined){
            f['ID_NO']={"$gte":u.profile.IdNoFilter.Start};
        }
        if(u.profile.IdNoFilter.Start==undefined && u.profile.IdNoFilter.End!=undefined){
            f['ID_NO']={"$lte":u.profile.IdNoFilter.End};
        }
    }
    
    return {
        products: prod_monitor.find(f).fetch(),
    };
}, PanelMain);

