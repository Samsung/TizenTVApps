/*Samsung*/
var widgetAPI	= new Common.API.Widget(),
	tvKey		= new Common.API.TVKeyValue(),
	pluginAPI	= new Common.API.Plugin();

/*Scenes Creation*/
var SceneManager = StateMachine.create({

	events: [

		{name: "start", from: "none",   to: "Loading"},
		{name: "LoadingToMainMenu", from: "Loading",   to: "MainMenu"},
		{name: "MainMenuToGameState", from: "MainMenu",   to: "GameState"},
		{name: "GameStateToMainMenu", from: "GameState",   to: "MainMenu"},
		{name: "GameStateToScore", from: "GameState",   to: "Score"},
		{name: "ScoreToGameState", from: "Score",   to: "GameState"},
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
