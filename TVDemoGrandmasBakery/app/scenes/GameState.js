/*jslint plusplus: true */
/*global SceneManager,Phaser,console,$*/

/*jslint plusplus: true */
/*global PhaserApp,Phaser,console*/
var PhaserApp = {
    keys: {
        up:     { isDown: false },
        down:   { isDown: false },
        left:   { isDown: false },
        right:  { isDown: false },
        enter:  { isDown: false }
    },
    GEM_SIZE:       118,
    GEM_SPACING:    0,
    GEM_SIZE_SPACED: 0,
    BOARD_COLS:     0,
    BOARD_ROWS:     0,
    BOARD_OFFSETX:   910,
    BOARD_OFFSETY:   60,
    MATCH_MIN:      3
    
};

PhaserApp.GameState = function (game) {
    'use strict';
	/*
    //	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    */
    
};

PhaserApp.GameState.prototype = {
    
    preload: function () {
        'use strict';
        this.load.spritesheet('gems', 'resources/images/cakes.png', PhaserApp.GEM_SIZE, PhaserApp.GEM_SIZE);
        this.load.image('plasma', 'resources/images/select.png');
        this.load.image('bg','resources/images/BAKERY BG-01.png');
        
    },
    
	create: function () {
        'use strict';
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        PhaserApp.GEM_SIZE_SPACED = PhaserApp.GEM_SIZE + PhaserApp.GEM_SPACING;
        
        //960x540   1280x720    1920x1080
        this.scale.minWidth   = 960;
		this.scale.minHeight  = 540;
		this.scale.maxWidth   = 1920;
		this.scale.maxHeight  = 1080;
		this.scale.setScreenSize();
        
        this.add.sprite(0,-10,'bg');
        
        this.score = 0;
        this.moves = 10;
        
        this.add.text(433,873,'High Score',{font:'36px LBRITEDI', fill: '#fff', fontWeight: 'italic'}).anchor.setTo(.5);
        this.highScore = 0;
        if (localStorage.getItem('highScore')) { 
            this.highScore = localStorage.highScore;
            this.noHighScore = false;
        }else {
            this.noHighScore = true;
        }
        
        this.add.text(187,873,'Score',{font:'36px LBRITEDI', fill: '#fff', fontWeight: 'italic'}).anchor.setTo(.5);
        this.add.text(673,873,'Moves',{font:'36px LBRITEDI', fill: '#fff', fontWeight: 'italic'}).anchor.setTo(.5);
        this.scoreLabel = this.add.text(187,920,this.score+"",{font:'48px LBRITED', fill: '#fff'});
        this.movesLabel = this.add.text(673,920,this.moves,{font:'48px LBRITED', fill: '#fff'});
        this.highScoreLabel = this.add.text(433,920,this.highScore+"",{font:'48px LBRITED', fill: '#fff'});
        this.scoreLabel.anchor.setTo(.5);
        this.movesLabel.anchor.setTo(.5);
        this.highScoreLabel.anchor.setTo(.5);
        this.plasmaBall = this.add.sprite( PhaserApp.BOARD_OFFSETX -1,  PhaserApp.BOARD_OFFSETY -3, "plasma");
        this.plasmaBall.scale.set(1.1);
        

        this.spawnBoard();

        // currently selected gem starting position. used to stop player form moving gems too far.
        this.selectedGem  = this.getGem(0, 0);
        this.selectedGemStartPos = { x: 0, y: 0 };

        // used to disable input while gems are dropping down and respawning
        this.allowInput = true;

	},

	update: function () {
        'use strict';
        // when the mouse is released with a gem selected
        // 1) check for matches
        // 2) remove matched gems
        // 3) drop down gems above removed gems
        // 4) refill the board
        if(!this.allowInput) {
            return;
        }
        
        if (PhaserApp.keys.left.isDown && PhaserApp.keys.enter.isDown === false) {
            PhaserApp.keys.left.isDown = false;
            if (this.selectedGemStartPos.x > 0) {
                this.selectGem(this.getGem(this.selectedGemStartPos.x - 1, this.selectedGemStartPos.y));
            } else {
                this.selectGem(this.getGem(PhaserApp.BOARD_COLS - 1, this.selectedGemStartPos.y));
            }

        }
        if (PhaserApp.keys.right.isDown && PhaserApp.keys.enter.isDown === false) {
            PhaserApp.keys.right.isDown = false;
            if (this.selectedGemStartPos.x < PhaserApp.BOARD_COLS - 1) {
                this.selectGem(this.getGem(this.selectedGemStartPos.x + 1, this.selectedGemStartPos.y));
            } else {
                this.selectGem(this.getGem(0, this.selectedGemStartPos.y));
            }
        }
        if (PhaserApp.keys.up.isDown && PhaserApp.keys.enter.isDown === false) {
            PhaserApp.keys.up.isDown = false;
            if (this.selectedGemStartPos.y > 0) {
                this.selectGem(this.getGem(this.selectedGemStartPos.x, this.selectedGemStartPos.y - 1));
            } else {
                this.selectGem(this.getGem(this.selectedGemStartPos.x, PhaserApp.BOARD_ROWS - 1));
            }
        }
        if (PhaserApp.keys.down.isDown && PhaserApp.keys.enter.isDown === false) {
            PhaserApp.keys.down.isDown = false;
            if (this.selectedGemStartPos.y < PhaserApp.BOARD_ROWS - 1) {
                this.selectGem(this.getGem(this.selectedGemStartPos.x, this.selectedGemStartPos.y + 1));
            } else {
                this.selectGem(this.getGem(this.selectedGemStartPos.x, 0));
            }
        }


        if (PhaserApp.keys.enter.isDown) {
            if (this.selectedGem === null) {
                this.selectedGem = this.getGem(this.selectedGemStartPos.x, this.selectedGemStartPos.y);
            }
            this.tempShiftedGem = null;
            if (PhaserApp.keys.left.isDown) {
                if (this.selectedGemStartPos.x - 1 >= 0) {
                    this.tempShiftedGem = this.getGem(this.selectedGemStartPos.x - 1, this.selectedGemStartPos.y);
                }
                PhaserApp.keys.left.isDown = false;
            }
            if (PhaserApp.keys.right.isDown) {
                if (this.selectedGemStartPos.x + 1 < PhaserApp.BOARD_COLS) {
                    this.tempShiftedGem = this.getGem(this.selectedGemStartPos.x + 1, this.selectedGemStartPos.y);
                }
                PhaserApp.keys.right.isDown = false;
            }
            if (PhaserApp.keys.up.isDown) {
                if (this.selectedGemStartPos.y - 1 >= 0) {
                    this.tempShiftedGem = this.getGem(this.selectedGemStartPos.x, this.selectedGemStartPos.y - 1);
                }
                PhaserApp.keys.up.isDown = false;
            }
            if (PhaserApp.keys.down.isDown) {
                if (this.selectedGemStartPos.y + 1 < PhaserApp.BOARD_ROWS) {
                    this.tempShiftedGem = this.getGem(this.selectedGemStartPos.x, this.selectedGemStartPos.y + 1);
                }
                PhaserApp.keys.down.isDown = false;
            }

            if (this.tempShiftedGem !== null) {
                this.moves--;
                this.movesLabel.setText(this.moves + " of 10");
                this.tweenGemPos(this.tempShiftedGem, this.selectedGem.posX, this.selectedGem.posY);
                this.tweenGemPos(this.selectedGem, this.tempShiftedGem.posX, this.tempShiftedGem.posY);
                this.swapGemPosition(this.selectedGem, this.tempShiftedGem);
                this.selectGem(this.selectedGem);
                PhaserApp.keys.enter.isDown = false;
                this.allowInput = false;
                this.time.events.add(200, this.checkMatches, this);

            }
        }
	},
    checkMatches: function () {
        'use strict';
        var gemMatches = this.evalBoardForMatches(),
            dropGemDuration;
        
        if (!gemMatches) {
            this.tweenGemPos(this.selectedGem, this.tempShiftedGem.posX, this.tempShiftedGem.posY);
            this.tweenGemPos(this.tempShiftedGem, this.selectedGem.posX, this.selectedGem.posY);
            this.swapGemPosition(this.selectedGem, this.tempShiftedGem);
            this.allowInput = true;
            this.selectGem(this.selectedGem);
            
            if (this.moves <= 0) {
                if (localStorage.highScore) {
                    if (this.score > Number(localStorage.highScore)) {
                        localStorage.highScore = this.score;
                    }
                }else {
                    localStorage.highScore = this.score;                
                }
                //SceneManager.GameStateToMainMenu();
                this.game.paused = true;
                popupExit.show();
            }
            
            
        } else {
            this.removeKilledGems();

            dropGemDuration = this.dropGems();
            this.time.events.add(dropGemDuration * 100, this.refillBoard, this); // delay board refilling until all existing gems have dropped down

            
        }
    },

    // fill the screen with as many gems as possible
    spawnBoard: function () {
        'use strict';
        var i,
            j,
            gem = null;
        
        /*PhaserApp.BOARD_COLS = Phaser.Math.floor(this.world.width / PhaserApp.GEM_SIZE_SPACED);
        PhaserApp.BOARD_ROWS = Phaser.Math.floor(this.world.height / PhaserApp.GEM_SIZE_SPACED);*/
        PhaserApp.BOARD_COLS = 8;
        PhaserApp.BOARD_ROWS = 8;
        this.gems = this.add.group();
        for (i = 0; i < PhaserApp.BOARD_COLS; i++) {
            for (j = 0; j < PhaserApp.BOARD_ROWS; j++) {
                gem = this.gems.create(i * PhaserApp.GEM_SIZE_SPACED + PhaserApp.BOARD_OFFSETX, j * PhaserApp.GEM_SIZE_SPACED + PhaserApp.BOARD_OFFSETY, "gems");
                gem.inputEnabled = true;
                this.randomizeGemColor(gem);
                this.setGemPos(gem, i, j); // each gem has a position on the board
            }
        }
    },

    // select a gem and remember its starting position
    selectGem: function (gem, pointer) {
        'use strict';
        if (this.allowInput) {
            this.selectedGem = gem;
            this.selectedGemStartPos.x = gem.posX;
            this.selectedGemStartPos.y = gem.posY;
            this.add.tween(this.plasmaBall).to({x: this.selectedGemStartPos.x * PhaserApp.GEM_SIZE_SPACED  + PhaserApp.BOARD_OFFSETX -1, y: this.selectedGemStartPos.y * PhaserApp.GEM_SIZE_SPACED  + PhaserApp.BOARD_OFFSETY - 3}, 100, Phaser.Easing.Linear.None, true);
        }
    },

    // find a gem on the board according to its position on the board
    getGem: function (posX, posY) {
        'use strict';
        return this.gems.iterate("id", this.calcGemId(posX, posY), Phaser.Group.RETURN_CHILD);
    },

    // convert world coordinates to board position
    getGemPos: function (coordinate) {
        'use strict';
        return Phaser.Math.floor(coordinate / PhaserApp.GEM_SIZE_SPACED)+ PhaserApp.BOARD_OFFSET;
    },

    // set the position on the board for a gem
    setGemPos: function (gem, posX, posY) {
        'use strict';
        gem.posX = posX;
        gem.posY = posY;
        gem.id = this.calcGemId(posX, posY);
    },

    // the gem id is used by getGem() to find specific gems in the group
    // each position on the board has a unique id
    calcGemId: function (posX, posY) {
        'use strict';
        return posX + posY * PhaserApp.BOARD_COLS;
    },

    // since the gems are a spritesheet, their color is the same as the current frame number
    getGemColor: function (gem) {
        'use strict';
        return gem.frame;
    },

    // set the gem spritesheet to a random frame
    randomizeGemColor: function (gem) {
        'use strict';
        gem.frame = ( this.rnd.integerInRange(0, Math.floor(gem.animations.frameTotal / 3 )  - 1))* 3;
        gem.animations.add('destroy',[gem.frame, gem.frame + 1, gem.frame + 2], 15);
    },

    // gems can only be moved 1 square up/down or left/right
    checkIfGemCanBeMovedHere: function (fromPosX, fromPosY, toPosX, toPosY) {
        'use strict';
        if (toPosX < 0 || toPosX >= PhaserApp.BOARD_COLS || toPosY < 0 || toPosY >= PhaserApp.BOARD_ROWS) {
            return false;
        }
        if (fromPosX === toPosX && fromPosY >= toPosY - 1 && fromPosY <= toPosY + 1) {
            return true;
        }
        if (fromPosY === toPosY && fromPosX >= toPosX - 1 && fromPosX <= toPosX + 1) {
            return true;
        }
        return false;
    },

    // count how many gems of the same color lie in a given direction
    // eg if moveX=1 and moveY=0, it will count how many gems of the same color lie to the right of the gem
    // stops counting as soon as a gem of a different color or the board end is encountered
    countSameColorGems: function (startGem, moveX, moveY) {
        'use strict';
        var curX = startGem.posX + moveX,
            curY = startGem.posY + moveY,
            count = 0;
        while (curX >= 0 && curY >= 0 && curX < PhaserApp.BOARD_COLS && curY < PhaserApp.BOARD_ROWS && this.getGemColor(this.getGem(curX, curY)) === this.getGemColor(startGem)) {
            count++;
            curX += moveX;
            curY += moveY;
        }
        return count;
    },

    // swap the position of 2 gems when the player drags the selected gem into a new location
    swapGemPosition: function (gem1, gem2) {
        'use strict';
        var tempPosX = gem1.posX,
            tempPosY = gem1.posY;
        
        this.setGemPos(gem1, gem2.posX, gem2.posY);
        this.setGemPos(gem2, tempPosX, tempPosY);
    },

    // count how many gems of the same color are above, below, to the left and right
    // if there are more than 3 matched horizontally or vertically, kill those gems
    // if no match was made, move the gems back into their starting positions
    evalBoardForMatches: function () {
        'use strict';
        
        
        this.matches = false;
        
        this.gems.forEach(function (gem) {
            var countUp = this.countSameColorGems(gem, 0, -1),
                countDown = this.countSameColorGems(gem, 0, 1),
                countLeft = this.countSameColorGems(gem, -1, 0),
                countRight = this.countSameColorGems(gem, 1, 0),
                countHoriz = countLeft + countRight + 1,
                countVert = countUp + countDown + 1;

            if (countVert >= PhaserApp.MATCH_MIN) {
                this.score += countVert * 10;                
                this.scoreLabel.setText(this.score);
                if (this.noHighScore) {
                    this.highScoreLabel.setText(this.score);
                }
                this.killGemRange(gem.posX, gem.posY - countUp, gem.posX, gem.posY + countDown);
            }

            if (countHoriz >= PhaserApp.MATCH_MIN) {
                this.score += countHoriz * 10;
                this.scoreLabel.setText(this.score);
                if (this.noHighScore) {
                    this.highScoreLabel.setText(this.score);
                }
                this.killGemRange(gem.posX - countLeft, gem.posY, gem.posX + countRight, gem.posY);
            }

            if (this.matches === false) {
                this.matches = (countVert >= PhaserApp.MATCH_MIN || countHoriz >= PhaserApp.MATCH_MIN);
            }
        }, this);
        return this.matches;
        
    },

    // kill all gems from a starting position to an end position
    killGemRange: function (fromX, fromY, toX, toY) {
        'use strict';
        var i,
            j,
            gem;
        
        fromX = Phaser.Math.clamp(fromX, 0, PhaserApp.BOARD_COLS - 1);
        fromY = Phaser.Math.clamp(fromY, 0, PhaserApp.BOARD_ROWS - 1);
        toX = Phaser.Math.clamp(toX, 0, PhaserApp.BOARD_COLS - 1);
        toY = Phaser.Math.clamp(toY, 0, PhaserApp.BOARD_ROWS - 1);
        for (i = fromX; i <= toX; i++) {
            for (j = fromY; j <= toY; j++) {
                gem = this.getGem(i, j);
                //gem.kill();
                gem.play('destroy', 9, false, true);
            }
        }
    },

    // move gems that have been killed off the board
    removeKilledGems: function () {
        'use strict';
        this.gems.forEach(function (gem) {
            if (!gem.alive) {
                this.setGemPos(gem, -1, -1);
            }
        }, this);
    },

    // animated gem movement
    tweenGemPos: function (gem, newPosX, newPosY, durationMultiplier) {
        'use strict';
        if (typeof durationMultiplier === "undefined") {
            durationMultiplier = 1;
        }
        return this.add.tween(gem).to({x: newPosX  * PhaserApp.GEM_SIZE_SPACED + PhaserApp.BOARD_OFFSETX , y: newPosY * PhaserApp.GEM_SIZE_SPACED + PhaserApp.BOARD_OFFSETY}, 100 * durationMultiplier, Phaser.Easing.Linear.None, true);
    },

    // look for gems with empty space beneath them and move them down
    dropGems: function () {
        'use strict';
        var dropRowCountMax = 0,
            dropRowCount,
            i,
            j,
            gem;
        
        for (i = 0; i < PhaserApp.BOARD_COLS; i++) {
            dropRowCount = 0;
            for (j = PhaserApp.BOARD_ROWS - 1; j >= 0; j--) {
                gem = this.getGem(i, j);
                if (gem === null) {
                    dropRowCount++;
                } else if (dropRowCount > 0) {
                    this.setGemPos(gem, gem.posX, gem.posY + dropRowCount);
                    this.tweenGemPos(gem, gem.posX, gem.posY, dropRowCount);
                }
            }
            dropRowCountMax = Math.max(dropRowCount, dropRowCountMax);
        }
        return dropRowCountMax;
    },

    // look for any empty spots on the board and spawn new gems in their place that fall down from above
    refillBoard: function () {
        'use strict';
        var maxGemsMissingFromCol = 0,
            gemsMissingFromCol,
            i,
            j,
            gem;
        
        for (i = 0; i < PhaserApp.BOARD_COLS; i++) {
            gemsMissingFromCol = 0;
            for (j = PhaserApp.BOARD_ROWS - 1; j >= 0; j--) {
                gem = this.getGem(i, j);
                if (gem === null) {
                    gemsMissingFromCol++;
                    gem = this.gems.getFirstDead();
                    gem.reset(i * PhaserApp.GEM_SIZE_SPACED + PhaserApp.BOARD_OFFSETX, -gemsMissingFromCol * PhaserApp.GEM_SIZE_SPACED + PhaserApp.BOARD_OFFSETY);
                    this.randomizeGemColor(gem);
                    this.setGemPos(gem, i, j);
                    this.tweenGemPos(gem, gem.posX, gem.posY, gemsMissingFromCol * 2);
                }
            }
            maxGemsMissingFromCol = Math.max(maxGemsMissingFromCol, gemsMissingFromCol);
        }
        this.time.events.add(maxGemsMissingFromCol * 2 * 100, this.boardRefilled, this);
    },

    // when the board has finished refilling, re-enable player input
    boardRefilled: function () {
        'use strict';
        
        if (this.evalBoardForMatches()) {
            this.removeKilledGems();
            this.time.events.add(this.dropGems() * 100, this.refillBoard, this); // delay board refilling until all existing gems have dropped down
        } else {
            if (this.moves > 0) {
                this.allowInput = true;
                this.selectGem(this.getGem(this.selectedGemStartPos.x, this.selectedGemStartPos.y));
            }else {
                if (localStorage.highScore) {
                    if (this.score > Number(localStorage.highScore)) {
                        localStorage.highScore = this.score;
                    }
                }else {
                    localStorage.highScore = this.score;                
                }
                //SceneManager.GameStateToMainMenu();
                this.game.paused = true;
                popupExit.show();
                
            }
        }
    }
	

};


var game;

SceneManager.GameState = (function () {

	SceneManager.onGameState = function (event, from, to, msg) {

		if (!$("#SceneGameState").length) {

			$("<div>").load("app/htmls/GameState.html", function(){

				$("body").append($(this).html());
 
				initScene();

			});
		} else {
			initScene();
		}

	};

	SceneManager.onleaveGameState = function(event, from, to, msg){
        game.destroy();
        $('canvas').remove();
	};

	function initScene(){

		// Language strings
		Scene.text = SceneText;
		Scene.text();

		Scene.keys = SceneKeys;
		Scene.keys();
        
        game = new Phaser.Game(1920, 1080, Phaser.CANVAS, 'game');
        game.state.add('GameState', PhaserApp.GameState);
        game.state.start('GameState');
        

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
            console.log(e.keyCode);
			switch(e.keyCode){
				case tvKey.KEY_LEFT:
                    PhaserApp.keys.left.isDown = true;
					break;
				case tvKey.KEY_UP:
                    PhaserApp.keys.up.isDown = true;
					break;
				case tvKey.KEY_DOWN:
                    PhaserApp.keys.down.isDown = true;
					break;
				case tvKey.KEY_RIGHT:
                    PhaserApp.keys.right.isDown = true;
					break;
				case tvKey.KEY_ENTER:
                    PhaserApp.keys.enter.isDown = true;
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
