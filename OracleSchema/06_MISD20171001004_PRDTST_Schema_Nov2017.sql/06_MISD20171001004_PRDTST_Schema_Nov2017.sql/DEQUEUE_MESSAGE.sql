--------------------------------------------------------
--  DDL for Procedure DEQUEUE_MESSAGE
--------------------------------------------------------
set define off;

  CREATE OR REPLACE PROCEDURE "HUBADMIN"."DEQUEUE_MESSAGE" 
(
  payload out varchar2
) as
msg message_t := message_t(NULL);
  msg_id RAW(16);
  dequeue_options DBMS_AQ.DEQUEUE_OPTIONS_T;
  message_properties DBMS_AQ.MESSAGE_PROPERTIES_T;
BEGIN

  DBMS_AQ.DEQUEUE(
queue_name => 'kfmqueue',
dequeue_options => dequeue_options,
message_properties => message_properties,
payload => msg,
msgid => msg_id
  ); -- the queue name must match the queue created in sqlplus
  payload := msg.json;

END dequeue_message;

/
