$(function () {

    $('#battery').text(battery);

    /*STATUS TOP*/

    $('#status__value--temp-out').text(tempOut);

    /*HISTORY*/
    var day = 25;
    var week = 8;
    var mounth = 31;

    var timeCell = '<td><p id="time-n"></p></td>';
    var tempCell = '<td><p id="temp-n"></p>&deg;</td>';
    var wetCell = '<td><p id="wet-n"></p>%</td>';
    var voltCell = '<td><p id="volt-n"></p>В</td>';

    for (i = 0; i < day; i++) {
        $('.history__time').append($(timeCell));
        $('.history__temp').append($(tempCell));
        $('.history__wet').append($(wetCell));
        $('.history__volt').append($(voltCell));
        $('#time-n').attr('id', 'time-' + i).text(time);
        $('#temp-n').attr('id', 'temp-' + i).text(historyTemp);
        $('#wet-n').attr('id', 'wet-' + i).text(historyWet);
        $('#volt-n').attr('id', 'volt-' + i).text(historyVolt);
    }

});


function updatePage(data) {

    try {
        if (print_debug_to_console)
            console.log("updating page");
        var json = JSON.parse(data);
        if (json["mode"] === "ARMED") {
            $('#mode__security').addClass('change__current');
            $('#mode__master').removeClass('change__current');
            $('#mode__current').text('Охрана');
        } else if (json["mode"] === "IDLE") {
            $('#mode__master').addClass('change__current');
            $('#mode__security').removeClass('change__current');
            $('#mode__current').text('Хозяин Дома');
        }
        for (var key in json) {
            try {
                var val = json[key]["last_value"];
                var elementKey = "#status__value--" + key;
                if ($(elementKey) !== "undefined") {
                    if (json[key]["par_type"] == "DOUBLE") {
                        $(elementKey).text(val);
                    } else if (json[key]["par_type"] === "BOOLEAN") {
                        if (val.toString().toLowerCase() === "true") {
                            $(elementKey).addClass("true");
                        } else {
                            $(elementKey).removeClass("false");
                        }

                    }
                }
                if (key === "SOCKET") { //костыль. зажигает лампочки и розетки, если они включены - нужно при перезагрузке страницы
                    if (val.toString().toLowerCase() === "true") {
                        var el = $('#socket--status');
                        $('.control__status', el).addClass('on');
                        $('.control__status', el).text('Включена');
                        $('.control__img img', el).attr('src', 'images/socket.png');
                    }
                } else if (key === "LAMP_1") { //костыль. зажигает лампочки и розетки, если они включены - нужно при перезагрузке страницы
                    if (val.toString().toLowerCase() === "true") {
                        var el = $('#lamp--first-status');
                        $('.control__status', el).addClass('on');
                        $('.control__status', el).text('Включена');
                        $('.control__img img', el).attr('src', 'images/lamp.png');
                    }
                } else if (key === "LAMP_2") { //костыль. зажигает лампочки и розетки, если они включены - нужно при перезагрузке страницы
                    if (val.toString().toLowerCase() === "true") {
                        var el = $('#lamp--second-status');
                        $('.control__status', el).addClass('on');
                        $('.control__status', el).text('Включена');
                        $('.control__img img', el).attr('src', 'images/lamp.png');
                    }
                }
            } catch (ee) {
                console.error(ee);
            }

        }

        console.log("page updated");
    } catch (e) {
        console.error(e);
    }
}

function updateSettings(data) {

    try {

        var json = data;
        for (var key in json) {
            try {
                if (print_debug_to_console) {
                    console.log("loading settings " + key);
                }
                var val = json[key];
                var elementKey = "#settings__value--" + key;
                if ($(elementKey) != "undefined") {

                    $(elementKey).html(val);

                }
            } catch (ee) {
                console.error(ee);
            }

        }

        console.log("settings loaded");
    } catch (e) {
        console.error(e);
    }
}