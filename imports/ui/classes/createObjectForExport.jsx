import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'

import CF from '../classes/CommonFunctions.jsx';
const cf=new CF();


import { prod_monitor } from '../../api/prod_monitor.js';
import { prod_monitor_comment } from '../../api/prod_monitor_comment.js';
import { prod_monitor_parts } from '../../api/prod_monitor_parts.js';

export default class createObjectForExport{
    
    productToStr(p){
        var contents = "";

        contents += ',"' + cf.formatString(p.ID_NO)                        + '"';
        contents += ',"' + cf.formatDateTime(p.CREATE_DATE)                + '"';
        contents += ',"' + cf.formatString(p.CREATE_BY)                    + '"';
        contents += ',"' + cf.formatDateTime(p.UPDATE_DATE)                + '"';
        contents += ',"' + cf.formatString(p.UPDATE_BY)                    + '"';
        contents += ','  + cf.formatString(p.MONTHLY_SEQ);
        contents += ',"' + cf.formatString(p.MODEL_CODE)                   + '"';
        contents += ',"' + cf.formatString(p.REMARKS)                      + '"';
        contents += ',"' + cf.formatDateTime(p.PLAN_PROD_FINISH_DATE)      + '"';
        contents += ','  + cf.formatString(p.LOCATION_STATUS);
        contents += ',"' + cf.formatString(p.PARTS_PREPARATION_STATUS)     + '"';
        contents += ',"' + cf.formatDateTime(p.CHASSIS_LINE_START_DATE)    + '"';
        contents += ',"' + cf.formatDateTime(p.CHASSIS_LINE_END_DATE)      + '"';
        contents += ',"' + cf.formatDateTime(p.PAINT_LINE_START_DATE)      + '"';
        contents += ',"' + cf.formatDateTime(p.PAINT_LINE_END_DATE)        + '"';
        contents += ',"' + cf.formatDateTime(p.TRACTOR_LINE_START_DATE)    + '"';
        contents += ',"' + cf.formatDateTime(p.TRACTOR_LINE_END_DATE)      + '"';
        contents += ',"' + cf.formatDateTime(p.REWORK_BEFORE_MQ_START_DATE)+ '"';
        contents += ',"' + cf.formatDateTime(p.REWORK_BEFORE_MQ_END_DATE)  + '"';
        contents += ',"' + cf.formatDateTime(p.MQ_LINE_START_DATE)         + '"';
        contents += ',"' + cf.formatDateTime(p.MQ_LINE_END_DATE)           + '"';
        contents += ',"' + cf.formatDateTime(p.REWORK_AFTER_MQ_START_DATE) + '"';
        contents += ',"' + cf.formatDateTime(p.REWORK_AFTER_MQ_END_DATE)   + '"';
        contents += ',"' + cf.formatDateTime(p.PRODUCTION_END_DATE)        + '"';
        contents += ',"' + cf.formatDateTime(p.INSPECTION_START_DATE)      + '"';
        contents += ',"' + cf.formatDateTime(p.INSPECTION_END_DATE)        + '"';
        contents += ',"' + cf.formatDateTime(p.REWORK_DUR_INSP_START_DATE) + '"';
        contents += ',"' + cf.formatDateTime(p.REWORK_DUR_INSP_END_DATE)   + '"';
        contents += ',"' + cf.formatString(p.SHIPPING_STATUS)              + '"';
        contents += ',"' + cf.formatDateTime(p.SHIPPING_DATE)              + '"';
        
        return contents;
    }
    
    createBlobCsv(filter){
        var products=prod_monitor.find({$or: [ {"CREATE_DATE":filter} , {"UPDATE_DATE":filter} ]}).fetch();

        var contents = "";
        
        // Header line
        contents +=  '"Collection"';
        contents += ',"ID_NO"';
        contents += ',"CREATE_DATE"';
        contents += ',"CREATE_BY"';
        contents += ',"UPDATE_DATE"';
        contents += ',"UPDATE_BY"';
        contents += ',"MONTHLY_SEQ"';
        contents += ',"MODEL_CODE"';
        contents += ',"REMARKS"';
        contents += ',"PLAN_PROD_FINISH_DATE"';
        contents += ',"LOCATION_STATUS"';
        contents += ',"PARTS_PREPARATION_STATUS"';
        contents += ',"CHASSIS_LINE_START_DATE"';
        contents += ',"CHASSIS_LINE_END_DATE"';
        contents += ',"PAINT_LINE_START_DATE"';
        contents += ',"PAINT_LINE_END_DATE"';
        contents += ',"TRACTOR_LINE_START_DATE"';
        contents += ',"TRACTOR_LINE_END_DATE"';
        contents += ',"REWORK_BEFORE_MQ_START_DATE"';
        contents += ',"REWORK_BEFORE_MQ_END_DATE"';
        contents += ',"MQ_LINE_START_DATE"';
        contents += ',"MQ_LINE_END_DATE"';
        contents += ',"REWORK_AFTER_MQ_START_DATE"';
        contents += ',"REWORK_AFTER_MQ_END_DATE"';
        contents += ',"PRODUCTION_END_DATE"';
        contents += ',"INSPECTION_START_DATE"';
        contents += ',"INSPECTION_END_DATE"';
        contents += ',"REWORK_DUR_INSP_START_DATE"';
        contents += ',"REWORK_DUR_INSP_END_DATE"';
        contents += ',"SHIPPING_STATUS"';
        contents += ',"SHIPPING_DATE"';
        contents += ',"SEQ_NO"';
        contents += ',"CREATE_DATE"';
        contents += ',"CREATE_BY"';
        contents += ',"UPDATE_DATE"';
        contents += ',"UPDATE_BY"';
        contents += ',"USER_COMMENT"';
        contents += ',"SEQ_NO"';
        contents += ',"LOCATION"';
        contents += ',"CALCULATED_DATE"';
        contents += ',"ITEM_NUMBER"';
        contents += ',"ITEM_DESCRIPTION"';
        contents += ',"REQUIREMENT_QTY"';
        contents += ',"MISSING_QTY"';
        contents += ',"Ack"';
        contents += ',"AckBy"';
        contents += ',"AckOn"';
        contents += "\r\n";
        
        //  Per product
        products.map(
            (p)=>{
                contents += '"PROD_MONITOR"' + this.productToStr(p);
                contents += "\r\n";

                // Comments
                var comments=prod_monitor_comment.find({"ID_NO":p.ID_NO.trim()}).fetch();
                comments.map(
                    (c)=>{
                        contents += '"PROD_MONITOR_COMMENT"'+ this.productToStr(p);
                        contents += ','  + cf.formatString(c.SEQ_NO);
                        contents += ',"' + cf.formatDateTime(c.CREATE_DATE)+ '"';
                        contents += ',"' + cf.formatString(c.CREATE_BY)    + '"';
                        contents += ',"' + cf.formatDateTime(c.UPDATE_DATE)+ '"';
                        contents += ',"' + cf.formatString(c.UPDATE_BY)    + '"';
                        contents += ',"' + cf.formatString(c.USER_COMMENT) + '"';
                        contents += "\r\n";
                    }
                );
                
                // Missing parts
                var parts=prod_monitor_parts.find({"ID_NO":p.ID_NO.trim()}).fetch();
                parts.map(
                    (mp)=>{
                        contents +=  '"PROD_MONITOR_PARTS"'+ this.productToStr(p);
                        // Comment
                        contents += ','  + cf.formatString(c.SEQ_NO);
                        contents += ',"' + cf.formatDateTime(c.CREATE_DATE)+ '"';
                        contents += ',"' + cf.formatString(c.CREATE_BY)    + '"';
                        contents += ',"' + cf.formatDateTime(c.UPDATE_DATE)+ '"';
                        contents += ',"' + cf.formatString(c.UPDATE_BY)    + '"';
                        contents += ',"' + cf.formatString(c.USER_COMMENT) + '"';
                        // Parts
                        contents += ','  + cf.formatString(mp.SEQ_NO);
                        contents += ',"' + cf.formatString(mp.LOCATION)         + '"';
                        contents += ',"' + cf.formatDateTime(mp.CALCULATED_DATE)+ '"';
                        contents += ',"' + cf.formatString(mp.ITEM_NUMBER)      + '"';
                        contents += ',"' + cf.formatString(mp.ITEM_DESCRIPTION) + '"';
                        contents += ','  + cf.formatString(mp.REQUIREMENT_QTY);
                        contents += ','  + cf.formatString(mp.MISSING_QTY);
                        contents += ',"' + (mp.Ack?'Received':'Missing')        + '"';
                        contents += ',"' + cf.formatString(mp.AckBy)            + '"';
                        contents += ',"' + cf.formatDateTime(mp.AckOn)          + '"';
                        contents += "\r\n";
                    }
                );
            }
        );

        return new Blob([contents], {type: 'text/csv'});
    }
    

    createBlobJson(filter){
        var products=prod_monitor.find({$or: [ {"CREATE_DATE":filter} , {"UPDATE_DATE":filter} ]}).fetch();

        var pLen=0;
        var contents = "[\r\n";

        products.map(
            (p)=>{
                if(0 < pLen) contents += ",\r\n";
                contents += "[";
                contents +=  '{"ID_NO": "'                      + cf.formatString(p.ID_NO)                        + '"}';
                contents += ',{"CREATE_DATE": "'                + cf.formatDateTime(p.CREATE_DATE)                + '"}';
                contents += ',{"CREATE_BY": "'                  + cf.formatString(p.CREATE_BY)                    + '"}';
                contents += ',{"UPDATE_DATE": "'                + cf.formatDateTime(p.UPDATE_DATE)                + '"}';
                contents += ',{"UPDATE_BY": "'                  + cf.formatString(p.UPDATE_BY)                    + '"}';
                contents += ',{"MONTHLY_SEQ": "'                + cf.formatString(p.MONTHLY_SEQ)                  + '"}';
                contents += ',{"MODEL_CODE": "'                 + cf.formatString(p.MODEL_CODE)                   + '"}';
                contents += ',{"REMARKS": "'                    + cf.formatString(p.REMARKS)                      + '"}';
                contents += ',{"PLAN_PROD_FINISH_DATE": "'      + cf.formatDateTime(p.PLAN_PROD_FINISH_DATE)      + '"}';
                contents += ',{"LOCATION_STATUS": '             + cf.formatString(p.LOCATION_STATUS)              + '}';
                contents += ',{"PARTS_PREPARATION_STATUS": "'   + cf.formatString(p.PARTS_PREPARATION_STATUS)     + '"}';
                contents += ',{"CHASSIS_LINE_START_DATE": "'    + cf.formatDateTime(p.CHASSIS_LINE_START_DATE)    + '"}';
                contents += ',{"CHASSIS_LINE_END_DATE": "'      + cf.formatDateTime(p.CHASSIS_LINE_END_DATE)      + '"}';
                contents += ',{"PAINT_LINE_START_DATE": "'      + cf.formatDateTime(p.PAINT_LINE_START_DATE)      + '"}';
                contents += ',{"PAINT_LINE_END_DATE": "'        + cf.formatDateTime(p.PAINT_LINE_END_DATE)        + '"}';
                contents += ',{"TRACTOR_LINE_START_DATE": "'    + cf.formatDateTime(p.TRACTOR_LINE_START_DATE)    + '"}';
                contents += ',{"TRACTOR_LINE_END_DATE": "'      + cf.formatDateTime(p.TRACTOR_LINE_END_DATE)      + '"}';
                contents += ',{"REWORK_BEFORE_MQ_START_DATE": "'+ cf.formatDateTime(p.REWORK_BEFORE_MQ_START_DATE)+ '"}';
                contents += ',{"REWORK_BEFORE_MQ_END_DATE": "'  + cf.formatDateTime(p.REWORK_BEFORE_MQ_END_DATE)  + '"}';
                contents += ',{"MQ_LINE_START_DATE": "'         + cf.formatDateTime(p.MQ_LINE_START_DATE)         + '"}';
                contents += ',{"MQ_LINE_END_DATE": "'           + cf.formatDateTime(p.MQ_LINE_END_DATE)           + '"}';
                contents += ',{"REWORK_AFTER_MQ_START_DATE": "' + cf.formatDateTime(p.REWORK_AFTER_MQ_START_DATE) + '"}';
                contents += ',{"REWORK_AFTER_MQ_END_DATE": "'   + cf.formatDateTime(p.REWORK_AFTER_MQ_END_DATE)   + '"}';
                contents += ',{"PRODUCTION_END_DATE": "'        + cf.formatDateTime(p.PRODUCTION_END_DATE)        + '"}';
                contents += ',{"INSPECTION_START_DATE": "'      + cf.formatDateTime(p.INSPECTION_START_DATE)      + '"}';
                contents += ',{"INSPECTION_END_DATE": "'        + cf.formatDateTime(p.INSPECTION_END_DATE)        + '"}';
                contents += ',{"REWORK_DUR_INSP_START_DATE": "' + cf.formatDateTime(p.REWORK_DUR_INSP_START_DATE) + '"}';
                contents += ',{"REWORK_DUR_INSP_END_DATE": "'   + cf.formatDateTime(p.REWORK_DUR_INSP_END_DATE)   + '"}';
                contents += ',{"SHIPPING_STATUS": '             + cf.formatString(p.SHIPPING_STATUS)              + '}';
                contents += ',{"SHIPPING_DATE": "'              + cf.formatDateTime(p.SHIPPING_DATE)              + '"}';

                // Comments
                var cLen=0;
                var comments=prod_monitor_comment.find({"ID_NO":p.ID_NO.trim()}).fetch();

                if(0 <= comments.length)    contents += ',{"COMMENT": [';
                comments.map(
                    (c)=>{
                        if(0 < cLen) contents += ",";
                        contents += "[";
                        contents +=  '{"SEQ_NO": '       + cf.formatString(c.SEQ_NO)       + '}';
                        contents += ',{"CREATE_DATE": "' + cf.formatDateTime(c.CREATE_DATE)+ '"}';
                        contents += ',{"CREATE_BY": "'   + cf.formatString(c.CREATE_BY)    + '"}';
                        contents += ',{"UPDATE_DATE": "' + cf.formatDateTime(c.UPDATE_DATE)+ '"}';
                        contents += ',{"UPDATE_BY": "'   + cf.formatString(c.UPDATE_BY)    + '"}';
                        contents += ',{"USER_COMMENT": "'+ cf.formatString(c.USER_COMMENT) + '"}';
                        contents += "]";
                        ++cLen;
                    }
                );
                if(0 <= comments.length)    contents += ']}';
                
                // Missing parts
                var mpLen=0;
                var parts=prod_monitor_parts.find({"ID_NO":p.ID_NO.trim()}).fetch();

                if(0 <= parts.length)    contents += ',{"PARTS": [';
                parts.map(
                    (mp)=>{
                        if(0 < mpLen) contents += ",";
                        contents += "[";
                        contents +=  '{"SEQ_NO": '           + cf.formatString(mp.SEQ_NO)           + '}';
                        contents += ',{"LOCATION": "'        + cf.formatString(mp.LOCATION)         + '"}';
                        contents += ',{"CALCULATED_DATE": "' + cf.formatDateTime(mp.CALCULATED_DATE)+ '"}';
                        contents += ',{"ITEM_NUMBER": "'     + cf.formatString(mp.ITEM_NUMBER)      + '"}';
                        contents += ',{"ITEM_DESCRIPTION": "'+ cf.formatString(mp.ITEM_DESCRIPTION) + '"}';
                        contents += ',{"REQUIREMENT_QTY": '  + cf.formatString(mp.REQUIREMENT_QTY)  + '}';
                        contents += ',{"MISSING_QTY": '      + cf.formatString(mp.MISSING_QTY)      + '}';
                        contents += ',{"Ack": "'             + (mp.Ack?'Received':'Missing')        + '"}';
                        contents += ',{"AckBy": "'           + cf.formatString(mp.AckBy)            + '"}';
                        contents += ',{"AckOn": "'           + cf.formatDateTime(mp.AckOn)          + '"}';

                        contents += "]";
                        ++mpLen;
                    }
                );
                if(0 <= parts.length)    contents += ']}';

                // End of one product.
                contents += "]\r\n";
                ++pLen;
            }
        );

        contents += "]\r\n"
            
        return new Blob([contents], {type: 'text/json'});
    }
    
}

