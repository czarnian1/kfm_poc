import React, { Component, PropTypes } from 'react'

export default class CF {

    constructor(props){
        var json=null;
        $.ajax(
            {
                async: false,
                type: 'GET',
                url: "/assets/Init.json",     // get xml file name
                dataType:'json',
                success:
                    function(x){
                        json=x;
                    },
                error:
                    function(x){
                        console.log('No /assets/Init.json file.');
                    },
            }
        );
        this.state = json;
    }

    
    stageTitle(stage){
        switch(parseInt(stage)){
        case 1: return  'common.main.chassis_line_title';
        case 2: return  'common.main.paint_line_title';
        case 3: return  'common.main.tractor_line_title';
        case 4: return  'common.main.rework_before_mq_title';
        case 5: return  'common.main.mq_line_title';
        case 6: return  'common.main.rework_after_mq_title';
        case 7: return  'common.main.production_end_title';
        case 8: return  'common.main.inspection_title';
        case 9: return  'common.main.rework_dur_insp_title';
        case 10: return 'common.main.shipping_title';
        default: return 'data error, unknown stage #'+stage+"#";
        }
    }

    stageIcon(stage){
        switch(parseInt(stage)){
        case 1: return  'kubota-KFM_Icons_chassis-icon';
        case 2: return  'kubota-KFM_Icons_paint-icon';
        case 3: return  'kubota-KFM_Icons_tractor-icon';
        case 4: return  'kubota-KFM_Icons_rework-icon';
        case 5: return  'kubota-KFM_Icons_mqline-icon';
        case 6: return  'kubota-KFM_Icons_rework-icon';
        case 7: return  'kubota-KFM_Icons_moved-icon';
        case 8: return  'kubota-KFM_Icons_inspection-icon';
        case 9: return  'kubota-KFM_Icons_rework-icon';
        case 10: return 'kubota-KFM_Icons_shipped-icon';
        default: return 'data error, unknown stage #'+stage+"#";
        }
    }


    judgeStatus(spent,ary){
        if(spent==undefined)    return  {error:true};

        if(ary==undefined)  return  {error:true};
        if(ary.length<=0)   return  {error:true};

        spent= Math.floor(spent/1000/60);

        var i;
        //MSJ : Bootstrap css tr classes for table highlighting added className to json object and return object
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
        
        return {"error":false,"thresholdSpent":spent,"thresholdDuration":duration,"thresholdMessage":message,"thresholdColor":color, "className":className}
    }
    
    
    productStatus(p){
        if(p==undefined)    return  {error:true};

        /*
         * Product status
         */
        var now=new Date();

        var stage=0;
        var isOnGoing=false;
        var stageTime=new Date(1);
        var ret=[];

        //  CREATE_DATE
        if(p.CREATE_DATE==undefined)    return  {error:true};
        
        //  UPDATE_DATE

        //  CHASSIS_LINE_START_DATE
        if(p.CHASSIS_LINE_START_DATE!=undefined && stageTime < p.CHASSIS_LINE_START_DATE.getTime()){
            stage=1;
            isOnGoing=true;
            stageTime=p.CHASSIS_LINE_START_DATE.getTime();
            ret[stage]=this.judgeStatus(now.getTime()-stageTime, this.state.ProductionThresholds.CHASSIS_LINE);
        }
        
        //  CHASSIS_LINE_END_DATE
        if(p.CHASSIS_LINE_END_DATE!=undefined && stageTime < p.CHASSIS_LINE_END_DATE.getTime()){
            stage=1;
            isOnGoing=false;
            stageTime=p.CHASSIS_LINE_END_DATE.getTime();
            if(p.CHASSIS_LINE_START_DATE==undefined)    ret[stage]=null;
            else    ret[stage]=this.judgeStatus(stageTime-p.CHASSIS_LINE_START_DATE.getTime(), this.state.ProductionThresholds.CHASSIS_LINE);
        }
        
        //  PAINT_LINE_START_DATE
        if(p.PAINT_LINE_START_DATE!=undefined && stageTime < p.PAINT_LINE_START_DATE.getTime()){
            stage=2;
            isOnGoing=true;
            stageTime=p.PAINT_LINE_START_DATE.getTime();
            ret[stage]=this.judgeStatus(now.getTime()-stageTime, this.state.ProductionThresholds.PAINT_LINE);
        }

        //  PAINT_LINE_END_DATE
        if(p.PAINT_LINE_END_DATE!=undefined && stageTime < p.PAINT_LINE_END_DATE.getTime()){
            stage=2;
            isOnGoing=false;
            stageTime=p.PAINT_LINE_END_DATE.getTime();
            if(p.PAINT_LINE_START_DATE==undefined)    ret[stage]=null;
            else    ret[stage]=this.judgeStatus(stageTime-p.PAINT_LINE_START_DATE.getTime(), this.state.ProductionThresholds.PAINT_LINE);
        }
                
        //  TRACTOR_LINE_START_DATE
        if(p.TRACTOR_LINE_START_DATE!=undefined && stageTime < p.TRACTOR_LINE_START_DATE.getTime()){
            stage=3;
            isOnGoing=true;
            stageTime=p.TRACTOR_LINE_START_DATE.getTime();
            ret[stage]=this.judgeStatus(now.getTime()-stageTime, this.state.ProductionThresholds.TRACTOR_LINE);
        }
                
        //  TRACTOR_LINE_END_DATE
        if(p.TRACTOR_LINE_END_DATE!=undefined && stageTime < p.TRACTOR_LINE_END_DATE.getTime()){
            stage=3;
            isOnGoing=false;
            stageTime=p.TRACTOR_LINE_END_DATE.getTime();
            if(p.TRACTOR_LINE_START_DATE==undefined)    ret[stage]=null;
            else    ret[stage]=this.judgeStatus(stageTime-p.TRACTOR_LINE_START_DATE.getTime(), this.state.ProductionThresholds.TRACTOR_LINE);
        }
                
        //  REWORK_BEFORE_MQ_START_DATE
        if(p.REWORK_BEFORE_MQ_START_DATE!=undefined && stageTime < p.REWORK_BEFORE_MQ_START_DATE.getTime()){
            stage=4;
            isOnGoing=true;
            stageTime=p.REWORK_BEFORE_MQ_START_DATE.getTime();
            ret[stage]=this.judgeStatus(now.getTime()-stageTime, this.state.ProductionThresholds.REWORK_BEFORE_MQ);
        }
                
        //  REWORK_BEFORE_MQ_END_DATE
        if(p.REWORK_BEFORE_MQ_END_DATE!=undefined && stageTime < p.REWORK_BEFORE_MQ_END_DATE.getTime()){
            stage=4;
            isOnGoing=false;
            stageTime=p.REWORK_BEFORE_MQ_END_DATE.getTime();
            if(p.REWORK_BEFORE_MQ_START_DATE==undefined)    ret[stage]=null;
            else    ret[stage]=this.judgeStatus(stageTime-p.REWORK_BEFORE_MQ_START_DATE.getTime(), this.state.ProductionThresholds.REWORK_BEFORE_MQ);
        }
                
        //  MQ_LINE_START_DATE
        if(p.MQ_LINE_START_DATE!=undefined && stageTime < p.MQ_LINE_START_DATE.getTime()){
            stage=5;
            stageTime=p.MQ_LINE_START_DATE.getTime();
            isOnGoing=true;
            ret[stage]=this.judgeStatus(now.getTime()-stageTime, this.state.ProductionThresholds.MQ_LINE);
        }
                
        //  MQ_LINE_END_DATE
        if(p.MQ_LINE_END_DATE!=undefined && stageTime < p.MQ_LINE_END_DATE.getTime()){
            stage=5;
            isOnGoing=false;
            stageTime=p.MQ_LINE_END_DATE.getTime();
            if(p.MQ_LINE_START_DATE==undefined)    ret[stage]=null;
            else    ret[stage]=this.judgeStatus(stageTime-p.MQ_LINE_START_DATE.getTime(), this.state.ProductionThresholds.MQ_LINE);
        }
                
        //  REWORK_AFTER_MQ_START_DATE
        if(p.REWORK_AFTER_MQ_START_DATE!=undefined && stageTime < p.REWORK_AFTER_MQ_START_DATE.getTime()){
            stage=6;
            isOnGoing=true;
            stageTime=p.REWORK_AFTER_MQ_START_DATE.getTime();
            ret[stage]=this.judgeStatus(now.getTime()-stageTime, this.state.ProductionThresholds.REWORK_AFTER_MQ);
        }
                
        //  REWORK_AFTER_MQ_END_DATE
        if(p.REWORK_AFTER_MQ_END_DATE!=undefined && stageTime < p.REWORK_AFTER_MQ_END_DATE.getTime()){
            stage=6;
            isOnGoing=false;
            stageTime=p.REWORK_AFTER_MQ_END_DATE.getTime();
            if(p.REWORK_AFTER_MQ_START_DATE==undefined)    ret[stage]=null;
            else    ret[stage]=this.judgeStatus(stageTime-p.REWORK_AFTER_MQ_START_DATE.getTime(), this.state.ProductionThresholds.REWORK_AFTER_MQ);
        }
                
        //  PRODUCTION_END_DATE
        if(p.PRODUCTION_END_DATE!=undefined && stageTime < p.PRODUCTION_END_DATE.getTime()){
            stage=7;
            isOnGoing=false;
            stageTime=p.PRODUCTION_END_DATE.getTime();
            if(p.CREATE_DATE==undefined)    ret[stage]=null;
            else    ret[stage]=this.judgeStatus(stageTime-p.CREATE_DATE.getTime(), this.state.ProductionThresholds.PRODUCTION_END);
        }
                
        //  INSPECTION_START_DATE
        if(p.INSPECTION_START_DATE!=undefined && stageTime < p.INSPECTION_START_DATE.getTime()){
            stage=8;
            isOnGoing=true;
            stageTime=p.INSPECTION_START_DATE.getTime();
            ret[stage]=this.judgeStatus(now.getTime()-stageTime, this.state.ProductionThresholds.INSPECTION);
        }
                
        //  INSPECTION_END_DATE
        if(p.INSPECTION_END_DATE!=undefined && stageTime < p.INSPECTION_END_DATE.getTime()){
            stage=8;
            isOnGoing=false;
            stageTime=p.INSPECTION_END_DATE.getTime();
            if(p.INSPECTION_START_DATE==undefined)    ret[stage]=null;
            else    ret[stage]=this.judgeStatus(stageTime-p.INSPECTION_START_DATE.getTime(), this.state.ProductionThresholds.INSPECTION);
        }
                
        //  REWORK_DUR_INSP_START_DATE
        if(p.REWORK_DUR_INSP_START_DATE!=undefined && stageTime < p.REWORK_DUR_INSP_START_DATE.getTime()){
            stage=9;
            isOnGoing=true;
            stageTime=p.REWORK_DUR_INSP_START_DATE.getTime();
            ret[stage]=this.judgeStatus(now.getTime()-stageTime, this.state.ProductionThresholds.REWORK_DUR_INSP);
        }
                
        //  REWORK_DUR_INSP_END_DATE
        if(p.REWORK_DUR_INSP_END_DATE!=undefined && stageTime < p.REWORK_DUR_INSP_END_DATE.getTime()){
            stage=9;
            isOnGoing=false;
            stageTime=p.REWORK_DUR_INSP_END_DATE.getTime();
            if(p.REWORK_DUR_INSP_START_DATE==undefined)    ret[stage]=null;
            else    ret[stage]=this.judgeStatus(stageTime-p.REWORK_DUR_INSP_START_DATE.getTime(), this.state.ProductionThresholds.REWORK_DUR_INSP);
        }
                
        //  SHIPPING_DATE
        if(p.SHIPPING_DATE!=undefined && stageTime < p.SHIPPING_DATE.getTime()){
            stage=10;
            isOnGoing=false;
            stageTime=p.SHIPPING_DATE.getTime();
            if(p.CREATE_DATE==undefined)    ret[stage]=null;
            else    ret[stage]=this.judgeStatus(stageTime-p.CREATE_DATE.getTime(), this.state.ProductionThresholds.SHIPPING);
        }
        
        ret["stage"]=stage;
        ret["isOnGoing"]=isOnGoing;
        ret["stageTime"]=stageTime;
        
        /*
         * SHIPPING_STATUS
         */
        var s;

        if(p.SHIPPING_STATUS==undefined)    p.SHIPPING_STATUS=0;
        switch(parseInt(p.SHIPPING_STATUS)){
        case 0:
            s="";
            break;
        case 1:
            s="Placed at shipping area";
            break;
        case 2:
            s="Placed outside";
            break;
        case 3:
            s="Placed at future area";
            break;
        case 4:
            s="Shipped";
            break;
        case 5:
            s="Lost";
            break;
        default:
            s="Unknown Status";
        }
        ret["shippingStatus"]=s;

        
        return ret;
    }

}
