
SceneManager.Game =(function(){

	var SCENE_CONTAINER	= "#SceneGame";
	var game = null;
	var canKeyDown = false;

	SceneManager.onGame = function(event, from, to, msg){

		if(!$("#SceneGame").length){

			$("<div>").load("app/htmls/Game.html", function(){

				$("body").append($(this).html());
 
				initScene();

			});
		} else {
			initScene();
		}

	};

	SceneManager.onleaveGame = function(event, from, to, msg){
		SceneAnimations.out(function(){
			$(SCENE_CONTAINER).remove();
		});
	};

	function initScene(){

		SceneAnimations.in(function(){
			Scene.text = SceneText;
			Scene.text();

			Scene.keys = SceneKeys;
			Scene.keys();

			SimonGame.init();
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

		inOut: function(element, callback) {
			$(element).addClass("visible");
			animation({
				id: element,
				transitionClass: "fade-in-out",
				duration: animationDuration.FADE_IN_OUT,
				timingFunction: "ease-in-out",
				callback: function(){
					$(element).removeClass("visible");
					
					if(typeof callback === "function") {
						callback();
					}
				}
			});
		},

		outInText: function(element, callback) {
			animation({
				id: element,
				transitionClass: "fade-out",
				duration: animationDuration.FADE_OUT,
				timingFunction: "ease-in-out",
				callback: function(){

					if(typeof callback === "function") {
						callback();
					}

					animation({
						id: element,
						transitionClass: "fade-in",
						duration: animationDuration.FADE_IN,
						timingFunction: "ease-in-out",
						callback: callback
					});
				}
			});
		},
	}

	function SceneKeys(){

		unbind_keys();

		$(document).keydown(function(e){
			if (canKeyDown) {
				switch(e.keyCode){
					case tvKey.KEY_RED:
						SimonGame.checkInput(0);
						break;
					case tvKey.KEY_BLUE:
						SimonGame.checkInput(3);
						break;
					case tvKey.KEY_GREEN:
						SimonGame.checkInput(1);
						break;
					case tvKey.KEY_YELLOW:
						SimonGame.checkInput(2);
						break;
					case tvKey.KEY_RETURN:
						break;
					case tvKey.KEY_EXIT:
						break;
				}
			}
		});
	}

	function SceneText(language_id){

		language.current = language_id || language.current;
	}

	var SimonGame = {

		init: function() {
			this.level = 1;
			this.sequence = [];
			this.masterSequence = [];
			this.score = 0;
			this.life = 3;
			this.highScore = localStorage.SimonSaysHighScore ? localStorage.SimonSaysHighScore : 0;
			this.assignScore('#game-high-score', this.highScore);
			this.assignScore('#game-score-amount', 0);
			$('#multiplier').html('X1');
			$('.life').removeClass('lost');
			$('#information').html('Get Ready');
			$('#round').html('Round 1');
			canKeyDown = false;
			if (this.timeouts) {
				for(timeout in this.timeouts) {
					clearInterval(this.timeouts[timeout]);
				}
			}
			this.timeouts = [];
			this.createSequence();
			this.colors = ["r", "g", "b", "y"];
		},

		createSequence: function() {
			for (var i = 0; i < this.level + 2; i++) {
				var color = parseInt(Math.random() * 4);
				this.masterSequence.push(color);
			}

			var context = this;

			this.timeouts.push(setTimeout(function(){
				
				context.sequence = context.masterSequence.slice(0);

				context.animateSequence();
			}, 4000));

			this.timeouts.push(setTimeout(function(){
				SceneAnimations.outInText('#information', function(){
					$('#information').html('3');
				});
			}, 1000));
			this.timeouts.push(setTimeout(function(){
				SceneAnimations.outInText('#information', function(){
					$('#information').html('2');
				});
			}, 2000));
			this.timeouts.push(setTimeout(function(){
				SceneAnimations.outInText('#information', function(){
					$('#information').html('1');
				});
			}, 3000));
		},

		addToSequence: function() {
			var color = parseInt(Math.random() * 4);
			this.masterSequence.push(color);
			this.sequence = this.masterSequence.slice(0);
			this.animateSequence();
		},

		animateSequence: function() {
			SceneAnimations.outInText('#information', function(){
					$('#information').html('Watch the sequence');
				});
			
			for (var i = 0; i < this.level + 2; i++) {
				var color = this.sequence[i];
				var time = 800 * i;
				switch(color) {
					case 0:
						this.animateFlash(time, '#red');
						break;
					case 1:
						this.animateFlash(time, '#green');
						break;
					case 2:
						this.animateFlash(time, '#yellow');
						break;
					case 3:
						this.animateFlash(time, '#blue');
						break;
				}
			}

			this.timeouts.push(setTimeout(function(){
				canKeyDown = true;
				SceneAnimations.outInText('#information', function(){
					$('#information').html('Your turn');
				});
			}, 800 * (this.level + 2)));
		},

		animateFlash: function(time, element, callback) {
			this.timeouts.push(setTimeout(function() {
				$(element).hide();
				$(element + '-selected').show();
			}, time));
			this.timeouts.push(setTimeout(function(){
				$(element + '-selected').hide();
				$(element).show();
				if (typeof callback === 'function') {
					callback();
				}
			}, time + 500));
		},

		checkInput: function(input) {
			canKeyDown = false;
			var value = this.sequence.shift();
			if (value !== input) {
				if (this.life > 1) {
					this.sequence.unshift(value);
					this.loseLife();
					return;
				} else {
					return this.loseGame();
				}
			} else if (this.sequence.length === 0) {
				this.score += (200 * this.level);
				this.assignScore('#game-score-amount', this.score);
				var level = ++this.level;
				SceneAnimations.outInText('#multiplier', function(){
					$('#multiplier').html('X' + level);
				});
				var color = "";
				switch(input) {
					case 0:
						color = '#red';
						break;
					case 1:
						color = '#green';
						break;
					case 2:
						color = '#yellow';
						break;
					case 3:
						color = '#blue';
						break;
				}
				this.animateFlash(0, color);
				return this.sequenceEnd();
			} else {
				this.score += (100 * this.level);
				this.assignScore('#game-score-amount', this.score);
				var color = "";
				switch(input) {
					case 0:
						color = '#red';
						break;
					case 1:
						color = '#green';
						break;
					case 2:
						color = '#yellow';
						break;
					case 3:
						color = '#blue';
						break;
				}
				this.animateFlash(0, color, function(){
					canKeyDown = true;
				});
			}
		},

		loseLife: function() {
			$('#life-' + this.life).addClass('lost');
			this.life--;
			canKeyDown = true;
		},

		sequenceEnd: function() {
			canKeyDown = false;
			var level = this.level;

			this.timeouts.push(setTimeout(function(){
				SceneAnimations.outInText('#round', function(){
					$('#round').html('Round ' + level);
				});
				SceneAnimations.outInText('#information', function(){
					$('#information').html('Well done!');
				});
			}, 500));

			this.timeouts.push(setTimeout(function(){
				SimonGame.addToSequence();
			}, 2000));
		},

		loseGame: function() {
			canKeyDown = false;
			var isHighScore = this.highScore < this.score ? true : false;
			localStorage.SimonSaysHighScore = isHighScore ? this.score : this.highScore;
			SceneManager.GameToGameEnd({score: this.score, isHighScore: isHighScore});
		},

		assignScore: function(element, score) {
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
		},
	};
})();

