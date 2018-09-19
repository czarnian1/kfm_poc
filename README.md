1. Base Process for Web App Portal VM Build

DevOps &&|| Production

![image alt text](image_0.png)

The deploy web app for QA also support deployment to production instance. This can be a vsphere copy of the QA with no install devops and meteor dependencies installed.

    1. Oracle Consumer Queuing and PROD_MONITOR Trigger

The ability to update/insert the HUBADMIN.PROD_MONOTIR table is affected by a working messaging and AQ queuing system. Without the AQ system implemented the trigger can’t be enabled as direct inserts/updates are actioned on PROD_MONITOR causing a message object to be passed – if this message passing is not enabled via AQ then the insert will fail after update and prevent a commit.

        1. Setup PRDTST (QA) Messaging and Queuing Environment

![image alt text](image_1.png)

        2. Give HUBADMIN and STDADMIN execute rights for AQ messaging for the consumers

As user sys as sysdba via sqlplus

SQL> grant EXECUTE on SYS.DBMS_AQ to HUBADMIN;

SQL> grant EXECUTE on DBMS_AQ to HUBADMIN;

SQL> grant EXECUTE on SYS.DBMS_AQADM to HUBADMIN;

SQL> grant EXECUTE on DBMS_AQADM to HUBADMIN;

SQL> grant EXECUTE_CATALOG_ROLE  to HUBADMIN;

/* repeat for STDADMIN */

Check SQL> select object_name, object_type from user_objects where object_type in ('PROCEDURE','PACKAGE', 'FUNCTION', 'PACKAGE BODY') AND ROWNUM < 50;

To make sure the HUBADMIN and STDADMIN users can access the SYS scope available stored procedure run the above; you are specifically using only the DBMS_AQ package, but the command should return package availability data limited to 50 rows (there are over 1300 stored procedures). Note STDADMIN and HUBADMIN permissions need to be checked confirmed to ensure the HUBADMIN user can run a trigger against a STDAMIN schema table

    2. Create Messaging Framework in Oracle for consumers

As user HUBADMIN (NOTE:  The batch process that updates PROD_MINOTR runs as STDADMIN user  therefore the queue names must include the user schema HUBADMIN)

Create message_t message payload type for consumer(s) via sqlplus

sqlplus> create type message_t as object (json varchar(4000));

  2  /

Create the consumer queue for PROD_MONITOR messages using this message_t

sqlplus> execute DBMS_AQADM.CREATE_QUEUE_TABLE(queue_table => 'KFMQUEUE_TAB',     queue_payload_type => 'message_t' );

Create a queue for PROD_MONITOR using the above queue table.

sqlplus> execute DBMS_AQADM.CREATE_QUEUE(queue_name => 'KFMQUEUE', queue_table => 'KFMQUEUE_TAB');

Start the queue

sqlplus> execute DBMS_AQADM.START_QUEUE(queue_name => 'KFMQUEUE');

This will create the following visible entry in SQL Developer , the owner will be HUBADMIN in Oracle for PRDTST service ID

![image alt text](image_2.png)

        3. Production Monitor Consumer

Create the procedure that will be called to enqueue and dequeue messages from the queue for PROD_MONITOR. This can be done in sqldeveloper right click on Procedures

![image alt text](image_3.png)

create or replace procedure enqueue_message

(

  payload in varchar2

) as

msg message_t := message_t(NULL);

msg_id RAW(16);

priority NUMBER;

enqueue_options DBMS_AQ.ENQUEUE_OPTIONS_T;

message_properties DBMS_AQ.MESSAGE_PROPERTIES_T;

BEGIN

  msg.json := payload;

  message_properties.priority := 1;  -- give all messages same priority

  DBMS_AQ.ENQUEUE(

queue_name => 'HUBADMIN.kfmqueue',

enqueue_options => enqueue_options,

message_properties => message_properties,

payload => msg,

msgid => msg_id);

END enqueue_message;

Create the associated Procedure to dequeue a message

create or replace procedure dequeue_message

(

  payload out varchar2

) as

msg message_t := message_t(NULL); --message_t must match the message object type created in sqlplus

  msg_id RAW(16);

  dequeue_options DBMS_AQ.DEQUEUE_OPTIONS_T;

  message_properties DBMS_AQ.MESSAGE_PROPERTIES_T;

BEGIN

  DBMS_AQ.DEQUEUE(

queue_name => 'HUBADMIN.kfmqueue',

dequeue_options => dequeue_options,

message_properties => message_properties,

payload => msg,

msgid => msg_id

  ); -- the queue name must match the queue created in sqlplus

  payload := msg.json;

END dequeue_message;

Create a function called ConvertToUTC with the following content

![image alt text](image_4.png)

-----------------------------------------------------------------------------------------------

--

-- 20Mar2018_Amd expect DATE in Oracle to be CET (DATE not TIMESTAMP or TIMESTAMP_WITH_LOCALTIME)

--

-----------------------------------------------------------------------------------------------

**create** **or** replace **Function** ConvertToUTC

   ( date_in **IN** **date** )

   **RETURN** **date**

**IS**

**BEGIN**

	

	**RETURN**(**cast**(date_in **as** **timestamp**) **at** **time** **zone** 'UTC');

**END**;

Create new trigger to monitor for data changes, right click on the Trigger icon and select New Trigger

![image alt text](image_5.png)

Create the PROD_MONITOR_QUEUE_TRIG as below (note the stripping of ASCII chars 13 and 10 are required) :-

------------------------------------------------------------------------

--

--  DDL for PROD_MONITOR_QUEUE_TRIG

--  20Mar2018_Amd1

--

------------------------------------------------------------------------

**create** **or** replace **TRIGGER** "HUBADMIN"."PROD_MONITOR_QUEUE_TRIG" **AFTER** **INSERT** **OR** **UPDATE** **OR** **DELETE** **OF** UPDATE_DATE

**ON** PROD_MONITOR

**FOR** **EACH** **ROW**

**DECLARE**

json VARCHAR2(4000);

**BEGIN**

**execute** **immediate** 'alter session set NLS_DATE_FORMAT=''yyyy-mm-dd"T"hh24:mi:ss''';

-- For simplicity sake for POC simple concatenations. Production

-- JSON serialization code should do character escaping (double quotes,

-- newlines, etc).

**IF** INSERTING **OR** UPDATING **THEN**

SYS.DBMS_OUTPUT.PUT_LINE('Updating');

json := '{"ID_NO":"' || **:new**.ID_NO;

json := json|| '","CREATE_DATE":"' || ConvertToUTC(**:new**.CREATE_DATE);

json := json|| '","CREATE_BY":"' || **TRIM**(**:new**.CREATE_BY);

json := json|| '","UPDATE_DATE":"' ||  ConvertToUTC(**:new**.UPDATE_DATE);

json := json|| '","UPDATE_BY":"' || **TRIM**(**:new**.UPDATE_BY);

json := json|| '","MONTHLY_SEQ":"' || **TRIM**(**:new**.MONTHLY_SEQ);

json := json|| '","MODEL_CODE":"' || **TRIM**(**TRANSLATE**(**:new**.MODEL_CODE,'x'||CHR(10)||CHR(13), 'x'));

json := json|| '","REMARKS":"' || **TRIM**(**TRANSLATE**(**:new**.REMARKS,'x'||CHR(10)||CHR(13), 'x'));

json := json|| '","PLAN_PROD_FINISH_DATE":"' ||  ConvertToUTC(**:new**.PLAN_PROD_FINISH_DATE);

json := json|| '","LOCATION_STATUS":"' || **:new**.LOCATION_STATUS;

json := json|| '","PARTS_PREPARATION_STATUS":"' || **:new**.PARTS_PREPARATION_STATUS;

json := json|| '","CHASSIS_LINE_START_DATE":"' ||  ConvertToUTC(**:new**.CHASSIS_LINE_START_DATE);

json := json|| '","CHASSIS_LINE_END_DATE":"' ||  ConvertToUTC(**:new**.CHASSIS_LINE_END_DATE);

json := json|| '","PAINT_LINE_START_DATE":"' ||  ConvertToUTC(**:new**.PAINT_LINE_START_DATE);

json := json|| '","PAINT_LINE_END_DATE":"' ||  ConvertToUTC(**:new**.PAINT_LINE_END_DATE);

json := json|| '","TRACTOR_LINE_START_DATE":"' ||  ConvertToUTC(**:new**.TRACTOR_LINE_START_DATE);

json := json|| '","TRACTOR_LINE_END_DATE":"' ||  ConvertToUTC(**:new**.TRACTOR_LINE_END_DATE);

json := json|| '","REWORK_BEFORE_MQ_START_DATE":"' ||  ConvertToUTC(**:new**.REWORK_BEFORE_MQ_START_DATE);

json := json|| '","REWORK_BEFORE_MQ_END_DATE":"' ||  ConvertToUTC(**:new**.REWORK_BEFORE_MQ_END_DATE);

json := json|| '","MQ_LINE_START_DATE":"' ||  ConvertToUTC(**:new**.MQ_LINE_START_DATE);

json := json|| '","MQ_LINE_END_DATE":"'||  ConvertToUTC(**:new**.MQ_LINE_END_DATE);

json := json|| '","REWORK_AFTER_MQ_START_DATE":"' ||  ConvertToUTC(**:new**.REWORK_AFTER_MQ_START_DATE);

json := json|| '","REWORK_AFTER_MQ_END_DATE":"' ||  ConvertToUTC(**:new**.REWORK_AFTER_MQ_END_DATE);

json := json|| '","PRODUCTION_END_DATE":"' ||  ConvertToUTC(**:new**.PRODUCTION_END_DATE);

json := json|| '","INSPECTION_START_DATE":"' ||  ConvertToUTC(**:new**.INSPECTION_START_DATE);

json := json|| '","INSPECTION_END_DATE":"' ||  ConvertToUTC(**:new**.INSPECTION_END_DATE);

json := json|| '","REWORK_DUR_INSP_START_DATE":"' ||  ConvertToUTC(**:new**.REWORK_DUR_INSP_START_DATE);

json := json|| '","REWORK_DUR_INSP_END_DATE":"' ||  ConvertToUTC(**:new**.REWORK_DUR_INSP_END_DATE);

json := json|| '","SHIPPING_STATUS":"' || **:new**.SHIPPING_STATUS;

json := json|| '","SHIPPING_DATE":"' ||  ConvertToUTC(**:new**.SHIPPING_DATE) || '","dml_type":"';

json := json|| **CASE** **WHEN** INSERTING **THEN** 'I' **ELSE** 'U' **END** || '"}';

**ELSE**

json := '{"ID_NO":"' || **:old**.ID_NO || '","dml_type":"D"}';

**END** **IF**;

SYS.DBMS_OUTPUT.PUT_LINE('--------- JSON -------- ');

SYS.DBMS_OUTPUT.PUT_LINE(json);

enqueue_message(json);

**END**;

 ALTER TRIGGER "HUBADMIN"."PROD_MONITOR_QUEUE_TRIG" ENABLE;

commit;

        4. Missing Parts Consumer

Perform the same workflow for missing parts

Create the consumer queue for MISSING_PARTS messages using this message_t

sqlplus> execute DBMS_AQADM.CREATE_QUEUE_TABLE(queue_table => 'KFMQUEUE_PARTS_TAB',     queue_payload_type => 'message_t' );

Create a queue for PROD_MONITOR using the above queue table.

sqlplus> execute DBMS_AQADM.CREATE_QUEUE(queue_name => 'HUBADMIN.KFMQUEUE_PARTS', queue_table => 'KFMQUEUE_PARTS_TAB');

Start the queue

sqlplus> execute DBMS_AQADM.START_QUEUE(queue_name => 'HUBADMIN.KFMQUEUE_PARTS');

This will create the following visible entry in SQL Developer , the owner will be HUBADMIN in Oracle for PRDTST service ID

![image alt text](image_6.png)

        5. Missing Parts Consumer

Create the procedure that will be called to enqueue and dequeue messages from the queue for MISSING_PARTS. This can be done in sqldeveloper right click on Procedures

![image alt text](image_7.png)

create or replace PROCEDURE "ENQUEUE_PARTS_MESSAGE" 

(

  payload in varchar2

) as

msg message_t := message_t(NULL); --message_t must match with the created message object type.

msg_id RAW(16);

priority NUMBER;

enqueue_options DBMS_AQ.ENQUEUE_OPTIONS_T;

message_properties DBMS_AQ.MESSAGE_PROPERTIES_T;

BEGIN

  msg.json := payload;

  message_properties.priority := 1;  -- give all messages same priority

  DBMS_AQ.ENQUEUE(

queue_name => 'HUBADMIN.kfmqueue_parts', -- the queue name must match with the created queue.

enqueue_options => enqueue_options,

message_properties => message_properties,

payload => msg,

msgid => msg_id);

END enqueue_parts_message;

Create the associated Procedure to dequeue a message from the parts queue

create or replace PROCEDURE "DEQUEUE_PARTS_MESSAGE" 

(

  payload out varchar2

) as

msg message_t := message_t(NULL); --message_t must match with the created message object type.

  msg_id RAW(16);

  dequeue_options DBMS_AQ.DEQUEUE_OPTIONS_T;

  message_properties DBMS_AQ.MESSAGE_PROPERTIES_T;

BEGIN

  DBMS_AQ.DEQUEUE(

queue_name => 'HUBADMIN.kfmqueue_parts', -- the queue name must match with the created queue.

dequeue_options => dequeue_options,

message_properties => message_properties,

payload => msg,

msgid => msg_id

  );

  payload := msg.json;

END dequeue_parts_message;

Create new trigger to monitor for data changes, right click on the Trigger icon and select New Trigger

![image alt text](image_8.png)

Create the PROD_MONITOR_PARTS_QUEUE_TRIG as below:-

--------------------------------------------------------

--  DDL for Trigger PROD_MONITOR_PARTS_QUEUE_TRIG

--------------------------------------------------------

  **CREATE** **OR** REPLACE **TRIGGER** "HUBADMIN"."PROD_MONITOR_PARTS_QUEUE_TRIG" 

 **AFTER** **INSERT** **OR** **UPDATE** **OR** **DELETE** **OF** ID_NO,SEQ_NO **ON** PROD_MONITOR_PARTS

**FOR** **EACH** **ROW**

**DECLARE**

json VARCHAR2(4000);

**BEGIN**

**execute** **immediate** 'alter session set NLS_DATE_FORMAT=''yyyy-mm-dd"T"hh24:mi:ss''';

-- For simplicity sake For POC simple concatenations.  Production

-- JSON serialization code should do character escaping (double quotes,

-- newlines, etc).

**IF** INSERTING **OR** UPDATING **THEN**

json := '{"ID_NO":"' || **:new**.ID_NO;

json := json|| '","SEQ_NO":"' || **:new**.SEQ_NO;

json := json|| '","LOCATION":"' || **:new**.LOCATION;

json := json|| '","CALCULATED_DATE":"' || ConvertToUTC(**:new**.CALCULATED_DATE);

json := json|| '","ITEM_NUMBER":"' || **:new**.ITEM_NUMBER;

json := json|| '","ITEM_DESCRIPTION":"' || **TRIM**(**TRANSLATE**(**:new**.ITEM_DESCRIPTION,'x'||CHR(10)||CHR(13), 'x'));

json := json|| '","REQUIREMENT_QTY":"' || **:new**.REQUIREMENT_QTY;

json := json|| '","MISSING_QTY":"' || **:new**.MISSING_QTY;

json := json|| **CASE** **WHEN** INSERTING **THEN** 'I' **ELSE** 'U' **END** || '"}';

**ELSE**

json := '{"ID_NO":"' || **:old**.ID_NO || '","dml_type":"D"}';

**END** **IF**;

enqueue_parts_message(json);

**END**;/

**ALTER** **TRIGGER** "HUBADMIN"."PROD_MONITOR_PARTS_QUEUE_TRIG" ENABLE;ALTER TRIGGER "HUBADMIN"."PROD_MONITOR_PARTS_QUEUE_TRIG" ENABLE;

commit;

        6. Confirm via SQLDEVELOPER triggers/messages/procedures

As HUBADMIN, check that the following now exist

![image alt text](image_9.png) 

    3. Consumer Scripts : Test Connectivity

The consumers scripts connect to Oracle PRDTST service using Basic Authentication initially and check the triggers dispatch JSON objects for :-

on update of PROD_MONITOR.UPDATE_DATE, this is updated by the PM_RFID_RAW_EVENTS trigger and finite state logic with PROD_MONITOR.UPDATE_BY set as the scanner ID.

on insert or update if ID_NO,SEQ_NO on PROD_MONITOR_PARTS.

The ruby oci8 library object used to connect to PRDTST has a constructor param setting of:-

oc = OCI8.new('HUBADMIN', 'HUBADMIN','//172.20.84.36:1521/PRDTST')

This is found on the web portal VM in the two consumer scripts orcl_kfmqueue_consumer.rb  orcl_kfmqueue_parts_consumer.rb and orcl_kfmqueue_consumer_KFMPROD.rb  orcl_kfmqueue_parts_consumer_KFMPROD.rb for production environment

These two scripts for PRDTST have been adjusted accordingly for the KFM environment and are controlled now via systemd services. The scripts are part of the code branch UKUS for the Production Monitoring Portal web application and version controlled via git.

Contents of orcl_kfmqueue_consumer_KFMPROD.rb (copied to /usr/bin by root)

#!/usr/bin/env ruby
# -*- coding: utf-8 -*-
#**********************************************************************************************
#* Title       : Production Ready Consumer service (use systemctrl to start | stop | status)
#* Version     : 0.1
#* Date        : 28-Jun-2017
#* Last update : MSJ 28-June
#* Description : Added ruby logging / added mongo log to file / added Oracle log to file - linked to .service file in /etc/systemd/system
#**********************************************************************************************
# coding: utf-8

require 'oci8'
require 'mongo'
require 'yajl'
require 'logger'

log = Logger.new('/var/log/consumer.log','daily')
log.level = Logger::INFO

#reduce oci8 client logging verbosity and redirect to /var/log file

oc = OCI8.new('HUBADMIN', 'HUBADMIN','//172.20.84.38:1521/PRDTST')
log.info "Oracle connector OK"

#Reduce Mongo client verbosity and send to log file
Mongo::Logger.logger.level = Logger::FATAL
Mongo::Logger.logger = Logger.new('/var/log/consumer_mongo.log')

mongo_client =  Mongo::Client.new('mongodb://localhost:27017/production_kfm_db')
log.info "MongoDB connector OK"

mongo_db = mongo_client.database
cols = mongo_db.collection_names
col = mongo_db.collection('prod_monitor')

oc.exec("alter session set NLS_DATE_FORMAT='yyyy-mm-dd\"T\"hh24:mi:ss'")
cur = oc.parse('BEGIN dequeue_message(:p); END;')
log.info "Oracle cursor OK "
log.info cur

#bind_param(key, param, type = nil, length = nil) ⇒ Object
#:p is the param variable name expected by oci8 ruby gem

cur.bind_param(':p', nil, String, 4000)
#Bind the object returned back from Oracle as JSON simple String

while true
  # retrieve message
  cur.exec()
  json = Yajl::Parser.new

  json.inspect

  #this hash can fail if trailing white space comes across from Oracle - in the enqueue procedure ensure TRIM(string) is used
  begin
    hash = json.parse(cur[':p'])
    hash.delete('_id')
  rescue
    log.fatal "rescue: cannot parse message into json object - check enqueue message_t content"
    log.fatal cur[:p]
  ensure
    #create a hash from the Oracle JSON object as a String binding to param called :p
    log.info "ensure: hash could not be created"
  end

  #if a dml_type of D delete is sent in JSON the CREATE/UPDATE_DATE will be null
  #code updated to not fail on strptime. Add try/catch ruby equivalemt structure
  #here begin/rescue/ensure

  unless hash.nil? || hash['dml_type'] == 'D'     
    hash['CREATE_DATE']=DateTime.strptime(hash['CREATE_DATE'], '%Y-%m-%dT%H:%M:%S');
    hash['UPDATE_DATE']=DateTime.strptime(hash['UPDATE_DATE'], '%Y-%m-%dT%H:%M:%S');
    begin # catch errors - note until an oc.commit is successful this could cause repeated attempts at begin/rescue/ensure loops
      if hash['PLAN_PROD_FINISH_DATE']==""
        hash.delete('PLAN_PROD_FINISH_DATE')
      else
        hash['PLAN_PROD_FINISH_DATE']=DateTime.strptime(hash['PLAN_PROD_FINISH_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      hash['LOCATION_STATUS']=hash['LOCATION_STATUS'].to_i(10);

      if hash['PARTS_PREPARATION_STATUS']==""
        hash.delete('PARTS_PREPARATION_STATUS')
      else
        hash['PARTS_PREPARATION_STATUS']=hash['PARTS_PREPARATION_STATUS'].to_i(10);
      end

      if hash['CHASSIS_LINE_START_DATE']==""
        hash.delete('CHASSIS_LINE_START_DATE')
      else
        hash['CHASSIS_LINE_START_DATE']=DateTime.strptime(hash['CHASSIS_LINE_START_DATE'], '%Y-%m-%dT%H:%M:%S')
      end
      
      if hash['CHASSIS_LINE_END_DATE']==""
        hash.delete('CHASSIS_LINE_END_DATE')
      else
        hash['CHASSIS_LINE_END_DATE']=DateTime.strptime(hash['CHASSIS_LINE_END_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['PAINT_LINE_START_DATE']==""
        hash.delete('PAINT_LINE_START_DATE')
      else
        hash['PAINT_LINE_START_DATE']=DateTime.strptime(hash['PAINT_LINE_START_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['PAINT_LINE_END_DATE']==""
        hash.delete('PAINT_LINE_END_DATE')
      else
        hash['PAINT_LINE_END_DATE']=DateTime.strptime(hash['PAINT_LINE_END_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['TRACTOR_LINE_START_DATE']==""
        hash.delete('TRACTOR_LINE_START_DATE')
      else
        hash['TRACTOR_LINE_START_DATE']=DateTime.strptime(hash['TRACTOR_LINE_START_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['TRACTOR_LINE_END_DATE']==""
        hash.delete('TRACTOR_LINE_END_DATE')
      else
        hash['TRACTOR_LINE_END_DATE']=DateTime.strptime(hash['TRACTOR_LINE_END_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['REWORK_BEFORE_MQ_START_DATE']==""
        hash.delete('REWORK_BEFORE_MQ_START_DATE')
      else
        hash['REWORK_BEFORE_MQ_START_DATE']=DateTime.strptime(hash['REWORK_BEFORE_MQ_START_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['REWORK_BEFORE_MQ_END_DATE']==""
        hash.delete('REWORK_BEFORE_MQ_END_DATE')
      else
        hash['REWORK_BEFORE_MQ_END_DATE']=DateTime.strptime(hash['REWORK_BEFORE_MQ_END_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['MQ_LINE_START_DATE']==""
        hash.delete('MQ_LINE_START_DATE')
      else
        hash['MQ_LINE_START_DATE']=DateTime.strptime(hash['MQ_LINE_START_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['MQ_LINE_END_DATE']==""
        hash.delete('MQ_LINE_END_DATE')
      else
        hash['MQ_LINE_END_DATE']=DateTime.strptime(hash['MQ_LINE_END_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['REWORK_AFTER_MQ_START_DATE']==""
        hash.delete('REWORK_AFTER_MQ_START_DATE')
      else
        hash['REWORK_AFTER_MQ_START_DATE']=DateTime.strptime(hash['REWORK_AFTER_MQ_START_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['REWORK_AFTER_MQ_END_DATE']==""
        hash.delete('REWORK_AFTER_MQ_END_DATE')
      else
        hash['REWORK_AFTER_MQ_END_DATE']=DateTime.strptime(hash['REWORK_AFTER_MQ_END_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['PRODUCTION_END_DATE']==""
        hash.delete('PRODUCTION_END_DATE')
      else
        hash['PRODUCTION_END_DATE']=DateTime.strptime(hash['PRODUCTION_END_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['INSPECTION_START_DATE']==""
        hash.delete('INSPECTION_START_DATE')
      else
        hash['INSPECTION_START_DATE']=DateTime.strptime(hash['INSPECTION_START_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['INSPECTION_END_DATE']==""
        hash.delete('INSPECTION_END_DATE')
      else
        hash['INSPECTION_END_DATE']=DateTime.strptime(hash['INSPECTION_END_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['REWORK_DUR_INSP_START_DATE']==""
        hash.delete('REWORK_DUR_INSP_START_DATE')
      else
        hash['REWORK_DUR_INSP_START_DATE']=DateTime.strptime(hash['REWORK_DUR_INSP_START_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['REWORK_DUR_INSP_END_DATE']==""
        hash.delete('REWORK_DUR_INSP_END_DATE')
      else
        hash['REWORK_DUR_INSP_END_DATE']=DateTime.strptime(hash['REWORK_DUR_INSP_END_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
      
      if hash['SHIPPING_STATUS']==""
        hash.delete('SHIPPING_STATUS')
      else
        hash['SHIPPING_STATUS']=hash['SHIPPING_STATUS'].to_i(10);
      end
      
      if hash['SHIPPING_DATE']==""
        hash.delete('SHIPPING_DATE')
      else
        hash['SHIPPING_DATE']=DateTime.strptime(hash['SHIPPING_DATE'], '%Y-%m-%dT%H:%M:%S');
      end
    rescue
      log.fatal "rescue: Hash malformed"
      log.fatal hash.inspect
      
    ensure
      log.info "ensure: cleanup enqueue"
      #oc.commit
    end # begin/rescue/ensure
  end #unless had dml_type is delete
log.info hash.inspect
begin
    if hash['dml_type'] == 'D'
      col.delete_one({'ID_NO' => hash['ID_NO']})
    else
      hash.delete('dml_type')
      col.update_one(
                     {'ID_NO' => hash['ID_NO']},
                     hash,
                     {:upsert => true}
                     )
    end
  rescue
    log.fatal "rescue: hash malformed not deleted"
  ensure
    log.info "ensure: nothing to do"
  end

  # remove from AQ.  dequeue isn't complete until this happens
  begin
    oc.commit
    log.info "Oracle commit OK"
  rescue
    log.info "Oracle commit failed"
  end
end

The contents of the systemd service Unit file /etc/systemd/system/consumer.service - 

[Unit]

Description=KFM PROD_MONITOR Consumer

After=syslog.target

[Service]

Type=simple

PIDFile=/var/run/kfm_consumer.pid

ExecStart=/usr/bin/bash -lc '/usr/bin/consumer.rb' --daemon --pidfile /var/run/kfm_consumer.pid

Restart=always

[Install]

WantedBy=multi-user.target

Make sure the latest version of orcl_kfmqueue_consumer_KFMPROD.rb  and orcl_kfmqueue_parts_consumer_KFMPROD.rb from git repository are copied to /usr/bin/consumer and /user/bin/comsumerp (with executable privileges)

Ensure the services can be started/stopped

systemctl enable consumer

Systemctl status consumer

systemctl stop consumer

systemctl start consumer

All logging goes to/var/log/consumer.log and /var/log/consumer_mongo.log and /var/log/consumerp.log consumerp_mongo.log

2. Web Portal VM Build

This guide assumes a default CentOS 7 system had been installed in a VM environment. Installing CentOS is outside scope of this guide.

    4. Building full CentOS 7 Production Monitoring Vanilla VM for Web Portal

This guide is step by step of building the web portal VM from a standard Vanilla CentOS VM Image

        7. Install MongoDB

Create mongodb repository file for the system, make sure it contains the below content (use a familiar editor such as vi from command line)

vi mongodb-org-3.4.repo

[mongodb-org-3.4]

name=MongoDB Repository

baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.4/x86_64/

gpgcheck=1

enabled=1

gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc

Once the repo file is created bring it into use by using the yum update command

yum update

=============================================================================================================

 Package                    Arch             Version                          Repository              Size

=============================================================================================================

Installing:

 kernel                    x86_64       3.10.0-514.21.1.el7                 updates                 37 M

Updating:

 NetworkManager            x86_64       1:1.4.0-20.el7_3                    updates                2.5 M

 NetworkManager-libnm      x86_64       1:1.4.0-20.el7_3                    updates                443 k

Wait for cleanup and verify stages, once complete now install mongodb

yum install -y mongodb-org

Loaded plugins: fastestmirror, langpacks

Loading mirror speeds from cached hostfile

 * base: mirror.airenetworks.es

 * extras: mirror.airenetworks.es

 * updates: mirror.airenetworks.es

Resolving Dependencies

--> Running transaction check

---> Package mongodb-org.x86_64 0:3.4.5-1.el7 will be installed

--> Processing Dependency: mongodb-org-tools = 3.4.5 for package: mongodb-org-3.4.5-1.el7.x86_64

..

..

Complete!

Initially turn off selinux for the VM

cat /etc/selinux/config

# This file controls the state of SELinux on the system.

# SELINUX= can take one of these three values:

#     enforcing - SELinux security policy is enforced.

#     permissive - SELinux prints warnings instead of enforcing.

#     disabled - No SELinux policy is loaded.

SELINUX=enforcing /*Change this to disabled */

# SELINUXTYPE= can take one of three two values:

#     targeted - Targeted processes are protected,

#     minimum - Modification of targeted policy. Only selected processes are protected.

#     mls - Multi Level Security protection.

SELINUXTYPE=targeted

vi /etc/selinux/config

change SELINUX=disabled, and restart the VM

shutdown -r now

Once the VM has restarted, log back in as root and check mongodb service can be started ok

systemctl start mongodb

systemctl status mongod

● mongod.service - High-performance, schema-free document-oriented database

   Loaded: loaded (/usr/lib/systemd/system/mongod.service; enabled; vendor preset: disabled)

   Active: active (running) since Thu 2017-06-15 15:53:01 CEST; 1min 13s ago

     Docs: https://docs.mongodb.org/manual

  Process: 969 ExecStartPre=/usr/bin/chmod 0755 /var/run/mongodb (code=exited, status=0/SUCCESS)

  Process: 966 ExecStartPre=/usr/bin/chown mongod:mongod /var/run/mongodb (code=exited, status=0/SUCCESS)

  Process: 960 ExecStartPre=/usr/bin/mkdir -p /var/run/mongodb (code=exited, status=0/SUCCESS)

 Main PID: 1619 (mongod)

   CGroup: /system.slice/mongod.service

           └─1619 /usr/bin/mongod --quiet -f /etc/mongod.conf run

Jun 15 15:53:01 KfmProdMonWS.kfme.fr systemd[1]: Starting High-performance, schema-free document-oriented database...

Jun 15 15:53:01 KfmProdMonWS.kfme.fr systemd[1]: Started High-performance, schema-free document-oriented database.

Jun 15 15:53:03 KfmProdMonWS.kfme.fr mongod[973]: about to fork child process, waiting until server is ready for connections.

Jun 15 15:53:03 KfmProdMonWS.kfme.fr mongod[973]: forked process: 1619

Jun 15 15:53:04 KfmProdMonWS.kfme.fr mongod[973]: child process started successfully, parent exiting

Set mongodb set to start after system restart

systemctl enable mongod.service

        8. Install node by adding the node source repository

wget [https://rpm.nodesource.com/pub_6.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm](https://rpm.nodesource.com/pub_6.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm)

--2017-06-15 16:00:00--  

https://rpm.nodesource.com/pub_6.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm

Resolving rpm.nodesource.com (rpm.nodesource.com)... 54.230.79.15, 54.230.79.140, 54.230.79.39, ...

Connecting to rpm.nodesource.com (rpm.nodesource.com)|54.230.79.15|:443... connected.

HTTP request sent, awaiting response... 200 OK

Length: 6460 (6.3K) [application/x-rpm]

Saving to: ‘nodesource-release-el7-1.noarch.rpm’

100%[========================================================>] 6,460       --.-K/s   in 0s

2017-06-15 16:00:00 (466 MB/s) - ‘nodesource-release-el7-1.noarch.rpm’ saved [6460/6460]

Install node source via yum

yum localinstall nodesource-release-el7-1.noarch.rpm

==========================================================================================================

 Package                          Arch       Version      Repository                                Size

==========================================================================================================

Installing:

 nodesource-release               noarch               el7-1   

/nodesource-release-el7-1.noarch               3.1 k

Transaction Summary

==========================================================================================================

..

Transaction test succeeded

Installed:

  nodesource-release.noarch 0:el7-1

Complete!

Now install nodejs binaries via yum

yum install nodejs

Dependencies Resolved

============================================================================================================

 Package                Arch                   Version                     Repository                  Size

============================================================================================================

Installing:

 nodejs                 x86_64       2:6.11.0-1nodesource.el7.centos        nodesource                 9.4 M

Transaction Summary

============================================================================================================

Install  1 Package

..

Public key for nodejs-6.11.0-1nodesource.el7.centos.x86_64.rpm is not installed

nodejs-6.11.0-1nodesource.el7.centos.x86_64.rpm                                                             | 9.4 MB  00:00:03

Retrieving key from file:///etc/pki/rpm-gpg/NODESOURCE-GPG-SIGNING-KEY-EL

Importing GPG key 0x34FA74DD:

..

..

Complete!

        9. Install Oracle Instance Client Library 

Install the Oracle instantclient 64bit  libraries for Linux - this is used by the ruby libraries to connect to the Oracle databases(s) for the consumer scripts

rpm -ivf oracle-instantclient12.2-sqlplus-12.2.0.1.0-1.x86_64.rpm

rpm -ivh oracle-instantclient12.2-devel-12.2.0.1.0-1.x86_64.rpm

export LD_LIBRARY_PATH=/usr/lib/oracle/12.2/client64/lib

export OCI_LIB_DIR=/usr/lib/oracle/12.2/client64

export OCI_INC_DIR=/usr/include/oracle/12.2/client64

export ORACLE_HOME=/usr/lib/oracle/12.2

To allow the oci8 ruby gem to be installed you will need the development environment and headers

yum group install "Development Tools"

gem install ruby-oci8 /* This is dependant on Oracle headers and instant client libraries - make sure the paths are correct as above */

gem install mongo

gem install yajl-ruby --platform=ruby

For the QA VM the VM is going to have a devops environment, meaning the web portal source code can be pulled from a git repository, and built using continuous integration tools abd deployed to the QA VM and if available a Production VM (mirror of QA without devops link to git repo)

        10. Install devops Meteor dependencies 

npm install -g react-tools

curl https://install.meteor.com/ | sh

vi ~/.bashrc /* create environment for meteor - for devops MONGO_URL etc */

useradd -m prodmon

passwd prodmon

su - prodmon

Add prodmon to sudo level with visudo as root

Notes on using screen to prevent any devops initiated application/script stopping on ssh disconnect

prodmon$screen

Pull the source code from git repository

Git clone [https://github.com/czarnian1/kfm_poc.git](https://github.com/czarnian1/kfm_poc.git) --branch UKUS

Start app in devops mode

cd /home/prodmon/kfm_poc

UNIVERSE_I18N_LOCALE=en,ja,fr MONGO_URL='mongodb://localhost:27017/production_kfm_db' meteor -p 172.20.84.86:3000

This will start the application on port 3000. In this mode any change to application source code causes a reload of the application in real time.

The application should resolve node dependencies and start. If you have any errors about fibers - check the mongodb environment variable. If any node dependencies have been installed by a developer in global mode - the aplication will stop with an error message indicating with node package should be installed by npm

To exit screen console and leave the script running Ctrl a+d  (to kill screen Ctrl C then type exit)

To lists all screens available to reconnect to:-

prodmin$ screen -r

And reconnect to a screen

screen -r 1276.somescreentext

Admin seed : by default the following user is added to the vanilla application - the password should be changed for the production environment VM


db.users.insert(
{
    "_id" : "2SLemX9BG28pnfkq2",
    "createdAt" : ISODate("2017-06-08T00:26:03.123Z"),
    "services" : {
        "password" : {
            "bcrypt" : "$2a$10$dCtBCzerFrMC.mbVteQw3ejP04B0X63/rs7inhkThGR92Jn0eTA1m" 
        }, 
        "resume" : { 
            "loginTokens" : [ 
                { 
                    "when" : ISODate("2017-06-08T00:26:03.146Z"), 
                    "hashedToken" : "o1ufmD59kU4/6AGaQcV/H05BcM5Hm2H98JKiAA4JSj8=" 
                } 
            ] 
        } 
    }, 
    "username" : "administrator", 
    "roles" : { "__global_roles__" : [ "Admin" ] } 
}
)

        11. Production Installs

The production instance of the web portal application (i.e not started from meteor command on port 3000) runs behind an nginx load balancer in a cluster mode node framework controlled by pm2,  the advanced, production process manager for Node.js 

![image alt text](image_10.png)

        12. Install nginx reverse proxy for load balancing

Install the epel repository

sudo yum install epel-release

Then install nginx

sudo yum install nginx

Edit the nginx config as below:-

sudo vi /etc/nginx/nginx.conf

Replace the code block in nginx.conf 

location / {
}

with
location / {
    /* proxy_pass [http://172.20.84.86:80](http://172.20.84.86:80)80; */
    proxy_pass [http://prodmonnodejs](http://prodmonnodejs);

    /* prodmonnodejs is the optional load balanced upstream group defined for load balancing below  - if only reverse proxy configured this will simply point to the node application online (from the pm2 manager) running on port 8080 at 172.20.84.86 comment out this line and re-instate the proxy_pass http://172.20.84.86:8080 */

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
   proxy_cache_bypass $http_upgrade;
}

Activate the change and make sure nginx set to start on server start

sudo systemctl restart nginx
sudo systemctl enable nginx

        13. Configuring Basic Load Balancing with nginx (optional requires ssl certs)

To configure load balancing, create a named "upstream group," to listen to the backend server(s). In KFM case the server is the same VM as the nginx instance but could be a complete different application server on a separte EXSi instance. Once the up stream group is created we pass this to the nginx reverse proxy and load balancer by referring to the upstream group in one or more proxy_pass directives as above.

For the KFM environment configure an upstream group called prodmonnodejs with one (this could be two or more if running separate IP addressable VMs)  Node.js application servers listening on port 8080, one on IP address 172.20.84.86 (and the other on 172.20.84.xx. The servers in the upstream group handle only HTTP and HTTPS traffic, because we’re creating the upstream group in the http block. 

In the 'http' block of /etc/nginx/nginx.conf


upstream prodmonnodejs {
    server 172.20.84.86:8080;
    //server 172.20.84.xx:8080; optional only need if load balancing across multiple VMs in the future
}


In the server block of the nginx.conf file include these two location blocks:

The first one matches HTTPS requests in which the path starts with /webapp/, and proxies them to the nodejs upstream group we created in the previous step.

The second one funnels all traffic to the first location block, by doing a temporary redirect of all requests for [http://example.com/](http://example.com/).

in the 'server' block for HTTPS traffic

location /webapp/ {
    proxy_pass http://prodmonnodejs;
}

location = / {
   return 302 /webapp/;
}

By default nginx uses the Round Robin algorithm for load balancing among servers. The load balancer runs through the list of servers in the upstream group in order, forwarding each new request to the next server. 

        14. Installing Advanced process manager for node (pm2)

Install the pm2 node application production deployment tool and the pm2-meteor extension for the devops QA environment

sudo npm install pm2@latest -g

            1. pm2-meteor

Install the meteor deployment utility that is used to automatically deploy devops instance to a production node, in this case our production node is the localhost VM, but in future this will be the IP address of the final VM instance for production deployment

sudo npm i -g pm2-meteor

            2. Setup the devops deployment config file from within meteor

cd kfm_poc

$ pm2-meteor init

Answer the config questions

[prodmon@KfmProdMonWS kfm_poc]$ pm2-meteor init

? What is the app name? ProdMonitoringSystem

? What is the app location? (path or git url)** /home/prodmon/kfm_poc**

? Where is the settings JSON file for Meteor located? **/home/prodmon/kfm_poc/settings.json**

? On which server architecture will your app run? os.linux.x86_64

? What will be the ROOT URL of your app? **http://172.20.84.86**

? On which PORT will your app run? **8080**

? What’s the MongoDB connection string for apps DB? **mongodb://localhost:27017/production_kfm_db**

? What is the host name of your production machine? **localhost**

? Username? **prodmon**

? Do you want to auth by password or by PEM file? **password**

? Password? **nec2017**

? How many instances? 1

INFO: pm2-meteor.json created!

Check the pm2-meteor.json and put the following details in the json keys ecosystem file

pm2-meteor.json

{

  "appName": "ProdMonitoringSystem",

  "appLocation": {

    "local": "/home/prodmon/kfm_poc/"

  },

  "meteorSettingsLocation": "/home/prodmon/kfm_poc/settings.json",

  "meteorSettingsInRepo": false,

  "prebuildScript": "",

  "meteorBuildFlags": "--architecture os.linux.x86_64",

  "env": {

    "ROOT_URL": "http://172.20.84.86",

    "PORT": "8080",

    "MONGO_URL": "mongodb://localhost:27017/production_kfm_db",

    "UNIVERSE_I18N_LOCALES": "all",

    "MAIL_URL": "smtp://localhost:25"

  },

  "server": {

    "host": "localhost",

    "username": "prodmon",

    "password": "nec2017",

    "deploymentDir": "/home/prodmon/meteor-apps",

    "loadProfile": "",

    "nvm": {

      "bin": "",

      "use": ""

    },

    "exec_mode": "cluster_mode",

    "instances": 1

  }

}

Important - make sure settings.json exists in the meteor application root directory and has a blank valid xml config e.g {}, make sure the username and deploymenetDir has write permissions (the default is usually /opt/meteor-apps which is not 

pm2-meteor deploy

Building your app and deploying to host machine //u01/userhome/oracle/kfm_poc/bundle.tar.gz

/home/oracle/meteor-apps/ProdMonitorSystem/bundle.tar.gz

OK: Deployed your app on the host machine!

pm2 start pm2-env.json

pm2 list

┌────────────────────────────┬─────────┬────────┬───┬─────┬────────────┐
│ Name                       │ mode    │ status │ ↺ │ cpu │ memory     │
├────────────────────────────┼─────────┼────────┼───┼─────┼────────────┤
│ ProductionMonitoringSystem │ cluster │ online │ 0 │ 0%  │ 119.6 MB   │
└────────────────────────────┴─────────┴────────┴───┴─────┴────────────┘
 Use `pm2 show <id|name>` to get more details about an app
[prodmon@KfmProdMonWS kfm_poc]$ 


Use `pm2 show <id|name>` to get more details about an app

pm2 show 0
[prodmon@KfmProdMonWS kfm_poc]$ pm2 show 0
 Describing process with id 0 - name ProductionMonitoringSystem 
┌───────────────────┬─────────────────────────────────────────────────────────────────────┐
│ status            │ online                                                              │
│ name              │ ProductionMonitoringSystem                                          │
│ restarts          │ 0                                                                   │
│ uptime            │ 2h                                                                  │
│ script path       │ /home/prodmon/meteor-apps/ProductionMonitoringSystem/bundle/main.js │
│ script args       │ N/A                                                                 │
│ error log path    │ /home/prodmon/.pm2/logs/ProductionMonitoringSystem-error-0.log      │
│ out log path      │ /home/prodmon/.pm2/logs/ProductionMonitoringSystem-out-0.log        │
│ pid path          │ /home/prodmon/.pm2/pids/ProductionMonitoringSystem-0.pid            │
│ interpreter       │ node                                                                │
│ interpreter args  │ N/A                                                                 │
│ script id         │ 0                                                                   │
│ exec cwd          │ /home/prodmon/meteor-apps/ProductionMonitoringSystem                │
│ exec mode         │ cluster_mode                                                        │
│ node.js version   │ 4.8.5                                                               │
│ watch & reload    │ ✘                                                                   │
│ unstable restarts │ 0                                                                   │
│ created at        │ 2017-06-28T16:24:56.102Z                                            │
└───────────────────┴─────────────────────────────────────────────────────────────────────┘
 Code metrics value 
┌────────────┬────────┐
│ Loop delay │ 8.17ms │
└────────────┴────────┘
 Add your own code metrics: http://bit.ly/code-metrics
 Use `pm2 logs ProductionMonitoringSystem [--lines 1000]` to display logs
 Use `pm2 monit` to monitor CPU and Memory usage ProductionMonitoringSystem


To enable change watching - if the application is updated in the devops environment and pushed to either the QA nodejs app server instance of the production VM - this will cause an automatic reload of the application post deployment

pm2 stop ProdMonitoringSystem

pm2 start ProdMonitoringSystem --watch

pm2 startup systemd

pm2 list

pm2 save

pm2 startup systemd

If you run startup systemd as user prodmon you will need to run

sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u prodmon --hp /home/prodmon

                1. Deploy / Re-deploy

While in the devops _deployment directory to deploy your app

$ pm2-meteor deploy

If you already have deployed ProdMonitoringSystem before, the old app tar-bundle will be moved to a ./backup directory. If you want to only reconfigure settings / env changes

$ pm2-meteor reconfig

Will send new pm2-env file to server and hard-restart your app. If something goes wrong during deploy: revert to previous version

$ pm2-meteor revert

Will unzip the old bundle.tar.gz and restart the app

                2. Devops to Production control

As well as using the pm2 commend directory from the _deployment devops areas (../kfm_poc) use the pm2-meteor command to control the system pm2 command for the prodmon app

$ pm2-meteor start

$ pm2-meteor stop

$ pm2-meteor status

$ pm2-meteor logs

                3. Production scaling the app

Start 2 more instances:

$ pm2-meteor scale +2

Down/Upgrade to 4 instances

$ pm2-meteor scale 4

            3. CentOS systemd Settings

So that the web portal and consumers can be controlled easily by a sys admin, put the consumer scripts under systemd control

/etc/systemd/system/consumer.service

[Unit]

Description=KFM PROD_MONITOR Consumer

After=syslog.target

[Service]

Type=simple

PIDFile=/var/run/kfm_consumer.pid

ExecStart=/usr/bin/bash -lc '/usr/bin/consumer.rb' --daemon --pidfile /var/run/kfm_consumer.pid

Restart=always

RestartSec=60

[Install]

WantedBy=multi-user.target

/etc/systemd/system/consumerp.service

[Unit]

Description=KFM PROD_MONITOR_PARTS Consumer

After=syslog.target

[Service]

Type=simple

PIDFile=/var/run/kfm_consumer_parts.pid

ExecStart=/usr/bin/bash -lc '/usr/bin/consumerp.rb' --daemon --pidfile /var/run/kfm_consumer_parts.pid

Restart=always

RestartSec=60

[Install]

WantedBy=multi-user.target

Check consumer services running status

systemctl start consumer

systemctl status consumer

● consumer.service - KFM PROD_MONITOR Consumer

   Loaded: loaded (/etc/systemd/system/consumer.service; enabled; vendor preset: disabled)

   Active: active (running) since Fri 2017-06-30 16:25:38 CEST; 1s ago

 Main PID: 3004 (ruby)

   CGroup: /system.slice/consumer.service

           └─3004 ruby /usr/bin/consumer.rb

Jun 30 16:25:38 KfmProdMonWS.kfme.fr systemd[1]: Started KFM PROD_MONITOR Consumer.

Jun 30 16:25:38 KfmProdMonWS.kfme.fr systemd[1]: Starting KFM PROD_MONITOR Consumer...

Jun 30 16:25:39 KfmProdMonWS.kfme.fr bash[3004]: Warning: NLS_LANG is not set. fallback to US7ASCII.

# systemctl start consumerp

# systemctl status consumerp

● consumerp.service - KFM PROD_MONITOR_PARTS Consumer

   Loaded: loaded (/etc/systemd/system/consumerp.service; enabled; vendor preset: disabled)

   Active: active (running) since Fri 2017-06-30 16:25:49 CEST; 2s ago

 Main PID: 3029 (ruby)

   CGroup: /system.slice/consumerp.service

           └─3029 ruby /usr/bin/consumerp.rb

Jun 30 16:25:49 KfmProdMonWS.kfme.fr systemd[1]: Started KFM PROD_MONITOR_PARTS Consumer.

Jun 30 16:25:49 KfmProdMonWS.kfme.fr systemd[1]: Starting KFM PROD_MONITOR_PARTS Consumer...

Jun 30 16:25:49 KfmProdMonWS.kfme.fr bash[3029]: Warning: NLS_LANG is not set. fallback to US7ASCII.

For an operational instance all five services; pm2 ProductionMonitoringSystem application, nginx, mongo, consumer, consumerp should be started and start automatically after a VM server restart

        15. Final Config Items

            4. Mail Transfer Environment

The web application notification engine uses an environment variable to toggle mail transfer on and off. The node server reads from the MAIL_URL environment variable to determine how to send mail.

The MAIL_URL should reference an SMTP server and use the form smtp://USERNAME:PASSWORD@HOST:PORT or smtps://USERNAME:PASSWORD@HOST:PORT. 

If MAIL_URL is not set email notification messages go to standard output that can be seen in the node server log file.

Since we are using pm2 as the node process management tool setting the MAIL_URL environment variable with a root .profile the PM2 CLI will use its environment so the current environment of your shell will be injected or this can be defined in the ecosystem json file (see 7.1.8) – currently as of this issue the smtp string is not set in the json ecosystem file.

            5. Setup NTPD on VM

Simple Network Time Protocol

All time generators within the production monitoring system are expected to send time in Universal Co-ordinated time (UTC). Therefore al time values in both Oracle and MongoDB must be stored in UTC. 

Both handheld RFID and Fixed RFID scanners must be synced to the KFM UTC single source SNTP server. The CentOS VM for the portal must be synced to the same UTC source.

The production monitoring web portal uses the system locale to convert the |UTC timestamp in database to the locale set on the client using the portal

As root user install ntp

yum install ntp ntpdate ntp-doc

Turn on system service, enter:

chkconfig ntpd on

Synchronize the system clock with the KFM SNTP server (use this command only once or as required)

ntpdate <kfm_sntp_server_fqdn or IP> /* e.g 172.20.84.71 */

Start the NTP server, he following will continuously adjust the VM system time from the upstream KFM NTP server. No need to run ntpdate again.

systemctl start ntpd

            6. Setup SSL Self Signed Certificate for nginx

Even though pm2 can offer load balancing – we use nginx to provide reverse proxy load balancing to the node instances. Also using nginx as https server. Once nginx is installed using openssl create self signed key/crt pair for use with nginx

sudo mkdir /etc/ssl/private

sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt

Generating a 2048 bit RSA private key

writing new private key to '/etc/ssl/private/nginx-selfsigned.key'

-----

You are about to be asked to enter information that will be incorporated

into your certificate request.

What you are about to enter is what is called a Distinguished Name or a DN.

There are quite a few fields but you can leave some blank

For some fields there will be a default value,

If you enter '.', the field will be left blank.

-----

Country Name (2 letter code) [XX]:**FR**

State or Province Name (full name) []:**Hauts-de-France**

Locality Name (eg, city) [Default City]:**Dunkerque**

Organization Name (eg, company) [Default Company Ltd]:**KFM**

Organizational Unit Name (eg, section) []:**IT**

Common Name (eg, your name or your server's hostname) []:**Greg**

Email Address []:gregory.ameye@kfm.com

[oracle@vbgeneric ~]$

req: Use X.509 public key infrastructure standard that SSL and TLS adheres to for its key and certificate management. 

-x509: Make a self-signed certificate instead of generating a certificate signing request, to a 3rd party CA server.

-nodes: Skip the option to secure our certificate with a passphrase.

-days 365: This option sets the length of time that the certificate will be considered valid. For dev purposes 1 year, but production can be 3-5 years.

-newkey rsa:2048: Generate a new certificate and a new key at the same time. We did not create the key that is required to sign the certificate in a previous step, so we need to create it along with the certificate. The rsa:2048 portion tells it to make an RSA key that is 2048 bits long.

-keyout: Location to store the generated private key file that we are creating.

-out: Location to store the certificate that we are creating.

Private key file and cert now available in /etc/ssl

            7. Configure nginx to Use SSL (not live yet)

We have created our key and certificate files under the /etc/ssl directory, now changes to nginx required are:-

New configuration snippet containing SSL key and certificate file locations.

New configuration snippet containing strong SSL settings that can be used with any certificates in the future.

Adjust nginx server blocks to handle SSL requests and use the two snippets above.

This method of configuring Nginx will allow us to keep clean server blocks and put common configuration segments into reusable modules.

                4. Create a Configuration Snippet Pointing to the SSL Key and Certificate

Create a new nginx configuration snippet in the/etc/nginx/snippets directory.

To properly distinguish the purpose of this file, let's call it self-signed.conf

sudo nano /etc/nginx/snippets/self-signed.conf

Within this file, we just need to set the ssl_certificate directive to our certificate file and the ssl_certificate_key to the associated key. In our case, this will look like this:

/etc/nginx/snippets/self-signed.conf

ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;

ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

                5. Create a Configuration Snippet with Strong Encryption Settings

Next, we will create another snippet that will define some SSL settings. This will set Nginx up with a strong SSL cipher suite and Create another snippet that will define some SSL settings. Use a strong SSL cipher suite and enable advanced features to keep server secure.

The parameters are stored in file with generic name:

sudo nano /etc/nginx/snippets/ssl-params.conf

/etc/nginx/snippets/ssl-params.conf

# from https://cipherli.st/

# and https://raymii.org/s/tutorials/Strong_SSL_Security_On_nginx.html

ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

ssl_prefer_server_ciphers on;

ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";

ssl_ecdh_curve secp384r1;

ssl_session_cache shared:SSL:10m;

ssl_session_tickets off;

ssl_stapling on;

ssl_stapling_verify on;

resolver 8.8.8.8 8.8.4.4 valid=300s;

resolver_timeout 5s;

# Disable preloading HSTS for now.  You can use the commented out header line that includes

# the "preload" directive if you understand the implications.

#add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";

add_header Strict-Transport-Security "max-age=63072000; includeSubdomains";

add_header X-Frame-Options DENY;

add_header X-Content-Type-Options nosniff;

ssl_dhparam /etc/ssl/certs/dhparam.pem;

Because we are using a self-signed certificate, the SSL stapling will not be used. Nginx will simply output a warning, disable stapling for our self-signed cert, and continue to operate correctly.

                6. Adjust the Nginx Configuration to Use SSL

Now that we have our snippets, adjust Nginx configuration to enable SSL.

KFM nginx is using the default server block file in the /etc/nginx/sites-available directory.

Back up our current server block file:

sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak

Now, open the server block file to make adjustments:

sudo nano /etc/nginx/sites-available/default

Inside, your server block probably begins like this:

/etc/nginx/sites-available/default

server {

    listen 80 default_server;

    listen [::]:80 default_server;

    # SSL configuration

    # listen 443 ssl default_server;

    # listen [::]:443 ssl default_server;

Modify this configuration so that unencrypted HTTP requests are automatically redirected to encrypted HTTPS. This offers the best security for our sites. If you want to allow both HTTP and HTTPS traffic, use the alternative configuration that follows.

We will be splitting the configuration into two separate blocks. After the two first listen directives, we will add a server_name directive, set to your server's domain name or, more likely, IP address. We will then set up a redirect to the second server block we will be creating. Afterwards, we will close this short block:

Note: Use a 302 redirect until we have verified that everything is working properly. Afterwards, we can change this to a permanent 301 redirect.

/etc/nginx/sites-available/default

server {

    listen 80 default_server;

    listen [::]:80 default_server;

    server_name server_domain_or_IP;

    return 302 https://$server_name$request_uri;

}

    # SSL configuration

    # listen 443 ssl default_server;

    # listen [::]:443 ssl default_server;

Next, we need to start a new server block directly below to contain the remaining configuration. We can uncomment the two listen directives that use port 443. We can add http2 to these lines in order to enable HTTP/2 within this block. Afterwards, we just need to include the two snippet files we set up:

Note: You may only have one listen directive that includes the default_server modifier for each IP version and port combination. If you have other server blocks enabled for these ports that have default_server set, you must remove the modifier from one of the blocks.

/etc/nginx/sites-available/default

server {

    listen 80 default_server;

    listen [::]:80 default_server;

    server_name server_domain_or_IP;

    return 302 https://$server_name$request_uri;

}

server {

    # SSL configuration

    listen 443 ssl http2 default_server;

    listen [::]:443 ssl http2 default_server;

    include snippets/self-signed.conf;

    include snippets/ssl-params.conf;

    5. QA Environment VM Testing

        16. Pre UAT test data

Five IDs already in place with associated MS_STATION entries are used for system testing. These IDs should be printed to RFID tags in preparation. The IDNO have already been prnted once and exist in file PRD-B01-test2.dat (converted from PRD-B01-test2.txt by Bartend.exe at last run)

            8. Bartender from Commander

The bartender command line in the automation watcher has been updated with two lptions /X and /MIN to simply print the tags and exit on detecting the txt file names starting PRD_B01-*

E.g

Bartend.exe /AF=c:\Users\iteam\Desktop\KFM\Models\RFID\RFID.btw /PRN="KFMER009” /P /R=1 /D=c:\Bartender\PRD-B01-test2.dat /X /MIN

            9. IDs for UAT pre flight check (loaded in PRD-B01-test2.txt ->generates PRD-B01-test2.dat)

The following IDNOs are to be used for all aspects of testing the workflow and the web portal reactivity – these IDNO exist in the current PRDTST PROD_RESULT table and should be initial seeded to ROD_MONITOR (until the batch job is amended).

30GQ00090

30GQ00091

30GQ00092

30GQ00093

30GQ00094

30GQ00095

        17. Seed oracle (pre batch PROD_RESULT|| PROD_MONITOR

Insert into PROD_MONITOR (ID_NO,CREATE_DATE,CREATE_BY,UPDATE_DATE,UPDATE_BY,MONTHLY_SEQ,MODEL_CODE,REMARKS,PLAN_PROD_FINISH_DATE,LOCATION_STATUS,PARTS_PREPARATION_STATUS) values ('30GQ00095',sysdate,'NEC',sysdate,'NEC','20170600040','1111','TESTUAT',sysdate+15,0,0);

Insert into PROD_MONITOR (ID_NO,CREATE_DATE,CREATE_BY,UPDATE_DATE,UPDATE_BY,MONTHLY_SEQ,MODEL_CODE,REMARKS,PLAN_PROD_FINISH_DATE,LOCATION_STATUS,PARTS_PREPARATION_STATUS) values ('30GQ00094',sysdate,'NEC',sysdate,'NEC','20170600039','1111','TESTUAT',sysdate+15,0,0);

Insert into PROD_MONITOR (ID_NO,CREATE_DATE,CREATE_BY,UPDATE_DATE,UPDATE_BY,MONTHLY_SEQ,MODEL_CODE,REMARKS,PLAN_PROD_FINISH_DATE,LOCATION_STATUS,PARTS_PREPARATION_STATUS) values ('30GQ00093',sysdate,'NEC',sysdate,'NEC','20170600038','1111','TESTUAT',sysdate+15,0,0);

Insert into PROD_MONITOR (ID_NO,CREATE_DATE,CREATE_BY,UPDATE_DATE,UPDATE_BY,MONTHLY_SEQ,MODEL_CODE,REMARKS,PLAN_PROD_FINISH_DATE,LOCATION_STATUS,PARTS_PREPARATION_STATUS) values ('30GQ00092',sysdate,'NEC',sysdate,'NEC','20170600037','1111','TESTUAT',sysdate+15,0,0);

Insert into PROD_MONITOR (ID_NO,CREATE_DATE,CREATE_BY,UPDATE_DATE,UPDATE_BY,MONTHLY_SEQ,MODEL_CODE,REMARKS,PLAN_PROD_FINISH_DATE,LOCATION_STATUS,PARTS_PREPARATION_STATUS) values ('30GQ00091',sysdate,'NEC',sysdate,'NEC','20170600036','1111','TESTUAT',sysdate+15,0,0);

Insert into PROD_MONITOR (ID_NO,CREATE_DATE,CREATE_BY,UPDATE_DATE,UPDATE_BY,MONTHLY_SEQ,MODEL_CODE,REMARKS,PLAN_PROD_FINISH_DATE,LOCATION_STATUS,PARTS_PREPARATION_STATUS) values ('30GQ00090',sysdate,'NEC',sysdate,'NEC','20170600035','1111','TESTUAT',sysdate+15,0,0);

Dependency MQ Start

The ECU Initialisation program has been updated to directly update PROD_MONITOR via the rules engine on test start (pressing F1). The version dated 20170710 must be used for the testing of MQ START LINE.

        18.  Test Case Scenarios

![image alt text](image_11.png)

            10. Test One Main Flow(commit needed if sqldeveloper used)

/* Production Chassis Start Pokayoke B1 STATION 201301 */

update prod_result set PROD_STATUS=2, UPDATE_BY='201301', UPDATE_DATE=SYSDATE where id_no='30GQ00090' and STATION_NO='201301';

 

/* Chassis End STATION 201601 */

update prod_result set PROD_STATUS=2, UPDATE_BY='201601', UPDATE_DATE=SYSDATE where id_no='30GQ00090' and STATION_NO='201601';

 

/* Paint Start RFID */

kfmrfida1 172.20.83.110

 

/* Paint End RFID */

kfmrfida2 172.20.83.111

 

/* Tractor Start RFID */

kfmrfida3 172.20.83.112

 

/* Tractor End line off result Pokayoke B3 STATION 245601 */

update prod_result set PROD_STATUS=2, UPDATE_BY='245601', UPDATE_DATE=SYSDATE where id_no='30GQ00090' and STATION_NO='245601';

 

/* MQ Line start ECU Init - this is now done by ECU Init application */

update prod_result set PROD_STATUS=2, UPDATE_BY='245311', UPDATE_DATE=SYSDATE where id_no='30GQ00090' and STATION_NO='245311';

/* MQ Line End STATION 250601 */

update prod_result set PROD_STATUS=2, UPDATE_BY='250601', UPDATE_DATE=SYSDATE where id_no='30GQ00090' and STATION_NO='250601';

/* FSM State 7 MFG PRODUCTION_END_DATE */

            11. Test Route Two

/* Production Chassis Start Pokayoke B1 STATION 201301 */

update prod_result set PROD_STATUS=2, UPDATE_BY='201301', UPDATE_DATE=SYSDATE where id_no='30GQ00091' and STATION_NO='201301';

 

/* Chassis End STATION 201601 */

update prod_result set PROD_STATUS=2, UPDATE_BY='201601', UPDATE_DATE=SYSDATE where id_no='30GQ00091' and STATION_NO='201601';

/* Paint Start RFID */

kfmrfida1 172.20.83.110

/* Paint End RFID */

kfmrfida2 172.20.83.111

/* Tractor Start RFID */

kfmrfida3 172.20.83.112

 

/* Tractor End line off result Pokayoke B3 STATION 245601 */

update prod_result set PROD_STATUS=2, UPDATE_BY='245601', UPDATE_DATE=SYSDATE where id_no='30GQ00091' and STATION_NO='245601';

 

/* Rework before MQ Start Line RFID Hand */

kfmrfidc4 172.20.80.83

 

/* Rework before MQ End Line RFID Hand */

kfmrfidc3 172.20.80.82

 

/* MQ Line start ECU Init - this is now done by ECU Init application */

update prod_result set PROD_STATUS=2, UPDATE_BY='245311', UPDATE_DATE=SYSDATE where id_no='30GQ00091' and STATION_NO='245311';

 

/* MQ Line End STATION 250601 */

update prod_result set PROD_STATUS=2, UPDATE_BY='250601', UPDATE_DATE=SYSDATE where id_no='30GQ00091' and STATION_NO='250601';

 

/* State 7 MFG PRODUCTION_END_DATE */

The SAP / MFG events are under consideration by KFM and will be added to this test scenario once completed by KFM

![image alt text](image_12.png)

            12. Test Route Three

/* Production Chassis Start Pokayoke B1 STATION 201301 */

update prod_result set PROD_STATUS=2, UPDATE_BY='201301', UPDATE_DATE=SYSDATE where id_no='30GQ00092' and STATION_NO='201301';

/* Chassis End STATION 201601 */

update prod_result set PROD_STATUS=2, UPDATE_BY='201601', UPDATE_DATE=SYSDATE where id_no='30GQ00092' and STATION_NO='201601';

/* Paint Start RFID */

kfmrfida1 172.20.83.110 using RFID tag 30GQ00092 pass tag in / out of field of vision of antenna connected to kfmrfida1 on IP 172.20.83.110

 

/* Paint End RFID */

kfmrfida2 172.20.83.111 using RFID tag 30GQ00092 pass tag in / out of field of vision of antenna connected to kfmrfida2 on IP 172.20.83.111

/* Tractor Start RFID */

kfmrfida3 172.20.83.112 using RFID tag 30GQ00092 pass tag in / out of field of vision of antenna connected to kfmrfida3 on IP 172.20.83.112

/* Tractor End line off result Pokayoke B3 STATION 245601 */

update prod_result set PROD_STATUS=2, UPDATE_BY='245601', UPDATE_DATE=SYSDATE where id_no='30GQ00092' and STATION_NO='245601';

 

/* MQ Line start ECU Init - this is now done by ECU Init application */

update prod_result set PROD_STATUS=2, UPDATE_BY='245311', UPDATE_DATE=SYSDATE where id_no='30GQ00092' and STATION_NO='245311';

 

/* Rework after MQ Start RFID

kfmrfidc2 172.20.80.81 using RFID tag 30GQ00092 pass tag in of field of vision of handheld tap on the scan on screen button – confirm the screen last scan ID is updated

/* Rework after MQ End RFID */

kfmrfidc3 172.20.80.82 using RFID tag 30GQ00092 pass tag in of field of vision of handheld tap on the scan on screen button – confirm the screen last scan ID is updated

/* MQ Line start ECU Init - this is now done by ECU Init application after start of F1 press - not barcode initial scan only once test sequence starts */

update prod_result set PROD_STATUS=2, UPDATE_BY='245311', UPDATE_DATE=SYSDATE where id_no='30GQ00092' and STATION_NO='245311';

 

/* MQ Line End STATION 250601 */

update prod_result set PROD_STATUS=2, UPDATE_BY='250601', UPDATE_DATE=SYSDATE where id_no='30GQ00092' and STATION_NO='250601';

 	

/* FSM State 7 MFG PRODUCTION_END_DATE */

Action from MES system UI to update LOCATION_STATUS = 7

update PROD_MONITOR set LOCATION_STATUS=7, UPDATE_BY=’MFG_USER’, UPDATE_DATE=sysdate where ID_NO='30GQ00092' and (LOCATION_STATUS=6 OR LOCATION_STATUS=4);

 

Alternate end 1

/* Inspection Start RFID */

kfmrfidc1(C1) 172.20.80.80

 

/* SAP event INSPECTION_END_DATE */

 

Alternate end 2

/* Inspection Start RFID */

kfmrfidc1(C1) 172.20.80.80

 

/* SAP Event Rework during inspection 

The SAP / MFG events are under consideration by KFM and will be added to this test scenario once completed by KFM

/* Rework During Inspection END RFID */

kfmrfidc3 (C3) 172.20.80.82

 

/* SAP event INSPECTION_END_DATE */

The SAP / MFG events are under consideration by KFM and will be added to this test scenario once completed by KFM

    6. Appendix A

        19. DDL as of 05-Jul-2017 from PRDTST (updates from 3-Nov-2017 walk through)

            13. DDL Table HUBADMIN.PM_DEVICE_MAP

--------------------------------------------------------

--  File created - Wednesday-July-05-2017   

--------------------------------------------------------

--------------------------------------------------------

--  DDL for Table PM_DEVICE_MAP

--------------------------------------------------------

  CREATE TABLE "HUBADMIN"."PM_DEVICE_MAP" 

   (	"SCANNER_ID" VARCHAR2(20 BYTE), 

	"SCANNER_IP" VARCHAR2(15 BYTE), 

	"SCANNER_COMMENT" VARCHAR2(2001 BYTE)

   ) SEGMENT CREATION IMMEDIATE 

  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 

 NOCOMPRESS LOGGING

  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645

  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1

  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)

  TABLESPACE "KBTDBDAT" ;

--------------------------------------------------------

--  File created - Friday-November-03-2017   

--------------------------------------------------------

REM INSERTING into HUBADMIN.PM_DEVICE_MAP

SET DEFINE OFF;

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmcasio1','172.20.83.110','SCANNER type 2 (handheld Casio Scanner)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmcasio2',null,'SCANNER type 2 (handheld Casio Scanner)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmcasio3',null,'SCANNER type 2 (handheld Casio Scanner)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('pokayokeb1','192.168.1.1','MS_STATION.STATION_NO  = SCANNER_ID for lookup in PM_FSM_RULES e.g 250311');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('pokayokeb2','192.168.1.2','MS_STATION.STATION_NO  = SCANNER_ID for lookup in PM_FSM_RULES e.g 250311');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('pokayokeb3','192.168.1.3','MS_STATION.STATION_NO  = SCANNER_ID for lookup in PM_FSM_RULES e.g 250311');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('pokayokeb4','192.168.1.4','MS_STATION.STATION_NO  = SCANNER_ID for lookup in PM_FSM_RULES e.g 250311');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfidc1','172.20.80.80','SCANNER type 2 (handheld) INSPECTION START (default 172.20.80.80)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfidc2','172.20.80.81','SCANNER type 2 (handheld) REWORK AFTER MQ START (default .81)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfidc3','172.20.80.82','SCANNER type 2 (handheld) REWORK DURING MQ START (default .82)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfidc4','172.20.80.83','SCANNER type 2 (handheld) REWORK BEFORE MQ START (default .83)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida1','172.20.83.110','SCANNER type 1 static fixed reader PAINT START (default kfmrfida1 .83.110)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida2','172.20.83.120','SCANNER type 1 static fixed reader PAINT END (default kfmrfida2 .111)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida3','172.20.83.111','SCANNER type 1 static fixed reader TRACTOR START (default kfmrfida3 . 112)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida4','172.20.83.113','SCANNER type 1 static fixed reader RFS TO OUTSIDE (default kfmrfid4 .113)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida5','172.20.83.114','SCANNER type 1 static fixed reader FUTURE TO OUTSIDE (default kfmrfida5 .114)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida6','172.20.83.115','SCANNER type 1 static fixed reader OUTSIDE TO SHIPPED (default kfmrfida6 .115)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida7','172.20.83.116','SCANNER type 1 static fixed reader OUTSIDE TO SHIPPED (default kfmrfida7 .116)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida8','172.20.83.117','SCANNER type 1 static fixed reader RFS TO OUTSIDE (default kfmrfidxx .11x)');

Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida9','172.20.83.118','SCANNER type 1 static fixed reader OUTSIDE TO FUTURE');

            14. DDL Table HUBADMIN.PM_FSM_RULES

--------------------------------------------------------

--  File created - Wednesday-July-05-2017   

--------------------------------------------------------

--------------------------------------------------------

--  DDL for Table PM_FSM_RULES

--------------------------------------------------------

  CREATE TABLE "HUBADMIN"."PM_FSM_RULES" 

   (	"RULENO" NUMBER(*,0), 

	"CURRENTSTATE" NUMBER(2,0), 

	"NEXTSTATE" VARCHAR2(20 BYTE), 

	"SCANNER_ID" VARCHAR2(20 BYTE), 

	"EVENT_RAISED_DATECOLUMN" VARCHAR2(50 BYTE), 

	"RULE_COMMENT" VARCHAR2(2001 BYTE)

   ) SEGMENT CREATION IMMEDIATE 

  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 

 NOCOMPRESS LOGGING

  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645

  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1

  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)

  TABLESPACE "KBTDBDAT" ;

            15. DDL Table HUBADMIN.PROD_MONITOR

--------------------------------------------------------

--  DDL for Table PROD_MONITOR

--------------------------------------------------------

  CREATE TABLE "HUBADMIN"."PROD_MONITOR" 

   (	"ID_NO" NCHAR(9), 

	"CREATE_DATE" DATE, 

	"CREATE_BY" NCHAR(10), 

	"UPDATE_DATE" DATE, 

	"UPDATE_BY" NCHAR(10), 

	"MONTHLY_SEQ" NCHAR(11), 

	"MODEL_CODE" NCHAR(10), 

	"REMARKS" NVARCHAR2(10), 

	"PLAN_PROD_FINISH_DATE" DATE, 

	"LOCATION_STATUS" NUMBER(2,0), 

	"PARTS_PREPARATION_STATUS" NCHAR(1), 

	"CHASSIS_LINE_START_DATE" DATE, 

	"CHASSIS_LINE_END_DATE" DATE, 

	"PAINT_LINE_START_DATE" DATE, 

	"PAINT_LINE_END_DATE" DATE, 

	"TRACTOR_LINE_START_DATE" DATE, 

	"TRACTOR_LINE_END_DATE" DATE, 

	"REWORK_BEFORE_MQ_START_DATE" DATE, 

	"REWORK_BEFORE_MQ_END_DATE" DATE, 

	"MQ_LINE_START_DATE" DATE, 

	"MQ_LINE_END_DATE" DATE, 

	"REWORK_AFTER_MQ_START_DATE" DATE, 

	"REWORK_AFTER_MQ_END_DATE" DATE, 

	"PRODUCTION_END_DATE" DATE, 

	"INSPECTION_START_DATE" DATE, 

	"INSPECTION_END_DATE" DATE, 

	"REWORK_DUR_INSP_START_DATE" DATE, 

	"REWORK_DUR_INSP_END_DATE" DATE, 

	"SHIPPING_STATUS" NCHAR(1), 

	"SHIPPING_DATE" DATE

   ) SEGMENT CREATION IMMEDIATE 

  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 

 NOCOMPRESS LOGGING

  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645

  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1

  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)

  TABLESPACE "KBTDBIDX" ;

            16. DDL Trigger HUBADMIN.UPDATE_PROD_MONITOR

Check permissions of STDADMIN/HUBADMIN for executing trigger as HUBADMIN on STDADMIN schema table

---------------------------------------------------------------------------------------

--

--  DDL for UPDATE_PROD_MONITOR

--  20Mar2018_Amd (UTC)

--

--------------------------------------------------------------------------------------

**create** **or** replace **TRIGGER** "HUBADMIN"."UPDATE_PROD_MONITOR" 

**AFTER** **UPDATE** **OF** PROD_STATUS **ON** "STDADMIN"."PROD_RESULT" 

**FOR** **EACH** **ROW**

**DECLARE**

    STATIONNO VARCHAR2(6 **CHAR**);   

    CURRENT_STATE_PM **NUMBER**(2,0);

    NEXT_STATE_RULE VARCHAR2(20 BYTE);

    EVENT_RAISEDDATECOLUMN VARCHAR2(50 BYTE);

    IDNO VARCHAR2(9 **CHAR**);

    RULECOUNT **INT** := 0;

    UPDATEDATE **DATE** := SYSDATE;  /*event date UTC +1) */

**BEGIN**

	DBMS_OUTPUT.PUT_LINE('--------- Begin -------- ');

    IDNO := **:NEW**.ID_NO;

    STATIONNO :=  **:NEW**.STATION_NO;

  /*  UPDATEDATE := :NEW.ACTUAL_DATE; */

    

    **IF** (**:NEW**.PROD_STATUS ='2') **THEN**  

      DBMS_OUTPUT.PUT_LINE('  ID NO: ' || IDNO);

      DBMS_OUTPUT.PUT_LINE('  Station No: ' || STATIONNO);

      DBMS_OUTPUT.PUT_LINE('  Scan Date:  ' || UPDATEDATE);

     

      /* FSM_RULES will have Station no instead of Station Name */

    

      -- Get Current Location from PROD_MONITOR using ID_NO

    

      **SELECT** LOCATION_STATUS **INTO** CURRENT_STATE_PM **FROM** HUBADMIN.PROD_MONITOR **WHERE** ID_NO = IDNO; 

      DBMS_OUTPUT.PUT_LINE('  Current Location: ' || CURRENT_STATE_PM);

    

      -- Check if a rule exist for Current state and Station

      **SELECT** **COUNT**(*) **INTO** RULECOUNT  **FROM** HUBADMIN.PM_FSM_RULES  

      **WHERE** SCANNER_ID = STATIONNO  **AND** CURRENTSTATE = CURRENT_STATE_PM;

    

      DBMS_OUTPUT.PUT_LINE('  RULECOUNT: ' || RULECOUNT);

      

      **IF** RULECOUNT = 1 **THEN**

         -- Get Next state and date column to update in PROD_Monitor from PM_FSM_RULES table

          **SELECT** NEXTSTATE, EVENT_RAISED_DATECOLUMN **INTO** NEXT_STATE_RULE, EVENT_RAISEDDATECOLUMN **FROM** HUBADMIN.PM_FSM_RULES  

            **WHERE** SCANNER_ID = STATIONNO  **AND** CURRENTSTATE = CURRENT_STATE_PM;

            DBMS_OUTPUT.PUT_LINE('  Next Location: ' || NEXT_STATE_RULE);

            DBMS_OUTPUT.PUT_LINE('  Update Column: ' || EVENT_RAISEDDATECOLUMN);

      

      ELSIF  RULECOUNT = 0 **THEN**

            DBMS_OUTPUT.PUT_LINE('  *** ERROR - No Rules Found. ****');

            -- raise exception

      

      ELSIF  RULECOUNT > 1 **THEN**

          -- If there are multiple rules then get the first rule in ascending order

           **SELECT** NEXTSTATE, EVENT_RAISED_DATECOLUMN **INTO** NEXT_STATE_RULE, EVENT_RAISEDDATECOLUMN **FROM** (

                **SELECT** * **FROM** HUBADMIN.PM_FSM_RULES  

                **WHERE** SCANNER_ID = STATIONNO  **AND** CURRENTSTATE = CURRENT_STATE_PM

                **ORDER** **BY** RULENO **ASC**) 

            **WHERE** ROWNUM=1;

     **END** **IF**;

       

      **CASE**

         **WHEN** EVENT_RAISEDDATECOLUMN = 'CHASSIS_LINE_START_DATE' **THEN** 

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, CHASSIS_LINE_START_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO; 

          

         **WHEN** EVENT_RAISEDDATECOLUMN = 'CHASSIS_LINE_END_DATE'  **THEN** 

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, CHASSIS_LINE_END_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO; 

              DBMS_OUTPUT.PUT_LINE('  CHASSIS_LINE_END_DATE Updated ');

          **WHEN** EVENT_RAISEDDATECOLUMN = 'PAINT_LINE_START_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, PAINT_LINE_START_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;          

      

          **WHEN** EVENT_RAISEDDATECOLUMN = 'PAINT_LINE_END_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, PAINT_LINE_START_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;

          **WHEN** EVENT_RAISEDDATECOLUMN = 'TRACTOR_LINE_START_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, TRACTOR_LINE_START_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;

          **WHEN** EVENT_RAISEDDATECOLUMN = 'TRACTOR_LINE_END_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, TRACTOR_LINE_END_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;

          **WHEN** EVENT_RAISEDDATECOLUMN = 'REWORK_BEFORE_MQ_START_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, REWORK_BEFORE_MQ_START_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;              

 

          **WHEN** EVENT_RAISEDDATECOLUMN = 'REWORK_BEFORE_MQ_END_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, REWORK_BEFORE_MQ_START_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;    

          

          -- Update PROD_MONITOR for MQLINE from station 245311 barcode scan

          -- this will never trigger during ECU Initialisation DTC NG issues until fix in place

          -- and then rule will not allow new time stamp after a barcode scan

          **WHEN** EVENT_RAISEDDATECOLUMN = 'MQ_LINE_START_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, MQ_LINE_START_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;   

  

          **WHEN** EVENT_RAISEDDATECOLUMN = 'MQ_LINE_END_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, MQ_LINE_END_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;  

          **WHEN** EVENT_RAISEDDATECOLUMN = 'REWORK_AFTER_MQ_START_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, REWORK_AFTER_MQ_START_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO; 

 

          **WHEN** EVENT_RAISEDDATECOLUMN = 'REWORK_AFTER_MQ_END_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, REWORK_AFTER_MQ_END_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;    

          

          **WHEN** EVENT_RAISEDDATECOLUMN = 'PRODUCTION_END_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, PRODUCTION_END_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;  

              

          **WHEN** EVENT_RAISEDDATECOLUMN = 'INSPECTION_START_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, INSPECTION_START_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;   

              

          **WHEN** EVENT_RAISEDDATECOLUMN = 'INSPECTION_END_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, INSPECTION_END_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;   

 

           **WHEN** EVENT_RAISEDDATECOLUMN = 'REWORK_DUE_INSP_START_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, REWORK_DUR_INSP_START_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO; 

 

           **WHEN** EVENT_RAISEDDATECOLUMN = 'REWORK_DUE_INSP_END_DATE' **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, REWORK_DUR_INSP_END_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;       

   

          **WHEN** EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' **AND** CURRENT_STATE_PM = 11 **and** NEXT_STATE_RULE = 12 **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='O', 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;                  

     

          **WHEN** EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' **AND** CURRENT_STATE_PM = 12 **AND** NEXT_STATE_RULE = 13 **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='F', 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;   

              

          **WHEN** EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' **AND** CURRENT_STATE_PM=13 **AND** NEXT_STATE_RULE = 12 **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='O', 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;      

   

          **WHEN** EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' **AND** CURRENT_STATE_PM=12 **AND** NEXT_STATE_RULE = 11 **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='I', 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;      

     

          **WHEN** EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' **AND** NEXT_STATE_RULE = 15 **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='S', SHIPPING_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO

              **WHERE** ID_NO = IDNO;                    

      **ELSE**

        DBMS_OUTPUT.PUT_LINE('  ****ERROR - No columns matched ****');

        **NULL**;

      **END** **CASE**;

      

  **END** **IF**;

    DBMS_OUTPUT.PUT_LINE('--------- End -------- ');

    

**EXCEPTION**

**WHEN** PROGRAM_ERROR **THEN**

  DBMS_OUTPUT.PUT_LINE('  ****ERROR - Unexpected error occurred**** ');

**WHEN** NO_DATA_FOUND **THEN**

  DBMS_OUTPUT.PUT_LINE('  ****ERROR - No data found**** ');

**END** UPDATE_PROD_MONITOR;

ALTER TRIGGER "HUBADMIN"."UPDATE_PROD_MONITOR" ENABLE;

            17. Debugging only sqldeveloper

--------------------------------------------------------

--  DDL for Synonymn DBMS_OUTPUT

--------------------------------------------------------

CREATE OR REPLACE PUBLIC SYNONYM "DBMS_OUTPUT" FOR "SYS"."DBMS_OUTPUT";

            18. DDL HUBADMIN.PM_RFID_RAW_EVENTS

--------------------------------------------------------
--  File created - Wednesday-July-05-2017   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Table PM_RFID_RAW_EVENTS
--------------------------------------------------------

  CREATE TABLE "HUBADMIN"."PM_RFID_RAW_EVENTS" 
   (	"SCAN_TIMESTAMP" DATE, 
	"TAGID" VARCHAR2(24 BYTE), 
	"IDNO" VARCHAR2(9 BYTE), 
	"SCANNER_IP" VARCHAR2(15 BYTE), 
	"RSSI" NUMBER(3,0), 
	"SCANNER_ID" VARCHAR2(17 BYTE), 
	"SCANNER_TYPE" NUMBER(1,0)
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 6291456 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "KBTDBDAT" ;

   COMMENT ON COLUMN "HUBADMIN"."PM_RFID_RAW_EVENTS"."SCAN_TIMESTAMP" IS 'Scan Timestamp';
   COMMENT ON COLUMN "HUBADMIN"."PM_RFID_RAW_EVENTS"."TAGID" IS 'Tag EPC';
   COMMENT ON COLUMN "HUBADMIN"."PM_RFID_RAW_EVENTS"."IDNO" IS 'Tractor ID No';
   COMMENT ON COLUMN "HUBADMIN"."PM_RFID_RAW_EVENTS"."SCANNER_IP" IS 'Scanner IP Address';
   COMMENT ON COLUMN "HUBADMIN"."PM_RFID_RAW_EVENTS"."RSSI" IS 'Signal Strength';

            19. DDL HUBADMIN.PM_FSM_RULES

--------------------------------------------------------
--  DDL for Table PM_FSM_RULES
--------------------------------------------------------

  CREATE TABLE "HUBADMIN"."PM_FSM_RULES" 
   (	"RULENO" NUMBER(*,0), 
	"CURRENTSTATE" NUMBER(2,0), 
	"NEXTSTATE" VARCHAR2(20 BYTE), 
	"SCANNER_ID" VARCHAR2(20 BYTE), 
	"EVENT_RAISED_DATECOLUMN" VARCHAR2(50 BYTE), 
	"RULE_COMMENT" VARCHAR2(2001 BYTE)
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "KBTDBDAT" ;

            20. DML PM_FSM_RULES

--------------------------------------------------------

--  DML for Table PM_FSM_RULES

--------------------------------------------------------

--------------------------------------------------------

--  File created - Friday-November-03-2017   

--------------------------------------------------------

REM INSERTING into HUBADMIN.PM_FSM_RULES

SET DEFINE OFF;

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (1,1,'2','kfmcasio1','PAINT_LINE_START_DATE','Motorla FX7500 Static Reader A.1');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (2,2,'2','kfmcasio2','PAINT_LINE_END_DATE','This static unit is to be replaced by new handheld unit (CR)');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (3,2,'3','kfmcasio3','TRACTOR_LINE_START_DATE','This static unit is to be replaced by new handheld unit (CR)');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (4,3,'5','kfmrfidc4','REWORK_BEFORE_MQ_START_DATE','END trigger is Pokayokeb4');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (5,6,'6','kfmrfidc3','REWORK_AFTER_MQ_END_DATE','Nordic Merlin SCANNER_ID KFMRFIDC3');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (6,4,'6','kfmrfidc3','REWORK_AFTER_MQ_END_DATE','Nordic Merlin SCANNER_ID KFMRFIDC3');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (7,4,'6','kfmrfidc2','REWORK_AFTER_MQ_START_DATE','Nordic Merlin SCANNER_ID KFMRFIDC3');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (8,7,'8','kfmrfidc1','INSPECTION_START_DATE','Nordic Merlin SCANNER_ID KFMRFIDC1');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (9,8,'8','kfmrfidc1','INSPECTION_END_DATE','INSPECTION_END_DATE comes from SAP not FSM -- RULE IS TO KEEP FSM IN STATE 8 i.e INSPECTION');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (10,9,'9','kfmrfidc1','REWORK_DUR_INSP_START_DATE','REWORK DURING INSPECTION COME FROM SAP -- RULE IS TO IGNORE IS SCANNER USED (ONLY C3 CAN EXIT REWORK_INSP_STATE 9)');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (11,9,'10','kfmrfidc3','REWORK_DUR_INSP_END_DATE','Nordic Merlin SCANNER_ID KFMRFIDC3');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (12,11,'12','kfmrfida4','SHIPPING_STATUS','Motorla FX7500 Static Reader A.4');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (13,12,'11','kfmrfida4','SHIPPING_STATUS','Motorla FX7500 Static Reader A.4');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (14,12,'14','kfmrfida6','SHIPPING_STATUS','Motorla FX7500 Static Reader A.6');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (15,12,'13','kfmrfida5','SHIPPING_STATUS','Motorla FX7500 Static Reader A.5');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (16,3,'4','250311','MQ_LINE_START_DATE','ECU init');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (17,5,'4','250311','MQ_LINE_START_DATE','ECU init');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (18,4,'4','250601','MQ_LINE_END_DATE','MQ Results');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (19,0,'1','201301','CHASSIS_LINE_START_DATE','PokaYoke Engine (Chassis Start trigger)');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (20,1,'1','201601','CHASSIS_LINE_END_DATE','Chassis Results');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (21,3,'3','245601','TRACTOR_LINE_END_DATE','Line Off Result');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (22,6,'4','250311','MQ_LINE_START_DATE','ECU init');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (23,12,'14','kfmrfida7','SHIPPING_STATUS','Motorla FX7500 Static Reader A.7  additional unit / antenna ');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (24,13,'12','kfmrfida5','SHIPPING_STATUS','Motorla FX7500 Static Reader A.9 from future area to outside area CHECK RSSI!!!');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (25,5,'5','kfmrfidc3','REWORK_BEFORE_MQ_END_DATE',' TBC Temporarily using RFIDC3 to test');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (26,6,'7','250601','MQ_LINE_END_DATE','MQ Results');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (27,4,'7','250701','PRODUCTION_END_DATE','MFG');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (28,6,'7','250701','PRODUCTION_END_DATE','Production End');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (29,11,'12','kfmrfida8','SHIPPING_STATUS','Motorla FX7500 Static Reader A.4/A.8');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (30,12,'11','kfmrfida8','SHIPPING_STATUS','Motorla FX7500 Static Reader A.4/A.8');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (31,12,'13','kfmrfida9','SHIPPING_STATUS','Motorla FX7500 Static Reader A.5/A.9');

Insert into PM_FSM_RULES (RULENO,CURRENTSTATE,NEXTSTATE,SCANNER_ID,EVENT_RAISED_DATECOLUMN,RULE_COMMENT) values (32,13,'12','kfmrfida9','SHIPPING_STATUS','Motorla FX7500 Static Reader A.5/A.9');

            21. DDL Trigger HUBADMIN.UPDATE_PROD_MONITOR_STATE

---------------------------------------------------------------------

--

--  DDL for UPDATE_PROD_MONITOR_STATE

--  20Mar2018_Amd (UTC)

--

---------------------------------------------------------------------

**create** **or** replace **TRIGGER** "HUBADMIN"."UPDATE_PROD_MONITOR_STATE" 

**AFTER** **INSERT** **ON** PM_RFID_RAW_EVENTS

**FOR** **EACH** **ROW**

    **DECLARE**     

    SCANNERIP VARCHAR2(20 BYTE);

    SCANNERID VARCHAR2(20 BYTE); -- not used refer to BEFORE UPDATE TRIGGER

    CURRENT_STATE_PM **NUMBER**(2,0);

    NEXT_STATE_RULE VARCHAR2(20 BYTE);

    EVENT_RAISEDDATECOLUMN VARCHAR2(50 BYTE);

    statecount **int** := 0;

    SCANTIME **DATE**;

    UPDATEDATE  **DATE**;

**BEGIN**  

      -- GET THE DEVICEIP AND COMPARE  WITH THE PM_DEVICE_MAP 

    **SELECT** LOCATION_STATUS **INTO** CURRENT_STATE_PM **FROM** PROD_MONITOR **WHERE** ID_NO = **:NEW**.IDNO; 

    

    **SELECT** **count**(*) **INTO** statecount **FROM** PM_FSM_RULES  **WHERE** SCANNER_ID = **:NEW**.SCANNER_ID **and** CURRENTSTATE = CURRENT_STATE_PM;

    

    /* CET date */

    SCANTIME := **:NEW**.SCAN_TIMESTAMP;

    UPDATEDATE := SYSDATE;

     

  **IF** (statecount > 0 )  **THEN**   

   **SELECT** NEXTSTATE,EVENT_RAISED_DATECOLUMN **INTO** NEXT_STATE_RULE,EVENT_RAISEDDATECOLUMN **FROM** PM_FSM_RULES  

    **WHERE** SCANNER_ID = **:NEW**.SCANNER_ID   **and** CURRENTSTATE = CURRENT_STATE_PM;    

    --Update the state in LOCATION_STATUS column and all event state date of PROD_MONITOR table with SCAN_TIMESTAMP column of PM_RFID_RAW_EVENTS TABLE

       **CASE**

       **WHEN** EVENT_RAISEDDATECOLUMN = 'CHASSIS_LINE_START_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,CHASSIS_LINE_START_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID

        **WHERE** ID_NO = **:NEW**.IDNO; 

       **WHEN** EVENT_RAISEDDATECOLUMN = 'CHASSIS_LINE_END_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,CHASSIS_LINE_END_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID    

        **WHERE** ID_NO = **:NEW**.IDNO;

       **WHEN** EVENT_RAISEDDATECOLUMN = 'PAINT_LINE_START_DATE' 

       **THEN**

       **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,PAINT_LINE_START_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID    

        **WHERE** ID_NO = **:NEW**.IDNO;         

 

       **WHEN** EVENT_RAISEDDATECOLUMN = 'PAINT_LINE_END_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,PAINT_LINE_END_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID  

        **WHERE** ID_NO = **:NEW**.IDNO; 

       **WHEN** EVENT_RAISEDDATECOLUMN = 'TRACTOR_LINE_START_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,TRACTOR_LINE_START_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID    

        **WHERE** ID_NO = **:NEW**.IDNO;

       **WHEN** EVENT_RAISEDDATECOLUMN = 'TRACTOR_LINE_END_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,TRACTOR_LINE_END_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID    

        **WHERE** ID_NO = **:NEW**.IDNO; 

        

       **WHEN** EVENT_RAISEDDATECOLUMN = 'REWORK_BEFORE_MQ_START_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,REWORK_BEFORE_MQ_START_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID  

        **WHERE** ID_NO = **:NEW**.IDNO; 

       **WHEN** EVENT_RAISEDDATECOLUMN = 'REWORK_BEFORE_MQ_END_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,REWORK_BEFORE_MQ_END_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID    

        **WHERE** ID_NO = **:NEW**.IDNO;

       **WHEN** EVENT_RAISEDDATECOLUMN = 'MQ_LINE_START_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,MQ_LINE_START_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID    

        **WHERE** ID_NO = **:NEW**.IDNO; 

        

        **WHEN** EVENT_RAISEDDATECOLUMN = 'MQ_LINE_END_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,MQ_LINE_END_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID  

        **WHERE** ID_NO = **:NEW**.IDNO; 

       **WHEN** EVENT_RAISEDDATECOLUMN = 'REWORK_AFTER_MQ_START_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,REWORK_AFTER_MQ_START_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID    

        **WHERE** ID_NO = **:NEW**.IDNO;

 

       **WHEN** EVENT_RAISEDDATECOLUMN = 'REWORK_AFTER_MQ_END_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,REWORK_AFTER_MQ_END_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID    

        **WHERE** ID_NO = **:NEW**.IDNO; 

        

         **WHEN** EVENT_RAISEDDATECOLUMN = 'PRODUCTION_END_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,PRODUCTION_END_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID  

        **WHERE** ID_NO = **:NEW**.IDNO; 

 

       **WHEN** EVENT_RAISEDDATECOLUMN = 'INSPECTION_START_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,INSPECTION_START_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID    

        **WHERE** ID_NO = **:NEW**.IDNO;

 

       **WHEN** EVENT_RAISEDDATECOLUMN = 'INSPECTION_END_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,INSPECTION_END_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID    

        **WHERE** ID_NO = **:NEW**.IDNO; 

        

         **WHEN** EVENT_RAISEDDATECOLUMN = 'REWORK_DUR_INSP_START_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,REWORK_DUR_INSP_START_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID    

        **WHERE** ID_NO = **:NEW**.IDNO;

 

       **WHEN** EVENT_RAISEDDATECOLUMN = 'REWORK_DUR_INSP_END_DATE' 

       **THEN** 

        **UPDATE** PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE,REWORK_DUR_INSP_END_DATE=SCANTIME, 

        UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID    

        **WHERE** ID_NO = **:NEW**.IDNO; 

        **WHEN** EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' **AND** CURRENT_STATE_PM = 11 **and** NEXT_STATE_RULE = 12 **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='O', 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID

              **WHERE** ID_NO = **:NEW**.IDNO;                  

     

          **WHEN** EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' **AND** CURRENT_STATE_PM = 12 **AND** NEXT_STATE_RULE = 13 **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='F', 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID

              **WHERE** ID_NO = **:NEW**.IDNO;   

              

          **WHEN** EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' **AND** CURRENT_STATE_PM=13 **AND** NEXT_STATE_RULE = 12 **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='O', 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID

              **WHERE** ID_NO = **:NEW**.IDNO;      

   

          **WHEN** EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' **AND** CURRENT_STATE_PM=12 **AND** NEXT_STATE_RULE = 11 **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='I', 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID

              **WHERE** ID_NO = **:NEW**.IDNO;      

     

          **WHEN** EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' **AND** CURRENT_STATE_PM=12 **AND** NEXT_STATE_RULE = 14 **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='S', SHIPPING_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID

              **WHERE** ID_NO = **:NEW**.IDNO;  

     

     

          **WHEN** EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' **AND** NEXT_STATE_RULE = 15 **THEN**

              **UPDATE** HUBADMIN.PROD_MONITOR **SET** LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='S', SHIPPING_DATE = UPDATEDATE, 

              UPDATE_DATE = UPDATEDATE, UPDATE_BY = **:NEW**.SCANNER_ID

              **WHERE** ID_NO = **:NEW**.IDNO;    

      

       **END** **CASE**;  

  **ELSE**

    **NULL**;

  **END** **IF**;  

**EXCEPTION**

**WHEN** PROGRAM_ERROR **THEN**

  DBMS_OUTPUT.PUT_LINE('  ****ERROR - Unexpected error occurred**** ');

**WHEN** NO_DATA_FOUND **THEN**

  DBMS_OUTPUT.PUT_LINE('  ****ERROR - No data found**** ');

**END**;
ALTER TRIGGER "HUBADMIN"."UPDATE_PROD_MONITOR_STATE" ENABLE;


--------------------------------------------------------
--  DDL for Trigger SCANNER_ID_LOOKUP
--------------------------------------------------------
create or replace TRIGGER "HUBADMIN"."SCANNER_ID_LOOKUP" 

BEFORE INSERT ON PM_RFID_RAW_EVENTS 

FOR EACH ROW

BEGIN

 IF (:new.SCANNER_TYPE = 1) THEN

  SELECT SCANNER_ID INTO :new.SCANNER_ID FROM PM_DEVICE_MAP 

  WHERE SCANNER_IP = :new.SCANNER_ID;

  END IF;

END;
ALTER TRIGGER "HUBADMIN"."SCANNER_ID_LOOKUP" ENABLE;


--------------------------------------------------------
--  DDL for Synonymn DBMS_OUTPUT
--------------------------------------------------------

  CREATE OR REPLACE PUBLIC SYNONYM "DBMS_OUTPUT" FOR "SYS"."DBMS_OUTPUT";

    7. Appendix B

        20. Github source control

Pull requests are currently on [https://github.com/czarnian1/kfm_poc.git](https://github.com/czarnian1/kfm_poc.git) branch UKUS

Pushes to the repository are password protected – refer to the latest source control master document for current commit hash

![image alt text](image_13.png)

    8. Appendix C – Middleware Pascal Script

//**********************************************************************************************

//* Version        : Script Version 0.1.1

//* Date           : 28th June 2017

//* Desc           : RogueID code added to detect non KFM RFID tags in vicinity of readers

//* Last update by : BP 3-Nov-2017

//* Update         : Set variable TAGID to sTAGID 3-Nov-2017

//**********************************************************************************************

var sIDNO:string = '';

    sTagID:string = '';

    sScannerId:string = '';

    sDataSourceName:string = '';

    i:integer;

    hx:string='';

begin

//SetVariable('TAGID', '3330474a3030303131');

//SetVariable('DATA_SOURCE_FULL_NAME', '172.29.1.118:5084');

//Get tagid from data source name

sDataSourceName := GetVariable('DATA_SOURCE_FULL_NAME');

sScannerId := StrBefore(':', sDataSourceName);

//Get tagid from data packet

sTagID := GetVariable('TAGID');

// For a valid varchar(9) IDNO from ERP via BarTender write to Gen2 EPC, the first character in tag is padded zero which is ignored

// The SATO CLN4X RFID writer needs to write 10 chars into EPC memory

i := 3;

while i <= length(sTagID) - 1 DO

    Begin

         hx := sTagID[i] + sTagID[i+1];

         sIDNO := sIDNO + StrToHex(hx);

          i := i + 2;

    end;

//ShowMessage(sIDNO);

//ShowMessage(sScannerId);

//IDNO if a valid KFM RFID tag will always come from BarTender written EPC as leading_zero+varchar(9)IDNO so we always

// expect array size of 20

if (StrLength(sTagID) <> 20) then

    sTagID := 'ROGUETAG';

//Set IDNO in data packet

if  StrLength(sIDNO) > 9 then

    sIDNO :=  'ROGUEID';

//Set SCANNER_ID in data packet

SetVariable('SCANNER_ID', sScannerId);

SetVariable('IDNO',sIDNO);

SetVariable('TAGID',sTagID);

end.

