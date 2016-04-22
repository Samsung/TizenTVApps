var FirstScreen = {
		id : 0,
	};
FirstScreen.initialize = function () {
	console.log("FirstScreen.initialize");
	webapis.avplay.setListener(listener);

	webapis.avplay.open(localVideoPath);
	webapis.avplay.prepare();	
	
	var avPlayerObj = document.getElementById("av-playerStart");	
	webapis.avplay.setDisplayRect(avPlayerObj.offsetLeft, avPlayerObj.offsetTop, avPlayerObj.offsetWidth, avPlayerObj.offsetHeight);
	console.log("Current state: " + webapis.avplay.getState());
	console.log("prepare complete");

	gDuration = webapis.avplay.getDuration();  
	
	playVideo();
	
};
var localPath = window.location.href.slice(0, window.location.href.length - 10);
	var videoPath = 'resources/videos/1.mov';
	var localVideoPath = localPath + videoPath;
	var gDuration = 0;
	var gMarginTime = 5000;

	var playVideo = function() {
		//prepare API should be done after open API.
			//var url = document.getElementById("url").value;
			
	    console.log("Current state: " + webapis.avplay.getState());
	    console.log('Play Video');
	    try {
	        webapis.avplay.play();
	        console.log("Current state: playing " + webapis.avplay.getState());
	    } catch (e) {
	        console.log("Current state: " + webapis.avplay.getState());
	        console.log(e);
	    }
	};
	
	var listener = { 
			 	onbufferingstart : function() { 
			 		console.log("Buffering start."); 
			 		showLoading(); 
			 	}, 
			 	onbufferingprogress : function(percent) { 
			 		console.log("Buffering progress data : " + percent); 
			 		updateLoading(percent); 
			 	}, 
			 	onbufferingcomplete : function() { 
			 		console.log("Buffering complete."); 
			 		hideLoading(); 
			 	}, 
			 	oncurrentplaytime : function(currentTime) { 
			 		console.log("Right Current Playtime : " + currentTime); 
			 		
				 	if(currentTime + gMarginTime > gDuration){
				 		console.log("value of gDuration :: " + gDuration); 
				 		webapis.avplay.jumpBackward(currentTime + gMarginTime);
					}	 		
			 	},
			 	onevent : function(eventType, eventData) { 
			 		console.log("event type : " + eventType + ", data: " + eventData); 
			 	}, 
			 	onerror : function(eventType) { 
			 		console.log("error type : " + eventType); 
			 	}, 
			 	onsubtitlechange : function(duration, text, data3, data4) { 
			 		console.log("Subtitle Changed."); 
			 	}, 
			 	ondrmevent : function(drmEvent, drmData) { 
			 		console.log("DRM callback: " + drmEvent + ", data: " + drmData); 
			 	}, 
			 	onstreamcompleted : function() { 
			 		console.log("Stream Completed");
			 		//webapis.avplay.seekTo(0); 
					playVideo();			 				 				
			 	} 
			 }; 
	