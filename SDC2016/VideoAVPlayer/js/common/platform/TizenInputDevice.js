var TizenInputDevice = {
	api: null,
	keyCode : {
		'Left': 37,
		'Right': 39,
		'Up': 38,
		'Down': 40,
		'Enter': 13,
		'Return': 10009
	}
};

TizenInputDevice.registerMediaKeys = function(){
	var registerKeyNames = [
	                        "0",
	                        "1",
	                        "2",
	                        "3",
	                        "3D",
	                        "4",
	                        "5",
	                        "6",
	                        "7",
	                        "8",
	                        "9",
	                        "ChannelDown",
	                        "ChannelList",
	                        "ChannelUp",
	                        "ColorF0Red",
	                        "ColorF1Green",
	                        "ColorF2Yellow",
	                        "ColorF3Blue",
	                        "Exit",
	                        "Info",
	                        "MediaFastForward",
	                        "MediaPause",
	                        "MediaPlay",
	                        "MediaRecord",
	                        "MediaRewind",
	                        "MediaStop",
	                        "MediaPlayPause",
	                        "Minus",
	                        "PreviousChannel",
	                        "Search",
	                        "Teletext",
	                        "Tools"
	                    ];
	registerKeyNames.forEach(function (name) {
        tizen.tvinputdevice.registerKey(name);
    })
};

TizenInputDevice.initialize = function () {
	this.api = (window.tizen && window.tizen.tvinputdevice) || {};
	this.getSupportedKeys();
	var keySet = [
	    'MediaPlayPause'
	];
	this.registerKeys(keySet);
};
TizenInputDevice.unregisterVolumeKey = function () 
{
	 tizen.tvinputdevice.unregisterKey('VolumeUp');
	tizen.tvinputdevice.unregisterKey('VolumeDown');
	tizen.tvinputdevice.unregisterKey('VolumeMute');
};
TizenInputDevice.getKeyCode = function (key) {
	return this.api.getKey(key).code;
};

TizenInputDevice.registerKeys = function (keySet) {
	for (var i = 0; i < keySet.length; i++) {
		this.api.registerKey(keySet[i]);
	}
};

TizenInputDevice.getSupportedKeys = function () {
	var supportedKeys = this.api.getSupportedKeys();
	for (var i = 0; i < supportedKeys.length; i++) {
	    this.keyCode[supportedKeys[i].name] = supportedKeys[i].code;
	}
};