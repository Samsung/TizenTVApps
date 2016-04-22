var Main = {
		scroller:null
	    ,gridData:[]
		,screen:0
	};

/*
@ method: init
@ description: This function is called first when the app is loaded.
@ param: none
@ return: none
*/
var init = function () {	
    console.log("init() called");
    FirstScreen.initialize();
    document.getElementById("VideoList").focus();
    
    this.screen = 0;
    
    Main.addListeners();
};

/*
@ method: Main.displayGrid
@ description: This function displays the grid and hides the current screen.
@ param: none
@ return: none
*/
Main.displayGrid = function()
{
	this.screen = 1;
	document.getElementById("gridContainer").style.display = "block";
	$(".mainPage").css("display", "none");
	TizenAVPlayer.initialize();
    UIController.initialize();
    TizenInputDevice.initialize();
    TizenInputDevice.registerMediaKeys();
    TizenInputDevice.unregisterVolumeKey();
   
    for(var i=1; i<=12; i++)
	{
    	Main.gridData.push({"image":'images/thumbnail/'+i+'.jpg'});
	}
    Main.populateGridData(0);
};

window.onload = init;

var localPath = window.location.href.slice(0, window.location.href.length - 10);
console.log("localPath == " + localPath );
var videoPath = 'resources/videos/movie_0.mp4';
var localVideoPath = localPath + videoPath;

//var remoteVideoPath = 'http://www.quirksmode.org/html5/videos/big_buck_bunny.mp4';

var timer;
var currentTime;
var togglePlayPause = true;
var openVdo = true;

/*
@ method: Main.addListeners
@ description: This function attaches listener to the app
@ param: none
@ return: none
*/
Main.addListeners = function () {
	console.log("Main.addListeners()");
    document.addEventListener('keydown', Main.keyDownHandler.bind(this));	
};

/*
@ method: Main.removeListeners
@ description: This function removes listener from the app
@ param: none
@ return: none
*/
Main.removeListeners = function () {
   document.removeEventListener ("keydown",  Main.keyDownHandler);
	
};

/*
@ method: Main.populateGridData
@ description: This function populates the data in the grid
@ param: index
@ return: none
*/
Main.populateGridData = function (index) {
        var len = this.gridData.length;
        var row = 3;
        var col = 4;
        this.scroller = new horizontalGridScroller("hGrid" + index //container ID,
            , "gridContainer", this.gridData.length, row // visible rows
            , col, 500, index, 'thumbContainer', Main.scrollAnimationComplete // callback function name
            , 300
        );
        len = Math.ceil(len/row);
    	len = (len > col) ? col : len;
    	if($('#hGrid'+index).length)
    	{
    		$('#hGrid'+index).remove();
    	}
    	$("#gridContainer").append('<div id="hGrid'+index+'" class="hGrid"><div class="hGridColumn"></div></div>');
    	$("#hGrid"+index +" .hGridColumn").css({'width':300*len+'px'});
    	$("#hGrid"+index).css({'width':300*len+'px'});
    	$("#hGrid"+index +" .hGridColumn").html(this.createHorizontalGridCell(0, len-1, col, row));
    	this.scroller.addFocus();
};

/*
@ method: Main.createHorizontalGridCell
@ description: This function creates the cells in the grid
@ param: startColumn, endColumn, maxColumn, maxRow
@ return: none
*/
Main.createHorizontalGridCell=function(startColumn, endColumn, maxColumn, maxRow){	
	var grid = "";
	var clsStyle = "";
	for(var i=0; i<maxRow; i++)
	{	
		for(var j=startColumn; j<=endColumn; j++)
		{
			//var index = (Math.floor(j/maxColumn)*maxColumn*(maxRow-1)) + (i*maxColumn + j);
			var index = (i + maxRow*j);
			var clsStyle = (index < this.gridData.length) ? 'style="visibility: visible"' : 'style="visibility: hidden"';			
			grid += '<div id="thumbContainer_'+i+'_'+j+'" class="thumbContainer" '+clsStyle+'>' +
						'<div id="thumbImgParent"  class="thumbImgParent"><img id="thumbImage'+i+'" class="thumbImg" src="'+ ((index < this.gridData.length) ? this.gridData[index].image : null)+'" onload="Main.imageOnLoad(this);" onerror="Main.imageLoadError(this);" /></div>' +
						//'<div class="titleContainer"><div id="thumbTitle" class="thumbTitle">'+movieTitle[index]+'</div></div>'+
					'</div>';			
		};
	};
	return grid;
};

/*
@ method: Main.addItems
@ description: This function adds the items in the grid
@ param: start, end, isPrev, categoryIndex, maxColumn
@ return: none
*/
Main.addItems = function (start, end, isPrev, categoryIndex, maxColumn) {
    (isPrev) ? $("#vGrid" + categoryIndex).prepend(this.createThumbnailData(start, end, maxColumn)): $("#vGrid" + categoryIndex).append(this.createThumbnailData(start, end, maxColumn));
};

/*
@ method: Main.createThumbnailData
@ description: This function creates the data of thumbnails
@ param: startRow, endRow, maxColumn
@ return: none
*/
Main.createThumbnailData = function (startRow, endRow, maxColumn) {
	var grid = "";
    for (var i = startRow; i <= endRow; i++) {
        for (var j = 0; j < maxColumn; j++) {
            if (i * maxColumn + j < this.gridData.length) {
                var data = this.gridData[i * maxColumn + j];
                grid += '<div id="thumbContainer_' + i + '_' + j + '" class="thumbContainer">' +
                    '<div class="thumbImgParent"><img id="thumbImage_' + i + '_' + j + '" class="thumbImg" src="' + data + '" onload="Main.imageOnLoad(this);" onerror="Main.imageLoadError(this);" /></div>' +                    
                    '</div>';
            } else {
                return grid;
            }
        };
    };
    return grid;
};

/*
@ method: Main.imageOnLoad
@ description: This function loads the image of thumbnails
@ param: image
@ return: none
*/
Main.imageOnLoad = function (image) {
    $(image).parent().css("background-image", "url(" + image.src + ")");
    $(image).hide();
};

/*
@ method: Main.imageLoadError
@ description: This function gives the error if image could not be displayed
@ param: image
@ return: none
*/
Main.imageLoadError = function (image) {
    image.onerror = null;
    $(image).hide();
};

/*
@ method: Main.flipVedioFlag
@ description: This function keeps track whether the video is paused or played again
@ param: image
@ return: none
*/
Main.flipVedioFlag = function()
{
	openVdo = true;
	togglePlayPause = true;
}

/*
@ method: Main.keyDownHandler
@ description: This function associates the keydown events to the app
@ param: e
@ return: none
*/
Main.keyDownHandler = function (e) {
	switch(e.keyCode){
	case 37: //LEFT arrow
		if(this.screen == 1)
		{
			Main.scroller.moveLeft();
		}
		else if(this.screen == 2)
		{
			if(playContVis)
			{
				if(UIController.idx > 0)
				{
					$(".controlArea > .controlBtn").eq(UIController.idx).removeClass('hover');
					UIController.idx--;
					$(".controlArea > .controlBtn").eq(UIController.idx).addClass('hover');
				}
			}
		}
		break;
	case 38: //UP arrow
		if(this.screen == 1)
		{
			Main.scroller.moveUp();
		}
		break;
	case 39: //RIGHT arrow
		console.log("value of screen is"+this.screen);
		if(this.screen == 1)
		{
			Main.scroller.moveRight();
		}
		else if(this.screen == 2)
		{
			console.log("BEFORE ID is "+ UIController.idx);
			if(playContVis)
			{
				if(UIController.idx < $(".controlArea").find('.controlBtn').length-1)
				{
					console.log("ID is "+ UIController.idx);
					$(".controlArea > .controlBtn").eq(UIController.idx).removeClass('hover');
					UIController.idx++;
					console.log("AFter inc ID is "+ UIController.idx);
					$(".controlArea > .controlBtn").eq(UIController.idx).addClass('hover');
				
				}
			}
			Main.setToolbarTimer();
		}
		break;
	case 40: //DOWN arrow
		if(this.screen == 1)
		{
			Main.scroller.moveDown();
		}
		break;
	case 13: //OK button
		if(this.screen == 1)
		{
			console.log("Ok Button click");
			console.log("this.screen == 1");
			if(openVdo == true )
			{
				Main.openVideo();
				openVdo = false;
				togglePlayPause = false;
			}
			
		}
		else if(this.screen == 0)
		{
			console.log("this.screen == 0");	
			webapis.avplay.stop();
			Main.displayGrid();			
		}
		else if(this.screen == 2)
		{
			console.log("this.screen == 2"+playContVis);
			if(playContVis)
			{
				UIController.enterKeyHandler();
			}
			else
			{
				UIController.showPlayControls();
				Main.clearToolbarTimer();
				Main.setToolbarTimer();
			}
		}
		else
			{}
		break;
	case 412:	// Rewind
		Main.rewindVideo();
		break;
	case 19:	// Pause
		console.log("Value of Pause e.keyCode " + e.keyCode);
		Main.pauseVideo();		
		break;
	case 417:   // Fast Forward
		Main.forwordVideo();
		break;
	case 415:	// Play
		console.log("Value of play e.keyCode " + e.keyCode);
		if(openVdo == true )
		{
			Main.openVideo();
			openVdo = false;
		}
		Main.playVideo();
		break;
	case 413:	// Stop
		console.log("Value of stop e.keyCode " + e.keyCode);
		Main.stopVideo();
		break;
	case 10252:	// PlayPause
		console.log("Value of PlayPause e.keyCode " + e.keyCode);
		
		if(togglePlayPause)
		{
			if(openVdo == true )
			{
				Main.openVideo();
				openVdo = false;
			}
			else
			{
				Main.playVideo();
			}
				
		}
		else
		{
		   Main.pauseVideo();		   
		}
		
		togglePlayPause = !togglePlayPause;
		
		break;
	case 10009: //RETURN button
		if(this.screen == 2)
		{
			console.log("return pressed");	
			Main.stopVideo();
			
		}
		else if(this.screen == 1)
		{
			console.log("sceen 1 return pressed");
			tizen.application.getCurrentApplication().exit();
		}
		else{}
		break;
	case 10182:	// EXIT key
		
		console.log("exit key pressed");
		tizen.application.getCurrentApplication().exit();
		
		break;
	default:
		console.log("Key code : " + e.keyCode);
		break;
	}
}

/*
@ method: Main.scrollAnimationComplete
@ description: This function assciates the up, down events on the grid
@ param: str, start, end, categoryIndex, maxColumn, maxRow
@ return: none
*/
Main.scrollAnimationComplete=function(str, start, end, categoryIndex, maxColumn, maxRow){
	switch(str)
	{
		case "upOnFirstItem":
		break;
		case "Down-Start":
			Main.addItems(start, end, false, categoryIndex, maxColumn);
		break;
		case "Up-Start":
			Main.addItems(start, end, true, categoryIndex, maxColumn);
		break;
		default:
	}
};

/*
@ method: Main.stopVideo
@ description: This function stops the video
@ param: none
@ return: none
*/
Main.stopVideo = function()
{
	UIController.idx = 1;
	document.getElementById("gridContainer").style.display = "block";
	document.getElementById("videoPlayer").style.display = "none";
	TizenAVPlayer.executeAction('stop');
	document.getElementById('progress-amount').style.width = "0%";
	document.getElementById("current-time").innerHTML = "Playing: "+"00:00";
	this.screen = 1;
	Main.flipVedioFlag();
	UIController.idx = 0;
	Main.clearToolbarTimer();
	clearTimeout(timer);
};

/*
@ method: Main.setToolbarTimer
@ description: This function sets the timer, to hide the controls after specified time
@ param: none
@ return: none
*/
Main.setToolbarTimer = function()
{
	timer = setTimeout(UIController.hidePlayControls, 7000);
};

/*
@ method: Main.clearToolbarTimer
@ description: This function clears the timer
@ param: none
@ return: none
*/
Main.clearToolbarTimer = function()
{
	clearTimeout(timer);
};

/*
@ method: Main.openVideo
@ description: This function plays the video after open, prepare
@ param: none
@ return: none
*/
Main.openVideo = function()
{
	console.log("play Video called");
	document.getElementById("gridContainer").style.display = "none";
	document.getElementById("videoPlayer").style.display = "block";
	this.screen = 2;
	var a = Main.scroller.getSelectedItemIndex();
	console.log("value of a is %d"+ a);
	var videoPath = 'resources/videos/movie';
	if(a > 4)
	{
		a = a%4; 
	}
	videoPath = videoPath+"_"+a+".mp4";
	localVideoPath = localPath + videoPath;
	console.log("videoapth comes ot as :--" + localVideoPath);
	UIController.showPlayControls();
	UIController.startVideo();
	Main.playVideo();
	UIController.fullScreenVideo();
	Main.setToolbarTimer();
};

/*
@ method: Main.playVideo
@ description: This function plays the video from the same state where it stopped
@ param: none
@ return: none
*/
Main.playVideo = function()
{
	console.log("playpause pressed");
	UIController.showPlayControls();
	UIController.idx = 0;
	$(".controlArea > .controlBtn").eq(0).addClass('hover');
	$(".controlArea > .controlBtn").eq(1).removeClass('hover');
	$(".controlArea > .controlBtn").eq(2).removeClass('hover');
	$(".controlArea > .controlBtn").eq(3).removeClass('hover');
	$('.playPause').addClass('pause');
	TizenAVPlayer.executeAction('play');
}

/*
@ method: Main.pauseVideo
@ description: This function pauses the video
@ param: none
@ return: none
*/
Main.pauseVideo = function()
{
	console.log("Main.pauseVideo");
	UIController.showPlayControls();
	UIController.idx = 0;
	$(".controlArea > .controlBtn").eq(0).addClass('hover');
	$(".controlArea > .controlBtn").eq(1).removeClass('hover');
	$(".controlArea > .controlBtn").eq(2).removeClass('hover');
	$(".controlArea > .controlBtn").eq(3).removeClass('hover');
	if ($('.playPause').hasClass('pause'))
	{
		$('.playPause').removeClass('pause');
		TizenAVPlayer.executeAction('pause');
	}
	currentTime = document.getElementById("current-time").innerHTML;
	var res = currentTime.split(":");
	currentTime = res[1]+":"+res[2];
	console.log("EXACT current Time is"+currentTime);
	document.getElementById("current-time").innerHTML = "Playing: "+ currentTime;
};

/*
@ method: Main.pauseVideo
@ description: This function rewinds the video to the specified number of milliseconds
@ param: none
@ return: none
*/
Main.rewindVideo = function()
{
	UIController.idx = 3;
	$(".controlArea > .controlBtn").eq(3).addClass('hover');
	$(".controlArea > .controlBtn").eq(0).removeClass('hover');
	$(".controlArea > .controlBtn").eq(1).removeClass('hover');
	$(".controlArea > .controlBtn").eq(2).removeClass('hover');
	TizenAVPlayer.executeAction('jump-backward', {time: 1000});
};

/*
@ method: Main.pauseVideo
@ description: This function frorwards the video to the specified number of milliseconds
@ param: none
@ return: none
*/
Main.forwordVideo = function()
{
	UIController.idx = 2;
	$(".controlArea > .controlBtn").eq(2).addClass('hover');
	$(".controlArea > .controlBtn").eq(0).removeClass('hover');
	$(".controlArea > .controlBtn").eq(1).removeClass('hover');
	$(".controlArea > .controlBtn").eq(3).removeClass('hover');
	TizenAVPlayer.executeAction('jump-forward', {time: 1000});
};

