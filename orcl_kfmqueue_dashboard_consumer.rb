#!/usr/bin/env ruby
# -*- coding: utf-8 -*-
#**********************************************************************************************
#* Title       : Production Ready Consumer dashboard service (use systemctrl to start | stop | status)
#* Version     : 0.1
#* Date        : 30-Aug-2018
#* Last update : UKUS 11-Sep-2018
#* Description : Added ruby logging / added mongo log to file / added Oracle log to file - linked to .service file in /etc/systemd/system
#**********************************************************************************************
# coding: utf-8

require 'oci8'
require 'mongo'
require 'yajl'
require 'logger'

log = Logger.new('/var/log/consumer_dashboard.log','daily')
log.level = Logger::INFO

#oc = OCI8.new('testuser1', 'testuser1')
oc = OCI8.new('HUBADMIN', 'HUBADMIN','//172.20.84.36:1521/PRDTST')
log.info "Oracle connector OK"

#Reduce Mongo client verbosity and send to log file
Mongo::Logger.logger.level = Logger::FATAL
Mongo::Logger.logger = Logger.new('/var/log/consumer_dashboard_mongo.log')

mongo_client =  Mongo::Client.new('mongodb://localhost:27017/production_kfm_db')
log.info "MongoDB Connector OK"

mongo_db = mongo_client.database
cols = mongo_db.collection_names
col = mongo_db.collection('pm_dashboard')

oc.exec("alter session set NLS_DATE_FORMAT='yyyy-mm-dd\"T\"hh24:mi:ss'")
cur = oc.parse('BEGIN dequeue_dashboard_message(:p); END;')
log.info "Dequeue dashboard cursor OK "
log.info cur
puts cur

#bind_param(key, param, type = nil, length = nil) ⇒ Object
#:p is the param variable name expected by oci8 ruby gem

cur.bind_param(':p', nil, String, 4000)
#Bind the object returned back from Oracle as JSON simple String

while true
  # retrieve message
  cur.exec()
  json = Yajl::Parser.new

  json.inspect
  
  begin
    hash = json.parse(cur[':p'])
    #create a hash from the Oracle JSON object as a String binding to param called :p
    log.info hash
    puts hash

    hash.delete('_id')
  rescue
    log.fatal "rescue: cannot parse message into json object - check enqueue message_t content"
    log.fatal cur[:p]
  ensure
    #create a hash from the Oracle JSON object as a String binding to param called :p
    log.info "ensure: hash could not be created"
  end

  unless hash.nil?
    if hash['PROD_TARGET']==""
      hash.delete('PROD_TARGET')
    end
    
    if hash['BF_TARGET']==""
      hash.delete('BF_TARGET')
    end
    
    if hash['SHIP_TARGET']==""
      hash.delete('SHIP_TARGET')
    end
    
    if hash['MQ_TARGET']==""
      hash.delete('MQ_TARGET')
    end
    
    if hash['TA_TARGET']==""
      hash.delete('TA_TARGET')
    end
    
    if hash['ID']==""
      hash.delete('ID')
    end
  end #unless hash.nil?
    
  # print
  log.info hash.inspect

  begin
    if hash['dml_type'] == 'D'
      col.delete_many(:ID => hash['ID'])
      puts 'Deleted.'

    else
      hash.delete('dml_type')
      col.update_one(
                     {'ID' => hash['ID']},
                     hash,
                     {:upsert => true}
                     )
      puts 'Upserted.'
    end
  rescue
    log.fatal "rescue: hash malformed not deleted"
  ensure
    log.info "ensure: nothing to do"
  end

  begin
    # remove from AQ.  dequeue isn't complete until this happens
    oc.commit
    log.info "Dequeue dashboard committed OK"
  rescue
    log.info "Oracle commit failed"
  end
end
