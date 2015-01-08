function onSuccess1(position) {
	//$.post( "http://162.220.167.131/test.php", { lat: position.coords.latitude, lot: position.coords.longitude } );
	//IMEI plugin code
	//window.plugins.imeiplugin.getImei(callback);
	//alert("on gps success");
	window.localStorage.setItem("langtitude", position.coords.latitude);
	window.localStorage.setItem("longtitude", position.coords.longitude);
	//langtitude = position.coords.latitude;
	//longtitude = position.coords.longitude;
	/*alert('Latitude: '          + position.coords.latitude          + '\n' +
		  'Longitude: '         + position.coords.longitude         + '\n' +
		  'Altitude: '          + position.coords.altitude          + '\n' +
		  'Accuracy: '          + position.coords.accuracy          + '\n' +
		  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
		  'Heading: '           + position.coords.heading           + '\n' +
		  'Speed: '             + position.coords.speed             + '\n' +
		  'Device ID: '         + device.uuid			            + '\n' +
		  'Timestamp: '         + position.timestamp                + '\n');*/
		  
	pushNotification = window.plugins.pushNotification;
		  
	//$("#app-status-ul").append('<li>registering ' + device.platform + '</li>');
	//alert(device.platform);
	
	if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" || device.platform == 'ANDROID'){
		//alert("Android machine");
		//navigator.geolocation.getCurrentPosition(onSuccess1, onError1);
		pushNotification.register(
		successHandler,//Fist call success handler then call ecb(onNotification)
		errorHandler,
		{
			"senderID":"759809028856",
			"ecb":"onNotification"
		});
	} else if ( device.platform == 'blackberry10'){
		pushNotification.register(
		successHandler,
		errorHandler,
		{
			invokeTargetId : "replace_with_invoke_target_id",
			appId: "replace_with_app_id",
			ppgUrl:"replace_with_ppg_url", //remove for BES pushes
			ecb: "pushNotificationHandler",
			simChangeCallback: replace_with_simChange_callback,
			pushTransportReadyCallback: replace_with_pushTransportReady_callback,
			launchApplicationOnPush: true
		});
	} else {
		pushNotification.register(
		tokenHandler,
		errorHandler,
		{
			"badge":"true",
			"sound":"true",
			"alert":"true",
			"ecb":"onNotificationAPN"
		});
	}			
}
	
	  
function onError1(error) {
		alert('code: '    + error.code    + '\n' +
			  'message: ' + error.message + '\n');
}	


function successHandler(result) {
	//alert('registered###' + result.uri+"test");
	//alert('registered###' + result );
	// send uri to your notification server
}
//push notificaation error handler
function errorHandler(error) {
	alert('error###' + error);
}

//Ecb handler
function onNotification(e) {
	$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

	switch( e.event )
	{
	case 'registered':
		if ( e.regid.length > 0 )
		{
			$("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
			window.localStorage.setItem("gcm_id", e.regid);
			// Your GCM push server needs to know the regID before it can push to this device
			// here is where you might want to send it the regID for later use.
			//navigator.geolocation.getCurrentPosition(onSuccess1, onError1, {timeout: 10000, enableHighAccuracy: true});
			
			//alert("regID = " + e.regid);
			//alert("   imei  -- >"+imei_no);
			//alert("   latitude  -- >"+langtitude);
			//alert("   longtitude  -- >"+longtitude);
			//alert("end testing")
			var langtitude=window.localStorage.getItem("langtitude");
			var longtitude=window.localStorage.getItem("longtitude");
			var gcm_id=window.localStorage.getItem("gcm_id");
			
			var device_info = 'Device Model: ' + device.model + 'Device Cordova: ' + device.cordova  + 'Device Platform: ' + device.platform + 'Device UUID: ' + device.uuid + 'Device Version: '  + device.version;
			
			//alert(device_info);
			//alert(langtitude);
			//alert(longtitude);
			//alert(gcm_id);
			//alert(web_url+"users/mob_user_reg.php");
			
			$.post( web_url+"users/mob_user_reg.php", { gcm_id: gcm_id, uuid: device.uuid,lat: langtitude, lon: longtitude, device_info: device_info} ).done(function( data ) {
				alert( "Data Loaded: " + data );
				$(':mobile-pagecontainer').pagecontainer('change', '#registration', {
					reload: false
				});
			});
		}
	break;

	case 'message':
		// if this flag is set, this notification happened while we were in the foreground.
		// you might want to play a sound to get the user's attention, throw up a dialog, etc.
		if ( e.foreground )
		{
			$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

			// on Android soundname is outside the payload.
			// On Amazon FireOS all custom attributes are contained within payload
			var soundfile = e.soundname || e.payload.sound;
			// if the notification contains a soundname, play it.
			var my_media = new Media("/android_asset/www/"+ soundfile);
			my_media.play();
		}
		else
		{  // otherwise we were launched because the user touched a notification in the notification tray.
			if ( e.coldstart )
			{
				$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
			}
			else
			{
				$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
			}
		}

	   $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
		   //Only works for GCM
	   $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
	   //Only works on Amazon Fire OS
	   $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
	break;

	case 'error':
		$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
	break;

	default:
		$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
	break;
	}
}
