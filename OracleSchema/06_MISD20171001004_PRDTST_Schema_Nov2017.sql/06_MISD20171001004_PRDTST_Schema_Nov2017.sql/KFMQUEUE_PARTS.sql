--------------------------------------------------------
--  DDL for Queue KFMQUEUE_PARTS
--------------------------------------------------------

   BEGIN DBMS_AQADM.CREATE_QUEUE(
     Queue_name          => 'HUBADMIN.KFMQUEUE_PARTS',
     Queue_table         => 'HUBADMIN.KFMQUEUE_PARTS_TAB',
     Queue_type          =>  0,
     Max_retries         =>  5,
     Retry_delay         =>  0,
     dependency_tracking =>  FALSE);
  END;
/
