/*Samsung*/
var widgetAPI	= new Common.API.Widget(),
	tvKey		= new Common.API.TVKeyValue(),
	pluginAPI	= new Common.API.Plugin();

/*Scenes Creation*/
var SceneManager = StateMachine.create({

	events: [

		{name: "start", from: "none",   to: "Title"},
		{name: "TitleToGame", from: "Title",   to: "Game"},
		// {name: "MainMenuToGame", from: "MainMenu",   to: "Game"},
		// {name: "GameToGamePause", from: "Game",   to: "GamePause"},
		{name: "GameToGameEnd", from: "Game",   to: "GameEnd"},
		// {name: "GamePauseToGame", from: "GamePause",   to: "Game"},
		// {name: "GamePauseToMainMenu", from: "GamePause",   to: "MainMenu"},
		{name: "GameEndToTitle", from: "GameEnd",   to: "Title"},
		{name: "GameEndToGame", from: "GameEnd",   to: "Game"},
		{name: "GoToScene", from: "*",   to: "ShortcutToScene"},

	],

	callbacks: {

		onbeforestart: function(event, from, to){
			console.log("STARTING UP");
		},
		onstart: function(event, from, to){
			console.log("READY");
		},
		onchangestate: function(event, from, to){
			console.log("TRANSITION: " + from + " to " + to);
		},
		onafterevent: function(event, from, to){
			console.log("ENTER SCENE: " + to);
		},
		onleavestate: function(event, from, to){
			unbind_keys();
		}

	}

});
