create or replace procedure HUBADMIN.dequeue_dashboard_message
(
  payload out varchar2
) as
msg message_t := message_t(NULL);
  msg_id RAW(16);
  dequeue_options DBMS_AQ.DEQUEUE_OPTIONS_T;
  message_properties DBMS_AQ.MESSAGE_PROPERTIES_T;
BEGIN
  DBMS_AQ.DEQUEUE(
queue_name => 'HUBADMIN.kfmqueue_dashboard',
dequeue_options => dequeue_options,
message_properties => message_properties,
payload => msg,
msgid => msg_id
  );
  payload := msg.json;
END dequeue_dashboard_message;
/

