create or replace procedure enqueue_dashboard_message
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
  message_properties.priority := 1;
  DBMS_AQ.ENQUEUE(
queue_name => 'kfmqueue_dashboard',
enqueue_options => enqueue_options,
message_properties => message_properties,
payload => msg,
msgid => msg_id);
END enqueue_dashboard_message;

