
var Main = {};

//called when application was loaded
Main.onLoad = function () {
	console.log("Main.onLoad()");
	
	//enabling media keys
	Main.enableMediaKeys();
	
	// setup handler to key events
	Main.handleKeyDownEvents();
	
	// setup video player
	Player.init("player");
	Player.prepare("http://yourvideourl.mp4"); // <-- set video URL here!
}

// called when application has closed
Main.onUnload = function () {
	console.log("Main.onUnload()");
}

// enabling media keys
Main.enableMediaKeys = function () {	
	console.log("Main.enableMediaKeys()");
	
	tizen.tvinputdevice.registerKey("MediaPlayPause");
	tizen.tvinputdevice.registerKey("MediaPlay");
	tizen.tvinputdevice.registerKey("MediaStop");
	tizen.tvinputdevice.registerKey("MediaPause");
	tizen.tvinputdevice.registerKey("MediaRewind");
	tizen.tvinputdevice.registerKey("MediaFastForward");	
}

// handle all keydown events triggered through remote control.
Main.handleKeyDownEvents = function () {

	// add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	    	
    	switch(e.keyCode){
    	case tvKey.LEFT: //LEFT arrow
        	console.log("LEFT");
    		break;
    	case tvKey.UP: //UP arrow
    		console.log("UP");
    		break;
    	case tvKey.RIGHT: //RIGHT arrow
    		console.log("RIGHT");
    		break;
    	case tvKey.DOWN: //DOWN arrow
    		console.log("DOWN");
    		break;
    	case tvKey.ENTER: //OK button
    		console.log("OK");
    		Player.setDisplayArea(0, 0, 1920, 1080);
    		break;
    	case tvKey.RETURN: //RETURN button
    		console.log("RETURN");
    		Player.setDisplayArea(0, 0, 960, 540);
    		break;
    	case tvKey.PLAYPAUSE: // PLAYPAUSE button
    		console.log("PLAYPAUSE");
    		if (Player.state == Player.STATES.PLAYING) {
    			Player.pause();
    		} else {
    			Player.play();
    		}    		
    		break;
    	case tvKey.PLAY: // PLAY button
    		console.log("PLAY");
    		Player.play();
    		break;
    	case tvKey.PAUSE: // PAUSE button
    		console.log("PAUSE");
    		Player.pause();
    		break;
    	default:
    		console.log("Key code : " + e.keyCode);
    		break;
    	}
    });
}

// binding some events
window.onload = Main.onLoad;
window.onunload = Main.onUnload;

/*********************************************** Player *************************************************/

(function(){
	
	var Player = {
		videoElem: null,	// tag video
		STATES: {
	        STOPPED: 0,
	        PLAYING: 1,
	        PAUSED: 2, 
	        PREPARED: 4
	    },
	    state: 0			// initial state: STOPPED
	};
	
	// Initialize player
	Player.init = function (id) {
		
		console.log("Player.init("+id+")");
		
		this.state = this.STATES.STOPPED;
		
		if (!this.videoElem && id) {
			this.videoElem = document.getElementById(id);
		}
		
		Player.setupEventListeners();
	}
	
	// Load video.
	Player.prepare = function (url) {
		
		console.log("Player.prepare("+url+")");		
		
		if (this.state > this.STATES.STOPPED) {
			return;
		}
		
		if (!this.videoElem) {
			return 0;
		}
		
		this.videoElem.src = url;
		this.videoElem.load();		
	}
	
	// Play video
	Player.play = function (url) {
		
		console.log("Player.play("+url+")");
		
		if (this.state < this.STATES.PAUSED) {
			return;
		}
		
		this.state = this.STATES.PLAYING;
		
		if (url) {
			this.videoElem.src = url;
		}
		
		this.videoElem.play();		
	}
	
	// Pause video
	Player.pause = function () {
		
		console.log("Player.pause()");
		
		if (this.state != this.STATES.PLAYING) {
			return;
		}
		
		this.state = this.STATES.PAUSED;
		
		this.videoElem.pause();
		
	}
	
	// Stop video
	Player.stop = function () {
		
		console.log("Player.stop()");
		
		this.state = this.STATES.STOPPED;
		
		if (this.videoElem.readyState > 0) {
			this.videoElem.src = "";
		}
	}
	
	// Set position and dimension of video area 
	Player.setDisplayArea = function (x, y, width, height) {
		
		if (!this.videoElem) {
			return 0;
		}
		
		this.videoElem.style.top = x + "px";
		this.videoElem.style.top = y + "px";
		this.videoElem.style.width = width + "px";
		this.videoElem.style.height = height + "px";
	}
	
	// format time in seconds to hh:mm:ss
	Player.formatTime = function (seconds) {
				
		var hh = Math.floor(seconds / 3600),
   		    mm = Math.floor(seconds / 60) % 60,
		    ss = Math.floor(seconds) % 60;
		  
		return (hh ? (hh < 10 ? "0" : "") + hh + ":" : "") + 
			   ((mm < 10) ? "0" : "") + mm + ":" + 
			   ((ss < 10) ? "0" : "") + ss;			
	}
	
	// Setup Listeners for video player events
	Player.setupEventListeners = function () {
	
		if (!this.videoElem) {
			return 0;
		}
		
		var that = this;
		
		// triggered when video metadata was loaded, i.e. duration dimensions etc
		this.videoElem.addEventListener('loadedmetadata', function() {
			console.log("Video metadata info was loaded");
			that.state = that.STATES.PREPARED;
			document.getElementById("total-time").innerHTML = that.formatTime(that.videoElem.duration);
		}, false);
		
		// triggered when video has ended.
		this.videoElem.addEventListener('ended', function() {
			console.log("Video ended");
			that.state = that.STATES.PREPARED;
		}, false);
		
		// triggered when playing has changed
		this.videoElem.addEventListener('timeupdate', function () {
			var duration =  that.videoElem.duration;
		    if (duration > 0) {
		    	document.getElementById('progress-amount').style.width = ((that.videoElem.currentTime / duration)*100) + "%";
		    	document.getElementById("current-time").innerHTML = that.formatTime(that.videoElem.currentTime);
		    }		    
        }, false);

		// triggered when the browser is in the process of getting the media data
        this.videoElem.addEventListener('progress', function () {
        	console.log("Buffering...");
        }, false);

        // triggered when a file is ready to start playing (when it has buffered enough to begin)
        this.videoElem.addEventListener('canplay', function () {
        	console.log('Buffering Complete, Can play now!');
        }, false);
				
		// triggered when some error during video happens
		this.videoElem.addEventListener('error', function(e) {
			console.log("Some error had happened: " + e);
		}, false);
        
	}	
	
	if (!window.Player) {
		window.Player = Player;
	}	
	
})()
