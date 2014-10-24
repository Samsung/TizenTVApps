
SceneManager.MainMenu =(function(){

	var SCENE_CONTAINER	= "#SceneMainMenu";

	SceneManager.onMainMenu = function(event, from, to, msg){

		if(!$("#SceneMainMenu").length){

			$("<div>").load("app/htmls/MainMenu.html", function(){

				$("body").append($(this).html());
 
				initScene();

			});
		} else {
			initScene();
		}

	};

	SceneManager.onleaveMainMenu = function(event, from, to, msg){
		SceneAnimations.out();
	};

	function initScene(){

		SceneAnimations.in(function(){

			Scene.text = SceneText;
			Scene.text();

			Scene.keys = SceneKeys;
		Scene.keys();
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
			switch(e.keyCode){
				case tvKey.KEY_ENTER:
					SceneManager.MainMenuToGame();
					break;
			}
		});
	}

	function SceneText(language_id){

		language.current = language_id || language.current;
	}

})();
