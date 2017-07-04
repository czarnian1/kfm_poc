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

  #this hash can fail if training white space comes across from Oracle - in the enqueue procedure ensure TRIM(string) is used
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

  # print
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
