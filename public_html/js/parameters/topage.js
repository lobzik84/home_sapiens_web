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
        for (var key in json) {
            try {
                var val = json[key]["last_value"];
                var elementKey = "#status__value--"+key;
                if ($(elementKey) != "undefined") {
                    if (json[key]["par_type"] == "DOUBLE") {
                        $(elementKey).text(val);
                    } else if (json[key]["par_type"] == "BOOLEAN") {
                        $(elementKey).addClass(val); //?? ставить класс если true
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