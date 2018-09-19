import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';

import '../../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { prod_monitor } from '../../api/prod_monitor.js';
import { pm_dashboard } from '../../api/pm_dashboard.js';

import CF, {LocationTitles, LocationIcons, ShippingStatuses} from '../classes/CommonFunctions.jsx';
const cf=new CF();

import CheckboxFilter, {TrueFalseFilter} from './CheckboxFilter.jsx';

const T = i18n.createComponent(); // translator component for json lookup universe:i18n

import Highcharts from 'highcharts';


export class PanelDashboard extends Component {

    updateDisplay(){
        console.log("PanelDashboard:updateDisplay()");
        
        var ij=cf.InitJson();   // Get the values in Init.json file.
        
        if(this.props.products == undefined)    return;
        if(this.props.target == undefined)    return;

        // Colouring
        this.props.products.map((p)=>{
            console.log("PanelDashboard:updateDisplay():products.map()");
            // Row's colour
            var r=cf.productStatus(p);
            if(r.error || r[p.LOCATION_STATUS]==undefined || r[p.LOCATION_STATUS].thresholdClassName==undefined)  return;

            $("."+p.ID_NO.trim()).removeClass(  $("."+p.ID_NO.trim()).attr('class')  ).addClass( p.ID_NO.trim()+' '+r[p.LOCATION_STATUS].thresholdClassName );
        });
        
        // StackedColumnCharts
        if(ij.StackedColumnCharts!=undefined && ij.StackedColumnCharts.series!=undefined){
            ij.StackedColumnCharts.series[0].data=[
                this.props.target.TA_TARGET - this.props.counts.TA,
                this.props.target.MQ_TARGET - this.props.counts.MQ,
                this.props.target.BF_TARGET - this.props.counts.BF,
                this.props.target.SHIP_TARGET - this.props.counts.SHIP
            ];
            ij.StackedColumnCharts.series[1].data=[
                this.props.counts.TA,
                this.props.counts.MQ,
                this.props.counts.BF,
                this.props.counts.SHIP
            ];

            Highcharts.chart('StackedColumnCharts', ij.StackedColumnCharts);
        }
        
        // ProductionTargetPieChart
        if(ij.ProductionTargetPieChart!=undefined && ij.ProductionTargetPieChart.series!=undefined){
            ij.ProductionTargetPieChart.series[0].data[0].y=this.props.counts.PROD;
            ij.ProductionTargetPieChart.series[0].data[1].y=this.props.target.PROD_TARGET - this.props.counts.PROD;
       
            Highcharts.chart('ProductionTargetPieChart', ij.ProductionTargetPieChart);
        }

        // ShippedTargetPieChart
        if(ij.ShippedTargetPieChart!=undefined && ij.ShippedTargetPieChart.series!=undefined){
            ij.ShippedTargetPieChart.series[0].data[0].y=this.props.counts.SHIP;
            ij.ShippedTargetPieChart.series[0].data[1].y=this.props.target.SHIP_TARGET - this.props.counts.SHIP;
       
            Highcharts.chart('ShippedTargetPieChart', ij.ShippedTargetPieChart); 
        }

    }
    
/*
    componentWillMount(){
        console.log('PaneDashboard:componentWillMount');
    }
*/
    
    render() {
        console.log('PaneDashboard:render()');

        var trClassName=(row, rowIndex)=>{
            var r=cf.productStatus(row);

            // Row's colour
            if(r.error || r[row.LOCATION_STATUS]==undefined || r[row.LOCATION_STATUS].thresholdClassName==undefined)  return row.ID_NO.trim();
            return row.ID_NO.trim() +' '+ r[row.LOCATION_STATUS].thresholdClassName;
        }

        var formatIdNo=(cell,row,formatExtraData,rowIdx)=>{
            return  '<a href="/Comments/' + row.ID_NO.trim() + '">' + row.ID_NO.trim() + '</a>';
            
        }
        
        const cellStyle={'wordBreak':'keep-all','whiteSpace':'normal', 'font-size':'25px'};
        
        
        console.log('PaneDashboard:render:return()');
        return (
            <div className="container">
				<div className="row" id="Line1">
					<div className="col-md-6">
                        <div id="StackedColumnCharts"></div>
					</div>
                
					<div className="col-md-3">
                    	<div id="ProductionTargetPieChart"></div>
					</div>
					<div className="col-md-3">
                    	<div id="ShippedTargetPieChart"></div>
					</div>
				</div>

                <BootstrapTable ref="ProductsTable" data={this.props.products} trClassName={trClassName} scrollTop={'Top'} options={{'defaultSortName':'ID_NO','defaultSortOrder':'asc'}}>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='100px' dataField='ID_NO'                       dataFormat={formatIdNo}        dataSort isKey><T>ui.common.IdNo</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='150px' dataField='PLAN_PROD_FINISH_DATE'       dataFormat={cf.formatDateTime} dataSort       ><T>ui.common.PlannedFinish</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='150px' dataField='MQ_LINE_START_DATE'          dataFormat={cf.formatDateTime} dataSort       ><T>ui.common.MQLine</T><br /><T>ui.common.Start</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='150px' dataField='PRODUCTION_END_DATE'         dataFormat={cf.formatDateTime} dataSort       ><T>ui.common.ProductionCompletion</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='150px' dataField='INSPECTION_START_DATE'       dataFormat={cf.formatDateTime} dataSort       ><T>ui.common.Inspection</T><br /><T>ui.common.Start</T></TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" thStyle={cellStyle} tdStyle={cellStyle} width='150px' dataField='SHIPPING_DATE'               dataFormat={cf.formatDateTime} dataSort       ><T>ui.common.Shipping</T></TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }

// The followings were removed by the KFM's request.  20180917 UKUS.
/*
                        <table width="100%">
                            <tr>
                                <td width="50%">
                                    <div id="ProductionTargetPieChart"></div>
                
                                    <table width="100%" align="center" style={{"font-size":ij.StackedColumnCharts.legend.itemStyle.fontSize}}>
                                        <tr>
                                            <td style={{"color":ij.ProductionTargetPieChart.colors[0],"font-size":"125%"}}>●</td>
                                            <td>Total produced<br/>tractors (Monthly)</td>
                                            <td style={{"color":ij.ProductionTargetPieChart.colors[1],"font-size":"125%"}}>●</td>
                                            <td>Not produced<br/>tractors (Monthly)</td>
                                        </tr>
                                    </table>
                                </td>
                                <td width="50%">
                                    <div id="ShippedTargetPieChart"></div>
                                                    
                                    <table width="100%" align="center" style={{"font-size":ij.StackedColumnCharts.legend.itemStyle.fontSize}}>
                                        <tr>
                                            <td style={{"color":ij.ShippedTargetPieChart.colors[0],"font-size":"125%"}}>●</td>
                                            <td>Total shipped<br/>tractors (Monthly)</td>
                                            <td style={{"color":ij.ShippedTargetPieChart.colors[1],"font-size":"125%"}}>●</td>
                                            <td>Not shipped<br/>tractors (Monthly)</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
*/



    componentDidMount() {
        console.log("PanelDashboard:componentDidMount");

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
        console.log("PanelDashboard:componentDidUpdate");
        this.updateDisplay();

        i18n.onChangeLocale ((newLocale)=>{
            this.updateDisplay();
        })
    }

    componentWillUnmount() {
        console.log("PanelDashboard:componentWillUnmount");
        if(this.state!=undefined && this.state.timerId!=undefined && this.state.timerId!=null)   Meteor.clearInterval(this.state.timerId);
    }
};



import { Session } from 'meteor/session'

export default PanelDashboard = createContainer(() => {
	console.log("PanelDashboard:createContainer");
    
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

	// Count quantities 1 by 1.
    var now=new Date();
    var yyyymm=now.getFullYear()*100+now.getMonth()+1;
    var counts={TA:0, MQ:0, BF:0, PROD:0, SHIP:0};
    var delayingProducts=[];

    prod_monitor.find(f).fetch().map((p)=>{
        // Count TA.
        if(p.TRACTOR_LINE_END_DATE!=undefined){
            if(p.TRACTOR_LINE_END_DATE.getFullYear()*100+p.TRACTOR_LINE_END_DATE.getMonth()+1==yyyymm)  ++counts.TA;
        }
    
        // Count MQ.
        if(p.MQ_LINE_END_DATE!=undefined){
            if(p.MQ_LINE_END_DATE.getFullYear()*100+p.MQ_LINE_END_DATE.getMonth()+1==yyyymm)  ++counts.MQ;
        }

        // Count PROD.
        if(p.PRODUCTION_END_DATE!=undefined){
            if(p.PRODUCTION_END_DATE.getFullYear()*100+p.PRODUCTION_END_DATE.getMonth()+1==yyyymm)  ++counts.PROD;
        }

        // Count BF. "BackFlush" means "Produced but not yet shipped" according to Dimitri on 29March2018.
        if(p.PRODUCTION_END_DATE!=undefined && p.SHIPPING_DATE==undefined){
            if(p.PRODUCTION_END_DATE.getFullYear()*100+p.PRODUCTION_END_DATE.getMonth()+1==yyyymm)  ++counts.BF;
        }

        // Count SHIP.
        if(p.SHIPPING_DATE!=undefined){
            if(p.SHIPPING_DATE.getFullYear()*100+p.SHIPPING_DATE.getMonth()+1==yyyymm)  ++counts.SHIP;
        }

        // According to the KFM_Portal_Improvement_Proposal_2018_02_14.pptx ,
        // On this table, we would like to see tractors which are late (=> If Backflush date > Plan finish date).
        if(
                p.PLAN_PROD_FINISH_DATE==undefined
                ||  (p.PRODUCTION_END_DATE!=undefined && p.PLAN_PROD_FINISH_DATE.getTime()<p.PRODUCTION_END_DATE.getTime())
                ||  (p.PRODUCTION_END_DATE==undefined && p.PLAN_PROD_FINISH_DATE.getTime()<now.getTime())
        ){
            delayingProducts.push(p);
        }
    })
                
    return {
        counts: counts,
        target: pm_dashboard.findOne({"ID":1}),
        products: delayingProducts,
    };
}, PanelDashboard);
