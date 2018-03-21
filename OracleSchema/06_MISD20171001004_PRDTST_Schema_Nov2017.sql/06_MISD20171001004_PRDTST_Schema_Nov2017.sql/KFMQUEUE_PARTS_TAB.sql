--------------------------------------------------------
--  DDL for Queue Table KFMQUEUE_PARTS_TAB
--------------------------------------------------------

   BEGIN DBMS_AQADM.CREATE_QUEUE_TABLE(
     Queue_table        => '"HUBADMIN"."KFMQUEUE_PARTS_TAB"',
     Queue_payload_type => 'HUBADMIN.MESSAGE_T',
     storage_clause     => 'PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 TABLESPACE KBTDBDAT',
     Sort_list          => 'ENQ_TIME',
     Compatible         => '10.0.0');
  END;
/
