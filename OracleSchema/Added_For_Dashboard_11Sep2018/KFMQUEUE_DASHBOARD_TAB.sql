BEGIN DBMS_AQADM.CREATE_QUEUE_TABLE(
     Queue_table        => 'HUBADMIN.KFMQUEUE_DASHBOARD_TAB',
     Queue_payload_type => 'MESSAGE_T',
     Sort_list          => 'ENQ_TIME'
     );
  END;
/


