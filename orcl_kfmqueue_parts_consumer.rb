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
col = mongo_db.collection('prod_monitor_parts')
puts col

oc.exec("alter session set NLS_DATE_FORMAT='yyyy-mm-dd\"T\"hh24:mi:ss'")
cur = oc.parse('BEGIN dequeue_parts_message(:p); END;')
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

  if hash['LOCATION']==""
    hash.delete('LOCATION')
  end
  
  hash['CALCULATED_DATE']=DateTime.strptime(hash['CALCULATED_DATE'], '%Y-%m-%dT%H:%M:%S');

  if hash['ITEM_NUMBER']==""
    hash.delete('ITEM_NUMBER')
  end
  
  if hash['ITEM_DESCRIPTION']==""
    hash.delete('ITEM_DESCRIPTION')
  end
  
  if hash['REQUIREMENT_QTY']==""
    hash.delete('REQUIREMENT_QTY')
  else
    hash['REQUIREMENT_QTY']=hash['REQUIREMENT_QTY'].to_i(10);
  end
  
  if hash['MISSING_QTY']==""
    hash.delete('MISSING_QTY')
  else
    hash['MISSING_QTY']=hash['MISSING_QTY'].to_i(10);
  end
  
  # print
  puts hash.inspect

  if hash['dml_type'] == 'D'
    col.remove({'ID_NO' => hash['ID_NO'],'SEQ_NO' => hash['SEQ_NO']})
  else
    hash.delete('dml_type')
    col.update_one(
      {'ID_NO' => hash['ID_NO'],'SEQ_NO' => hash['SEQ_NO']},
      hash,
      {:upsert => true}
    )
  end

  # remove from AQ.  dequeue isn't complete until this happens
  oc.commit
end
