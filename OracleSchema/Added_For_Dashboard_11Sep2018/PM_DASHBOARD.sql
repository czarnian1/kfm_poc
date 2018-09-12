  CREATE TABLE "PM_DASHBOARD" 
   (	"PROD_TARGET" NUMBER(22,0) NOT NULL ENABLE, 
	"BF_TARGET" NUMBER(22,0) NOT NULL ENABLE, 
	"SHIP_TARGET" NUMBER(22,0) NOT NULL ENABLE, 
	"MQ_TARGET" NUMBER(22,0) NOT NULL ENABLE, 
	"TA_TARGET" NUMBER(22,0) NOT NULL ENABLE, 
	"ID" NUMBER(22,0) NOT NULL ENABLE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "SYSTEM" ;
