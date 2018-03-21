--------------------------------------------------------
--  DDL for Queue KFMQUEUE
--------------------------------------------------------

   BEGIN DBMS_AQADM.CREATE_QUEUE(
     Queue_name          => 'HUBADMIN.KFMQUEUE',
     Queue_table         => 'HUBADMIN.KFMQUEUE_TAB',
     Queue_type          =>  0,
     Max_retries         =>  5,
     Retry_delay         =>  0,
     dependency_tracking =>  FALSE);
  END;
/
