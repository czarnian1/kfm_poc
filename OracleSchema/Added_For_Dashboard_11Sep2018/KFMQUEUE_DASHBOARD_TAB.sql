BEGIN DBMS_AQADM.CREATE_QUEUE_TABLE(
     Queue_table        => '"KFMQUEUE_DASHBOARD_TAB"',
     Queue_payload_type => 'MESSAGE_T',
     storage_clause     => 'PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 TABLESPACE SYSTEM',
     Sort_list          => 'ENQ_TIME',
     Compatible         => '8.1.3');
  END;

