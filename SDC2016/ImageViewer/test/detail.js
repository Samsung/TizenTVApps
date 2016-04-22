$(document).ready(function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'media/Forever.mp3');
    var $fotoramaDiv = $('#fotorama').fotorama();
    var fotorama = $fotoramaDiv.data('fotorama');
    $("#light-overlay").hide();

    $('.fotorama').on("fotorama:fullscreenenter", function() {
        fotorama.startAutoplay(2000);
        if (!$("#disable").hasClass("displaynoe")) {
            audioElement.play();
        }
    });


    $('.fotorama').on("fotorama:fullscreenexit", function() {
        //fotorama.stopAutoplay();
        // audioElement.pause();
          fotorama.startAutoplay(2000);
    });
    fotorama.show('>');
    $('.fotorama').on("fotorama:show", function() {
        var ramdom = Math.floor((Math.random() * 5) + 1);



        switch (ramdom) {
            case 1:
                $(this).children().fadeOut();
                $(this).children().fadeIn();
                break;
            case 2:
                $(this).children().animate({
                    width: 'toggle'
                });
                break;
            case 3:
                $(this).children().animate({ borderSpacing: -360 }, {
                    step: function(now, fx) {
                        $(this).children().css('-webkit-transform', 'rotate(' + now + 'deg)');
                        $(this).children().css('-moz-transform', 'rotate(' + now + 'deg)');
                        $(this).children().css('transform', 'rotate(' + now + 'deg)');
                    },
                    duration: 'slow'
                }, 'linear');
                break;
            case 4:
                $(this).children().animate({
                    height: 'toggle'
                });
                break;
            default:
                break;
        }



    });

    $('.fotorama').on("fotorama:showend", function() {
        $(this).children().fadeIn();
    });

    $("#enable").on("click", function() {
        $(this).hide();
        $("#light-overlay").show();
        $("#disable").show();
        audioElement.play();

        fotorama.startAutoplay(2000);
        $("#disable").removeAttr("class");
        $("#enable").addClass("displaynoe");
    })
    $("#disable").on("click", function() {
        $(this).hide();
        $("#light-overlay").hide();
        $("#enable").show();
        audioElement.pause();
        fotorama.stopAutoplay();
        $("#enable").removeAttr("class");
        $("#disable").addClass("displaynoe");
    })


    $("#div-flip").on("click", function() {
        $(imageactive).removeClass("imageflipped");
        var imageactive = $(".fotorama__stage__shaft .fotorama__active img");
        if ($(imageactive).hasClass("imageflipped")) {
            $(imageactive).removeClass("imageflipped");
        } else {
            $(imageactive).removeAttr('class');
            $(imageactive).addClass("imageflipped");
        }
    })

    $("#div-slideshow").on("click", function() {
        fotorama.requestFullScreen();
        fotorama.startAutoplay(2000);
    })

    $(document).on("keydown", function(e) {
        var activeNode = $(document.activeElement);
        var activebutton = $(".active");


        switch (e.which) {
            case 13:
                $(activebutton).click();


                if (activebutton.length < 1) {
                    if ($("#enable").hasClass("displaynoe")) {
                        $("#disable").click();
                    } else {
                        $("#enable").click();
                    }
                }
                fotorama.requestFullScreen();
                //Enter
                break;
            case 37:
                //Prev
                $(".control-effect li").removeClass("active");
                activebutton.prev().addClass("active");
                activebutton.prev().focus();
                break;
            case 39:
                //Next
                $(".control-effect li").removeClass("active");
                activebutton.next().addClass("active");
                activebutton.next().focus();
                break;
            case 38:
                $("#disable").focus();
                $("#disable").parent().parent().addClass("actives");
                $("#enable").focus();
                $("#enable").parent().parent().addClass("actives");


                //Up
                $("#div-rotate").removeClass("active");
                $("#div-flip").removeClass("active");
                break;
            case 40:
                //Down
                if ($("#div-flip").hasClass("active")) {
                    $("#div-flip").removeClass("active");
                    $("#div-rotate").focus();
                    $("#div-rotate").addClass("active");
                } else {
                    $("#div-rotate").removeClass("active");
                    $("#div-flip").focus();
                    $("#div-flip").addClass("active");
                }


                break;

            case 415:


                fotorama.requestFullScreen();
                fotorama.startAutoplay(2000);


             case 27:
                fotorama.startAutoplay(2000);
                break;
            case 413:

                $("#disable").click();
                break;
            case 10009:

                window.location.href = "index.html";
                break;


        }
    });


    var i = 0;
    $("#div-rotate").on("click", function() {
        i += 1;
        if (i > 4) {
            i = 0;
        }
        var imageactive = $(".fotorama__stage__shaft .fotorama__active img");
        $(imageactive).removeAttr('class');
        switch (i) {
            case 1:
                $(imageactive).addClass("rotate90");
                break;
            case 2:
                $(imageactive).addClass("rotate180");
                break;
            case 3:
                $(imageactive).addClass("rotate270");
                break;
            case 4:
                $(imageactive).addClass("rotate360");
                break;
            default:
                $(imageactive).addClass("rotate90");
                break;
        }


    });
});
