//
// Set InstalledVersion value in registry
//
function SetFirefoxVerRegVal(Ver, ProcArch, Lang)
{
    var FireFoxRoot = "HKEY_LOCAL_MACHINE\\SOFTWARE\\CDP\\SnapBack\\Apps\\updatefirefox\\";  
    var ret = 0;
	
    ret = WshShell.RegWrite(FireFoxRoot + "InstalledVersion", Ver, "REG_SZ");  
	ret = WshShell.RegWrite(FireFoxRoot + "Installed32v64", ProcArch, "REG_SZ");
	ret = WshShell.RegWrite(FireFoxRoot + "InstalledLang", Lang, "REG_SZ");

	return ret;
}


var WshShell = new ActiveXObject("WScript.Shell");
var Fso = new ActiveXObject( "Scripting.FileSystemObject" );

//
// Main function to get current installed Firefox Version, Os Thpe and language Pack.
//
function main()
{
    var OsArch = WshShell.ExpandEnvironmentStrings("%PROCESSOR_ARCHITECTURE%");
	var FireFoxCurVersion = "";

	try
    {
        FireFoxCurVersion = WshShell.RegRead("HKEY_LOCAL_MACHINE\\SOFTWARE\\Mozilla\\Mozilla Firefox\\CurrentVersion");
    }
    catch ( e )
    {
	    //Not installed
		//UI should read above key too to see if it's not installed, if it's not installed ask if they want to install:
		//	if they say no, don't call this script at all
		//	If they say yes, then it will hit these writes, and should call FirefoxUpdater.js?
		var FireFoxRoot = "HKEY_LOCAL_MACHINE\\SOFTWARE\\CDP\\SnapBack\\Apps\\updatefirefox\\";  
		WshShell.RegWrite(FireFoxRoot + "AutoUpdate", "true", "REG_SZ");  
		WshShell.RegWrite(FireFoxRoot + "AutoInstall", "true", "REG_SZ");  
		return 0;
    }   

	if (FireFoxCurVersion) 
	{
		
		var CurVerTokens = FireFoxCurVersion.split(" ");		
		var CurInstVer  = CurVerTokens[0];
        var CurInstOsArch  = CurVerTokens[1].substr(1);
		//We only support English right now
        //var CurInstlLang  = CurVerTokens[2].substr(0, CurVerTokens[2].length-1);
		var CurInstlLang  = "en-US";
		
		if (CurInstOsArch == "x86")
		{
            SetFirefoxVerRegVal(CurInstVer, "32", CurInstlLang)
		}
		else
		{
		    SetFirefoxVerRegVal(CurInstVer, "64", CurInstlLang)
		}
	}
	else
	{
	    WScript.Echo("Can not read the registry...");		
		return 0;
	}
}

main();
