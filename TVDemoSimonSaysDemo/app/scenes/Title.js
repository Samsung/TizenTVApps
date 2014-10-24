
SceneManager.Title =(function(){

	var SCENE_CONTAINER	= "#SceneTitle",
		soundPlayer = null;

	SceneManager.onTitle = function(event, from, to, msg){

		if(!$("#SceneTitle").length){

			$("<div>").load("app/htmls/Title.html", function(){

				$("body").append($(this).html());
 
				initScene();

			});
		} else {
			initScene();
		}

	};

	SceneManager.onleaveTitle = function(event, from, to, msg){
		SceneAnimations.out(function(){
			SceneManager.transition();
			
			$(SCENE_CONTAINER).remove();
		});
		
		return StateMachine.ASYNC;
	};

	function initScene(){

		SceneAnimations.in(function(){
			Scene.keys = SceneKeys;
			Scene.keys();

			if (soundPlayer === null) {
				soundPlayer = new SoundPlayer({
		            urls: ['resources/sounds/pop-rock-loop.wav'],
  					loop: true
		        });

		        soundPlayer.play();
			}
		});
	}

	var SceneAnimations = {
		in: function(callback){
			$(SCENE_CONTAINER).addClass("visible");
			animation({
				id: SCENE_CONTAINER,
				transitionClass: "fade-in",
				duration: animationDuration.FADE_IN,
				timingFunction: "ease-in-out",
				callback: callback
			});
		},

		out: function(callback){
			animation({
				id: SCENE_CONTAINER,
				transitionClass: "fade-out",
				duration: animationDuration.FADE_OUT,
				timingFunction: "ease-in-out",
				callback: function(){
					$(SCENE_CONTAINER).removeClass("visible");
					
					if(typeof callback === "function") {
						callback();
					}
				}
			});
		}
	}

	function SceneKeys(){

		unbind_keys();

		$(document).keydown(function(e){
			switch(e.keyCode) {
				case tvKey.KEY_ENTER:
					SceneManager.TitleToGame();
					break;
			}
		});
	}

	function SceneText(language_id){

		language.current = language_id || language.current;
	}

})();
