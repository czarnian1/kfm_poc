#!/usr/bin/env ruby
# coding: utf-8

require 'oci8'
require 'mongo'
require 'yajl'

oc = OCI8.new('testuser1', 'testuser1')

mongo_client =  Mongo::Client.new('mongodb://localhost:27017/production_kfm_db')

mongo_db = mongo_client.database
cols = mongo_db.collection_names
puts cols
col = mongo_db.collection('prod_monitor')
puts col

oc.exec("alter session set NLS_DATE_FORMAT='yyyy-mm-dd\"T\"hh24:mi:ss'")
cur = oc.parse('BEGIN dequeue_message(:p); END;')
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
  
  hash = json.parse(cur[':p'])
  #create a hash from the Oracle JSON object as a String binding to param called :p
  puts hash


  hash.delete('_id')
     
  hash['CREATE_DATE']=DateTime.strptime(hash['CREATE_DATE'], '%Y-%m-%dT%H:%M:%S');
  hash['UPDATE_DATE']=DateTime.strptime(hash['UPDATE_DATE'], '%Y-%m-%dT%H:%M:%S');
 
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
  
  # print
  puts hash.inspect

  if hash['dml_type'] == 'D'
    col.remove({'ID_NO' => hash['ID_NO']})
  else
    hash.delete('dml_type')
    col.update_one(
      {'ID_NO' => hash['ID_NO']},
      hash,
      {:upsert => true}
    )
  end

  # remove from AQ.  dequeue isn't complete until this happens
  oc.commit
end
