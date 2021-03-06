--------------------------------------------------------
--  DDL for Table PROD_MONITOR_COMMENT
--------------------------------------------------------

  CREATE TABLE "HUBADMIN"."PROD_MONITOR_COMMENT" 
   (	"ID_NO" NCHAR(9), 
	"SEQ_NO" NUMBER(2,0), 
	"CREATE_DATE" DATE, 
	"CREATE_BY" NCHAR(10), 
	"UPDATE_DATE" DATE, 
	"UPDATE_BY" NCHAR(10), 
	"USER_COMMENT" NVARCHAR2(50)
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 3145728 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "KBTDBDAT" ;
