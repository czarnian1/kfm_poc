BEGIN DBMS_AQADM.CREATE_QUEUE(
     Queue_name          => 'KFMQUEUE_DASHBOARD',
     Queue_table         => 'KFMQUEUE_DASHBOARD_TAB',
     Queue_type          =>  0,
     Max_retries         =>  5,
     Retry_delay         =>  0,
     dependency_tracking =>  FALSE);
  END;

