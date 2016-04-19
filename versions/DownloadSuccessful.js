//This file gets run every time CDPUpdater brings down a new version
//Only need to modify 1 thing for a new version
//		lVersion
//		lVersion is the newest version number



function fnWriteReg(regkey, regvalue, regtype)
{
   var success = true;
   try
   {
      var WshShell = new ActiveXObject("WScript.Shell");
      regvalue = WshShell.ExpandEnvironmentStrings(regvalue);
      WshShell.RegWrite(regkey, regvalue, regtype);
   }
   catch (fWR)
   {
      success = false;
      WScript.Echo(fWR.message);
   }
   finally
   {
      WshShell = null;
   }
   
   return success;
}


function fnNewVersion()
{											
	var lVersion = "45.0.1";
	
	fnWriteReg("HKLM\\SOFTWARE\\CDP\\SnapBack\\Apps\\updatefirefox\\Versions\\"+lVersion+"\\Downloaded","true", "REG_SZ");
	var d = new Date();
	fnWriteReg("HKLM\\SOFTWARE\\CDP\\SnapBack\\Apps\\updatefirefox\\Versions\\"+lVersion+"\\DownloadedDate",d.toUTCString(), "REG_SZ");
}
	
fnNewVersion();
	

	
