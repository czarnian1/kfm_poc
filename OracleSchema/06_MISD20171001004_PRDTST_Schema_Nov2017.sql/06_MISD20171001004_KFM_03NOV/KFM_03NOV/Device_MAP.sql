--------------------------------------------------------
--  File created - Friday-November-03-2017   
--------------------------------------------------------
REM INSERTING into PM_DEVICE_MAP
SET DEFINE OFF;
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmcasio1','172.20.83.110','SCANNER type 2 (handheld Casio Scanner)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmcasio2',null,'SCANNER type 2 (handheld Casio Scanner)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmcasio3',null,'SCANNER type 2 (handheld Casio Scanner)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('pokayokeb1','192.168.1.1','MS_STATION.STATION_NO  = SCANNER_ID for lookup in PM_FSM_RULES e.g 250311');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('pokayokeb2','192.168.1.2','MS_STATION.STATION_NO  = SCANNER_ID for lookup in PM_FSM_RULES e.g 250311');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('pokayokeb3','192.168.1.3','MS_STATION.STATION_NO  = SCANNER_ID for lookup in PM_FSM_RULES e.g 250311');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('pokayokeb4','192.168.1.4','MS_STATION.STATION_NO  = SCANNER_ID for lookup in PM_FSM_RULES e.g 250311');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfidc1','172.20.80.80','SCANNER type 2 (handheld) INSPECTION START (default 172.20.80.80)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfidc2','172.20.80.81','SCANNER type 2 (handheld) REWORK AFTER MQ START (default .81)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfidc3','172.20.80.82','SCANNER type 2 (handheld) REWORK DURING MQ START (default .82)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfidc4','172.20.80.83','SCANNER type 2 (handheld) REWORK BEFORE MQ START (default .83)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida1','172.20.83.110','SCANNER type 1 static fixed reader PAINT START (default kfmrfida1 .83.110)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida2','172.20.83.120','SCANNER type 1 static fixed reader PAINT END (default kfmrfida2 .111)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida3','172.20.83.111','SCANNER type 1 static fixed reader TRACTOR START (default kfmrfida3 . 112)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida4','172.20.83.113','SCANNER type 1 static fixed reader RFS TO OUTSIDE (default kfmrfid4 .113)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida5','172.20.83.114','SCANNER type 1 static fixed reader FUTURE TO OUTSIDE (default kfmrfida5 .114)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida6','172.20.83.115','SCANNER type 1 static fixed reader OUTSIDE TO SHIPPED (default kfmrfida6 .115)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida7','172.20.83.116','SCANNER type 1 static fixed reader OUTSIDE TO SHIPPED (default kfmrfida7 .116)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida8','172.20.83.117','SCANNER type 1 static fixed reader RFS TO OUTSIDE (default kfmrfidxx .11x)');
Insert into PM_DEVICE_MAP (SCANNER_ID,SCANNER_IP,SCANNER_COMMENT) values ('kfmrfida9','172.20.83.118','SCANNER type 1 static fixed reader OUTSIDE TO FUTURE');
