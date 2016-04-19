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
	
	//These next 2 lines are only because the app hasn't been setup yet in deploy/install
	fnWriteReg("HKLM\\SOFTWARE\\CDP\\SnapBack\\Apps\\updatefirefox\\", "0", "REG_SZ");
	fnWriteReg("HKLM\\SOFTWARE\\CDP\\SnapBack\\Apps\\updatefirefox\\LatestVersion", lVersion, "REG_SZ");
	
	//Version Key
	fnWriteReg("HKLM\\SOFTWARE\\CDP\\SnapBack\\Apps\\updatefirefox\\Versions\\"+lVersion+"\\", "0", "REG_SZ");
	//Version Defaults
	fnWriteReg("HKLM\\SOFTWARE\\CDP\\SnapBack\\Apps\\updatefirefox\\Versions\\"+lVersion+"\\Downloaded","false", "REG_SZ");
	fnWriteReg("HKLM\\SOFTWARE\\CDP\\SnapBack\\Apps\\updatefirefox\\Versions\\"+lVersion+"\\DownloadedDate","null", "REG_SZ");
	fnWriteReg("HKLM\\SOFTWARE\\CDP\\SnapBack\\Apps\\updatefirefox\\Versions\\"+lVersion+"\\Installed","false", "REG_SZ");
	fnWriteReg("HKLM\\SOFTWARE\\CDP\\SnapBack\\Apps\\updatefirefox\\Versions\\"+lVersion+"\\InstalledDate","null", "REG_SZ");
	fnWriteReg("HKLM\\SOFTWARE\\CDP\\SnapBack\\Apps\\updatefirefox\\Versions\\"+lVersion+"\\UpdatesOff","false", "REG_SZ");
}
	
fnNewVersion();
	

	
