$(function () {
    $('.status__item').each(function () {
        $(this).click(function () {
            $('.status__tip', this).fadeIn('fast');
            setTimeout(function () {
                $('.status__tip').fadeOut('fast');
                //$(this).css({'display': 'none'});
                console.log('ok');
            }, 2000);
        });
    });
    $('.history__dropdown').click(function () {
        $('.history__info').toggle();
    });
    $('.settings__dropdown').click(function () {
        $('.settings__options').toggle();
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
    $('.settings__dropdown').click(function () {
        $('html, body').animate({scrollTop:2048}, 'fast');
    });
    $('.settings__temp_min--minus').click(function() {
        var i = $('#settings__value_temp--min').text();
        i--;
        $('#settings__value_temp--min').text(i);
    });
    $('.settings__temp_min--plus').click(function() {
        var i = $('#settings__value_temp--min').text();
        i++;
        $('#settings__value_temp--min').text(i);
    });
    $('.settings__temp_max--minus').click(function() {
        var i = $('#settings__value_temp--max').text();
        i--;
        $('#settings__value_temp--max').text(i);
    });
    $('.settings__temp_max--plus').click(function() {
        var i = $('#settings__value_temp--max').text();
        i++;
        $('#settings__value_temp--max').text(i);
    });
    
    
    
    $('.settings__volt_min--minus').click(function() {
        var i = $('#settings__value_volt--min').text();
        i = i - 5;
        i.toString();
        $('#settings__value_volt--min').text(i);
    });
    $('.settings__volt_min--plus').click(function() {
        var i = $('#settings__value_volt--min').text();
        i = i + 5;
        i.toString();
        $('#settings__value_volt--min').text(i);
    });
    $('.settings__volt_max--minus').click(function() {
        var i = $('#settings__value_volt--max').text();
        i = i - 5;
        i.toString();
        $('#settings__value_volt--max').text(i);
    });
    $('.settings__volt_max--plus').click(function() {
        var i = $('#settings__value_volt--max').text();
        i = i + 5;
        i.toString();
        $('#settings__value_volt--max').text(i);
    });
});
