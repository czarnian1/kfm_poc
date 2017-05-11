import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Email } from 'meteor/email'

import CF from '../imports/ui/classes/CommonFunctions.jsx';
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
    console.log('');
    console.log('EmailNotification');

    if(prod_monitor == undefined)    return;
    
    var products=prod_monitor.find().fetch();
    if(products <= 0)    return;
        
    products.map((p)=>{
        console.log('----------'+p.ID_NO+'--------------------------------------');

        if(p.LOCATIONSTATUS==undefined || p.LOCATIONSTATUS==null) return;
        var r=cf.productStatus(p);

        if(r[p.LOCATIONSTATUS].thresholdWarn){
            if( 0 < prod_monitor_notification.find({"ID_NO":p.ID_NO, "LOCATIONSTATUS":p.LOCATIONSTATUS}).count() ){
                console.log("Already sent.");
            }
            else{
                sendEmail(p);

                // Add to prod_monitor_notification
                var argv=[];
                argv["ID_NO"]=p.ID_NO;
                argv["LOCATIONSTATUS"]= p.LOCATIONSTATUS;
                argv["SENT_DATE"]=new Date();
                console.log('Inserting into prod_monitor_notification');
                console.log(argv);
                prod_monitor_notification.insert(argv);

            }
        } else {
            console.log("No need to send an email.");
        }
    });
}

function sendEmail(p){      // p: product, a record of PROD_MONITOR.
    var bcc=[];
    var users=Meteor.users.find().fetch();
    users.map(
        function(u){
            if(u.profile==undefined) return;
            if(!u.profile.EmailNotification) return;

//            console.log('u.profile.FilterStartId');
//            console.log(u.profile.FilterStartId);
            if(u.profile.FilterStartId != undefined
              && u.profile.FilterStartId != ""
              && p.ID_NO < u.profile.FilterStartId) return;
            
//            console.log('u.profile.FilterEndId');
//            console.log(u.profile.FilterEndId);
            if(u.profile.FilterEndId != undefined
              && u.profile.FilterEndId != ""
              && u.profile.FilterEndId < p.ID_NO) return;

            if(u.emails==undefined) return;
            
            u.emails.map(
                function(m){
                    if(m.address==undefined)    return;
                    bcc[bcc.length]=m.address;
//                    console.log('  '+ m.address + ' has been added to bcc.');
                }
            ) // u.emails.map
        }
    ); // users.map

    if(bcc.length<=0)    return;
    Email.send({
        "from": "do_not_reply@KFM_Production_portal",
        "bcc": bcc,
        "subject": 'Production warning, '+ p.ID_NO+' , ' + i18n.__(cf.locationTitle(p.LOCATIONSTATUS)),
        "text": 'The production of ' + p.ID_NO + ' is experiencing an issue in ' + i18n.__(cf.locationTitle(p.LOCATIONSTATUS))
    });
}





