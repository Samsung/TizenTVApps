// Namespace. Contains data of the current Scene.
var Scene = {
	keys: 		false,
	text: 		false,
	isReturn:	false,
	tvInfo:		false
};

var config = {
	FADE_IN_DURATION:		300,
	WINDOW_WIDTH: 			document.body.clientWidth,
	POPUP_FADE_IN_DURATION:	250,
	FADE_IN_DELAY:			150,
	FADE_EASE_IN:			"ease-out",
	FADE_EASE_OUT:			"ease-in"
};

/**
 *	Clears all the keys events and adds the common keys for TV usage. Blocks the RETURN and EXIT event 
 *	from the TV. Use this function when entering a new scene or before binding a new set of keys.
 *
 *	@author Gerardo Reyes, g.reyes@samsung.com
 */

function unbind_keys () {

	$(document).unbind('keydown');
	$(document).keydown(function(e) {

		switch(e.keyCode){
			case tvKey.KEY_RETURN:
				widgetAPI.blockNavigation(event);
				break;
			case tvKey.KEY_EXIT:
				widgetAPI.blockNavigation(event);
				if (SceneManager.current === "Video")
					SceneManager.Video.pauseVideo();
				popupExit.show();
				break;
		}
	});
}

function PopUpManager(options){
	var active = false;
	var html = 	'<div id="' + options.id + '" class="popup">'  +
					'<header>' +
						'<div><span>'+ options.title + '</span></div>' +
					'</header>' +
					'<div class="container">';
	if(options.text)
		html += 		'<p>' + options.text + '</p>';
	if(options.content)
		html += 		options.content;	
	if(options.buttons)
		html += 		'<div class="buttons"></div></div>';
	html += 		'</div>';
	html += 	'</div>';
	
	$('#dim').append(html);

	if(options.buttons){
		for (var i=0;i<options.buttons.length;i++){
			$('#dim #' + options.id + ' .buttons').append('<div class="' + options.buttons[i].class + '" onclick="' + options.buttons[i].onclick + '">' + options.buttons[i].text + '</div>');
		}
	}
	
	this.show = function(){
		if(!active && !window.active_popup){
			if(options.onShow)
				options.onShow();

			$('#dim').css({'display': '-webkit-box'});
			setTimeout(function(){
				$('#dim').css({'opacity': '1'});
			},50);
			
			if (SceneManager.current === 'Loading') {
				$('#loader').addClass('hide_loader');
			}
			
			$('#' + options.id).css('display', 'block').addClass('popup_in');
			
			active = true;
			window.activePopup = true;
			
			//$('#' + options.id).on('webkitAnimationEnd',function(){
				$('#' + options.id).removeClass('popup_in');
				$('#' + options.id).off();
			//});
		}
	}
	
	this.close = function(){
		if(active){
			
			$('#' + options.id).addClass('popup_out');
			//$('#' + options.id).on('webkitAnimationEnd',function(){
				
				// HACK: Section added to deal with the Loading dim.
				if (SceneManager.current !== 'Loading') {
					$('#dim').css('display', 'none');
				}
				
				$('#' + options.id).css('display', 'none');
				$('#' + options.id).removeClass('popup_out');
				
				active = false;
				window.activePopup = false;
				
				if(options.onClose)
					options.onClose();
				$('#' + options.id).off();
			//});
		}
	}
	
	this.isActive = function(){
		return active;
	}
}


/**
 *	Manages the focus on a generic list. The elements of the list must be place within a parent container.
 *
 *	@param {string|object} options The ID for the list container element or an object with all the list options.
 *	@param {string} list_id A selector with the ID of the list container. 
 * 	@param {boolean} [infinite=true] Makes the navigation through the list infinite, without edge. Default 'true'.
 *  @param {string} [focus_class='focus'] Name of the class to add to the focused element in the list. Default 'focus'.
 *  @param {string} [element_list='li'] Selector for the lines of the list container. Default 'li'.
 *
 *	@author Cristian Valladares, cristian.v@samsung.com
 */
function ListFocusManager(options){
	
	if (typeof options == "object") {
		var list_id = '#' + options.id;
	} else {
		var list_id = '#' + options;
		options = {};
	}
	
	var temp_selected;
	var focus_class = options.focus_class || 'focus';
	var element_list = options.element_list || 'li';
	var infinite = options.infinite || false;
	var index = 0;
		
	$(list_id + ' > ' + element_list + ':first-child').addClass(focus_class);
	
	return {
		
		/**
		 *	Move the focus one element before.
		 *	@param {function} [callback] Function to be call when the focus gets to the edge of the list.
		 */
		up: function(callback){
			temp_selected = $(list_id + ' > .' + focus_class);
			if (temp_selected.index() > 0) {
				temp_selected.removeClass(focus_class).prev().addClass(focus_class);
				index--;
			} else {
				if (infinite) {
					temp_selected.removeClass(focus_class);
					$(list_id + ' > ' + element_list + ':last-child').addClass(focus_class);
					index = $(list_id + ' > ' + element_list).length - 1;
				}
				if (typeof callback === 'function') {
					callback();
				};
			}
		},
		
		/**
		 *	Move the focus one element after.
		 *	@param {function} [callback] Function to be call when the focus gets to the edge of the list.
		 */
		down: function(callback){
			temp_selected = $(list_id + ' > .' + focus_class);
			if ((temp_selected.index()+1) < $(list_id + ' > ' + element_list).length) {
				temp_selected.removeClass(focus_class).next().addClass(focus_class);
				index++;

			} else {
				if (infinite) {
					temp_selected.removeClass(focus_class);
					$(list_id + ' > ' + element_list + ':first-child').addClass(focus_class);
					index = 0;
				}
				if (typeof callback === 'function') {
					callback();
				}
			}
		},
		
		/**
		 *	@returns {number} Returns the position of the focus in the list.
		 */
		getIndex: function(){
			return index;
		},
		
		/**
		 *	Sets a new index in the list.
		 *	@param {number} The index of the focus.
		 */
		setIndex: function(value){
			if ((value < $(list_id + ' > ' + element_list).length)||(value > 0)) {
				$(list_id + ' > .' + focus_class).removeClass(focus_class);
				$(list_id + ' > ' + element_list + ':nth-child(' + (value+ 1) + ')').addClass(focus_class);
				index = value;
			}
		},
		
		/**
		 *	@returns {number} Returns the length of the list.
		 */
		length: function(){
			return $(list_id + ' > ' + element_list).length;
		}
	}
} Object.freeze(ListFocusManager);

exitOptionsList = new ListFocusManager({
		id: "popup-exit-list",
		infinite: true
	});

popupExit = new PopUpManager({
	id: 'popup-exit', 
	title: 'Do you want to exit the application?', 
	content:'<ul id="popup-exit-list"> ' +
				'<li>' +
					'<div></div>' +
					'<span class="button_no"></span>' +
					'<div></div>' +
				'</li>' +
				'<li>' +
					'<div></div>' +
					'<span class="button_yes"></span>' +
					'<div></div>' +
				'</li>' +
			'</ul>',
	onShow: function(){
	
		Scene.focus = $(".focus");
		$(".focus").removeClass("focus");
		$("#score-popup, #two-players-end-menu").addClass("hide");
		
		
		/*$(".button_no").html(text[LANGUAGE.current].no);
		$(".button_yes").html(text[LANGUAGE.current].yes);
		$("#popup-exit header span").html(text[LANGUAGE.current].popop_exit_header);*/
		
		unbind_keys();
		
		exitOptionsList.setIndex(0);
		
		setTimeout(function(){
			
			$(document).keydown(function(e){
				switch(e.keyCode){
					case tvKey.KEY_UP:
						exitOptionsList.up();
						break;
					case tvKey.KEY_DOWN:
						exitOptionsList.down();
						break;
					case tvKey.KEY_ENTER:
						switch(exitOptionsList.getIndex()){
							case 0:
								popupExit.close();
                                //SceneManager.MainMenuToGameState();
                                game.paused=false;
                                game.state.start('GameState',true,false);
								break;
							case 1:
                                popupExit.close();
                                
								SceneManager.GameStateToMainMenu();
								break;
						}
						break;
					case tvKey.KEY_RETURN:
					case tvKey.KEY_EXIT:
						
						break;
				}
			});
		},100);
	},
	onClose: function(){
		unbind_keys();
		
		Scene.isReturn = false;
		
		Scene.focus.addClass("focus");
		$("#score-popup, #two-players-end-menu").removeClass("hide");
		
		if (SceneManager.current === "GameStart")
			SceneManager.GameStart.pauseGame(false);
		else if (SceneManager.current === "TwoPlayersGameStart")
			SceneManager.TwoPlayersGameStart.pauseGame(false)
		
		if (typeof Scene.keys == "function") {
			Scene.keys();
		}
	}
});
