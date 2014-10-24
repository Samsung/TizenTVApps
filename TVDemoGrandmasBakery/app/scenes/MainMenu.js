var gameSound = null;
SceneManager.MainMenu =(function(){

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

	};

	function initScene(){
        if (!gameSound) {
            gameSound = new SoundPlayer({
          urls: ['resources/sounds/song.wav'],
            loop: true,
        }).play();
        }
        
		// Language strings
		Scene.text = SceneText;
		Scene.text();

		Scene.keys = SceneKeys;
		Scene.keys();

	}

	var SceneAnimations = {
		in: function(){ 
		},

		out: function(){ 
		}
	}

	function SceneKeys(){

		unbind_keys();

		$(document).keydown(function(e){
			switch(e.keyCode){
				case tvKey.KEY_LEFT:
					break;
				case tvKey.KEY_UP:
					break;
				case tvKey.KEY_DOWN:
					break;
				case tvKey.KEY_RIGHT:
					break;
				case tvKey.KEY_ENTER:
                    SceneManager.MainMenuToGameState();
					break;
				case tvKey.KEY_RETURN:
					break;
				case tvKey.KEY_EXIT:
					break;
			}
		});
	}

	function SceneText(language_id){

		language.current = language_id || language.current;
	}

})();
