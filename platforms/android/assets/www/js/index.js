/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    
    app_loaded: false,
    testing_on_desktop: true,
 
    init: function () {
		//alert("[init]"+document.URL.indexOf("http://"));
 
		if (document.URL.indexOf("http://") === -1) {
			app.testing_on_desktop = false;
		}
	 
		jQuery(document).ready(function () {
			console.log("jQuery finished loading");
			
			var deviceReadyDeferred = jQuery.Deferred();
			var jqmReadyDeferred    = jQuery.Deferred();
			//alert(app.testing_on_desktop);
			if (app.testing_on_desktop) {
				console.log("PhoneGap finished loading"+app.testing_on_desktop);
				_onDeviceReady();
				deviceReadyDeferred.resolve();
			} else {
				//alert("in");
				document.addEventListener('deviceready', function () {
					console.log("PhoneGap finished loading asdasdasd");
					//alert("in device ready");
					_onDeviceReady();
					deviceReadyDeferred.resolve();
				}, false);
			}
	 
			jQuery(document).one("pageinit", function () {
				console.log("jQuery.Mobile finished loading");				
				jqmReadyDeferred.resolve();
			});
	 
			jQuery.when(deviceReadyDeferred, jqmReadyDeferred).then(function () {
				console.log("PhoneGap & jQuery.Mobile finished loading");
				navigator.geolocation.getCurrentPosition(onSuccess1, onError1);
				
				/*if (navigator.notification) { // Override default HTML alert with native dialog
				  window.alert = function (message) {
					  navigator.notification.alert(
						  "jQuery.when both framework loads",    // message
						  null,       // callback
						  "Workshop", // title
						  'OK'        // buttonName
					  );
				  };
				}*/
				initPages();
				console.log("App finished loading");
				app.app_loaded = true;
			});			
		});
	 
		function _onDeviceReady () {
			//PGproxy.navigator.splashscreen.hide();			
			console.log("[onDeviceReady] calling phonegap api functions");
		};
		function initPages () {
			//alert("[initPages]");
			jQuery(document).bind("pageinit", _initPages);
			 
			function _initPages () {
				//alert("calling pageinit");
			};
		};
    },
 
    utilities: {
    },
    
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

// emulate PhoneGap for testing on Chrome
var PGproxy = {
    "navigator": {
        "connection": function () {
            if (navigator.connection) {
                return navigator.connection;
            } else {
                console.log('navigator.connection');
                return {
                    "type":"WIFI" // Avoids errors on Chrome
                };
            }
        },
        "notification": {
            "vibrate": function (a) {
                if (navigator.notification && navigator.notification.vibrate) {
                    navigator.notification.vibrate(a);
                } else {
                    console.log("navigator.notification.vibrate");
                }
            },
            "alert": function (a, b, c, d) {
                if (navigator.notification && navigator.notification.alert) {
                    navigator.notification.alert(a, b, c, d);
                } else {
                    console.log("navigator.notification.alert");
                    alert(a);
                }
            }
        },
        "splashscreen": {
            "hide": function () {				
                if (navigator.splashscreen) {
                    navigator.splashscreen.hide();
                    //console.log('show navigator.splashscreen.hide');
                } else {
                    console.log('navigator.splashscreen.hide');
                }
            }
        }
    }
};
