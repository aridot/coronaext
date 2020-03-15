let global_result = undefined;

async function clickLogic() {
    console.log('fetching..');

    const [userPositions, coronaPositions] = await Promise.all([
      fetchUserTimeline(),
      fetchCoronaLocations(),
    ]);

    console.log('fetching.. done');

    const risks = findRiskPoints(userPositions, coronaPositions);

    console.log('cross-referencing.. done');

    const risksElement = document.getElementById('risks');
    risksElement.innerText = formatRisks(risks);
}

changeColor.onclick = function(element) {
    clickLogic();
};

function formatRisks(risks) {
  return risks.map(
    ({
      text,
      startTime,
      endTime,
    }) => `From ${startTime.toISOString()} to ${endDate.toISOString()}: ${text}`
  ).join('\n\n');
}
