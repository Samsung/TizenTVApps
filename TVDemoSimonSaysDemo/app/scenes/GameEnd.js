
SceneManager.GameEnd =(function(){

	var SCENE_CONTAINER	= "#SceneGameEnd",
		optionsList		= null;

	SceneManager.onGameEnd = function(event, from, to, msg){

		if(!$("#SceneGameEnd").length){

			$("<div>").load("app/htmls/GameEnd.html", function(){

				$("body").append($(this).html());

				if (msg.isHighScore) {
					$("#score-end-text").html("New high score");
				} else {
					$("#score-end-text").html("Score");
				}

				assignScore("#score-end-score", msg.score);

				optionsList = new ListFocusManager({
					id: "options-menu",
					infinite: true
				});
 
				initScene();

			});
		} else {
			initScene();
		}

	};

	SceneManager.onleaveGameEnd = function(event, from, to, msg){
		SceneAnimations.out(function(){
			$(SCENE_CONTAINER).remove();
		});
	};

	function initScene(){

		SceneAnimations.in(function() {

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
		},
	}

	function SceneKeys(){

		unbind_keys();

		$(document).keydown(function(e){
			switch(e.keyCode){
				case tvKey.KEY_UP:
					optionsList.up();
					break;
				case tvKey.KEY_DOWN:
					optionsList.down();
					break;
				case tvKey.KEY_ENTER:
					switch(optionsList.getIndex()){
						case 0:
							SceneManager.GameEndToGame();
						break;
						case 1:
							SceneManager.GameEndToTitle();
						break;
					}
					break;
				case tvKey.KEY_EXIT:
					break;
			}
		});
	}

	function SceneText(language_id){

		language.current = language_id || language.current;
	}

	function assignScore(element, score) {
		var scoreAssignment = [];
		$(element).html('');
		var newScore = score;
		do {
			var num = '';
			switch(newScore % 10) {
				case 0:
					num = 'zero';
					break;
				case 1:
					num = 'one';
					break;
				case 2:
					num = 'two';
					break;
				case 3:
					num = 'three';
					break;
				case 4:
					num = 'four';
					break;
				case 5:
					num = 'five';
					break;
				case 6:
					num = 'six';
					break;
				case 7:
					num = 'seven';
					break;
				case 8:
					num = 'eight';
					break;
				case 9:
					num = 'nine';
					break;
			} 
			scoreAssignment.unshift(num);
			newScore = parseInt(newScore / 10);
		} while(newScore !== 0);
		for (var i = 0; i < scoreAssignment.length; i++) {
			$(element).append('<div class="zenith-' + scoreAssignment[i] + '"></div>');
		}
	}

})();
