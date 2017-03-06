#!/usr/bin/env ruby
# coding: utf-8

require 'oci8'
require 'mongo'
require 'yajl'

oc = OCI8.new('testuser1', 'testuser1')
#mongo_client =  Mongo::Client.new(['127.0.0.1:27017'], :database => 'production_kfm_db')
mongo_client =  Mongo::Client.new('mongodb://localhost:27017/production_kfm_db')

mongo_db = mongo_client.database

cols = mongo_db.collection_names

puts cols


col = mongo_db.collection('productiontasks')

puts col

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
  
  # print
  puts hash.inspect

  if hash['dml_type'] == 'D'
    col.remove({'_id' => hash['IDNO']})
  else
    # rename IDNO to _id
    hash['_id'] = hash.delete('IDNO')
    hash.delete('dml_type')
    col.update_one(
      {'_id' => hash['_id']},
      hash,
      {:upsert => true}
    )
  end

  # remove from AQ.  dequeue isn't complete until this happens
  oc.commit
end
