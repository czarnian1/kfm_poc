import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import Clock from 'react-live-clock';

import Snap from 'snapsvg';

import { prod_monitor } from '../../api/prod_monitor.js';
import { prod_monitor_comment } from '../../api/prod_monitor_comment.js';
import { prod_monitor_parts } from '../../api/prod_monitor_parts.js';

import CF, {LocationTitles, LocationIcons, ShippingStatuses} from '../classes/CommonFunctions.jsx';
const cf=new CF();

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

//const SVGCX = 589;
//const SVGCY = 73;
const SVGCX = 100;
const SVGCY = 5;
const DIVIDER=3;
const AREA_HEIGHT=22;

var boundingBoxes = [];
var textPaint, textMqline, textTractor, paintIds;

export class FactoryDash extends Component {
   
    constructor(props) {
	super(props);
    } 

    updateTextElements(areaElement, circleElement, count, ids, collection) {
      mIds=[];
      collection.map((p)=>{
        //use xlink in the future this is not possible
        //mIds.push('<a href="/Comments/'+p.ID_NO.trim() + '">');
        mIds.push(p.ID_NO);
      });
      count.node.textContent = collection.length;
      ids.attr({text:mIds});
      //select all new tspan elements and append attr to align the new tspans
      ids.children().map(function(child,index) { 
         child.attr({x: child.parent().attr('x'), dx:0, dy: 5});
        });
      //change colour of count_circle based on age in area
      collection.map(function(p) {
	var r=cf.productStatus(p);
        if(r.error || r[p.LOCATION_STATUS]==undefined || r[p.LOCATION_STATUS].thresholdColor==undefined) { 
	  return
	} else {
          circleElement.attr({fill: r[p.LOCATION_STATUS].thresholdColor, opacity: 0.5, fill_opacity: 0.5});
        }
      });
      //change height of rectangle element to accomodate number of tspans
      areaElementHeight=areaElement.attr('height');
      areaElement.attr({height: Math.round(collection.length/DIVIDER) <=0 ? AREA_HEIGHT: AREA_HEIGHT*Math.ceil(collection.length/DIVIDER), opacity: 0.8 });
    }

    //var hoverover =  function(){
    //  console.log("o");
//
//    }

//    var hoverout = function() {
//      console.log("t");
//    }

    afterSnapLoadFunction() {
        s=Snap('#factoryMap');
        //mq=Snap.select("[id^='area_mqline']");
	this.arrayProductionAreas = s.selectAll("[id^='area_']");
        boundingBoxes = this.arrayProductionAreas.items.map(function(productionArea) {
                return({key: productionArea.node.id, boundingbox: productionArea.getBBox()})
        });
        pa=s.select("[id^='circle_count_paint']"); 
	paArea=s.select("[id^='area_paint']");
	//`pa.hover(this.hoverover, this.hoverout);
        paTextCount=s.select("[id^='text_paint_count']");
        paTextIds=s.select("[id^='text_ids_in_paint']");
        ca=s.select("[id^='circle_count_chassis']");
        caArea=s.select("[id^='area_chassis']");
        caTextCount=s.select("[id^='text_chassis_count']");
        caTextIds=s.select("[id^='text_ids_in_chassis']");
        mq=s.select("[id^='circle_count_mqline']");
        mqArea=s.select("[id^='area_mqline']");
        mqTextCount=s.select("[id^='text_mqline_count']");
        mqTextIds=s.select("[id^='text_ids_in_mqline']");
	tractor=s.select("[id^='circle_count_tractor']");
        tractorArea=s.select("[id^='area_tractor']");
        tractorTextCount=s.select("[id^='text_tractor_count']");
	tractorTextIds=s.select("[id^='text_ids_in_tractor']");
        insp=s.select("[id^='circle_count_inspection']");
        inspArea=s.select("[id^='area_inspection']");
        inspTextCount=s.select("[id^='text_inspection_count']");
        inspTextIds=s.select("[id^='text_ids_in_inspection']");
        rework=s.select("[id^='circle_count_rework']");
        reworkArea=s.select("[id^='area_rework']");
        reworkTextCount=s.select("[id^='text_rework_count']");
        reworkTextIds=s.select("[id^='text_ids_in_rework']");
        rfs=s.select("[id^='circle_count_rfs']");
	rfsArea=s.select("[id^='area_rfs']");
        rfsTextCount=s.select("[id^='text_rfs_count']");
        rfsTextIds=s.select("[id^='text_ids_in_rfs']");
        future=s.select("[id^='circle_count_future']");
	futureArea=s.select("[id^='area_future']");
        futureTextCount=s.select("[id^='text_future_count']");
        futureTextIds=s.select("[id^='text_ids_in_future']");

	this.updateTextElements(caArea, ca, caTextCount, caTextIds, this.props.inChassis);
        this.updateTextElements(paArea, pa, paTextCount, paTextIds, this.props.inPaint);
        this.updateTextElements(tractorArea, tractor, tractorTextCount, tractorTextIds, this.props.inTractor);
        this.updateTextElements(mqArea, mq, mqTextCount, mqTextIds, this.props.inMqline);
        this.updateTextElements(inspArea, insp, inspTextCount, inspTextIds, this.props.inInspection);
        this.updateTextElements(reworkArea, rework, reworkTextCount, reworkTextIds, this.props.inRework);
        this.updateTextElements(rfsArea, rfs, rfsTextCount, rfsTextIds, this.props.inRfs);
        this.updateTextElements(futureArea, future, futureTextCount, futureTextIds, this.props.inFuture);

    }

    updateDisplay(){
        if(this.props.products == undefined)    return;
        if(this.props.products <= 0)    return;
        this.afterSnapLoadFunction(); 
    }
    
    render() {
        return (
            <span>
	    <Clock format={'HH:mm:ss'} ticking={true} timezone={'Europe/Paris'} />
            <div id="factoryMapDiv">
              <svg id="factoryMap" width="100%" height="100%" viewBox="0 0 1280 1024" preserveAspectRatio="xMinYMin"></svg>
            </div>
            </span>
        );
    }

    componentDidMount() {
        // Set timer to update the graphic
        this.setState({
            'timerId': Meteor.setInterval(
                ()=>{
                    this.updateDisplay();
                }, 
                //60000
                10000
            )
        });
        s = Snap("#factoryMap");
	var map = Snap.load("assets/kfm_svg_dashboard.svg", function(fragment){
		s.append(fragment);
        	return;
	}); 
    }
    
    componentDidUpdate() {
        this.updateDisplay();
    }

    componentWillUnmount() {
        if(this.state!=undefined && this.state.timerId!=undefined && this.state.timerId!=null)   Meteor.clearInterval(this.state.timerId);
    }
};

import { Session } from 'meteor/session'

export default FactoryDash = createContainer(() => {
    
    Meteor.user();  // This require in the createContainer(). Unless this, this program does not react, componentDidUpdate() is not triggered.

    var f={};
    var pf={};
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
        //classes common functions array of locations
        //0:'ui.common.PreProduction',
        //1:'ui.common.ChassisLine',
        //2:'ui.common.PaintLine',
        //3:'ui.common.TractorLine',
        //4:'ui.common.MQLine',
        //5:'ui.common.ReworkBeforeMQ',
        //6:'ui.common.ReworkAfterMQ',
        //7:'ui.common.ProductionCompletion',
        //8:'ui.common.Inspection',
        //9:'ui.common.ReworkDuringInspection',
        //10:'ui.common.SapComplete',
        //11:'ui.shippingStatus.State001',
        //12:'ui.shippingStatus.State002',
        //13:'ui.shippingStatus.State003',
        //14:'ui.common.Shipped'
  
    return {
        products: prod_monitor.find(f).fetch(),
        inPaint: prod_monitor.find({"LOCATION_STATUS": 2}).fetch(),
	inTractor: prod_monitor.find({"LOCATION_STATUS": 3}).fetch(),
	inChassis: prod_monitor.find({"LOCATION_STATUS": 1}).fetch(),
	inMqline: prod_monitor.find({"LOCATION_STATUS": 4}).fetch(),
	inInspection: prod_monitor.find({"LOCATION_STATUS": 8}).fetch(),
	inRework: prod_monitor.find({$or: [{"LOCATION_STATUS": 5},{"LOCATION_STATUS": 6}]}).fetch(),
	inRfs: prod_monitor.find({"LOCATION_STATUS": 11}).fetch(),
	inFuture: prod_monitor.find({"LOCATION_STATUS": 12}).fetch(),
    };
}, FactoryDash);

