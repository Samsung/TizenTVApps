/**
*	Library created in SRT to help develop and test projects on web.
*		- Emulate some functions from TV like:
*			* TvKeys
*			* Player (Audio and Video)
*			* FileSystem
*			* Volume
*			* Language
*			* Internet connection
*			* Firmware
*	@author Gerardo Reyes, g.reyes@samsung.com
**/
(function(window){
	if(navigator.userAgent.toLowerCase().indexOf('smarttv') > -1){
	
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = '$MANAGER_WIDGET/Common/API/Widget.js';
		document.head.appendChild(script);
		
		script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = '$MANAGER_WIDGET/Common/API/TVKeyValue.js';
		document.head.appendChild(script);
		
		script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = '$MANAGER_WIDGET/Common/API/Plugin.js';
		document.head.appendChild(script);
		
		script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = '$MANAGER_WIDGET/Common/webapi/1.0/webapis.js';
		document.head.appendChild(script);
		
		script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = '$MANAGER_WIDGET/Common/webapi/1.0/deviceapis.js';
		document.head.appendChild(script);
		
		window.isWebRunning = false;

		console.log("** TV PROJECT **");
	}else{
		window.isWebRunning = true;

		console.log("%c** Samsung INIT **",'color:blue');
		window.Common = {
			API: {
				Widget: function(){
					this.sendReadyEvent = function(){
						console.log("** Samsung: windgetAPI - SENDREADYEVENT **");
						return true;
					},
					this.blockNavigation = function(event){
						console.log("** Samsung: windgetAPI - BLOCKNAVIGATION **");
						return true;
					},
					this.sendReturnEvent = function(){
						console.log("** Samsung: windgetAPI - SENDRETURNEVENT(Exit App) **");
						return true;
					},
					this.sendExitEvent = function(){
						console.log("** Samsung: windgetAPI - SENDEXITEVENT(Exit App) **");
						return true;
					}
				},
				Plugin:	function(){
					this.SetBannerState = function(param){
						console.log("** Samsung: Plugin - SetBannerState **");
					},
					this.unregistKey = function(param){
						console.log("** Samsung: Plugin - unregistKey("+param+") **");
					},
					this.registKey = function(param){
						console.log("** Samsung: Plugin - registKey("+param+") **");
					},
					this.unregistIMEKey = function(){
						console.log("** Samsung: Plugin - unregistIMEKey **");
					},
					this.registIMEKey = function(){
						console.log("** Samsung: Plugin - registIMEKey **");
					},
					this.setOnScreenSaver = function(){
						console.log("** Samsung: Plugin - setOnScreenSaver **");
					},
					this.setOffScreenSaver = function(){
						console.log("** Samsung: Plugin - setOffScreenSaver **");
					}
					this.setOnIdleEvent = function(){
						console.log("** Samsung: Plugin - setOnIdleEvent **");
					},
					this.setOffIdleEvent = function(){
						console.log("** Samsung: Plugin - setOffIdleEvent **");
					}
				},
				TVKeyValue: function(){
					this.KEY_RIGHT = 39, // DOWN
					this.KEY_LEFT = 37, // LEFT
					this.KEY_UP = 38, // UP
					this.KEY_DOWN = 40, //DOWN
					this.KEY_VOL_UP = 107, // +
					this.KEY_VOL_DOWN = 109, // -
					this.KEY_MUTE = 77, // M
					this.KEY_TOOLS = 84, // T
					this.KEY_INFO = 73, // I
					this.KEY_EMODE = '',
					this.KEY_DMA = '',
					this.KEY_MENU = '',
					this.KEY_SOURCE = '',
					this.KEY_PRECH = '',
					this.KEY_FAVCH = '',
					this.KEY_CHLIST = '',
					this.KEY_DMA = '',
					this.KEY_TTX_MIX = '',
					this.KEY_GUIDE = '',
					this.KEY_SUBTITLE = '',
					this.KEY_ASPECT = '',
					this.KEY_DOLBY_SRR = '',
					this.KEY_MTS = '',
					this.KEY_PANEL_CH_UP = '',
					this.KEY_PANEL_CH_DOWN = '',
					this.KEY_PANEL_VOL_UP = '',
					this.KEY_PANEL_VOL_DOWN = '',
					this.KEY_PANEL_ENTER = '',
					this.KEY_PANEL_SOURCE = '',
					this.KEY_PANEL_MENU = '',
					this.KEY_1 = 97, // 1
					this.KEY_2 = 98, // 2
					this.KEY_3 = 99, // 3
					this.KEY_4 = 100, // 4
					this.KEY_5 = 101, // 5
					this.KEY_6 = 102, // 6
					this.KEY_7 = 103, // 7
					this.KEY_8 = 104, // 8
					this.KEY_9 = 105, // 9
					this.KEY_0 = 96, // 0
					this.KEY_WHEELDOWN = '',
					this.KEY_WHEELUP = '',
					this.KEY_RED = 65, // A
					this.KEY_GREEN = 66, // B
					this.KEY_YELLOW = 67, // C
					this.KEY_BLUE = 68, // D
					this.KEY_RW = 82, // R
					this.KEY_PAUSE = 186, //;
					this.KEY_FF = 70, // F
					this.KEY_PLAY = 80, // P
					this.KEY_STOP = 83, // S
					this.KEY_ENTER = 13, // ENTER
					this.KEY_RETURN = 27, // ESC
					this.KEY_EXIT = 192 // TILDE
				}
			}
		};

		/*	webapis Simulator */
		var vol_simulator = 50;
		var mute_simulator = false;
		window.webapis = {
			audiocontrol: {
				getVolume: function(){ console.log("** Samsung: webapis.audiocontrol - GETVOLUME, actual vol = "+vol_simulator+" **"); return vol_simulator;},
				playSound: function(sound){console.log("** Samsung: webapis.audiocontrol - PLAYSOUND("+sound+") **");},
				getMute: function(){console.log("** Samsung: webapis.audiocontrol - GETMUTE, actual state = "+mute_simulator+" **"); return mute_simulator;},
				setMute: function(param){mute_simulator = param; console.log("** Samsung: webapis.audiocontrol - SETMUTE, actual state = "+mute_simulator+" **");},
				setVolume: function(param){vol_simulator = param; console.log("** Samsung: webapis.audiocontrol - SETVOLUME, actual vol = "+vol_simulator+" **"); return true;},
				setVolumeUp: function(){
					if(vol_simulator<100)
						vol_simulator++;
					console.log("** Samsung: webapis.audiocontrol - SETVOLUMEUP, actual vol = "+vol_simulator+" **");
				},
				setVolumeDown: function(){
					if(vol_simulator>0)
						vol_simulator--;
					console.log("** Samsung: webapis.audiocontrol - SETVOLUMEDOWN, actual vol = "+vol_simulator+" **");
				},
			},
			tv: {
				info: {
					getModel: function(){
						//return '13_FOXP';
						return 'X12';
					},
					getProduct: function () {
						var TV = 0, MONITOR = 1, BD = 2;
						return TV;
					}
				}
			}
		};
		
		window.deviceapis = {
			avplay: {
				getAVPlay: function(avPlaySucces, avPlayError){
					if(typeof avPlaySucces == "function"){
						avPlaySucces({
							init: function(){},
							open: function(){},
							play: function(){},
							stop: function(){},
							pause: function(){},
							resume: function(){},
							setDisplayRect: function(){}
						})
					}
				}
			}
		}
		
		window.curWidget = {
			id: ''
		};

		window.FileSystem = function () {
			this.openCommonFile = function(dir,type){
				var c_name = dir.replace(".data","").replace("/","");
				var regexp = new RegExp("(?:^" + c_name + "|;\\s*"+ c_name + ")=(.*?)(?:;|$)", "g");
				if(type=='w'){
					var cookie = c_name + "=" + escape("") + ";";
					var expires = new Date(new Date().getTime() + parseInt(10) * 1000 * 60 * 60 * 24);
					cookie += "expires=" + expires.toGMTString() + ";";
					document.cookie = cookie;
				}
				var result = regexp.exec(document.cookie);
				if(result === null){
					return null;
				}else
					return {
						name: c_name,
						val: result[1],
						writeAll:function(val){
							var cookie = this.name + "=" + escape(val) + ";";
							var expires = new Date(new Date().getTime() + parseInt(10) * 1000 * 60 * 60 * 24);
							cookie += "expires=" + expires.toGMTString() + ";";
							document.cookie = cookie;
						},
						readAll:function(){return unescape(this.val);}
					};
			};
			this.closeCommonFile = function(){
				console.log("closeCommonFile");
			};
			this.isValidCommonPath = function(){
				return true;
			};
			this.closeCommonFile = function(){
			};
			this.deleteCommonFile = function(){
			};
		}

		/* KeyBoard */
		window.IMEShell_Common = function () {
			// var previousKeys = getEventListeners(document).keydown[0].listener;
			this.inputboxID = '';
			this.inputTitle = '';
			this.setOnCompleteFunc = '';
			this.onShow = function () {
				// getEventListeners(document).keydown[0].remove();
				document.getElementById(this.inputboxID).focus();
				console.log('** Samsung: IMEShell_Common ShowKeyBoard')
			}
			
			function keys () {
				// TODO: Add new keys for the keyboard and remove it when the enter key is pressed
			}
		}
		
		window.clsid = {
			PLAYER: "clsid:SAMSUNG-INFOLINK-PLAYER",
			NETWORK: "clsid:SAMSUNG-INFOLINK-NETWORK",
			NNAVI: "clsid:SAMSUNG-INFOLINK-NNAVI",
			TVMW: "clsid:SAMSUNG-INFOLINK-TVMW",
			TV: "clsid:SAMSUNG-INFOLINK-TV"
		};
		

		/**
			Methods for player
			Video or Audio
		**/
		var videoElement = false;
		window.addEventListener('load', function(){
			var body = document.getElementsByTagName('body')[0];
			body.insertBefore(document.createElement('video'),body.firstChild);
			document.getElementsByTagName('video')[0].setAttribute('id','samsungVideo');
			document.getElementsByTagName('video')[0].setAttribute('width',0);
			document.getElementsByTagName('video')[0].setAttribute('height',0);
			document.getElementsByTagName('video')[0].setAttribute('style','position:absolute; top:0px; left:0px; z-index:-1000');

			videoElement = document.getElementById('samsungVideo');
		}, false);

		HTMLObjectElement.prototype.Stop = function(){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-PLAYER Player.Stop: id = "+this.getAttribute("id")+" ,  classid = "+this.getAttribute("classid")+" **");
			videoElement.pause();
			if (videoElement.currentTime)
				videoElement.currentTime = 0;
		};
		HTMLObjectElement.prototype.SetDisplayArea = function(x,y,w,h){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-PLAYER Player.SetDisplayArea: id = "+this.getAttribute("id")+" ,  classid = "+this.getAttribute("classid")+" **");
			videoElement.setAttribute('style','position:absolute; top:'+y+'px; left:'+x+'px');
			if ( w >= 960 )
				w = document.body.offsetWidth;
			if ( h >= 540 )
				h = document.body.offsetHeight;
			videoElement.setAttribute('width',w);
			videoElement.setAttribute('height',h);
		};
		HTMLObjectElement.prototype.Play = function(url){
			url = url.replace('undefined','');
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-PLAYER Player.Play url = "+url+" **");
			var type = videoElement;
			type.setAttribute('src',url);
			var self = this;
			var bg = window.getComputedStyle(document.body, null).getPropertyValue('background-Color');
			if(bg.indexOf('rgba') == -1 || (bg.indexOf('rgba') != -1 && bg[bg.indexOf(')') - 1] != "0")) {
				videoElement.setAttribute('width',0);
				videoElement.setAttribute('height',0);
				console.warn('%c** Samsung: If you are trying to play a video the background needs to be transparent.','color:blue');
				console.warn('%c** Samsung: body background-Color: '+ bg,'color:blue');
			}
			if (typeof self.OnBufferingStart == 'function')
				self.OnBufferingStart();
			setTimeout(function(){
				if (typeof self.OnBufferingComplete == 'function')
					self.OnBufferingComplete();

				var time = (parseInt(type.duration * 1000) + 1) - (type.currentTime * 1000);
				if (typeof self.OnRenderingComplete === 'function' && typeof time === 'number') {
					setTimeout(function() { self.OnRenderingComplete(); },time);
				}
				type.play();
			},1000);
			
		};
		HTMLObjectElement.prototype.Pause = function(){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-PLAYER Player.Pause **");
			videoElement.pause();
		};
		HTMLObjectElement.prototype.Resume = function(){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-PLAYER Player.Resume **");
			videoElement.play();
		};
		HTMLObjectElement.prototype.ResumePlay = function(url,time){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-PLAYER Player.ResumePlay url = "+url+" time=" +time+"  **");
			var self = this;
			videoElement.currentTime = time;
			self.Play(url);
		};

		HTMLObjectElement.prototype.OnBufferingStart = false;
		HTMLObjectElement.prototype.OnBufferingCompleteSamsung = false;
		HTMLObjectElement.prototype.OnRenderingComplete = false;

		HTMLObjectElement.prototype.SetBannerState = function(num){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-NNAVI NNaviPlugin num = "+num+" **");
		};
		HTMLObjectElement.prototype.GetLanguage = function(){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-TV GetLanguage **");
			var samsungTV_language = { KOR: 0, ENG: 1, ESP: 2 };
			return samsungTV_language.ENG;
		};
		HTMLObjectElement.prototype.GetFirmware = function(){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-TV GetFirmware **");
			return 'T-INFOLINK2013-1011';
			//return 'T-INFOLINK2012-1011';
		};
		HTMLObjectElement.prototype.GetDUID = function(mac){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-TV GetDUID **");
			return "BDCAAKYFDB4FQ";
		};
		HTMLObjectElement.prototype.GetProductType = function(){
			console.log("** Samsung: Plugin - GetProductType **");
			var TV = 0, MONITOR = 1, BD = 2;
			return TV;
		}


		/************/
		/* Network */
		/***********/
		window.internet_simulator = 1;
		HTMLObjectElement.prototype.CheckPhysicalConnection = function(test){
			// console.log("** Samsung: clsid:SAMSUNG-INFOLINK-NETWOR network status CheckPhysicalConnection **");
			return internet_simulator;
		};
		HTMLObjectElement.prototype.GetIP = function(type,numer){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-NETWOR network status GetIP **");
			return "105.102.15.207";
		};
		HTMLObjectElement.prototype.CheckHTTP= function(type,numer){
			// console.log("** Samsung: clsid:SAMSUNG-INFOLINK-NETWOR network status CheckHTTP **");
			return internet_simulator;
		};
		HTMLObjectElement.prototype.GetMAC= function(){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-NETWOR GetMAC **");
			return "0800279b3e8c";
		};
		HTMLObjectElement.prototype.GetActiveType = function(){
			// console.log("** Samsung: clsid:SAMSUNG-INFOLINK-NETWOR GetActiveType **");
			return 1;
		};

		/*************/
		/* Broadcast */
		/*************/
		HTMLObjectElement.prototype.SetPreviousSource = function(){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-WINDOW SetPreviousSource **");
		};
		HTMLObjectElement.prototype.SetScreenRect = function(x,y,w,h){
			var element = document.getElementById("pluginObjectWindow");
			element.innerHTML = "Broadcast";
			
			element.style.fontSize = "30px";
			element.style.display = "-webkit-box";
			element.style.webkitBoxPack = "center";
			element.style.webkitBoxAlign = "center";
			element.style.background = "-webkit-gradient(linear, left top, right bottom, color-stop(0%,#3b679e), color-stop(50%,#2b88d9), color-stop(51%,#207cca), color-stop(100%,#7db9e8))";
			element.style.width = Math.round(((document.body.offsetWidth*w)/960)) + "px";
			element.style.height = Math.round(((document.body.offsetHeight*h)/540)) + "px";
			element.style.left = x + "px";
			element.style.top = y + "px";
			
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-WINDOW SetScreenRect **");
		};
		HTMLObjectElement.prototype.GetSource = function(){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-WINDOW GetSource **");
		};
		HTMLObjectElement.prototype.SetSource = function(){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-WINDOW SetSource **");
		};
		
		/*************/
		/*    Time   */
		/*************/
		HTMLObjectElement.prototype.GetEpochTime = function(){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-TIME GetEpochTime **");
			return new Date().getTime();
		};
		HTMLObjectElement.prototype.ConvertEpochToLocalTime = function(epoch){
			console.log("** Samsung: clsid:SAMSUNG-INFOLINK-TIME ConvertEpochToLocalTime **");
			var date = new Date(epoch);
			return date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getHours() + "/" + date.getMinutes() + "/" + date.getSeconds();
		};

	}
})(window);