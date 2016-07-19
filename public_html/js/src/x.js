$(function () {
    $('.status__item').each(function () {
        $(this).click(function () {
            $('.status__tip', this).fadeIn('fast');
            setTimeout(function () {
                $('.status__tip').fadeOut('fast');
            }, 2000);
        });
    });
    $('.history__dropdown').click(function () {
        $('.history__info').toggle();
    });
    $('.settings__dropdown').click(function () {
        $('.settings__options, .settings__save').toggle();
    });
    $('#lamp--first-status').click(function () {
        $('.control__status', this).toggleClass('on');
        if ($('.control__status', this).hasClass('on')) {
            $('.control__status', this).text('Включена');
            $('.control__img img', this).attr('src', 'images/lamp.png');
        } else {
            $('.control__status', this).text('Выключена');
            $('.control__img img', this).attr('src', 'images/lamp-off.png');
        }
    });
    $('#lamp--second-status').click(function () {
        $('.control__status', this).toggleClass('on');
        if ($('.control__status', this).hasClass('on')) {
            $('.control__status', this).text('Включена');
            $('.control__img img', this).attr('src', 'images/lamp.png');
        } else {
            $('.control__status', this).text('Выключена');
            $('.control__img img', this).attr('src', 'images/lamp-off.png');
        }
    });
    $('#socket--status').click(function () {
        $('.control__status', this).toggleClass('on');
        if ($('.control__status', this).hasClass('on')) {
            $('.control__status', this).text('Включена');
            $('.control__img img', this).attr('src', 'images/socket.png');
        } else {
            $('.control__status', this).text('Выключена');
            $('.control__img img', this).attr('src', 'images/socket-off.png');
        }
    });
    $('#mode__master, #mode__security').click(function () {
        $(this).toggleClass('change__current');
    });
    $('.history__dropdown').click(function () {
        $('html, body').animate({scrollTop: 1400}, 'fast');
    });
    $('.settings__dropdown').click(function () {
        $('html, body').animate({scrollTop: 2048}, 'fast');
    });
    $('.settings__temp_min--minus').click(function () {
        var i = $('#settings__value_temp--min').text();
        i--;
        $('#settings__value_temp--min').text(i);
    });
    $('.settings__temp_min--plus').click(function () {
        var i = $('#settings__value_temp--min').text();
        i++;
        $('#settings__value_temp--min').text(i);
    });
    $('.settings__temp_max--minus').click(function () {
        var i = $('#settings__value_temp--max').text();
        i--;
        $('#settings__value_temp--max').text(i);
    });
    $('.settings__temp_max--plus').click(function () {
        var i = $('#settings__value_temp--max').text();
        i++;
        $('#settings__value_temp--max').text(i);
    });
    $('.settings__volt_min--minus').click(function () {
        var k = $('#settings__value_volt--min').text();
        k.toString();
        i = k - 5;
        i.toString();
        $('#settings__value_volt--min').text(i);
    });
    $('.settings__volt_min--plus').click(function () {
        var i = $('#settings__value_volt--min').text();
        i++;
        i++;
        i++;
        i++;
        i++;
        // :) потом сделаю нормально
        $('#settings__value_volt--min').text(i);
    });
    $('.settings__volt_max--minus').click(function () {
        var k = $('#settings__value_volt--max').text();
        k.toString();
        i = k - 5;
        i.toString();
        $('#settings__value_volt--max').text(i);
    });
    $('.settings__volt_max--plus').click(function () {
        var i = $('#settings__value_volt--max').text();
        i++;
        i++;
        i++;
        i++;
        i++;
        // :) потом сделаю нормально
        $('#settings__value_volt--max').text(i);
    });
    $('.password__save').click(function () {
        var text = $('input')[0];
        var val = text.value;
        console.log(val);
    });
    /*SWIPE ALERT BLOCK*/
    /*$('.alerts__block').bind('touchmove', function (e) {
     e.preventDefault();
     var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
     var elm = $(this).offset();
     var x = $(this).width() - touch.pageX;
     console.log(x);
     $(this).css('right', $(this).width());
     //$(this).css('display', 'none');
     if (x > 250) {
     //$(this).css('display', 'none');
     } 
     });
     $('.alerts__block').bind('touchstart', function (e) {
     console.log('start');
     e.preventDefault();
     var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
     var x = $(this).width() - touch.pageX;
     console.log(x);
     console.log(this);
     });
     $('.alerts__block').bind('touchmove', function (e) {
     e.preventDefault();
     var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
     var x = $(this).width() - touch.pageX;
     console.log(x);
     $(this).css('right', x);
     });
     $('.alerts__block').bind('touchend', function (e) {
     console.log('end');
     e.preventDefault();
     var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
     var x = $(this).width() - touch.pageX;
     console.log(x);
     console.log(this);
     $(this).css('right', '0px');
     });
     
     
     var myElement = document.getElementById('alerts__block');
     var mc = new Hammer(myElement);
     mc.on("press", function (ev) {
     
     console.log('qewrty');
     });*/
    $('.alerts__block').bind('touchstart', function (e) {


        console.log('start');
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        var x = $(this).width() - touch.pageX;
        $('.alerts__block').bind('touchmove', function (e) {
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            var x = $(this).width() - touch.pageX;
            var k = x / 1000 + 0.1;
            var opacity = 1 - k;
            $(this).css('right', x);
            $(this).css('opacity', opacity);
            console.log(x);
            if (x > 450) {
                $(this).css('display', 'none');
            }
        });
        $('.alerts__block').bind('touchend', function (e) {
            console.log('end');
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            var x = $(this).width() - touch.pageX;
            $(this).css('right', '0px');
            $(this).css('opacity', '1');
            if (x > 450) {
                $(this).css('display', 'none');
            }
        });


    });
});
