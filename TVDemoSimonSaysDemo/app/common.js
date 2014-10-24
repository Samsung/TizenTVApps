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

var animationDuration = {
	FADE_IN: 		200,
	FADE_OUT: 		200,
	FADE_IN_OUT:    1000,
	FROM_BOTTOM:	200,
	TO_BOTTOM: 		200,
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