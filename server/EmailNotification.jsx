import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Email } from 'meteor/email'

import CF, {LocationTitles, LocationIcons, ShippingStatuses} from '../imports/ui/classes/CommonFunctions.jsx';
const cf=new CF();


const prod_monitor_notification = new Mongo.Collection('prod_monitor_notification',{"idGeneration":"MONGO"});


/*
 * Email notification
 * In a live system, do not forget specifying the MAIL_URL environment valiavle
 *  export MAIL_URL=smtp://USERNAME:PASSWORD@HOST:PORT
 * ex. 
 *  export MAIL_URL=smtp://localhost:25
 *  export MAIL_URL=smtp://smtpauthuser:smtpauthpassword@smtp.kubota.com:465
 * 
 */
export function EmailNotification(prod_monitor){
    console.log('EmailNotification');

    var users=Meteor.users.find().fetch();

    var ProductLineEvent=(p,le,m)=>{  // p:product. le:LineEvent. m:message.
        if( prod_monitor_notification.find({'ID_NO':p.ID_NO, 'LineEvent':le}).count() <=0 ){
            for(var i in users){
                var u=users[i];
                if(u.profile==undefined || u.profile.EmailLineEventNotification==undefined || u.profile.EmailLineEventNotification[le]==undefined)    continue;

                if( ! u.profile.EmailLineEventNotification[le] )    continue;
                
                sendEmailLineEventNotification(p,le,m,u);
            }   // for each user

            // Add to prod_monitor_notification
            var argv=[];
            argv["ID_NO"]=p.ID_NO;
            argv["LineEvent"]= le;
            argv["SENT_DATE"]=new Date();
            prod_monitor_notification.insert(argv);
        }
    }


    if(prod_monitor == undefined)    return;
    
    var products=prod_monitor.find().fetch();
    //console.log(products);
    if(products.length <= 0)    return;
        
    for(var i in products){
        var p=products[i];
        console.log('----------'+p.ID_NO+'--------------------------------------');

        if(p.LOCATION_STATUS==undefined || p.LOCATION_STATUS==null) return;
        var s=cf.productStatus(p);  //  s:productStatus 
        
        // Email Threshold Notification
        var thresholdIndex=s[p.LOCATION_STATUS].thresholdIndex;
        
        if( 0 < thresholdIndex && prod_monitor_notification.find({'ID_NO':p.ID_NO, 'LOCATION_STATUS':p.LOCATION_STATUS, 'thresholdIndex':thresholdIndex}).count() <=0 ){
            for(var i in users){
                var u=users[i];
                if(u.profile==undefined || u.profile.EmailThresholdNotification==undefined)    continue;

                var e=u.profile.EmailThresholdNotification;

                switch(p.LOCATION_STATUS){
                case 1:
                    if(e.ChassisLine===thresholdIndex)    sendEmailThresholdNotification(p,s,u); // p:product. s:productStatus. u:user.
                    break;
                case 2:
                    if(e.PaintLine===thresholdIndex)    sendEmailThresholdNotification(p,s,u); // p:product. s:productStatus. u:user.
                    break;
                case 3:
                    if(e.TractorLine===thresholdIndex)    sendEmailThresholdNotification(p,s,u); // p:product. s:productStatus. u:user.
                    break;
                case 4:
                    if(e.MQLine===thresholdIndex)    sendEmailThresholdNotification(p,s,u); // p:product. s:productStatus. u:user.
                    break;
                case 5:
                    if(e.ReworkBeforeMQ===thresholdIndex)    sendEmailThresholdNotification(p,s,u); // p:product. s:productStatus. u:user.
                    break;
                case 6:
                    if(e.ReworkAfterMQ===thresholdIndex)    sendEmailThresholdNotification(p,s,u); // p:product. s:productStatus. u:user.
                    break;
                case 7:
                    if(e.ProductionCompletion===thresholdIndex)    sendEmailThresholdNotification(p,s,u); // p:product. s:productStatus. u:user.
                    break;
                case 8:
                    if(e.Inspection===thresholdIndex)    sendEmailThresholdNotification(p,s,u); // p:product. s:productStatus. u:user.
                    break;
                case 9:
                    if(e.ReworkDuringInspection===thresholdIndex)    sendEmailThresholdNotification(p,s,u); // p:product. s:productStatus. u:user.
                    break;
                case 14:
                    if(e.Shipped===thresholdIndex)    sendEmailThresholdNotification(p,s,u); // p:product. s:productStatus. u:user.
                    break;
                default:
                }   // switch
                
            }   // for each user

            // Add to prod_monitor_notification
            var argv=[];
            argv["ID_NO"]=p.ID_NO;
            argv["LOCATION_STATUS"]= p.LOCATION_STATUS;
            argv["thresholdIndex"]=thresholdIndex;
            argv["SENT_DATE"]=new Date();
            //console.log('Inserting into prod_monitor_notification');
            //console.log(argv);
            prod_monitor_notification.insert(argv);
        }
        
        // Email Line Event Notification
        switch(p.LOCATION_STATUS){
        case 0:
            ProductLineEvent(p, 'PreProductionStart', p.ID_NO+' is in the pre-production state.');
            break;
        case 1:
            if(p.CHASSIS_LINE_START_DATE!=undefined && p.CHASSIS_LINE_START_DATE!=null)         ProductLineEvent(p, 'ChassisLineStart',             'Production of '+p.ID_NO+' is starting in the Chassis Line.');
            if(p.CHASSIS_LINE_END_DATE!=undefined   && p.CHASSIS_LINE_END_DATE!=null)           ProductLineEvent(p, 'ChassisLineEnd',               'Production of '+p.ID_NO+' is ending in the Chassis Line.');
            break;
        case 2:
            if(p.PAINT_LINE_START_DATE!=undefined && p.PAINT_LINE_START_DATE!=null)             ProductLineEvent(p, 'PaintLineStart',               'Production of '+p.ID_NO+' is starting in the Paint Line.');
            if(p.PAINT_LINE_END_DATE!=undefined   && p.PAINT_LINE_END_DATE!=null)               ProductLineEvent(p, 'PaintLineEnd',                 'Production of '+p.ID_NO+' is ending in the Paint Line.');
            break;
        case 3:
            if(p.TRACTOR_LINE_START_DATE!=undefined && p.TRACTOR_LINE_START_DATE!=null)         ProductLineEvent(p, 'TractorLineStart',             'Production of '+p.ID_NO+' is starting in the Tractor Line.');
            if(p.TRACTOR_LINE_END_DATE!=undefined   && p.TRACTOR_LINE_END_DATE!=null)           ProductLineEvent(p, 'TractorLineEnd',               'Production of '+p.ID_NO+' is ending in the Tractor Line.');
            break;
        case 4:
            if(p.MQ_LINE_START_DATE!=undefined && p.MQ_LINE_START_DATE!=null)                   ProductLineEvent(p, 'MQLineStart',                  'Production of '+p.ID_NO+' is starting in the MQ Line.');
            if(p.MQ_LINE_END_DATE!=undefined   && p.MQ_LINE_END_DATE!=null)                     ProductLineEvent(p, 'MQLineEnd',                    'Production of '+p.ID_NO+' is ending in the MQ Line.');
            break;
        case 5:
            if(p.REWORK_BEFORE_MQ_START_DATE!=undefined && p.REWORK_BEFORE_MQ_START_DATE!=null) ProductLineEvent(p, 'ReworkBeforeMQStart',          'Rework of '+p.ID_NO+' Before MQ is starting.');
            if(p.REWORK_BEFORE_MQ_END_DATE!=undefined   && p.REWORK_BEFORE_MQ_END_DATE!=null)   ProductLineEvent(p, 'ReworkBeforeMQEnd',            'Rework of '+p.ID_NO+' Before MQ is ending.');
            break;
        case 6:
            if(p.REWORK_AFTER_MQ_START_DATE!=undefined && p.REWORK_AFTER_MQ_START_DATE!=null)   ProductLineEvent(p, 'ReworkAfterMQStart',           'Rework of '+p.ID_NO+' After MQ is starting.');
            if(p.REWORK_AFTER_MQ_END_DATE!=undefined   && p.REWORK_AFTER_MQ_END_DATE!=null)     ProductLineEvent(p, 'ReworkAfterMQEnd',             'Rework of '+p.ID_NO+' After MQ is ending.');
            break;
        case 7:
            if(p.PRODUCTION_END_DATE!=undefined && p.PRODUCTION_END_DATE!=null)                 ProductLineEvent(p, 'ProductionCompletionEnd',      'Production of '+p.ID_NO+' is Completing.');
            break;
        case 8:
            if(p.INSPECTION_START_DATE!=undefined && p.INSPECTION_START_DATE!=null)             ProductLineEvent(p, 'InspectionStart',              'Inspection of '+p.ID_NO+' is starting.');
            if(p.INSPECTION_END_DATE!=undefined   && p.INSPECTION_END_DATE!=null)               ProductLineEvent(p, 'InspectionEnd',                'Inspection of '+p.ID_NO+' is ending.');
            break;
        case 9:
            if(p.REWORK_DUR_INSP_START_DATE!=undefined && p.REWORK_DUR_INSP_START_DATE!=null)   ProductLineEvent(p, 'ReworkDuringInspectionStart',  'Rework of '+p.ID_NO+' During Inspection is starting.');
            if(p.REWORK_DUR_INSP_END_DATE!=undefined   && p.REWORK_DUR_INSP_END_DATE!=null)     ProductLineEvent(p, 'ReworkDuringInspectionEnd',    'Rework of '+p.ID_NO+' During Inspection is ending.');
            break;
        case 14:
            if(p.SHIPPING_DATE!=undefined && p.SHIPPING_DATE!=null)                             ProductLineEvent(p, 'ShippedEndd',                  p.ID_NO+' has been shipped.');
            break;
        default:
        }   // switch
        
    };  // for each product
}

function sendEmailThresholdNotification(p,s,u){     // p:product. s:productStatus. u:user.
    if(u.emails==undefined || u.emails[0]==undefined || u.emails[0].address==undefined) return;

    Email.send({
        "from": "do_not_reply@KFM_Production_portal",
        "to": u.emails[0].address,
        "subject": p.ID_NO +' , '+ i18n.__(LocationTitles[p.LOCATION_STATUS]) +' , '+ i18n.__('ui.manageAccount.EmailThresholdNotification'),
//        "text": 'The production of ' + p.ID_NO + ' is experiencing an issue in ' + i18n.__(LocationTitles[p.LOCATION_STATUS])
        "text": 'The state of ' + p.ID_NO + ' is changing to ' +i18n.__(s[p.LOCATION_STATUS]['thresholdMessage'])+ ' in ' + i18n.__(LocationTitles[p.LOCATION_STATUS])
    });
}


function sendEmailLineEventNotification(p,le,m,u){     // p:product. le:LineEvent. m:message. u:user.
    if(u.emails==undefined || u.emails[0]==undefined || u.emails[0].address==undefined) return;

    Email.send({
        "from": "do_not_reply@KFM_Production_portal",
        "to": u.emails[0].address,
        "subject": p.ID_NO +' , '+ i18n.__(LocationTitles[p.LOCATION_STATUS]) +' , '+ le,
        "text": m
    });
}

