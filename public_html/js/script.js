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
});
