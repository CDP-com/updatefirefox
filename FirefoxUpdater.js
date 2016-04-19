//
//Download Installer Through Our Service
//
function StartDownload(version, bit, lang)
{
    var clsid = "57FF5EAF-789B-4738-8D25-B4848CC41298";
    var progid = WshShell.RegRead("HKEY_CLASSES_ROOT\\CLSID\\{" + clsid + "}\\ProgID\\");
    var IDAXUpdater = new ActiveXObject( progid );
	
    var ManifestURL_Remote = "http://snapback-apps.com/updatefirefox/versions/firefox."+version+"."+lang+"."+bit+".xml";
    var ManifestURL_Local = "%ALLUSERSPROFILE%\\CDP\\SnapBack\\APPs\\updatefirefox\\versions\\firefox."+version+"."+lang+"."+bit+".xml";
    var ret = IDAXUpdater.RequestUpdate( ManifestURL_Remote, ManifestURL_Local);
}

//
//Compare Latest Version with Current Version
//
function CheckVersion()
{
    var InstVerTokens = InstallVersion.split(".");
    var CurVerTokens = CurrentVersion.split(".");
    var InstMajVer = InstVerTokens[0];
    var InstMinVer = InstVerTokens[1];
    var InstRelVer = InstVerTokens[2];
    var CurVerMajVer  = CurVerTokens[0];
    var CurVerMinVer  = CurVerTokens[1];
    var CurVerRelVer  = CurVerTokens[2];

    if (InstMajVer > CurVerMajVer) return  1;
    if (InstMajVer < CurVerMajVer) return -1;
    if (InstMinVer > CurVerMinVer) return  1;
    if (InstMinVer < CurVerMinVer) return -1;
    if (InstRelVer > CurVerRelVer) return  1;
    if (InstRelVer < CurVerRelVer) return -1;
    return 0;
}

//
//Install FireFox
//
function InstallFireFox()
{
	//var InstallExe = WshShell.RegRead(GFireFoxRoot +  "Versions" + "\\" + InstallVersion +"\\InstallerName");
    var InstallCmd = WshShell.ExpandEnvironmentStrings("%ALLUSERSPROFILE%\\cdp\\snapback\\install\\firefox\\") + InstallExe + " -ms";
	var ret = 0;

	////WScript.Echo (InstallCmd);
    ret = WshShell.run( InstallCmd, 0, true ); 
	//Investigate what firefox actually returns, valid installed were triggering "Install Failed"
	//if (!ret)
	//{
	    //WScript.Echo ("Install Failed....");
	//	return 0;
	//}

    ret = WshShell.RegWrite(GFireFoxRoot + "Versions" + "\\" + InstallVersion + "\\Installed", "true", "REG_SZ");
    ret = WshShell.RegWrite(GFireFoxRoot + "InstalledVersion", InstallVersion, "REG_SZ");
	var d = new Date();
	ret = WshShell.RegWrite(GFireFoxRoot + "Versions" + "\\" + InstallVersion + "\\InstalledDate", d, "REG_SZ");
	
	//FixFixFix Check "Am I up to date?" to do TurnOffUpdates.js/bat & CommunityChanges.js/bat
	
    return ret; 
    
}

//
//Chack Community Changes In Registry
//
function FxChkCommunityChanges()
{
    var FxCommunityChanges = WshShell.RegRead(GFireFoxRoot + "CommunityChanges");
	
    if (FxCommunityChanges.toUpperCase() == "FALSE")
	{
	    //WScript.Echo ("Nothing to do..");
        return 0; 
	}
	else
	{
	    var FxLatestCCVersion = WshShell.RegRead(GFireFoxRoot + "LatestCCVersion");
		var FxInstalledCCVersion = WshShell.RegRead(GFireFoxRoot + "InstalledCCVersion");
		
	    if (FxLatestCCVersion == FxInstalledCCVersion)
		{
			//WScript.Echo ("CC: Nothing to do..");
		    return 0; 
		}
		else 
		{
		    //WScript.Echo ("Call CommunityChanges.js..");
		    //Call CommunityChanges.js
			 //Update Registry
			 return 1;
		}
	}
} 

//
//Main Function for Updater
//
function main()
{
    var FxAutoUpdate = WshShell.RegRead(GFireFoxRoot + "AutoUpdate");
	var ChkVerRet = CheckVersion();

    if (FxAutoUpdate.toUpperCase() == "FALSE")  // need ignori case 
    {
        //WScript.Echo ("Auto Update is turned off....");
		return 0;
    }
	   
    if (ChkVerRet == 0)
	{
	    var FxDisableNativeUpdates = WshShell.RegRead(GFireFoxRoot + "DisableNativeUpdates");
		
		if (FxDisableNativeUpdates.toUpperCase() == "FALSE")
		{
		    return FxChkCommunityChanges();
		}
		else
		{
		    var FxUpdatesOff  = WshShell.RegRead(GFireFoxRoot + "Versions" + "\\" + InstallVersion + "\\UpdatesOff");
			
			if (FxUpdatesOff.toUpperCase() == "FALSE")
			{
			   //WScript.Echo ("Call TurnoffUpdate.js..");
			   //Turnoffautoupdate.js
			   //update registry
			   return 1;
			}
			else
			{
			    return FxChkCommunityChanges();
			}
		}
		
        return 0; 
	}
	else if (ChkVerRet == 1)
	{
	    var IsDownlaoded = WshShell.RegRead(GFireFoxRoot +  "Versions" + "\\" + InstallVersion +"\\Downloaded");
		
		if (IsDownlaoded.toUpperCase() == "FALSE")
		{
	        StartDownload(InstallVersion, CurOsType, CurLang);	
			//WScript.Echo ("Will Install Next time???");
			return 1;
		}
		else
		{
		    var FxAutoInstall = WshShell.RegRead(GFireFoxRoot + "AutoInstall");
			
			////WScript.Echo ("Will Install Next time???");
			if (FxAutoInstall.toUpperCase() == "FALSE")
			{
			    //WScript.Echo ("Auto Install is turned off. Please do manu install");
			    return 0; 
			}
			else
			{
   			    //WScript.Echo ("Newer Version."); 
                return InstallFireFox();
			}
		
		}
	}
	else
	{
	    //Support roll back in  the future.
	}
}   
   

var WshShell = new ActiveXObject("WScript.Shell");
var Fso = new ActiveXObject( "Scripting.FileSystemObject" );
var GFireFoxRoot = "HKEY_LOCAL_MACHINE\\SOFTWARE\\CDP\\SnapBack\\Apps\\updatefirefox\\";  
var InstallVersion = WshShell.RegRead(GFireFoxRoot + "LatestVersion");
var CurrentVersion = WshShell.RegRead(GFireFoxRoot + "InstalledVersion");
var OsArch = WshShell.ExpandEnvironmentStrings("%PROCESSOR_ARCHITECTURE%");
var CurLang   = WshShell.RegRead(GFireFoxRoot + "InstalledLang");
var CurOsType = WshShell.RegRead(GFireFoxRoot + "Installed32v64");
var InstLang   = CurLang;
var InstOsType = CurOsType;
var InstallExe = "firefox." + InstallVersion +"." + InstLang + "." + InstOsType + ".exe";


main();


