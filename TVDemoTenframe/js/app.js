/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(['jquery'], function ($) {
    return function () {
        "use strict";

        window.isrotated = false;

        var piratesGame, rocketsGame, bowlingGame, activeGame;

        var menu = $("#game_menu");

        function closeMenu() {
            menu.removeClass("slide");
            menu.off("click").one("click", openMenu);
        }

        function openMenu() {
            menu.addClass("slide");
            menu.off("click").one("click", closeMenu);
        }

        function startGame(game) {
            activeGame = game;
            activeGame.start();
            $("#game_menu_border").show();
        }

        /* need to set isrotated so we can swap x/y axis for touch events */
        function resize()
        {
            if ($(window).width() > $(window).height())
                window.isrotated = false;
            else
                window.isrotated = true;
        }

        if (window.chrome&&window.chrome.i18n)
        {
            $("#home_pirates_text").html(chrome.i18n.getMessage("pirates_title"));
            $("#home_rockets_text").html(chrome.i18n.getMessage("rockets_title"));
            $("#home_bowling_text").html(chrome.i18n.getMessage("bowling_title"));
        }

        var touchToMouse = function(event) {
            if (event.touches.length > 1) return;
            var touch = event.changedTouches[0];
            var type = "";

            switch (event.type) {
            case "touchstart":
                type = "mousedown";
                break;
            case "touchmove":
                type="mousemove";
                break;
            case "touchend":
                type="mouseup";
                break;
            default:
                return;
            }

            var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1,
                touch.screenX, touch.screenY,
                touch.clientX, touch.clientY, false,
                false, false, false, 0, null);

            touch.target.dispatchEvent(simulatedEvent);
        };
        window.ontouchstart = touchToMouse;
        window.ontouchmove = touchToMouse;
        window.ontouchend = touchToMouse;

        piratesGame = new Pirates();
        $("#home_pirates").click(function() {
            startGame(piratesGame);
        });

        rocketsGame = new Rockets();
        $("#home_rockets").click(function() {
            startGame(rocketsGame);
        });

        bowlingGame = new Bowling();
        $("#home_bowling").click(function() {
            startGame(bowlingGame);
        });

        $("#game_menu_new").click(function(e){
            e.stopPropagation();

            closeMenu();

            startGame(activeGame);
        });

        $("#game_menu_home").click(function(e){
            e.stopPropagation();

            activeGame.close();
            activeGame = null;

            setTimeout(closeMenu, 0);
        });

        // set the initial event handler for the menu
        closeMenu();

        $(window).bind('resize', resize);
        resize();
    };
});
