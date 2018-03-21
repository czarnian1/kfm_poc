--------------------------------------------------------
--  DDL for Table PROD_MONITOR
--------------------------------------------------------

  CREATE TABLE "HUBADMIN"."PROD_MONITOR" 
   (	"ID_NO" NCHAR(9), 
	"CREATE_DATE" DATE, 
	"CREATE_BY" NCHAR(10), 
	"UPDATE_DATE" DATE, 
	"UPDATE_BY" NCHAR(10), 
	"MONTHLY_SEQ" NCHAR(11), 
	"MODEL_CODE" NCHAR(10), 
	"REMARKS" NVARCHAR2(10), 
	"PLAN_PROD_FINISH_DATE" DATE, 
	"LOCATION_STATUS" NUMBER(2,0), 
	"PARTS_PREPARATION_STATUS" NCHAR(1), 
	"CHASSIS_LINE_START_DATE" DATE, 
	"CHASSIS_LINE_END_DATE" DATE, 
	"PAINT_LINE_START_DATE" DATE, 
	"PAINT_LINE_END_DATE" DATE, 
	"TRACTOR_LINE_START_DATE" DATE, 
	"TRACTOR_LINE_END_DATE" DATE, 
	"REWORK_BEFORE_MQ_START_DATE" DATE, 
	"REWORK_BEFORE_MQ_END_DATE" DATE, 
	"MQ_LINE_START_DATE" DATE, 
	"MQ_LINE_END_DATE" DATE, 
	"REWORK_AFTER_MQ_START_DATE" DATE, 
	"REWORK_AFTER_MQ_END_DATE" DATE, 
	"PRODUCTION_END_DATE" DATE, 
	"INSPECTION_START_DATE" DATE, 
	"INSPECTION_END_DATE" DATE, 
	"REWORK_DUR_INSP_START_DATE" DATE, 
	"REWORK_DUR_INSP_END_DATE" DATE, 
	"SHIPPING_STATUS" NCHAR(1), 
	"SHIPPING_DATE" DATE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "KBTDBIDX" ;