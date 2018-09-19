create or replace TRIGGER HUBADMIN.PM_DASHBOARD_QUEUE_TRIG
 AFTER INSERT OR UPDATE OR DELETE ON PM_DASHBOARD
FOR EACH ROW
DECLARE
json VARCHAR2(4000);
BEGIN
execute immediate 'alter session set NLS_DATE_FORMAT=''yyyy-mm-dd"T"hh24:mi:ss''';
IF INSERTING OR UPDATING THEN
json := '{"PROD_TARGET":' || :new.PROD_TARGET;
json := json|| ',"BF_TARGET":' || :new.BF_TARGET;
json := json|| ',"SHIP_TARGET":' || :new.SHIP_TARGET;
json := json|| ',"MQ_TARGET":' || :new.MQ_TARGET;
json := json|| ',"TA_TARGET":' || :new.TA_TARGET;
json := json|| ',"ID":' || :new.ID;
json := json|| ',"dml_type":"' || CASE WHEN INSERTING THEN 'I' ELSE 'U' END || '"}';
ELSE
json := '{"ID":' || :old.ID || ',"dml_type":"D"}';
END IF;
enqueue_dashboard_message(json);
END;
/


