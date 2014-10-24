head.js(

	/*Default Libraries*/
	{Jquery: "app/javascripts/jquery.js"},
	{State_machine: "app/javascripts/state_machine.js"},
	{SrtObjects: "app/javascripts/srtObjects.js"},
	/*{Phaser: "app/javascripts/phaser.min.js"},*/
	{Phaser: "app/javascripts/phaser.js"},
	{SoundPlayer: "app/javascripts/soundPlayer.js"},
    

	/*Common functions*/
	{Common: "app/common.js"},
	{Init: "app/init.js"},

	/*Scenes functions*/
	{Loading: "app/scenes/Loading.js"},
	{MainMenu: "app/scenes/MainMenu.js"},
	{GameState: "app/scenes/GameState.js"},
	{Score: "app/scenes/Score.js"},
	{ShortcutToScene: "app/scenes/ShortcutToScene.js"},

	/*Language management*/
	{LangConfig: "resources/language/langConfig.js"},
	{Eng: "resources/language/eng.js"},

	function(){

		/*Start Scene Manager after all scripts are loaded*/
		console.log("ALL LOADED");

		"use strict";

		widgetAPI.sendReadyEvent();

		SceneManager.start();

});

/*
head.ready("jQuery", function(){
	console.log("JAVASCRIPT LOADED: jQuery library");
});
*/
