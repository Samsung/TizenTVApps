var TizenAVPlayer = {
	api : null,
	container : null,
	duration: 0
};

/*
@ method: TizenAVPlayer.initialize
@ description: This function captures the object of av player
@ param: none
@ return: none
*/
TizenAVPlayer.initialize = function () {
	this.api = (window.tizen && window.webapis.avplay) || {};
	this.container = document.getElementById("av-player");
};

/*
@ method: TizenAVPlayer.initialize
@ description: This function opens the target URL and sets the listener 
@ param: url
@ return: none
*/
TizenAVPlayer.openVideo = function (url) {
	try {
		// open API gets target URL. URL validation is done in prepare API.
		this.api.open(url);
		// setListener should be done before prepare API. Do setListener after open immediately.
		this.api.setListener(this.listenerCallback);	
		//this.api.setTimeoutForBuffering(10000);
	}
	catch (e) {
		console.log("Exception: " + e.name);
	}
};

/*
@ method: TizenAVPlayer.initialize
@ description: This function prepares the video so that the source element is created
@ param: none
@ return: none
*/
TizenAVPlayer.prepareVideoSync = function () {
	try { 
		this.api.prepare();	
		this.api.setDisplayRect(this.container.parentElement.offsetLeft, this.container.parentElement.offsetTop, this.container.offsetWidth, this.container.offsetHeight);
	}
	catch (e) {
		console.log(e);
	}
};

TizenAVPlayer.prepareVideoAsync = function () {
	try { 
		this.api.prepareAsync(function () {	
			this.api.setDisplayRect(this.container.offsetLeft, this.container.offsetTop, this.container.offsetWidth, this.container.offsetHeight);
		}.bind(this), function (e){
			console.log(e);			
		});	
	}
	catch (e) {
		console.log(e);
	}
};

/*
@ method: TizenAVPlayer.initialize
@ description: This function returns the time in the format of hh:mm:ss
@ param: seconds
@ return: time
*/
TizenAVPlayer.formatTime = function (seconds) {
			
	var hh = Math.floor(seconds / 3600),
		    mm = Math.floor(seconds / 60) % 60,
	    ss = Math.floor(seconds) % 60;
	  
	return (hh ? (hh < 10 ? "0" : "") + hh + ":" : "") + 
		   ((mm < 10) ? "0" : "") + mm + ":" + 
		   ((ss < 10) ? "0" : "") + ss;			
};

/*
@ method: TizenAVPlayer.initialize
@ description: This function performs the functions related to video such as play, pause, rewind, forward
@ param: action, arg
@ return: none
*/
TizenAVPlayer.executeAction = function (action, arg) {
	try {	
		switch (action) {
		case 'play':
			if(this.api.getState() == "IDLE"){
				this.api.prepare();
			}				
			this.api.play();
			break;
		case 'pause':
			this.api.pause();
			break;
		case 'stop':
			$('.playPause').removeClass('pause');
			TizenAVPlayer.executeAction('pause');			 
			this.api.stop();
			break;
		case 'jump-forward':
			if (typeof arg.time != 'undefined') this.api.jumpForward(5000);
			break;
		case 'jump-backward':
			
			if (typeof arg.time != 'undefined') this.api.jumpBackward(5000);
			break;
		case 'change-size':
			if (typeof arg.left != 'undefined') this.container.parentElement.style.left = arg.left+"px";
			if (typeof arg.top != 'undefined') this.container.parentElement.style.top = arg.top+"px";
			if (typeof arg.width != 'undefined') this.container.style.width = arg.width+"px";
			if (typeof arg.height != 'undefined') this.container.style.height = arg.height+"px";
			if (typeof arg.delay == 'undefined') arg.delay = 0;	
			window.setTimeout(function () {
				this.api.setDisplayRect(arg.left, arg.top, arg.width, arg.height);
			}.bind(this), arg.delay);		
			break;
		case 'get-state':
			return this.api.getState();
			break;
		case 'get-duration':
			console.log("get-duration");
			return this.api.getDuration();
			break;
		case 'get-current-time':
			console.log("get-current-time");
			return this.api.getCurrentTime();
			break;
		default:
			break;
		}
	}
	catch (e) {
		console.log(e);
	}
};

TizenAVPlayer.listenerCallback = {
	onbufferingstart : function() {
		
	},
	onbufferingprogress : function(percent) {
		
	},
	onbufferingcomplete : function() {
		totalTime = webapis.avplay.getDuration();
		TizenAVPlayer.duration = webapis.avplay.getDuration();
	},
	oncurrentplaytime : function(currentTime) {	

		 var duration =  webapis.avplay.getDuration();				
		    if (duration > 0) {			    	
		    	var percent = ((currentTime / duration)*100);		    	
		    	document.getElementById('progress-amount').style.width = percent + "%";
		    	document.getElementById("current-time").innerHTML = "Playing: "+TizenAVPlayer.formatTime(currentTime/1000);
		    }
	},
	onevent : function(eventType, eventData) {
		
	},
	onerror : function(eventType) {
		
	},
	onsubtitlechange : function(duration, text, data3, data4) {
		
	},
	ondrmevent : function(drmEvent, drmData) {
	},
	onstreamcompleted : function() {
		$('.playPause').removeClass('pause');
		TizenAVPlayer.executeAction('pause');		 
		webapis.avplay.stop();// For Tizen
		if(webapis.avplay.getState() == "IDLE"){
			webapis.avplay.prepare();
		}				
		$('.playPause').addClass('pause');
		webapis.avplay.play();
		Main.stopVideo();
	}
};