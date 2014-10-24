
SceneManager.ShortcutToScene =(function(){

	SceneManager.onShortcutToScene = function(event, from, to, msg){

		SceneManager.current = msg.to;
		SceneManager["on" + msg.to]("GoToScene", from, msg.to, msg.msg);

	};

})();
