--------------------------------------------------------
--  DDL for Trigger UPDATE_PROD_MONITOR
--------------------------------------------------------

  CREATE OR REPLACE TRIGGER "HUBADMIN"."UPDATE_PROD_MONITOR" 
AFTER UPDATE OF PROD_STATUS ON "STDADMIN"."PROD_RESULT" 
FOR EACH ROW
DECLARE
    STATIONNO VARCHAR2(6 CHAR);   
    CURRENT_STATE_PM NUMBER(2,0);
    NEXT_STATE_RULE VARCHAR2(20 BYTE);
    EVENT_RAISEDDATECOLUMN VARCHAR2(50 BYTE);
    IDNO VARCHAR2(9 CHAR);
    RULECOUNT INT := 0;
    UPDATEDATE DATE := SYSDATE - 1/24;  /*event date UTC +1) */

BEGIN
	DBMS_OUTPUT.PUT_LINE('--------- Begin -------- ');
    IDNO := :NEW.ID_NO;
    STATIONNO :=  :NEW.STATION_NO;
  /*  UPDATEDATE := :NEW.ACTUAL_DATE; */
    
    IF (:NEW.PROD_STATUS ='2') THEN  
      DBMS_OUTPUT.PUT_LINE('  ID NO: ' || IDNO);
      DBMS_OUTPUT.PUT_LINE('  Station No: ' || STATIONNO);
      DBMS_OUTPUT.PUT_LINE('  Scan Date:  ' || UPDATEDATE);
     
      /* FSM_RULES will have Station no instead of Station Name */
    
      -- Get Current Location from PROD_MONITOR using ID_NO
    
      SELECT LOCATION_STATUS INTO CURRENT_STATE_PM FROM HUBADMIN.PROD_MONITOR WHERE ID_NO = IDNO; 
      DBMS_OUTPUT.PUT_LINE('  Current Location: ' || CURRENT_STATE_PM);
    
      -- Check if a rule exist for Current state and Station
      SELECT COUNT(*) INTO RULECOUNT  FROM HUBADMIN.PM_FSM_RULES  
      WHERE SCANNER_ID = STATIONNO  AND CURRENTSTATE = CURRENT_STATE_PM;
    
      DBMS_OUTPUT.PUT_LINE('  RULECOUNT: ' || RULECOUNT);
      
      IF RULECOUNT = 1 THEN
         -- Get Next state and date column to update in PROD_Monitor from PM_FSM_RULES table
          SELECT NEXTSTATE, EVENT_RAISED_DATECOLUMN INTO NEXT_STATE_RULE, EVENT_RAISEDDATECOLUMN FROM HUBADMIN.PM_FSM_RULES  
            WHERE SCANNER_ID = STATIONNO  AND CURRENTSTATE = CURRENT_STATE_PM;
            DBMS_OUTPUT.PUT_LINE('  Next Location: ' || NEXT_STATE_RULE);
            DBMS_OUTPUT.PUT_LINE('  Update Column: ' || EVENT_RAISEDDATECOLUMN);
      
      ELSIF  RULECOUNT = 0 THEN
            DBMS_OUTPUT.PUT_LINE('  *** ERROR - No Rules Found. ****');
            -- raise exception
      
      ELSIF  RULECOUNT > 1 THEN
          -- If there are multiple rules then get the first rule in ascending order
           SELECT NEXTSTATE, EVENT_RAISED_DATECOLUMN INTO NEXT_STATE_RULE, EVENT_RAISEDDATECOLUMN FROM (
                SELECT * FROM HUBADMIN.PM_FSM_RULES  
                WHERE SCANNER_ID = STATIONNO  AND CURRENTSTATE = CURRENT_STATE_PM
                ORDER BY RULENO ASC) 
            WHERE ROWNUM=1;
     END IF;
       
      CASE
         WHEN EVENT_RAISEDDATECOLUMN = 'CHASSIS_LINE_START_DATE' THEN 
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, CHASSIS_LINE_START_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO; 
          
         WHEN EVENT_RAISEDDATECOLUMN = 'CHASSIS_LINE_END_DATE'  THEN 
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, CHASSIS_LINE_END_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO; 
              DBMS_OUTPUT.PUT_LINE('  CHASSIS_LINE_END_DATE Updated ');
          WHEN EVENT_RAISEDDATECOLUMN = 'PAINT_LINE_START_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, PAINT_LINE_START_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;          
      
          WHEN EVENT_RAISEDDATECOLUMN = 'PAINT_LINE_END_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, PAINT_LINE_START_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;

          WHEN EVENT_RAISEDDATECOLUMN = 'TRACTOR_LINE_START_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, TRACTOR_LINE_START_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;

          WHEN EVENT_RAISEDDATECOLUMN = 'TRACTOR_LINE_END_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, TRACTOR_LINE_END_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;

          WHEN EVENT_RAISEDDATECOLUMN = 'REWORK_BEFORE_MQ_START_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, REWORK_BEFORE_MQ_START_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;              
 
          WHEN EVENT_RAISEDDATECOLUMN = 'REWORK_BEFORE_MQ_END_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, REWORK_BEFORE_MQ_START_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;    
          
          -- Update PROD_MONITOR for MQLINE from station 245311 barcode scan
          -- this will never trigger during ECU Initialisation DTC NG issues until fix in place
          -- and then rule will not allow new time stamp after a barcode scan
          WHEN EVENT_RAISEDDATECOLUMN = 'MQ_LINE_START_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, MQ_LINE_START_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;   
  
          WHEN EVENT_RAISEDDATECOLUMN = 'MQ_LINE_END_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, MQ_LINE_END_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;  

          WHEN EVENT_RAISEDDATECOLUMN = 'REWORK_AFTER_MQ_START_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, REWORK_AFTER_MQ_START_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO; 
 
          WHEN EVENT_RAISEDDATECOLUMN = 'REWORK_AFTER_MQ_END_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, REWORK_AFTER_MQ_END_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;    
          
          WHEN EVENT_RAISEDDATECOLUMN = 'PRODUCTION_END_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, PRODUCTION_END_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;  
              
          WHEN EVENT_RAISEDDATECOLUMN = 'INSPECTION_START_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, INSPECTION_START_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;   
              
          WHEN EVENT_RAISEDDATECOLUMN = 'INSPECTION_END_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, INSPECTION_END_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;   
 
           WHEN EVENT_RAISEDDATECOLUMN = 'REWORK_DUE_INSP_START_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, REWORK_DUR_INSP_START_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO; 
 
           WHEN EVENT_RAISEDDATECOLUMN = 'REWORK_DUE_INSP_END_DATE' THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, REWORK_DUR_INSP_END_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;       
   
          WHEN EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' AND CURRENT_STATE_PM = 11 and NEXT_STATE_RULE = 12 THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='O', 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;                  
     
          WHEN EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' AND CURRENT_STATE_PM = 12 AND NEXT_STATE_RULE = 13 THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='F', 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;   
              
          WHEN EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' AND CURRENT_STATE_PM=13 AND NEXT_STATE_RULE = 12 THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='O', 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;      
   
          WHEN EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' AND CURRENT_STATE_PM=12 AND NEXT_STATE_RULE = 11 THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='I', 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;      
     
          WHEN EVENT_RAISEDDATECOLUMN = 'SHIPPING_STATUS' AND NEXT_STATE_RULE = 15 THEN
              UPDATE HUBADMIN.PROD_MONITOR SET LOCATION_STATUS = NEXT_STATE_RULE, SHIPPING_STATUS='S', SHIPPING_DATE = UPDATEDATE, 
              UPDATE_DATE = UPDATEDATE, UPDATE_BY = STATIONNO
              WHERE ID_NO = IDNO;                    
      ELSE
        DBMS_OUTPUT.PUT_LINE('  ****ERROR - No columns matched ****');
        NULL;
      END CASE;
      
  END IF;
    DBMS_OUTPUT.PUT_LINE('--------- End -------- ');
    
EXCEPTION
WHEN PROGRAM_ERROR THEN
  DBMS_OUTPUT.PUT_LINE('  ****ERROR - Unexpected error occurred**** ');
WHEN NO_DATA_FOUND THEN
  DBMS_OUTPUT.PUT_LINE('  ****ERROR - No data found**** ');
END UPDATE_PROD_MONITOR;
/
ALTER TRIGGER "HUBADMIN"."UPDATE_PROD_MONITOR" ENABLE;