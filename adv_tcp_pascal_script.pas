//**********************************************************************************************
//* Version        : Script Version 0.1
//* Date           : 28th June 2017
//* Desc           : RogueID code added to detect non KFM RFID tags in vicinity of readers
//* Last update by : MSJ 28-Jun-17
//*                : committed to git repo
//**********************************************************************************************

var sIDNO:string = '';
    sTagID:string = '';
    sScannerId:string = '';
    sDataSourceName:string = '';
    i:integer;
    hx:string='';
begin

//SetVariable('TAGID', '3330474a3030303131');
//SetVariable('DATA_SOURCE_FULL_NAME', '172.29.1.118:5084');

//Get tagid from data source name
sDataSourceName := GetVariable('DATA_SOURCE_FULL_NAME');
sScannerId := StrBefore(':', sDataSourceName);

//Get tagid from data packet
sTagID := GetVariable('TAGID');

// For a valid varchar(9) IDNO from ERP via BarTender write to Gen2 EPC, the first character in tag is padded zero which is ignored
// The SATO CLN4X RFID writer needs to write 10 chars into EPC memory
i := 3;
while i <= length(sTagID) - 1 DO
    Begin
         hx := sTagID[i] + sTagID[i+1];
         sIDNO := sIDNO + StrToHex(hx);
          i := i + 2;
    end;
//ShowMessage(sIDNO);
//ShowMessage(sScannerId);

//IDNO if a valid KFM RFID tag will always come from BarTender written EPC as leading_zero+varchar(9)IDNO so we always
// expect array size of 20
if (StrLength(sTagID) <> 20) then
    sTagID := 'ROGUETAG';

//Set IDNO in data packet
if  StrLength(sIDNO) > 9 then
    sIDNO :=  'ROGUEID';


//Set SCANNER_ID in data packet
SetVariable('SCANNER_ID', sScannerId);
SetVariable('IDNO',sIDNO);
end.

