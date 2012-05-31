window.forge.enableDebug();

var API_PREFIX = "http://winning-culture.appspot.com/api";
var DEPARTMENT = 'Projectplace';

var rater_id;


function getComments(department, callback){
    forge.logging.log('[getComments] getting comments for'+department);
    forge.request.ajax({
        url: API_PREFIX + "/comments/latest/" + encodeURIComponent(department),
        dataType: 'json',
        success: function(data, textStatus, jqXHR){
            callback(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            forge.logging.log('ERROR! [getComments] '+textStatus);
        }
    });
}

function getTeamSpirit(department, callback){
    forge.logging.log('[getTeamSpirit] getting team spirit for'+department);
    forge.request.ajax({
        url: API_PREFIX + "/rating/latest/10/" + encodeURIComponent(department),
        dataType: 'json',
        success: function(data, textStatus, jqXHR){
            callback(department, data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            forge.logging.log('ERROR! [getTeamSpirit] '+textStatus);
        }
    });
}

function addLocalSpirit(spirit, comment) {
    forge.logging.log('beginning inserting comment');
    var tmpl = $('#comments_tmpl').html();
    var output = Mustache.to_html(tmpl, {'comments': [{'rating': spirit, 'comment': comment}]});
    $('#comments ul').prepend(output);
    forge.logging.log('finished inserting comment');
}

function populateComments(comments_json) {
    forge.logging.log('beginning populating comments');
    var tmpl = $('#comments_tmpl').html();
    var output = Mustache.to_html(tmpl, {comments: comments_json.comments});
    $('#comments ul').append(output);
    forge.logging.log('finished populating comments');
}

function populateTeamSpirit(department, team_spirit_json) {
    forge.logging.log('beginning populating team spirit');
    var tmpl = $('#team_spirit_tmpl').html();
    var output = Mustache.to_html(tmpl, {'department': department, 'spirit': team_spirit_json.average_rating});
    $('#team_spirit').append(output);
    forge.logging.log('done populating team spirit');
}

function updateSpirit(spirit, comment) {
    forge.request.ajax({
        url: API_PREFIX + "/rater_rating/update/" + rater_id + "/" + Math.round(spirit) + "/" + encodeURIComponent(comment),
        type: 'POST',
        data: {},
        dataType: 'json',
        success: function(data, textStatus, jqHXR) {
            addLocalSpirit(spirit, comment);
        },
        error: function(jqHXR, textStatus, errorThrown) {
            forge.logging.log('ERROR! [updateSpirit] ' + textStatus);
        }
    });
}

function initRater() {
    forge.request.ajax({
        url: API_PREFIX + "/rater_rating/init/" + rater_id + "/" + DEPARTMENT,
    type: 'POST',
    data: {},
    dataType: 'json',
    success: function(data, textStatus, jqHXR) {
        rater_id = data.rater_id;
        forge.logging.log('[initRater] got rater_id: ' + rater_id);
        forge.prefs.set('rater_id', rater_id);
    },
    error: function(jqHXR, textStatus, errorThrown) {
        forge.logging.log('ERROR! [initRater] ' + textStatus);
    }
    });
}

function getRaterFromPrefs() {
    forge.prefs.get('rater_id',
        function(resource) {
            if (resource) {
                rater_id = resource;
            } else {
                rater_id = '';
            }
            initRater();
        },
        function (error) {
            forge.logging.error('failed when retrieving rater_id prefs');
            rater_id = '';
        }
        );
}

$(function () {
    getRaterFromPrefs();
    $('#my_spirit_button').click(function(e) {
        updateSpirit($('#my_spirit').val(), $('#my_spirit_comment').val());
    });
    getTeamSpirit(DEPARTMENT, populateTeamSpirit);
    getComments(DEPARTMENT, populateComments);
    forge.event.messagePushed.addListener(function (msg) {
        alert(msg.alert);
    });
});
