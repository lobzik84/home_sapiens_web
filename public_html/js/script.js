$(function () {
    $('.status__item').each(function () {
        $(this).click(function () {
            $('.status__tip', this).fadeToggle('fast');
            setTimeout(function () {
                $('.status__tip', this).css({'display': 'none'});
                console.log('ok');
            }, 3000);
        });
    });
    
    $('.history__dropdown').click(function () {
        $('.history__info').toggle();
    });
});
