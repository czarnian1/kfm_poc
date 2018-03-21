--------------------------------------------------------
--  DDL for Table PM_FSM_RULES
--------------------------------------------------------

  CREATE TABLE "HUBADMIN"."PM_FSM_RULES" 
   (	"RULENO" NUMBER(*,0), 
	"CURRENTSTATE" NUMBER(2,0), 
	"NEXTSTATE" VARCHAR2(20 BYTE), 
	"SCANNER_ID" VARCHAR2(20 BYTE), 
	"EVENT_RAISED_DATECOLUMN" VARCHAR2(50 BYTE), 
	"RULE_COMMENT" VARCHAR2(2001 BYTE)
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "KBTDBDAT" ;