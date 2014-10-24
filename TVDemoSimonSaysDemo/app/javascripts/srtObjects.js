/**
 *	Adds an animation keyframe class with custom properties and a callback at the animation ends event.
 *
 *	@param {string|object} options The ID for the element or an object with all the animation options.
 *	@param {string} animationClass The keyframe class with the animation to apply.
 *	@param {number} [duration=300] Specifies how milliseconds an animation takes to complete one cycle.
 *	@param {string} [timingFunction=ease] Describes how the animation will progress over one cycle of its duration.
 *	@param {number} [delay=0] Specifies when the animation will start.
 *	@param {number} [iterations=1] Specifies the number of times an animation is played.
 *	@param {number} [direction=normal] Specifies whether or not the animation should play in reverse on alternate cycles.
 *	@param {string} [fillMode=forwards] Specifies what values are applied by the animation outside the time it is execution.
 *	@param {function} [callback] Specifies function to be call when the animation ends.
 *
 *	@author Cristian Valladares, cristian.v@samsung.com
 */
function animation(options, animationClass, callback, duration_ms){

	var animationDuration_ms,
		timingFunction,
		delay_ms,
		iterations,
		direction,
		fillMode,
		endCallback,
		element,
		transitionClass;

	// Reassign variables depending if the functions recives multiple parameters or an object.
	if (typeof options === "object") {
		if (typeof options.id === "string" && typeof options.transitionClass === "string") {
			element			= $(options.id);
			transitionClass = options.transitionClass;
		} else {
		
			// Fail if the functions does not receive a selector and a keyframe class.  
			throw new Error("TRANSITION: Element does not exist");
			return;
		}
	} else {
		if (typeof options === "string" && typeof animationClass === "string") {
			element			= $(options);
			transitionClass = animationClass;
			options 		= {
								callback: callback,
								duration: duration_ms
							};
		} else {
			
			// Fail if the functions does not receive a selector and a keyframe class.  
			throw new Error("TRANSITION: Element does not exist");
			return;
		}
	}

	animationDuration_ms = options.duration || 300,
	timingFunction 	= options.timingFunction || "ease",
	delay_ms 		= options.delay || 0,
	iterations	 	= options.iterations || 1,
	direction		= options.direction || "normal",
	fillMode		= options.fillMode || "forwards",
	steps			= options.steps || 0,
	endCallback 	= options.callback || "";
	
	if (steps > 0) {
		steps = "steps(" + options.steps + ")";
		timingFunction = "";
	} else {
		steps = "";
	}
		
	// Add the CSS animation properties received.
	element
		.css(
			"-webkit-animation", 	transitionClass + " " + 
									animationDuration_ms + "ms " + 
									steps + " " +
									timingFunction + " " +
									delay_ms + "ms " +
									iterations + " " +
									direction + " " +
									fillMode
		)
				
		// When the animation is complete, remove the properties and execute the callback.
		.on("webkitAnimationEnd", function(){
							
			element
				.css("-webkit-animation", "")
				.off();
		
			if (typeof endCallback === "function") {
				endCallback();
			}
		});
}

/**
 *	controlTVFunctions
 *  Function to help the control of the tv functions like:
 *	 	volume control, 
 * 		network
 *		language
 *		model
 *	@author Gerardo Reyes, g.reyes@samsung.com
 */

var tvFunctions = (function () {

	function createObject (id, classid) {
		var element = document.getElementById(id);
		if (!element) {
			var newElement = document.createElement("object")
			newElement.setAttribute('id',id);
			newElement.setAttribute('width',0);
			newElement.setAttribute('height',0);
			newElement.setAttribute('style','position:absolute; z-index:-1000');
			newElement.setAttribute('border',0);
			newElement.setAttribute('classid',classid);
			var body = document.getElementsByTagName('body')[0];
			body.appendChild(newElement);
			element = document.getElementById(id);
		}
		return element;
	}
	
	function activateVolumeKeys () {
		setTimeout(function(){
			createObject("pluginObjectTVMW","clsid:SAMSUNG-INFOLINK-TVMW");
			var NNaviPlugin = createObject("pluginObjectNNavi","clsid:SAMSUNG-INFOLINK-NNAVI");
			NNaviPlugin.SetBannerState(1);
			keys.unregister(tvKey.KEY_VOL_UP);
			keys.unregister(tvKey.KEY_VOL_DOWN);
			keys.unregister(tvKey.KEY_MUTE);
		},1000);
	}

	var screenSaver = {
	
		enable: function () {
			setTimeout(function() { pluginAPI.setOnScreenSaver(); },1000);
		},
	
		disable: function () {
			setTimeout(function() { pluginAPI.setOffScreenSaver(); },1000);
		}

	};

	function getLanguage () {
		var languageObject = createObject("pluginObjectLanguage","clsid:SAMSUNG-INFOLINK-TV");
		return languageObject.GetLanguage();
	}

	function changeAppLanguage (languageControl) {
		var languageObject = createObject("pluginObjectLanguage","clsid:SAMSUNG-INFOLINK-TV");
		switch (languageObject.GetLanguage()) {
			case 2:
			case 24:
				languageControl.current = languageControl.ESP;
			break;

			default:
				languageControl.current = languageControl.current;
			break
		};

	}

	var network = {
		isOnline: function () {
			var Network = createObject("Network","clsid:SAMSUNG-INFOLINK-NETWORK");
			return Network.CheckPhysicalConnection(Network.GetActiveType());
		},
		checkPhysicalConnection: function () {
			var Network = createObject("Network","clsid:SAMSUNG-INFOLINK-NETWORK");
			return Network.CheckPhysicalConnection(Network.GetActiveType());
		},
		checkHTTP: function () {
			var Network = createObject("Network","clsid:SAMSUNG-INFOLINK-NETWORK");
			return Network.CheckHTTP(Network.GetActiveType());
		}
	}

	function getInfo () {
		var NNaviPlugin = createObject("pluginObjectNNavi","clsid:SAMSUNG-INFOLINK-NNAVI");
		var Network = createObject("Network","clsid:SAMSUNG-INFOLINK-NETWORK");
		var infolinkTV = createObject("pluginObjectLanguage","clsid:SAMSUNG-INFOLINK-TV");
		var mac = Network.GetMAC();
		var duid = NNaviPlugin.GetDUID(mac);

		var year = NNaviPlugin.GetFirmware();
		var index = year.indexOf("2011") > 0 ? year.indexOf("2011") : 
					year.indexOf("2012") > 0 ? year.indexOf("2012") :
					year.indexOf("2013") > 0 ? year.indexOf("2013") : 
					year.indexOf("2014") > 0 ? year.indexOf("2014") : 
					false;
		
		year = !index? false : parseInt(year.substring(index, index + 4));
		
		var category = webapis.tv.info.getProduct();
		category = 	category === 0 ? "TV" :
					category === 1 ? "MONITOR" :
					category === 2 ? "BD" :
					false;

		var info = { year: year, model: webapis.tv.info.getModel(), mac: mac, duid: duid, category: category };
		return info;
	}
	
	var keys = {
		register: function (key) {
			if (key === "numbers")
				pluginAPI.registIMEKey();
			else
				pluginAPI.registKey(key);
		},
		unregister:function (key) {
			if (key === "numbers")
				pluginAPI.unregistIMEKey();
			else
				pluginAPI.unregistKey(key);
		},
	}
	
	var broadcast = (function () {
		var bc = false;
		
		function Create () {
			if (!bc) {
				bc = createObject("pluginObjectWindow","clsid:SAMSUNG-INFOLINK-WINDOW");
				bc.SetPreviousSource();
				bc.SetScreenRect(0, 0, 960, 540);
				setTimeout(function() {
					var NNaviPlugin = createObject("pluginObjectNNavi","clsid:SAMSUNG-INFOLINK-NNAVI");
					NNaviPlugin.SetBannerState(2);

					keys.unregister(tvKey.KEY_VOL_UP);
					keys.unregister(tvKey.KEY_VOL_DOWN);
					keys.unregister(tvKey.KEY_MUTE);
					keys.unregister(tvKey.KEY_CH_UP);
					keys.unregister(tvKey.KEY_CH_DOWN);
					
					keys.unregister("numbers");
				},1000);
			}
		}
		
		function GetSource () {
			if (bc)
				return bc.GetSource();
		}
		
		function SetSource (src) {
			if (bc)
				bc.SetSource(src);
		}
		
		function SetPreviousSource () {
			if (bc)
				bc.SetPreviousSource();
		}
		
		function SetScreenRect (x, y, w, h) {
			if (bc)
				bc.SetScreenRect(x, y, w, h);
		}
		
		function Restore () {
			if (bc){
				var year = getInfo().year;
				if (year>2012) {
					bc.SetScreenRect(-1, 0, 0, 0);
				}
				// bc.parentNode.removeChild(bc);
			}
		}
		
		return {
			Create: Create,
			GetSource: GetSource,
			SetSource: SetSource,
			SetPreviousSource: SetPreviousSource,
			SetScreenRect: SetScreenRect,
			Restore: Restore
		}
		
		
	})();
	
	var imeKeyBoard = false;
	function showKeyboard (id) {
		if (!imeKeyBoard) {
		
			if (!isWebRunning) {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = '$MANAGER_WIDGET/Common/IME_XT9/ime.js';
				document.body.appendChild(script);
			
				script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = '$MANAGER_WIDGET/Common/IME_XT9/inputCommon/ime_input.js';
				document.body.appendChild(script);
			}
			
			setTimeout(function() {
				imeKeyBoard = new IMEShell_Common();
				$(window).on('unload', function(){
					imeKeyBoard.onClose();
				});
				imeKeyBoard.inputboxID = id;
				imeKeyBoard.onShow();
			},300);
		}
		else {
			imeKeyBoard.inputboxID = id;
			imeKeyBoard.onShow();
		}
	}
	
	function getTime () {
		var timePlugin = createObject("pluginTime","clsid:SAMSUNG-INFOLINK-TIME");
		return timePlugin.ConvertEpochToLocalTime(timePlugin.GetEpochTime());
		 
	}

	return {

		activateVolumeKeys: activateVolumeKeys,
		screenSaver: screenSaver,
		getLanguage: getLanguage,
		changeAppLanguage: changeAppLanguage,
		network: network,
		getInfo: getInfo,
		broadcast: broadcast,
		showKeyboard: showKeyboard,
		getTime: getTime,
		keys: keys
	}

})();

/**
 *  Manages the focus on a generic grid or list system. The elements must be place within a parent container. Based on the Grid Focus Manager method.
 *
 *  @param {string|object} options The ID for the list container element or an object with all the list options.
 *  @param {string} grid_id A selector with the ID of the grid container.
 *  @param {boolean} [infinite=false] Makes the navigation through the grid infinite, without edge. Both horizontally and vertically. Default 'false'.
 *  @param {boolean} [infinite_x=false] Makes the horizontally navigation through the grid infinite, without edge. Default 'false'.
 *  @param {boolean} [infinite_y=false] Makes the vertically navigation through the grid infinite, without edge. Default 'false'.
 *  @param {string} [focus_class='focus'] Name of the class to add to the focused element in the grid. Default 'focus'.
 *  @param {string} [element_list='li'] Selector for the lines of the list container. Default 'li'.
 *
 *  @author Cristian Valladares, cristian.v@samsung.com
 *  @modified by: Alejandro Gonzalez, a.camarena@samsung.com
 */
function GridFocusManager(options){
  var elementsPerRow, rowCount, grid_id;

  if (typeof options == "object") {
    grid_id = '#' + options.id
  } else {
    grid_id = '#' + options,
    options = {};
  }
  
  /**
   * Get the number of li elements per row (via left position)
   */
  var setElementsPerRow = function(){
    var prev = -1; var elementCount = 0;
    elementsPerRow = 0; rowCount = 0;

    $.each($(grid_id + " li"), function(a,b){
      elementCount++;

      if(prev < $(b).position().left){
        if(rowCount == 0){ elementsPerRow++; }
        prev = $(b).position().left;
      }else if(prev == $(b).position().left){
        rowCount++;
      }else{
        prev = 0;
        rowCount++;
      }
    });

    if(elementCount > rowCount * elementsPerRow){
      rowCount++;
    }
  };

  $(window).resize(setElementsPerRow); // DEBUG
  setElementsPerRow();

  var focus_class = options.focus_class || 'focus',
  element_list    = options.element_list || 'li',
  infinite_x      = options.infinite_x || false,
  infinite_y      = options.infinite_y || false,
  index           = 0;
  
  if (options.infinite != undefined) {
    infinite_x = true;
    infinite_y = true;
  }
  
  var elements_length = $(grid_id + ' > ' + element_list).length, temp_selected;
  $(grid_id + ' > ' + element_list + ':first-child').addClass(focus_class);
  
  return {
    /**
     *  Move the focus to the right in the grid.
     *  @param {function} [callback] Function to be call when the focus gets to the edge of the list.
     */
    right: function(callback){
      if(elementsPerRow == 1 && rowCount != 1){
        this.down(callback);
        return;
      }

      temp_selected = $(grid_id + ' > .' + focus_class);
      temp_selected_index = temp_selected.index()+1;
      
      if ((temp_selected_index)%elementsPerRow != 0 && (temp_selected_index) < elements_length) {
        temp_selected.removeClass(focus_class).next().addClass(focus_class);
        index++;
      } else {
        if (infinite_x) {
          temp_selected.removeClass(focus_class);
          if (elements_length == temp_selected_index && elements_length % elementsPerRow !=0) {
            index = (elements_length - ((elements_length % elementsPerRow) - 1)) - 1;
            $(grid_id + ' > ' + element_list + ':nth-child(' + (index + 1)  + ')').addClass(focus_class);
          } else {
            index = (temp_selected.index() - (elementsPerRow - 2)) - 1;
            $(grid_id + ' > ' + element_list + ':nth-child(' + (index + 1) + ')').addClass(focus_class);
          }
        }
        if (typeof callback === 'function') {
          callback();
        }
      }
    },
    
    /**
     *  Move the focus to the left in the grid.
     *  @param {function} [callback] Function to be call when the focus gets to the edge of the list.
     */
    left: function(callback){
      if(elementsPerRow == 1  && rowCount != 1){
        this.up(callback);
        return;
      }

      temp_selected = $(grid_id + ' > .' + focus_class);
      temp_selected_index = temp_selected.index() + 1;
      
      if ((temp_selected_index) % elementsPerRow != 1 && elementsPerRow != 1) {
        temp_selected.removeClass(focus_class).prev().addClass(focus_class);
        index--;
      } else {
        if (infinite_x) {
          temp_selected.removeClass(focus_class);
          if ((temp_selected_index) == elements_length - ((elements_length % elementsPerRow)-1)) {
            index = $(grid_id + ' > ' + element_list).length - 1;
            $(grid_id + ' > ' + element_list + ':last-child').addClass(focus_class);
          } else {
            index = (temp_selected.index() + elementsPerRow) - 1;
            $(grid_id + ' > ' + element_list + ':nth-child(' + (index + 1)  + ')').addClass(focus_class);
          }
        }
        if (typeof callback === 'function') {
          callback();
        }
      }
    },
    
    /**
     *  Move the focus down in the grid.
     *  @param {function} [callback] Function to be call when the focus gets to the edge of the list.
     */
    down: function(callback){
      if(rowCount == 1 && elementsPerRow != 1){
        this.right(callback);
        return;
      }

      temp_selected = $(grid_id + ' > .' + focus_class);
      temp_selected_index = temp_selected.index()+1;
      
      if ((temp_selected.index() + elementsPerRow) < elements_length) {
        temp_selected.removeClass(focus_class);
        index = temp_selected.index() + elementsPerRow;
        $(grid_id + ' > ' + element_list + ':nth-child(' + (index + 1) + ')').addClass(focus_class);
      } else {
        if (infinite_y) {
          temp_selected.removeClass(focus_class);
          index = (((temp_selected_index) % elementsPerRow) ? ((temp_selected_index) % elementsPerRow) : elementsPerRow ) - 1;
          $(grid_id + ' > ' + element_list + ':nth-child(' + (index + 1) + ')').addClass(focus_class);
        }
        if (typeof callback === 'function') {
          callback();
        }
      }
    },
    
    /**
     *  Move the focus up in the grid.
     *  @param {function} [callback] Function to be call when the focus gets to the edge of the list.
     */
    up: function(callback){
      if(rowCount == 1 && elementsPerRow != 1){
        this.left(callback);
        return;
      }

      temp_selected = $(grid_id + ' > .' + focus_class);
      temp_selected_index = temp_selected.index()+1;
      
      if (((temp_selected.index() - elementsPerRow)) >= 0) {
        temp_selected.removeClass(focus_class);
        index = temp_selected.index() - elementsPerRow;
        $(grid_id + ' > ' + element_list + ':nth-child(' + (index + 1) + ')').addClass(focus_class);
      } else {
        if (infinite_y) {
          temp_selected.removeClass(focus_class);
          if (elements_length%elementsPerRow == 0) {
            index = ((((elements_length/elementsPerRow)-1)*elementsPerRow) + temp_selected_index) - 1;
            $(grid_id + ' > ' + element_list + ':nth-child(' + (index + 1) + ')').addClass(focus_class);
          } else {
            if ((parseInt(elements_length/elementsPerRow)*elementsPerRow) + temp_selected_index <= elements_length) {
              index = ((parseInt(elements_length/elementsPerRow)*elementsPerRow) + temp_selected_index) - 1;
              $(grid_id + ' > ' + element_list + ':nth-child(' + (index + 1) + ')').addClass(focus_class);
            } else {
              index = (((parseInt(elements_length/elementsPerRow)-1)*elementsPerRow) + temp_selected_index) - 1;
              $(grid_id + ' > ' + element_list + ':nth-child(' + (index + 1) + ')').addClass(focus_class);;
            }
          }
        }
        if(typeof callback === 'function') {
          callback();
        }
      }
    },
    
    /**
     *  @returns {number} Returns the position of the focus in the grid.
     */
    getIndex: function(){
      // Returns index
      return index;
    },
    
    /**
     *  @returns {number} Returns the row of the focus in the grid.
     */
    getRow: function(){
      var temp_row = (($(grid_id + ' > .' + focus_class).index()+1)/elementsPerRow);
      return (temp_row%1 == 0 ? temp_row-1 : parseInt(temp_row));
    },
    
    /**
     *  @returns {number} Returns the grid of the focus in the grid.
     */
    getColumn: function(){
      var temp_column = ($(grid_id + ' > .' + focus_class).index()+1)%elementsPerRow;
      return (temp_column == 0 ? elementsPerRow-1 : temp_column-1);
    },
    
    /**
     *  @returns {number} Returns the total columns of the grid.
     */
    getTotalColumns: function(){
      // Return the total columns
      return elementsPerRow;
    },
    
    /**
     *  @returns {number} Returns the total rows of the grid.
     */
    getTotalRows: function(){
      var tmp = parseInt(elements_length/elementsPerRow);
      if (elements_length%elementsPerRow > 0) {
        tmp = tmp + 1;
      }
      
      return tmp;
    },

    /**
     *  Sets a new index in the grid.
     *  @param {number} [value] The new index
     *  @param {function} [callback] Function to be call when the focus gets to the edge of the list.
     */
    setIndex: function(value, callback){
      if ((value < elements_length)&&(value >= 0)) {
        $(grid_id + ' > .' + focus_class).removeClass(focus_class);
        $(grid_id + ' > ' + element_list + ':nth-child(' + (value + 1) + ')').addClass(focus_class);
        index = value;
      } else {
        if (typeof callback === 'function') {
          callback();
        }
      }
    },
    
    /**
     *  Sets a new index in the grid by coordinates.
     *  @param {number} [x] The new index column.
     *  @param {number} [y] The new index row.
     *  @param {function} [callback] Function to be call when the focus gets to the edge of the list.
     */
    setIndexByCoordenate: function(x, y, callback){
      if (x < elementsPerRow && (y*elementsPerRow + (x+1)) <= elements_length) {
        $(grid_id + ' > .' + focus_class).removeClass(focus_class);
        index = ((y*elementsPerRow) + (x+1)) - 1;
        $(grid_id + ' > ' + element_list + ':nth-child(' + (index + 1) + ')').addClass(focus_class);
      } else {
        if (typeof callback === 'function') {
          callback();
        }
      }
    },

    /**
     *  Changes the id of the grid focus manager. Usefull mainly while managing carrousels
     */
    setNewID : function(id, direction){
      grid_id = id;
      setElementsPerRow();
      this.refresh();

      switch(direction){
        case "left":
          this.setIndex($(id + ">li:last-child").index());
        break;

        case "right":
          this.setIndex($(id + ">li:first-child").index());
        break;
      }
    },
    
    /**
     *  Resets the variables for elements in the list and elements per row. Not necessary under new unified method.
     *  @param {number} [elements_per_row] The new elements per rows.
     */
    refresh: function(elements_per_row){
      elements_length   = $(grid_id + ' > ' + element_list).length;
      
      if (elements_per_row >= 1) {
        elementsPerRow    = elements_per_row;
      }
    },

    setElementsPerRow: setElementsPerRow
  }
}

