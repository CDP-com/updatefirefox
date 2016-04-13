// JavaScript Document displaymessage.js


var wsh = new ActiveXObject("WScript.Shell");
wsh.popup( "This button will execute a Firefox related script!", 5, "Update Firefox Message 1" );

wsh = null;
