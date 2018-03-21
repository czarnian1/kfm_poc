--------------------------------------------------------
--  DDL for Procedure ENQUEUE_MESSAGE
--------------------------------------------------------
set define off;

  CREATE OR REPLACE PROCEDURE "HUBADMIN"."ENQUEUE_MESSAGE" 
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
  SYS.DBMS_OUTPUT.PUT_LINE(payload);
  message_properties.priority := 1;  -- give all messages same priority
  DBMS_AQ.ENQUEUE(
queue_name => 'HUBADMIN.KFMQUEUE',
enqueue_options => enqueue_options,
message_properties => message_properties,
payload => msg,
msgid => msg_id);
END enqueue_message;

/
