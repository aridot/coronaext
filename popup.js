let global_result = undefined;

async function clickLogic() {
    console.log('fetching..');

    const [userPositions, coronaPositions] = await Promise.all([
        fetchUserTimeline(),
        fetchCoronaLocations(),
    ]);

    console.log('fetching.. done');

    const risks = findRiskPoints(userPositions, coronaPositions);

    console.log('cross-referencing.. done', risks);

    const risksElement = document.getElementById('risks');
    risksElement.innerText = formatRisks(risks);
}

fetchAndCompare.onclick = function(element) {
    clickLogic();
};

function formatRisks(risks) {
    return risks.map(
        ({
            text,
            label,
            startTime,
            endTime,
            distance,
        }) => `On ${moment(startTime).format("YYYY-MM-DD HH:mm:ss")}: ${text || label}, ${distance.toFixed(2)} km away`
    ).join('\n\n');
}