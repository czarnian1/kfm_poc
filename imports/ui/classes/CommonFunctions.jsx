var ij;     //  Array which comes from  Init.json

export const LocationTitles={
    0:'ui.common.PreProduction',
    1:'ui.common.ChassisLine',
    2:'ui.common.PaintLine',
    3:'ui.common.TractorLine',
    4:'ui.common.MQLine',
    5:'ui.common.ReworkBeforeMQ',
    6:'ui.common.ReworkAfterMQ',
    7:'ui.common.ProductionCompletion',
    8:'ui.common.Inspection',
    9:'ui.common.ReworkDuringInspection',
    10:'ui.common.SapComplete',
    11:'ui.shippingStatus.State001',
    12:'ui.shippingStatus.State002',
    13:'ui.shippingStatus.State003',
    14:'ui.common.Shipped'
};

export const LocationIcons={
    0:' ',
    1:'kubota-KFM_Icons_chassis-icon',
    2:'kubota-KFM_Icons_paint-icon',
    3:'kubota-KFM_Icons_tractor-icon',
    4:'kubota-KFM_Icons_mqline-icon',
    5:'kubota-KFM_Icons_rework-icon',
    6:'kubota-KFM_Icons_rework-icon',
    7:' ',
    8:'kubota-KFM_Icons_inspection-icon',
    9:'kubota-KFM_Icons_rework-icon',
    10:' ',
    11:' ',
    12:' ',
    13:' ',
    14:'kubota-KFM_Icons_shipped-icon'
}


export const ShippingStatuses={
    0:"ui.shippingStatus.State000",
    1:"ui.shippingStatus.State001",
    2:"ui.shippingStatus.State002",
    3:"ui.shippingStatus.State003",
    4:"ui.shippingStatus.State004",
    5:"ui.shippingStatus.State005",
};


export default class CF {
    
    constructor(){
//        console.log('CommonFunctions:constructor()');
        if (Meteor.isServer) {

//            ij = require('../../../public/assets/Init.json');     
// require() does not allow users to modify Init.json file, because it includes
// Init.json file when compile, not run time.
            
            //console.log('CommonFunctions:constructor():Meteor.isServer');

            var fs = Npm.require('fs');
            fs.readFile(
                process.cwd() + '/../web.browser/assets/Init.json', 
                'utf8', 
                function (err, data) {
                    if (err) {
                        console.log('Error to read Init.json: ' + err);
                        return;
                    }
                    ij = JSON.parse(data);
                    console.log('Imported Init.json in the server.');
                }
            );
        }

        if (Meteor.isClient) {
            $.ajax(
                {
                    async: false,
                    type: 'GET',
                    url: "/assets/Init.json",
                    dataType:'json',
                    success:
                        function(x){
                            ij=x;
                        },
                    error:
                        function(x){
                            console.log('No /assets/Init.json file.');
                        },
                }
            );
        }

    }
    
    ProductionThresholds(LOCATION_STATUS){
        switch(parseInt(LOCATION_STATUS)){
        case 0: return  null;
        case 1: return  ij.ProductionThresholds.CHASSIS_LINE;
        case 2: return  ij.ProductionThresholds.PAINT_LINE;
        case 3: return  ij.ProductionThresholds.TRACTOR_LINE;
        case 4: return  ij.ProductionThresholds.REWORK_BEFORE_MQ;
        case 5: return  ij.ProductionThresholds.MQ_LINE;
        case 6: return  ij.ProductionThresholds.REWORK_AFTER_MQ;
        case 7: return  ij.ProductionThresholds.PRODUCTION_END;
        case 8: return  ij.ProductionThresholds.INSPECTION;
        case 9: return  ij.ProductionThresholds.REWORK_DUR_INSP;
        case 10: return null;
        case 11: return null;
        case 12: return null;
        case 13: return null;
        case 14: return ij.ProductionThresholds.SHIPPING;
        default: return null;
        }
    }

    ProductionAreaStart(LOCATION_STATUS) {
	switch(parseInt(LOCATION_STATUS)) {
        case 0: return  null; //pre-prod (0) 
        case 1: return "CHASSIS_LINE_START_DATE"; 
        case 2: return "PAINT_LINE_START_DATE"; 
        case 3: return "TRACTOR_LINE_START_DATE";
        case 4: return "MQ_LINE_START_DATE";
        case 5: return "REWORK_BEFORE_MQ_LINE_START_DATE";
        case 6: return "REWORK_AFTER_MQ_LINE_START_DATE";
        case 7: return "PRODUCTION_START_DATE";
        case 8: return "INSPECTION_START_DATE";
        case 9: return "REWORK_DUR_INSP_START_DATE";
        case 10: return null; // SAP and MES states
        case 11: return null;
        case 12: return null;
        case 13: return null;
        case 14: return "SHIPPING_DATE";
        default: return null;
	}
    }
    
    i18nLocationTitles(){
        var ret={};
        for(var index in LocationTitles) ret[index]=i18n.__(LocationTitles[index]);
        return  ret;
    }

    i18nShippingStatuses(){
        var ret={};
        for(var index in ShippingStatuses)  ret[index]=i18n.__(ShippingStatuses[index]);
        return  ret;
    }
    
    i18nRoles(){
        var ret={};
        for(var index in ij.Roles){
            ret[index]=i18n.__(ij.Roles[index].message);
        }
        return  ret;
    }

    valueBetween (value, minValue, maxValue) {
	return (Math.min(maxValue, Math.max(minValue,value)));
    }
    
    Roles(){
        return  ij.Roles;
    }
    
    Role(user){
        if(user==undefined)    return  false;

        var role=this.Roles()[0].role;    // Set default value;
        if(user.roles!=undefined && user.roles[Roles.GLOBAL_GROUP]!=undefined && user.roles[Roles.GLOBAL_GROUP][0]!=undefined){
            role=user.roles[Roles.GLOBAL_GROUP][0];
        }

        for(var index in this.Roles()){
            if(this.Roles()[index].role==role) return this.Roles()[index];
        }

        return  false;
    }
    
    AllowSelfRegistration(){
        return ij.AllowSelfRegistration;
    }

    judgeStatus(spent,ary){
        //console.log("cf::judgeStatus");
        //console.log(spent);
        //console.log(ary);
        if(spent==undefined)    return  {error:true};
        if(spent < 0)    return  {error:true};

        if(ary==undefined)  return  {error:true};
        if(ary.length<=0)   return  {error:true};

        spent= Math.floor(spent/1000/60);
	//console.log("cf:judgeStatus::spent");
        //console.log(spent);
        var i;
        var duration=null,index=null,thresholdOver=null,message=null,color=null, className=null;
        for(i=0,c=''; i < ary.length; ++i){
            if(duration==null && ary[i].thresholdOver)   duration=ary[i].duration;
            if(ary[i].duration <= spent){
                index        =i;
                thresholdOver=ary[i].thresholdOver;
                message      =ary[i].message;
                color        =ary[i].color;
                className    =ary[i].className;
            }
        }
        
        return {
            "error":false,
            "thresholdSpent":spent,
            "thresholdDuration":duration,
            "thresholdIndex":index,
            "thresholdOver":thresholdOver,
            "thresholdMessage":message,
            "thresholdColor":color, 
            "thresholdClassName":className
        }
    }
    
    
    productStatus(p){
        //console.log(p);
        if(p==undefined){
            console.log('CommonFunctions:productStatus(p), "p" is undefined.');
            return  {error:true};
        }
        
        if(ij==undefined){
            console.log('CommonFunctions:productStatus(p), Init.json has not been read.');
            return  {error:true};
        }
        

        /*
         * Product status
         */
        var now=new Date();

        var ret=[];

        //  CREATE_DATE
        if(p.CREATE_DATE==undefined)    return  {error:true};
        
        //  UPDATE_DATE

       
        /*
         * LOCATION_STATUS
         */
        if(p.LOCATION_STATUS==undefined || p.LOCATION_STATUS==null) p.LOCATION_STATUS=0;    // UKUS 28June2017. null means Pre-production.
        if(p.LOCATION_STATUS < 0 || 14 < p.LOCATION_STATUS)   return  {error:true};
	//Added here archive status 99 || 15 in future
	//
        //  00 - pre - production - exported from SAP 

        //  01 - chassis State
        //  CHASSIS_LINE_START_DATE
        if(p.CHASSIS_LINE_START_DATE!=undefined){
            if(p.LOCATION_STATUS==1) ret["isOnGoing"]=true;
            ret[1]=this.judgeStatus(now.getTime() - p.CHASSIS_LINE_START_DATE.getTime(), ij.ProductionThresholds.CHASSIS_LINE);
        }
        
        //  CHASSIS_LINE_END_DATE
        if(p.CHASSIS_LINE_END_DATE!=undefined){
            if(p.LOCATION_STATUS==1) ret["isOnGoing"]=false;
            if(p.CHASSIS_LINE_START_DATE==undefined)    ret[1]=null;
            else    ret[1]=this.judgeStatus(p.CHASSIS_LINE_END_DATE.getTime() - p.CHASSIS_LINE_START_DATE.getTime(), ij.ProductionThresholds.CHASSIS_LINE);
        }
        
        //  02 - paint State
        //  PAINT_LINE_START_DATE
        if(p.PAINT_LINE_START_DATE!=undefined){
            if(p.LOCATION_STATUS==2) ret["isOnGoing"]=true;
            //console.log("paint line");
            //console.log(now.getTime());
            //console.log(p.PAINT_LINE_START_DATE.getTime());
            //console.log(ij.ProductionThresholds.PAINT_LINE);
            //console.log("send to judgeStatus");
            ret[2]=this.judgeStatus(now.getTime() - p.PAINT_LINE_START_DATE.getTime(), ij.ProductionThresholds.PAINT_LINE);
        }

        //  PAINT_LINE_END_DATE
        if(p.PAINT_LINE_END_DATE!=undefined){
            if(p.LOCATION_STATUS==2) ret["isOnGoing"]=false;
            if(p.PAINT_LINE_START_DATE==undefined)    ret[2]=null;
            else    ret[2]=this.judgeStatus(p.PAINT_LINE_END_DATE.getTime() - p.PAINT_LINE_START_DATE.getTime(), ij.ProductionThresholds.PAINT_LINE);
        }
                
        //  03 - assembly (tractor) State
        //  TRACTOR_LINE_START_DATE
        if(p.TRACTOR_LINE_START_DATE!=undefined){
            //console.log("cf::tractor line start");
            if(p.LOCATION_STATUS==3) ret["isOnGoing"]=true;
            //console.log(p.TRACTOR_LINE_START_DATE.getTime());
            //console.log(ij.ProductionThresholds.TRACTOR_LINE);
            //console.log(now.getTime());
            ret[3]=this.judgeStatus(now.getTime() - p.TRACTOR_LINE_START_DATE.getTime(), ij.ProductionThresholds.TRACTOR_LINE);
        }
                
        //  TRACTOR_LINE_END_DATE
        if(p.TRACTOR_LINE_END_DATE!=undefined){
            if(p.LOCATION_STATUS==3) ret["isOnGoing"]=false;
            if(p.TRACTOR_LINE_START_DATE==undefined)    ret[3]=null;
            else    ret[3]=this.judgeStatus(p.TRACTOR_LINE_END_DATE.getTime() - p.TRACTOR_LINE_START_DATE.getTime(), ij.ProductionThresholds.TRACTOR_LINE);
        }
                
        //  04  - MQ Line State
        //  MQ_LINE_START_DATE
        if(p.MQ_LINE_START_DATE!=undefined){
            if(p.LOCATION_STATUS==4) ret["isOnGoing"]=true;
            ret[4]=this.judgeStatus(now.getTime() - p.MQ_LINE_START_DATE.getTime(), ij.ProductionThresholds.MQ_LINE);
        }
                
        //  MQ_LINE_END_DATE
        if(p.MQ_LINE_END_DATE!=undefined){
            if(p.LOCATION_STATUS==4) ret["isOnGoing"]=false;
            if(p.MQ_LINE_START_DATE==undefined)    ret[4]=null;
            else    ret[4]=this.judgeStatus(p.MQ_LINE_END_DATE.getTime() - p.MQ_LINE_START_DATE.getTime(), ij.ProductionThresholds.MQ_LINE);
        }
                
        //  05 - Rework-pre MQ State
        //  REWORK_BEFORE_MQ_START_DATE
        if(p.REWORK_BEFORE_MQ_START_DATE!=undefined){
            if(p.LOCATION_STATUS==5) ret["isOnGoing"]=true;
            ret[5]=this.judgeStatus(now.getTime() - p.REWORK_BEFORE_MQ_START_DATE.getTime(), ij.ProductionThresholds.REWORK_BEFORE_MQ);
        }
                
        //  REWORK_BEFORE_MQ_END_DATE
        if(p.REWORK_BEFORE_MQ_END_DATE!=undefined){
            if(p.LOCATION_STATUS==5) ret["isOnGoing"]=false;
            if(p.REWORK_BEFORE_MQ_START_DATE==undefined)    ret[5]=null;
            else    ret[5]=this.judgeStatus(p.REWORK_BEFORE_MQ_END_DATE.getTime() - p.REWORK_BEFORE_MQ_START_DATE.getTime(), ij.ProductionThresholds.REWORK_BEFORE_MQ);
        }
                
        //  06 - Rework MQ State
        //  REWORK_AFTER_MQ_START_DATE
        if(p.REWORK_AFTER_MQ_START_DATE!=undefined){
            if(p.LOCATION_STATUS==6) ret["isOnGoing"]=true;
            ret[6]=this.judgeStatus(now.getTime() - p.REWORK_AFTER_MQ_START_DATE.getTime(), ij.ProductionThresholds.REWORK_AFTER_MQ);
        }
                
        //  REWORK_AFTER_MQ_END_DATE
        if(p.REWORK_AFTER_MQ_END_DATE!=undefined){
            if(p.LOCATION_STATUS==6) ret["isOnGoing"]=false;
            if(p.REWORK_AFTER_MQ_START_DATE==undefined)    ret[6]=null;
            else    ret[6]=this.judgeStatus(p.REWORK_AFTER_MQ_END_DATE.getTime() - p.REWORK_AFTER_MQ_START_DATE.getTime(), ij.ProductionThresholds.REWORK_AFTER_MQ);
        }
                
        //  07 - production complete State
        //  PRODUCTION_END_DATE
        if(p.PRODUCTION_END_DATE!=undefined){
            if(p.LOCATION_STATUS==7) ret["isOnGoing"]=false;
            ret[7]=this.judgeStatus(p.PRODUCTION_END_DATE.getTime() - p.CREATE_DATE.getTime(), ij.ProductionThresholds.PRODUCTION_END);
        }
                
        //  08 - Inspection State
        //  INSPECTION_START_DATE
        if(p.INSPECTION_START_DATE!=undefined){
            if(p.LOCATION_STATUS==8) ret["isOnGoing"]=true;
            ret[8]=this.judgeStatus(now.getTime() - p.INSPECTION_START_DATE.getTime(), ij.ProductionThresholds.INSPECTION);
        }
                
        //  INSPECTION_END_DATE
        if(p.INSPECTION_END_DATE!=undefined){
            if(p.LOCATION_STATUS==8) ret["isOnGoing"]=false;
            if(p.INSPECTION_START_DATE==undefined)    ret[8]=null;
            else    ret[8]=this.judgeStatus(p.INSPECTION_END_DATE.getTime() - p.INSPECTION_START_DATE.getTime(), ij.ProductionThresholds.INSPECTION);
        }
                
        //  09 - Rework Inspection State
        //  REWORK_DUR_INSP_START_DATE
        if(p.REWORK_DUR_INSP_START_DATE!=undefined){
            if(p.LOCATION_STATUS==9) ret["isOnGoing"]=true;
            ret[9]=this.judgeStatus(now.getTime() - p.REWORK_DUR_INSP_START_DATE.getTime(), ij.ProductionThresholds.REWORK_DUR_INSP);
        }
                
        //  REWORK_DUR_INSP_END_DATE
        if(p.REWORK_DUR_INSP_END_DATE!=undefined){
            if(p.LOCATION_STATUS==9) ret["isOnGoing"]=false;
            if(p.REWORK_DUR_INSP_START_DATE==undefined)    ret[9]=null;
            else    ret[9]=this.judgeStatus(p.REWORK_DUR_INSP_END_DATE.getTime() - p.REWORK_DUR_INSP_START_DATE.getTime(), ij.ProductionThresholds.REWORK_DUR_INSP);
        }
                
        //  10 - SAP Complete State
        
        //  11 - Shipping Area State
        
        //  12 - Outside Area State
        
        //  13 - Future Area State

        //  14 - Shipped State
        //  SHIPPING_DATE
        if(p.SHIPPING_DATE!=undefined){
            if(p.LOCATION_STATUS==14) ret["isOnGoing"]=false;
            ret[14]=this.judgeStatus(p.SHIPPING_DATE.getTime() - p.CREATE_DATE.getTime(), ij.ProductionThresholds.SHIPPING);
        }
        
        return ret;
    }
    

    formatDateTime(d){
        var r="";
        //console.log("cf::formatDateTime");
        //console.log(d);
         
        if(d==undefined)    return "";
        if(!(d instanceof Date))    return "";

        switch(i18n.getLocale()){
        case 'ja':
            r =       d.getFullYear();
            r+= '/' + ('0'+(d.getMonth()+1)).slice( -2 );
            r+= '/' + ('0'+d.getDate()).slice( -2 );
            r+= ' ' + ('0'+d.getHours()).slice( -2 );
            r+= ':' + ('0'+d.getMinutes()).slice( -2 );

            return r;
        default:
            r =       ('0'+d.getDate()).slice( -2 );
            r+= '/' + ('0'+(d.getMonth()+1)).slice( -2 );
            r+= '/' + d.getFullYear();
            r+= ' ' + ('0'+d.getHours()).slice( -2 );
            r+= ':' + ('0'+d.getMinutes()).slice( -2 );

            return r;
        }
    }


    formatString(s){
        if(s==undefined)    return "";

        return s.toString().trim();
    }
    
}
