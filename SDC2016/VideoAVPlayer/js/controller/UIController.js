var UIController = {
	idx : 0,
	controlBtn : ["playPause","stop","ff","rew"],
	//playContVis: false
};

var playContVis = false;

/*
@ method: UIController.initialize
@ description: This function initializes the Control area and control buuttons
@ param: none
@ return: none
*/
UIController.initialize = function () {
	this.render();
	this.addFocus();
};

/*
@ method: UIController.startVideo
@ description: This function prepares the Video to play
@ param: none
@ return: none
*/
UIController.startVideo = function (){
	TizenAVPlayer.openVideo(localVideoPath);
	TizenAVPlayer.prepareVideoSync();
	$(".controlArea > .controlBtn").eq(0).addClass('hover');
	$(".controlArea > .controlBtn").eq(1).removeClass('hover');
	$(".controlArea > .controlBtn").eq(2).removeClass('hover');
	$(".controlArea > .controlBtn").eq(3).removeClass('hover');
	document.getElementById("total-time").innerHTML = TizenAVPlayer.formatTime(webapis.avplay.getDuration()/1000);	
};

/*
@ method: UIController.render
@ description: This function creates the control area and control buttons
@ param: none
@ return: none
*/
UIController.render = function () {
	var controlArea = $(".controlArea");
	var self = this;
	console.log("Value of this.controlBtn.length :: " + this.controlBtn.length);
	for(var i = 0; i < this.controlBtn.length; i++) {
		var btn = $("<div>").addClass(this.controlBtn[i] + ' controlBtn').appendTo(controlArea);
		btn.hover(function(){
			self.idx = $(this).index(); 
			self.addFocus();
		},function(){
			
		})
		.mousedown(function() {
			 $(this).addClass('down');
		})
		.mouseup(function() {
			 $(this).removeClass('down');
		})
		.click(function() {
			 self.enterKeyHandler();
		});
	}
};

UIController.enterKeyHandler = function () {	
	switch (this.idx) {
	case 0:	
		if ($('.playPause').hasClass('pause')){
			$('.playPause').removeClass('pause');
			TizenAVPlayer.executeAction('pause');
		} else {
			$('.playPause').addClass('pause');
			TizenAVPlayer.executeAction('play');
		}
		break;
	case 1:	
		Main.stopVideo();
		break;
	case 2:	
		Main.forwordVideo();
		break;
	case 3:	
		Main.rewindVideo();
		break;
	default:
		break;
	}
};

/*
@ method: UIController.addFocus
@ description: This function adds the focus to the control button according to the index
@ param: none
@ return: none
*/
UIController.addFocus = function () {
	this.removeFocus();
	$(".controlArea").eq(this.idx).addClass('hover');
};

/*
@ method: UIController.removeFocus
@ description: This function removes the focus from the control button according to the index
@ param: none
@ return: none
*/
UIController.removeFocus = function () {
	$(".controlArea").find('.hover').removeClass('hover');
};

UIController.handleKeyDown = function (keyCode) {
	switch (keyCode) {	
	default:
		break;	
	}
};

/*
@ method: UIController.showPlayControls
@ description: This function displays the controls on the Video
@ param: none
@ return: none
*/
UIController.showPlayControls = function(){
	console.log("showPlayControls");
	$(".menu-container").css('display', 'block');
	$(".progress").css('display', 'block');
	playContVis = true;
};

/*
@ method: UIController.hidePlayControls
@ description: This function hides the controls on the Video
@ param: none
@ return: none
*/
UIController.hidePlayControls = function(){
	console.log("hidePlayControls");
	$(".menu-container").css('display', 'none');
	$(".progress").css('display', 'none');
	console.log("UI controller value of flag"+ playContVis);
	playContVis = false;
	console.log("AFTER UI controller value of flag"+ playContVis);
};

/*
@ method: UIController.fullScreenVideo
@ description: This function sets the display area of the video
@ param: none
@ return: none
*/
UIController.fullScreenVideo = function () {
	TizenAVPlayer.executeAction('change-size', {left: 0, top: 0, width : 1920, height: 1080, delay: 300});
};

