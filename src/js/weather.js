window.forge.enableDebug();

var forecast = {
    city: "Mountain View, CA",
    forecast_date: "2011-08-09"
};

var currentConditions = {
    condition: "Clear",
    temp_f: "73",
    humidity: "Humidity: 57%",
    icon: "resources/sunny.gif",
    wind_condition: "Wind: N at 9 mph"
};

var forecastConditionMaker = function(day_of_week, low, high, icon, condition) {
    return {
        day_of_week: day_of_week,
            low: low,
            high: high,
            icon: icon,
            condition: condition
    };
};

var tuesdayConditions = forecastConditionMaker("Tue", "58","72", "resources/mostly_sunny.gif","Clear");
var wednesdayConditions = forecastConditionMaker("Wed", "58", "72", "resources/sunny.gif", "Clear");
var thursdayConditions = forecastConditionMaker("Thu", "56", "72", "resources/chance_of_rain.gif", "Chance of Rain");
var fridayConditions = forecastConditionMaker("Fri", "58", "74", "resources/sunny.gif", "Clear");

var mountainViewForecast = {
    forecast: forecast,
    currentConditions: currentConditions,
    forecastConditions: [tuesdayConditions, wednesdayConditions, thursdayConditions, fridayConditions]
};

function populateWeatherConditions (weatherCondition) {
    var tmpl, output;
    forge.logging.log('beginning populating weather conditions');

    tmpl = $('#forecast_information_tmpl').html();
    output = Mustache.to_html(tmpl, weatherCondition.forecast);
    $('#forecast_information').append(output);
    forge.logging.log('finished populating forecast information');

    tmpl = $('#current_conditions_tmpl').html();
    output = Mustache.to_html(tmpl, weatherCondition.currentConditions);
    $('#current_conditions').append(output);
    forge.logging.log('finished populating current conditions');

    tmpl = $('#forecast_conditions_tmpl').html();
    output = Mustache.to_html(tmpl, {conditions: weatherCondition.forecastConditions});
    $('#forecast_conditions table tr').append(output);
    forge.logging.log('finished populating forecast conditions');

    forge.logging.log('finished populating weather conditions');
}

$(function () {
    populateWeatherConditions(mountainViewForecast);
});
