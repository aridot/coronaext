var _gaq = _gaq || [];

_gaq.push(['_setAccount', 'UA-160779860-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

async function clickLogic() {
    console.log('fetching..');

    const [userPositions, coronaPositions] = await Promise.all([
        fetchUserTimeline(),
        fetchCoronaLocations(),
    ]);

    console.log('fetching.. done');
    _gaq.push(['_trackEvent', 'fetching', 'done']);

    console.log('cross-referencing..');

    const risks = findRiskPoints(userPositions, coronaPositions);

    console.log('cross-referencing.. done', risks);
    _gaq.push(['_trackEvent', 'cross-referencing', 'done']);

    const risksElement = document.getElementById('risks');
    risksElement.innerText = formatRisks(risks);
}

function trackButtonClick(e) {
    _gaq.push(['_trackEvent', e.target.id, 'clicked']);
}

document.addEventListener('DOMContentLoaded', function() {
    popup_button_fetch_compare.onclick = function(element) {
        clickLogic();
    };
    var buttons = document.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', trackButtonClick);
    }
});

function formatRisks(risks) {
    const formatLocaleMessages = ['format_on', 'format_km_away'];
    const _lo = formatLocaleMessages.reduce((o, k) =>
        Object.assign(o, {
            [k]: chrome.i18n.getMessage(k)
        }), {});

    return risks.map(
        ({
            text,
            label,
            startTime,
            endTime,
            distance,
        }) => `${_lo.format_on} ${moment(startTime).format("YYYY-MM-DD HH:mm:ss")}: ${text || label}, ${distance.toFixed(2)} ${_lo.format_km_away}`
    ).join('\n\n');
}

function internationalizeStrings() {
    function putMessage(id) {
        var message = chrome.i18n.getMessage(id);
        document.getElementById(id).innerHTML = message;
    }

    const static_string_ids = ["popup_title", "popup_explain", "popup_data", "popup_button_fetch_compare"];
    static_string_ids.forEach(id => putMessage(id));
}
document.addEventListener('DOMContentLoaded', function() {
    internationalizeStrings();
});