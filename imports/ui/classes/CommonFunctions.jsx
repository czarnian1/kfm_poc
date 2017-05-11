var ij;     //  Array which comes from  Init.json

export default class CF {

    constructor(){
        console.log('CommonFunctions:constructor()');
        if (Meteor.isServer) {

//            ij = require('../../../public/assets/Init.json');     
// require() does not allow users to modify Init.json file, because it includes
// Init.json file when compile, not run time.
            
            console.log('CommonFunctions:constructor():Meteor.isServer');

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
//                    console.log(ij);
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
    
    locationTitle(location){
        switch(parseInt(location)){
        case 0: return  'ui.common.PreProduction';
        case 1: return  'ui.common.ChassisLine';
        case 2: return  'ui.common.PaintLine';
        case 3: return  'ui.common.TractorLine';
        case 4: return  'ui.common.MQLine';
        case 5: return  'ui.common.ReworkBeforeMQ';
        case 6: return  'ui.common.ReworkAfterMQ';
        case 7: return  'ui.common.ProductionCompletion';
        case 8: return  'ui.common.Inspection';
        case 9: return  'ui.common.ReworkDuringInspection';
        case 10: return 'ui.common.SapComplete';
        case 11: return 'ui.shippingStatus.State001';
        case 12: return 'ui.shippingStatus.State002';
        case 13: return 'ui.shippingStatus.State003';
        case 14: return 'ui.common.Shipped';
        default: return 'data error, unknown LOCATIONSTATUS code #'+location+"#";
        }
    }

    locationIcon(location){
        switch(parseInt(location)){
        case 0: return  ' ';
        case 1: return  'kubota-KFM_Icons_chassis-icon';
        case 2: return  'kubota-KFM_Icons_paint-icon';
        case 3: return  'kubota-KFM_Icons_tractor-icon';
        case 4: return  'kubota-KFM_Icons_mqline-icon';
        case 5: return  'kubota-KFM_Icons_rework-icon';
        case 6: return  'kubota-KFM_Icons_rework-icon';
        case 7: return  ' ';
        case 8: return  'kubota-KFM_Icons_inspection-icon';
        case 9: return  'kubota-KFM_Icons_rework-icon';
        case 10: return ' ';
        case 11: return ' ';
        case 12: return ' ';
        case 13: return ' ';
        case 14: return 'kubota-KFM_Icons_shipped-icon';
        default: return 'data error, unknown LOCATIONSTATUS code #'+location+"#";
        }
    }


    judgeStatus(spent,ary){
        if(spent==undefined)    return  {error:true};

        if(ary==undefined)  return  {error:true};
        if(ary.length<=0)   return  {error:true};

        spent= Math.floor(spent/1000/60);

        var i;
        var duration=null,warn=null,message='',color='', className='';
        for(i=0,c=''; i < ary.length; ++i){
            if(duration==null && ary[i].warn)   duration=ary[i].duration;
            if(ary[i].duration <= spent){
                warn      =ary[i].warn;
                message   =ary[i].message;
                color     =ary[i].color;
                className =ary[i].className;
            }
        }
        
        return {
            "error":false,
            "thresholdSpent":spent,
            "thresholdDuration":duration,
            "thresholdWarn":warn,
            "thresholdMessage":message,
            "thresholdColor":color, 
            "thresholdClassName":className
        }
    }
    
    
    productStatus(p){
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
         * LOCATIONSTATUS
         */
        if(p.LOCATIONSTATUS < 0 || 14 < p.LOCATIONSTATUS)   return  {error:true};

        //  00 - pre - production - exported from SAP 

        //  01 - chassis State
        //  CHASSIS_LINE_START_DATE
        if(p.CHASSIS_LINE_START_DATE!=undefined){
            if(p.LOCATIONSTATUS==1) ret["isOnGoing"]=true;
            ret[1]=this.judgeStatus(now.getTime() - p.CHASSIS_LINE_START_DATE.getTime(), ij.ProductionThresholds.CHASSIS_LINE);
        }
        
        //  CHASSIS_LINE_END_DATE
        if(p.CHASSIS_LINE_END_DATE!=undefined){
            if(p.LOCATIONSTATUS==1) ret["isOnGoing"]=false;
            if(p.CHASSIS_LINE_START_DATE==undefined)    ret[1]=null;
            else    ret[1]=this.judgeStatus(p.CHASSIS_LINE_END_DATE.getTime() - p.CHASSIS_LINE_START_DATE.getTime(), ij.ProductionThresholds.CHASSIS_LINE);
        }
        
        //  02 - paint State
        //  PAINT_LINE_START_DATE
        if(p.PAINT_LINE_START_DATE!=undefined){
            if(p.LOCATIONSTATUS==2) ret["isOnGoing"]=true;
            ret[2]=this.judgeStatus(now.getTime() - p.PAINT_LINE_START_DATE.getTime(), ij.ProductionThresholds.PAINT_LINE);
        }

        //  PAINT_LINE_END_DATE
        if(p.PAINT_LINE_END_DATE!=undefined){
            if(p.LOCATIONSTATUS==2) ret["isOnGoing"]=false;
            if(p.PAINT_LINE_START_DATE==undefined)    ret[2]=null;
            else    ret[2]=this.judgeStatus(p.PAINT_LINE_END_DATE.getTime() - p.PAINT_LINE_START_DATE.getTime(), ij.ProductionThresholds.PAINT_LINE);
        }
                
        //  03 - assembly (tractor) State
        //  TRACTOR_LINE_START_DATE
        if(p.TRACTOR_LINE_START_DATE!=undefined){
            if(p.LOCATIONSTATUS==3) ret["isOnGoing"]=true;
            ret[3]=this.judgeStatus(now.getTime() - p.TRACTOR_LINE_START_DATE.getTime(), ij.ProductionThresholds.TRACTOR_LINE);
        }
                
        //  TRACTOR_LINE_END_DATE
        if(p.TRACTOR_LINE_END_DATE!=undefined){
            if(p.LOCATIONSTATUS==3) ret["isOnGoing"]=false;
            if(p.TRACTOR_LINE_START_DATE==undefined)    ret[3]=null;
            else    ret[3]=this.judgeStatus(p.TRACTOR_LINE_END_DATE.getTime() - p.TRACTOR_LINE_START_DATE.getTime(), ij.ProductionThresholds.TRACTOR_LINE);
        }
                
        //  04  - MQ Line State
        //  MQ_LINE_START_DATE
        if(p.MQ_LINE_START_DATE!=undefined){
            if(p.LOCATIONSTATUS==4) ret["isOnGoing"]=true;
            ret[4]=this.judgeStatus(now.getTime() - p.MQ_LINE_START_DATE.getTime(), ij.ProductionThresholds.MQ_LINE);
        }
                
        //  MQ_LINE_END_DATE
        if(p.MQ_LINE_END_DATE!=undefined){
            if(p.LOCATIONSTATUS==4) ret["isOnGoing"]=false;
            if(p.MQ_LINE_START_DATE==undefined)    ret[4]=null;
            else    ret[4]=this.judgeStatus(p.MQ_LINE_END_DATE.getTime() - p.MQ_LINE_START_DATE.getTime(), ij.ProductionThresholds.MQ_LINE);
        }
                
        //  05 - Rework-pre MQ State
        //  REWORK_BEFORE_MQ_START_DATE
        if(p.REWORK_BEFORE_MQ_START_DATE!=undefined){
            if(p.LOCATIONSTATUS==5) ret["isOnGoing"]=true;
            ret[5]=this.judgeStatus(now.getTime() - p.REWORK_BEFORE_MQ_START_DATE.getTime(), ij.ProductionThresholds.REWORK_BEFORE_MQ);
        }
                
        //  REWORK_BEFORE_MQ_END_DATE
        if(p.REWORK_BEFORE_MQ_END_DATE!=undefined){
            if(p.LOCATIONSTATUS==5) ret["isOnGoing"]=false;
            if(p.REWORK_BEFORE_MQ_START_DATE==undefined)    ret[5]=null;
            else    ret[5]=this.judgeStatus(p.REWORK_BEFORE_MQ_END_DATE.getTime() - p.REWORK_BEFORE_MQ_START_DATE.getTime(), ij.ProductionThresholds.REWORK_BEFORE_MQ);
        }
                
        //  06 - Rework MQ State
        //  REWORK_AFTER_MQ_START_DATE
        if(p.REWORK_AFTER_MQ_START_DATE!=undefined){
            if(p.LOCATIONSTATUS==6) ret["isOnGoing"]=true;
            ret[6]=this.judgeStatus(now.getTime() - p.REWORK_AFTER_MQ_START_DATE.getTime(), ij.ProductionThresholds.REWORK_AFTER_MQ);
        }
                
        //  REWORK_AFTER_MQ_END_DATE
        if(p.REWORK_AFTER_MQ_END_DATE!=undefined){
            if(p.LOCATIONSTATUS==6) ret["isOnGoing"]=false;
            if(p.REWORK_AFTER_MQ_START_DATE==undefined)    ret[6]=null;
            else    ret[6]=this.judgeStatus(p.REWORK_AFTER_MQ_END_DATE.getTime() - p.REWORK_AFTER_MQ_START_DATE.getTime(), ij.ProductionThresholds.REWORK_AFTER_MQ);
        }
                
        //  07 - production complete State
        //  PRODUCTION_END_DATE
        if(p.PRODUCTION_END_DATE!=undefined){
            if(p.LOCATIONSTATUS==7) ret["isOnGoing"]=false;
            ret[7]=this.judgeStatus(p.PRODUCTION_END_DATE.getTime() - p.CREATE_DATE.getTime(), ij.ProductionThresholds.PRODUCTION_END);
        }
                
        //  08 - Inspection State
        //  INSPECTION_START_DATE
        if(p.INSPECTION_START_DATE!=undefined){
            if(p.LOCATIONSTATUS==8) ret["isOnGoing"]=true;
            ret[8]=this.judgeStatus(now.getTime() - p.INSPECTION_START_DATE.getTime(), ij.ProductionThresholds.INSPECTION);
        }
                
        //  INSPECTION_END_DATE
        if(p.INSPECTION_END_DATE!=undefined){
            if(p.LOCATIONSTATUS==8) ret["isOnGoing"]=false;
            if(p.INSPECTION_START_DATE==undefined)    ret[8]=null;
            else    ret[8]=this.judgeStatus(p.INSPECTION_END_DATE.getTime() - p.INSPECTION_START_DATE.getTime(), ij.ProductionThresholds.INSPECTION);
        }
                
        //  09 - Rework Inspection State
        //  REWORK_DUR_INSP_START_DATE
        if(p.REWORK_DUR_INSP_START_DATE!=undefined){
            if(p.LOCATIONSTATUS==9) ret["isOnGoing"]=true;
            ret[9]=this.judgeStatus(now.getTime() - p.REWORK_DUR_INSP_START_DATE.getTime(), ij.ProductionThresholds.REWORK_DUR_INSP);
        }
                
        //  REWORK_DUR_INSP_END_DATE
        if(p.REWORK_DUR_INSP_END_DATE!=undefined){
            if(p.LOCATIONSTATUS==9) ret["isOnGoing"]=false;
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
            if(p.LOCATIONSTATUS==14) ret["isOnGoing"]=false;
            ret[14]=this.judgeStatus(p.SHIPPING_DATE.getTime() - p.CREATE_DATE.getTime(), ij.ProductionThresholds.SHIPPING);
        }
        
        
        /*
         * SHIPPING_STATUS
         */
        var s;

        if(p.SHIPPING_STATUS==undefined)    p.SHIPPING_STATUS=0;
        switch(parseInt(p.SHIPPING_STATUS)){
        case 0:
            s="ui.shippingStatus.State000";
            break;
        case 1:
            s="ui.shippingStatus.State001";
            break;
        case 2:
            s="ui.shippingStatus.State002";
            break;
        case 3:
            s="ui.shippingStatus.State003";
            break;
        case 4:
            s="ui.shippingStatus.State004";
            break;
        case 5:
            s="ui.shippingStatus.State005";
            break;
        default:
            s="ui.shippingStatus.StateErr";
        }
        ret["shippingStatus"]=s;

        
        return ret;
    }
    

    formatDateTime(d){
        var r="";
        
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
