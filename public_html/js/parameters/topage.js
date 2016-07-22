$(function () {
    
    $('#battery').text(battery);
    
    /*STATUS TOP*/
    $('#status__value--temp').text(tempIn);
    $('#status__value--wet').text(wet);
    $('#status__value--volt').text(volt);
    $('#status__value--temp-out').text(tempOut);

    /*HISTORY*/
    var timeCell = '<td><p id="time-n"></p></td>';
    for (i = 0; i < 20; i++) {
        $('.history__time').append($(timeCell));
        $('#time-n').attr('id', 'time-' + i).text(time);
    }
    var tempCell = '<td><p id="temp-n"></p>&deg;</td>';
    for (i = 0; i < 20; i++) {
        $('.history__temp').append($(tempCell));
        $('#temp-n').attr('id', 'temp-' + i).text(historyTemp);
    }    
    var wetCell = '<td><p id="wet-n"></p>%</td>';
    for (i = 0; i < 20; i++) {
        $('.history__wet').append($(wetCell));
        $('#wet-n').attr('id', 'wet-' + i).text(historyWet);
    }
    var voltCell = '<td><p id="volt-n"></p>В</td>';
    for (i = 0; i < 20; i++) {
        $('.history__volt').append($(voltCell));
        $('#volt-n').attr('id', 'volt-' + i).text(historyVolt);
    }
    
    
});