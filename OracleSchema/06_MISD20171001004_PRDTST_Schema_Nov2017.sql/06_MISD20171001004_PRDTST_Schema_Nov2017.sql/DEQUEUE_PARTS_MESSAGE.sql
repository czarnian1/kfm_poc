--------------------------------------------------------
--  DDL for Procedure DEQUEUE_PARTS_MESSAGE
--------------------------------------------------------
set define off;

  CREATE OR REPLACE PROCEDURE "HUBADMIN"."DEQUEUE_PARTS_MESSAGE" 
(
  payload out varchar2
) as
msg message_t := message_t(NULL); --message_t must match with the created message object type.
  msg_id RAW(16);
  dequeue_options DBMS_AQ.DEQUEUE_OPTIONS_T;
  message_properties DBMS_AQ.MESSAGE_PROPERTIES_T;
BEGIN
  DBMS_AQ.DEQUEUE(
queue_name => 'kfmqueue_parts', -- the queue name must match with the created queue.
dequeue_options => dequeue_options,
message_properties => message_properties,
payload => msg,
msgid => msg_id
  );
  payload := msg.json;
END dequeue_parts_message;

/
