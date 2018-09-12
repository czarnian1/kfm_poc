------------------------------------------------------------------------------------------------
--
-- 20Mar2018_Amd expect DATE in Oracle to be CET (DATE not TIMESTAMP or TIMESTAMP_WITH_LOCALTIME
--
------------------------------------------------------------------------------------------------
create or replace Function ConvertToUTC
   ( date_in IN date )
   RETURN date
IS
BEGIN
	
	RETURN(cast(date_in as timestamp) at time zone 'UTC');
END;