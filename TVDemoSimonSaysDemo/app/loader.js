head.js(

	/*Default Libraries*/
	{Jquery: "app/javascripts/jquery.js"},
	{State_machine: "app/javascripts/state_machine.js"},
	{SrtObjects: "app/javascripts/srtObjects.js"},
	{SoundPlayer: "app/javascripts/soundPlayer.js"},

	/*Common functions*/
	{Common: "app/common.js"},
	{Init: "app/init.js"},

	/*Scenes functions*/
	{Title: "app/scenes/Title.js"},
	{MainMenu: "app/scenes/MainMenu.js"},
	{Game: "app/scenes/Game.js"},
	{GamePause: "app/scenes/GamePause.js"},
	{GameEnd: "app/scenes/GameEnd.js"},
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
