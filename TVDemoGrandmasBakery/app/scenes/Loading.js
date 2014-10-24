SceneManager.Loading = (function () {

    SceneManager.onLoading = function (event, from, to, msg) {

        if (!$("#SceneLoading").length) {

            $("<div>").load("app/htmls/Loading.html", function () {

                $("body").append($(this).html());

                initScene();

            });
        } else {
            initScene();
        }

    };

    SceneManager.onleaveLoading = function (event, from, to, msg) {

    };

    function initScene() {

        // Language strings
        Scene.text = SceneText;
        Scene.text();

        Scene.keys = SceneKeys;
        Scene.keys();
        SceneManager.LoadingToMainMenu();
    }

    var SceneAnimations = { in : function () {},

        out: function () {}
    }

    function SceneKeys() {

        unbind_keys();

        $(document).keydown(function (e) {
            switch (e.keyCode) {
            case tvKey.KEY_LEFT:
                break;
            case tvKey.KEY_UP:
                break;
            case tvKey.KEY_DOWN:
                break;
            case tvKey.KEY_RIGHT:
                break;
            case tvKey.KEY_ENTER:
                SceneManager.LoadingToMainMenu();
                break;
            case tvKey.KEY_RETURN:
                break;
            case tvKey.KEY_EXIT:
                break;
            }
        });
    }

    function SceneText(language_id) {

        language.current = language_id || language.current;
    }

})();